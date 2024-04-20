"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useGamesStore } from "@/lib/stores/gameStore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function Browse() {
  const router = useRouter();
  const params = useSearchParams().get("search") || "";
  const gameStore = useGamesStore();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(
    () =>
      setGames(
        gameStore.games.filter((game) =>
          game.name
            .toLowerCase()
            .replace(" ", "")
            .includes(params.toLowerCase()),
        ),
      ),
    [params],
  );

  return (
    <div className="grid grid-cols-4 gap-4 p-8">
      {games.map((game) => (
        <Card
          key={game.gameId}
          className=" mb-16 aspect-square w-[300px] cursor-pointer"
          onClick={() => router.push("/game-detail?" + game.name)}
        >
          <CardContent className=" absolute flex aspect-square w-[300px] items-center justify-center p-4">
            <img
              src={ENDPOINT + game.cover}
              crossOrigin="anonymous"
              alt={game.name}
              className="flex h-full w-full rounded-lg object-cover"
            />
          </CardContent>
          <div className="card-drawer flex h-full flex-col items-center gap-3 bg-background p-3">
            <CardTitle className="flex">{game.name}</CardTitle>
            <CardDescription className=" flex">
              {game.description}
            </CardDescription>
          </div>
          <CardFooter className="mt-4 flex justify-between">
            <h3 className="text-lg font-medium">{game.name}</h3>
            <h3 className="text-lg font-medium">{game.price}</h3>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
