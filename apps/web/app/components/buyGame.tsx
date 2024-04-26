import { Button } from "@/components/ui/button";
import { useBuyGame } from "@/lib/stores/marketOperations";
import { useUserStore } from "@/lib/stores/userWallet";
import { Check } from "lucide-react";
import React from "react";

interface BuyGameProps {
  gameId: number | undefined;
}

export default function BuyGame({ gameId }: BuyGameProps) {
  const handleGameBuy = useBuyGame(gameId);
  const userStore = useUserStore();

  return !userStore.library.includes(gameId || -1) ? (
    <Button
      variant={"default"}
      onClick={(event) => {
        event.stopPropagation();
        handleGameBuy();
      }}
    >
      Buy Game
    </Button>
  ) : (
    <div className=" flex flex-row items-center text-green-700">
      <Check /> <span>Owned</span>
    </div>
  );
}
