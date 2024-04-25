import { Badge } from "@/components/ui/badge";
import { fetchGameData } from "@/lib/api";
import { useChainStore } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useGamesStore } from "@/lib/stores/gameStore";
import { UInt64 } from "@proto-kit/library";
import React, { useEffect } from "react";

export default function ChainStatus() {
  const client = useClientStore();
  const chain = useChainStore();
  const gameStore = useGamesStore();

  useEffect(() => {
    if (!client.client) return;
    (async () => {
      const games: Game[] = await fetchGameData();
      console.log("games fetched");
      const totalGames =
        await client.client.query.runtime.GameToken.totalGameNumber.get();
      console.log("total games: ", totalGames?.toString());
      const gameIds = Array.from(
        { length: Number(totalGames?.toString()) },
        (_, i) => i + 1,
      );
      console.log("gameIds: ", gameIds);
      for (const gameId of gameIds) {
        console.log("fetching game: ", gameId);
        const price = await client.client.query.runtime.GameToken.gamePrice.get(
          UInt64.from(gameId),
        );
        const discount =
          await client.client.query.runtime.GameToken.discount.get(
            UInt64.from(gameId),
          );
        console.log("price: ", price.value.toString());
        console.log("discount: ", discount.value.toString());
        if (price?.value && discount?.value) {
          games[gameId - 1].price = Number(price.value.toString());
          games[gameId - 1].discount = Number(discount.value.toString());
        }
      }
      console.log("games: ", games);
      gameStore.setGames(games);
      const discounts = games.filter((game: Game) => game.discount > 0);
      gameStore.setDiscountGames(discounts);
    })();
  }, []);

  return (
    <Badge className=" items-center rounded-lg text-center" variant="outline">
      <div className={"mr-1 h-2 w-2 rounded-full bg-green-400"}></div>
      <span>{chain.block?.height ?? "-"}</span>
    </Badge>
  );
}
