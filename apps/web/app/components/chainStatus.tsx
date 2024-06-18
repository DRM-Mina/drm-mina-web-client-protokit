import { Badge } from "@/components/ui/badge";
import { fetchGameData } from "@/lib/api";
import { useChainStore } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useRegisterStore } from "@/lib/stores/gameRegister";
import { useGamesStore } from "@/lib/stores/gameStore";
import React, { useEffect } from "react";

const query = `
query GetPrices {
  runtime {
    GameToken {
      gamePrice(key: {value: "$gameId"}) {
        value
      }
      discount(key: {value: "$gameId"}) {
        value
      }
    }
  }
}
`;

interface GamePrices {
  data: {
    runtime: {
      GameToken: {
        gamePrice: {
          value: string | null;
        };
        discount: {
          value: string | null;
        };
      };
    };
  };
}

export default function ChainStatus() {
  const client = useClientStore();
  const chain = useChainStore();
  const gameStore = useGamesStore();
  const registerStore = useRegisterStore();

  useEffect(() => {
    if (!client.client) return;
    (async () => {
      const games: Game[] = await fetchGameData();
      let gameList: Game[] = [];
      const totalGames =
        await client.client!.query.runtime.GameToken.totalGameNumber.get();
      const gameIds = Array.from(
        { length: Number(totalGames?.toString()) },
        (_, i) => i + 1,
      );
      for (const gameId of gameIds) {
        const url =
          process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
          "http://localhost:8080/graphql";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query.replace(/\$gameId/g, gameId.toString()),
          }),
        });

        const { data } = (await response.json()) as GamePrices;

        if (
          data.runtime.GameToken.discount?.value &&
          data.runtime.GameToken.gamePrice?.value
        ) {
          const game = games.find((game: Game) => game.gameId === gameId);
          if (game) {
            game.price = Number(
              data.runtime.GameToken.gamePrice?.value.toString(),
            );
            game.discount = Number(
              data.runtime.GameToken.discount?.value.toString(),
            );
            if (!game.cover) {
              game.cover = "images/default.webp";
            }
            gameList.push(game);
          }
        }
      }
      console.log(gameList);
      gameStore.setGames(gameList);
      const discounts = gameList.filter((game: Game) => game.discount > 0);
      gameStore.setDiscountGames(discounts);
    })();
  }, [registerStore.trigger]);

  return (
    <Badge className=" items-center rounded-lg text-center" variant="outline">
      <div className={"mr-1 h-2 w-2 rounded-full bg-green-400"}></div>
      <span>{chain.block?.height ?? "-"}</span>
    </Badge>
  );
}
