import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { useChainStore } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useGamesStore } from "@/lib/stores/gameStore";
import { useUserStore } from "@/lib/stores/userWallet";
import { UInt64 } from "@proto-kit/library";
import { UserKey } from "chain/dist/GameToken";
import { useRouter } from "next/navigation";
import { PublicKey } from "o1js";
import React, { useEffect } from "react";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function DynamicLibrary() {
  const client = useClientStore();
  const chain = useChainStore();
  const router = useRouter();
  const userStore = useUserStore();
  const gameStore = useGamesStore();

  useEffect(() => {
    if (!client.client || !userStore.userPublicKey) return;
    (async () => {
      const totalGames =
        await client.client.query.runtime.GameToken.totalGameNumber.get();
      const gameIds = Array.from(
        { length: totalGames?.toNumber() - 1 },
        (_, i) => i + 1,
      );
      let library: number[] = [];
      gameIds.map(async (gameId) => {
        const userKey = UserKey.from(
          UInt64.from(gameId),
          PublicKey.fromBase58(userStore.userPublicKey),
        );
        const query =
          await client.client.query.runtime.GameToken.users.get(userKey);
        if (query?.value) {
          library.push(gameId);
        }
      });
      userStore.setLibrary(library);
    })();
  }, [userStore.userPublicKey, client.client, chain.block?.height]);

  return (
    <div className=" flex w-full flex-wrap justify-center gap-4">
      {gameStore.games
        .filter((game: Game) => userStore.library.includes(game.gameId))
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
