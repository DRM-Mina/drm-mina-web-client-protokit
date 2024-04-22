"use client";
import React, { useEffect } from "react";

import Autoplay from "embla-carousel-autoplay";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGamesStore } from "@/lib/stores/gameStore";
import { useDeviceStore } from "@/lib/stores/deviceStore";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/lib/stores/userWallet";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function GameDetail() {
  const gameName = useSearchParams().get("game");
  const device = useSearchParams().get("device");
  const gameStore = useGamesStore();
  const deviceStore = useDeviceStore();
  const userStore = useUserStore();
  const { toast } = useToast();

  useEffect(() => {
    if (device) {
      if (deviceStore.isDeviceSet === false) {
        deviceStore.setDevice(JSON.parse(device));
        toast({
          title: "Device set",
          description:
            "We got your device information 🕵️, just kidding your information is only yours ✨",
        });
      }
      router.push("/game-detail?game=" + gameName);
    }
  }, []);

  const router = useRouter();

  const game = gameStore.games.find((game) => game.name === gameName);

  const handleGameBuy = () => {
    if (userStore.isConnected === false) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
      });
      return;
    }
    console.log("Buying game");
  };
  const handleGameDownload = () => {};

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
              {Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem key={i}>
                  <img
                    src={ENDPOINT + game?.cover}
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
            <h1 className=" p-4 text-3xl font-bold">{game?.name}</h1>
            <div className=" mt-8 text-base">{game?.description}</div>

            <div>Total Reviews: 5 (4.3)</div>

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
                    {game?.price - game?.discount}
                  </span>
                  <img
                    src={"/mina.png"}
                    alt="mina"
                    className=" inline-block h-4 w-4"
                  />
                </div>
                <Button variant={"default"} onClick={handleGameBuy}>
                  Buy Game
                </Button>
              </div>
              <Button variant={"link"} onClick={handleGameDownload}>
                <Download size={24} />
                Download Game
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-1/3 p-8">
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
      {/* <CommentSection /> */}
    </div>
  );
}