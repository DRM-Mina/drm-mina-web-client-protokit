"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import "./wishlist.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/userWallet";
import { useGamesStore } from "@/lib/stores/gameStore";
import { useEffect } from "react";
import { fetchWishlist } from "@/lib/api";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function WishlistItems() {
  const router = useRouter();

  const gameStore = useGamesStore();

  const userStore = useUserStore();

  useEffect(() => {
    if (userStore.isConnected) {
      fetchWishlist(userStore.userPublicKey || "").then((data) => {
        userStore.setWishlist(data);
      });
    }
  }, []);

  return (
    <div className=" flex w-full flex-wrap justify-center gap-4">
      {gameStore.games
        .filter((game: Game) => userStore.wishlist.includes(game.gameId))
        .map((game, index) => {
          return (
            <Card
              key={index}
              className=" card-hover-effect mb-16 aspect-square w-[300px] cursor-pointer"
              onClick={() => router.push("/game-detail?game=" + game.name)}
            >
              <CardContent className=" absolute flex aspect-square w-[300px] items-center justify-center p-4">
                <img
                  src={ENDPOINT + game.cover}
                  crossOrigin="anonymous"
                  alt={game.name}
                  className="card-image flex h-full w-full rounded-lg object-cover"
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
          );
        })}
    </div>
  );
}
