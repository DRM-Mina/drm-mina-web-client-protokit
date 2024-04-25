import { Button } from "@/components/ui/button";
import { useBuyGame } from "@/lib/stores/marketOperations";
import React from "react";

interface BuyGameProps {
  game: Game | undefined;
}

export default function BuyGame({ game }: BuyGameProps) {
  const handleGameBuy = useBuyGame(game!.gameId);

  return (
    <div className=" mt-8 flex flex-row gap-4 rounded-lg border border-gray-300 p-2">
      <div className=" flex items-center justify-center gap-1 ">
        {game?.discount || 0 > 0 ? (
          <>
            <div className=" text-discount bg-discount rounded-lg p-1 text-lg">
              -%
              {Math.floor(((game?.discount || 0) / (game?.price || 1)) * 100)}
            </div>
            <span className="strikethrough px-2 text-base text-gray-500">
              {game?.price}
            </span>
          </>
        ) : (
          <></>
        )}
        <span className="text-base">{game?.price! - game?.discount!}</span>
        <img src={"/mina.png"} alt="mina" className=" inline-block h-4 w-4" />
      </div>
      <Button variant={"default"} onClick={handleGameBuy}>
        Buy Game
      </Button>
    </div>
  );
}
