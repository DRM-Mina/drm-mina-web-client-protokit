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

  const handleGameDownload = async (gameId: number) => {
    if (gameId !== 1) {
      toast({
        title: "Download started",
        description:
          "Just kidding we do not have this game yet, maybe in the future 🤷‍♂️",
      });
      return;
    } else if (gameId === 1) {
      toast({
        title: "Download started",
        description:
          "Please wait while we prepare the download link for you 🚀",
      });
      try {
        const signedUrlResponse = await fetch(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "get-signed-url",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: "Game-Demo.exe",
            }),
          },
        );

        if (!signedUrlResponse.ok) {
          throw new Error("Failed to get signed url");
        }

        const { url } = await signedUrlResponse.json();

        const downloadResponse = await fetch(url);
        if (!downloadResponse.ok) {
          throw new Error("Failed to download file");
        }
        const blob = await downloadResponse.blob();
        const urlBlob = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urlBlob;
        a.download = "Game-Demo.exe";
        a.click();
        URL.revokeObjectURL(urlBlob);

        toast({
          title: "Download complete",
          description:
            "Please check your download folder 😏, ensure you cloned our prover too :)",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to download",
          description: "Sowwy 😢, please try again later.",
        });
      }
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
              <Button
                variant={"link"}
                onClick={() => {
                  handleGameDownload(game?.gameId!);
                }}
              >
                <Download size={24} /> &nbsp; Download Game
              </Button>
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
