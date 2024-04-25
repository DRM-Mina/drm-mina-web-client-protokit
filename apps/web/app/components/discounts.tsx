"use client";
import React, { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
  CardFooter,
  CardShadow,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGamesStore } from "@/lib/stores/gameStore";
import GameBookmark from "./bookmark";
import DiscountRate from "./discountRate";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Discounts() {
  const gameStore = useGamesStore();

  const router = useRouter();

  return (
    <div className="col-span-3 row-span-1 flex justify-center lg:col-span-5">
      <Carousel
        plugins={[
          Autoplay({
            delay: 6000,
          }),
        ]}
        opts={{
          align: "start",
        }}
        className="w-full max-w-4xl justify-center p-4"
      >
        <h3 className="mb-2 mt-2 text-lg font-medium tracking-tight">
          On Discount
        </h3>
        <CarouselContent>
          {Array.from(gameStore.discountGames).map((game, index) => (
            <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
              <div className="p-2">
                <Card
                  className=" cursor-pointer overflow-hidden"
                  onClick={() => router.push("/game-detail?game=" + game.name)}
                >
                  <CardContent className="lg:aspect-3/4 relative flex items-center justify-center p-6 md:aspect-square">
                    <img
                      src={ENDPOINT + game.cover}
                      crossOrigin="anonymous"
                      alt={game.name}
                      className="h-full w-full object-cover"
                    />
                    <DiscountRate game={game} />
                    <GameBookmark gameId={game.gameId} />
                  </CardContent>
                  <CardFooter className="w-</CardContent>full flex justify-between">
                    <CardTitle className=" text-base">{game.name}</CardTitle>
                    <CardShadow className=" flex flex-col items-start justify-center rounded-sm px-3">
                      <span className=" strikethrough text-xs text-gray-500">
                        &nbsp;{game?.price}&nbsp;
                      </span>
                      <div className="flex items-center justify-center gap-1">
                        <span className=" text-lg">
                          {game?.price - game?.discount}
                        </span>
                        <img
                          src={"/mina.png"}
                          alt="mina"
                          className=" inline-block h-4 w-4"
                        />
                      </div>
                    </CardShadow>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
