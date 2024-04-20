"use client";
import React, { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextBig,
  CarouselPreviousBig,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Card,
  CardContent,
  CardFooter,
  CardShadow,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGamesStore } from "@/lib/stores/gameStore";
import GameBookmark from "./bookmark";
import DiscountRate from "./discountRate";
import { useToast } from "@/components/ui/use-toast";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Featured() {
  const gameStore = useGamesStore();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div className="col-span-3 row-span-1 flex justify-center py-8 lg:col-span-5">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        opts={{
          align: "start",
        }}
        className="w-full max-w-2xl justify-center p-4"
      >
        <h3 className="mb-2 text-lg font-medium tracking-tight">
          Featured Games
        </h3>
        <CarouselContent>
          {Array.from(gameStore.games).map((game, index) => (
            <CarouselItem key={index} className="md:basis-full lg:basis-full">
              <div className="p-2">
                <Card
                  className=" cursor-pointer overflow-hidden"
                  onClick={() => router.push("/game-detail?game=" + game.name)}
                >
                  <CardContent className="relative flex items-center justify-center p-6 md:aspect-square lg:aspect-video">
                    <img
                      src={ENDPOINT + game.cover}
                      crossOrigin="anonymous"
                      alt={game.name}
                      className="h-full w-full object-cover"
                    />
                    <DiscountRate variant={"bg"} game={game} />
                    <GameBookmark className=" h-8 w-8" gameId={game.gameId} />
                  </CardContent>
                  <CardFooter className="flex w-full justify-between">
                    <CardTitle>{game.name}</CardTitle>
                    <div className=" mt-8 flex flex-row gap-3 p-2">
                      <CardShadow className=" flex items-center justify-center gap-1 rounded-sm px-3 py-1">
                        {game?.discount || 0 > 0 ? (
                          <span className="strikethrough px-2 text-base text-gray-500">
                            {game?.price}
                          </span>
                        ) : (
                          <></>
                        )}
                        <span className=" text-xl">
                          {game?.price - game?.discount}
                        </span>
                        <img
                          src={"/mina.png"}
                          alt="mina"
                          className=" inline-block h-5 w-5"
                        />
                      </CardShadow>
                      <Button
                        variant={"default"}
                        onClick={(e) => {
                          toast({
                            description: "Soon",
                          });
                          e.stopPropagation();
                        }}
                      >
                        Buy Game
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPreviousBig />
        <CarouselNextBig />
      </Carousel>
    </div>
  );
}
