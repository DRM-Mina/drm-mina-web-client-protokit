"use client";
import React, { useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, Download, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGamesStore } from "@/lib/stores/gameStore";
import { useDeviceStore } from "@/lib/stores/deviceStore";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const BuyGame = dynamic(() => import("../components/buyGame"), {
  loading: () => <Button>Loading...</Button>,
});

const GiftGame = dynamic(() => import("../components/giftGame"), {
  loading: () => <Gift className=" p-4" />,
});

const AssignDevice = dynamic(() => import("./assignDevice"));

export default function GameDetail() {
  const gameName = useSearchParams().get("game");
  const device = useSearchParams().get("device");
  const gameStore = useGamesStore();
  const deviceStore = useDeviceStore();
  const { toast } = useToast();
  useEffect(() => {
    if (device) {
      if (deviceStore.isDeviceSet === false) {
        deviceStore.setDevice(JSON.parse(device));
        router.push("/game-detail?game=" + gameName);
      }
    }
    if (deviceStore.isDeviceSet) {
      toast({
        title: "Device set",
        description:
          "We got your device information 🕵️, just kidding your information is only yours ✨",
      });
    }
  }, []);

  const router = useRouter();

  const game = gameStore.games.find((game) => game.name === gameName);
  const imageCount = game?.imageCount || 1;

  const handleGameDownload = async (platfom: string) => {
    let fileName = "";
    try {
      if (platfom === "windows") {
        if (game?.downloadable) {
          fileName = game?.imageFolder + ".exe";
        } else {
          fileName = "Game-Demo-" + game?.gameId + ".exe";
        }
      } else if (platfom === "linux") {
        if (game?.downloadable) {
          fileName = game?.imageFolder + ".tar.gz";
        } else {
          fileName = "Game-Demo-" + game?.gameId + ".tar.gz";
        }
      } else if (platfom === "macos") {
        throw new Error("MacOS not supported yet");
      } else {
        throw new Error("Invalid platform");
      }

      const signedUrlResponse = await fetch(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "get-signed-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        },
      );

      if (!signedUrlResponse.ok) {
        throw new Error("Failed to get signed url from server");
      }
      toast({
        title: "Download started",
        description: "Please wait while we download the game for you 🚀",
      });
      const { url } = await signedUrlResponse.json();

      const downloadResponse = await fetch(url);
      if (!downloadResponse.ok) {
        throw new Error(
          "Server could not find file, maybe we do not have it yet 😢",
        );
      }
      const blob = await downloadResponse.blob();
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(urlBlob);

      toast({
        title: "Download complete",
        description: "Please check your download folder 😏",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Sowwy 😢",
        description: error.message,
      });
    }

    return;
  };

  return (
    <div>
      <div className=" grid w-full grid-cols-5 p-4">
        <div className=" col-span-3 mt-8 h-full">
          <Button
            variant={"outline"}
            onClick={() => router.replace("/store")}
            className=" ml-4"
          >
            <ChevronLeft size={24} /> Back to Store
          </Button>
          <Carousel
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            opts={{
              align: "start",
            }}
            className="w-full justify-center p-4"
          >
            <CarouselContent>
              {Array.from({ length: imageCount }).map((_, i) => (
                <CarouselItem key={i}>
                  <img
                    src={
                      imageCount > 1
                        ? ENDPOINT! +
                          "images/" +
                          game?.imageFolder +
                          "/40/" +
                          game?.imageFolder +
                          "_ingame_" +
                          (i + 1) +
                          ".webp"
                        : ENDPOINT! + "images/default/40/default.webp"
                    }
                    crossOrigin="anonymous"
                    alt="Game"
                    className="aspect-video h-full w-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className=" col-span-2 h-full px-4">
          <div className=" mt-8 flex h-full flex-col items-center justify-between p-8">
            <div className="w-full ">
              <h1 className=" self-center p-4 text-3xl font-bold">
                {game?.name}
              </h1>
              <Separator />
              <h3 className=" self text-md p-3 font-normal">
                <span className="text-lg font-normal text-gray-700">
                  {"Publisher: "}
                </span>
                {game?.creator}
              </h3>
            </div>
            <div className=" mt-8 text-base">{game?.description}</div>

            {/* <div>Total Reviews: 5 (4.3)</div> */}

            <div>
              {Array.from(game?.tags || []).map((tag, index) => (
                <Badge key={index} className=" mx-1 rounded-lg">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 ">
              <div className=" mt-8 flex flex-row gap-4 rounded-lg border border-gray-300 p-2">
                <div className=" flex items-center justify-center gap-1 ">
                  {game?.discount || 0 > 0 ? (
                    <>
                      <div className=" text-discount bg-discount rounded-lg p-1 text-lg">
                        -%
                        {Math.floor(
                          ((game?.discount || 0) / (game?.price || 1)) * 100,
                        )}
                      </div>
                      <span className="strikethrough px-2 text-base text-gray-500">
                        {game?.price}
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                  <span className="text-base">
                    {game?.price! - game?.discount!}
                  </span>
                  <img
                    src={"/mina.webp"}
                    alt="mina"
                    className=" inline-block h-4 w-4"
                  />
                </div>
                <BuyGame gameId={game?.gameId} />
                <GiftGame gameId={game?.gameId} />
              </div>
              <Popover>
                <PopoverTrigger>
                  <Button variant={"link"}>
                    <Download size={24} className=" mr-2" />{" "}
                    {game?.downloadable ? "Download Game" : "Download Demo"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className=" flex flex-col gap-6 p-4">
                    <Button
                      className=" flex flex-row justify-start text-center"
                      onClick={() => {
                        handleGameDownload("windows");
                      }}
                    >
                      <Download size={24} className=" mr-2" />
                      Windows Downloader
                    </Button>
                    <Button
                      className=" flex flex-row justify-start text-center"
                      onClick={() => {
                        handleGameDownload("linux");
                      }}
                    >
                      <Download size={24} className=" mr-2" />
                      Linux Downloader
                    </Button>
                    <Button
                      className=" flex flex-row justify-start text-center"
                      onClick={() => {
                        handleGameDownload("macos");
                      }}
                    >
                      <Download size={24} className=" mr-2" />
                      MacOS Downloader
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-6">
        <div className=" col-span-2 p-8">
          <h3 className=" font-semibold">Recommended System Requirements</h3>
          <Separator />
          <div className=" mt-4 text-base">
            <ul>
              <li>Processor: Intel Core i5-3570K</li>
              <li>Memory: 8 GB RAM</li>
              <li>Graphics: GeForce GTX 780</li>
              <li>Storage: 10 GB available space</li>
            </ul>
          </div>
        </div>
        <div className=" col-span-1"></div>
        <AssignDevice gameId={game?.gameId!} />
      </div>
      {/* <CommentSection /> */}
    </div>
  );
}
