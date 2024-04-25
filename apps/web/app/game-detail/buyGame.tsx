import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useFaucet } from "@/lib/stores/balances";
import { useClientStore } from "@/lib/stores/client";
import { useMarketStore } from "@/lib/stores/marketOperations";
import { useUserStore } from "@/lib/stores/userWallet";
import React from "react";

interface BuyGameProps {
  gameId: number | undefined;
}

export default function BuyGame({ gameId }: BuyGameProps) {
  const userStore = useUserStore();
  const client = useClientStore();
  const marketStore = useMarketStore();
  const handleGameBuy = () => {
    if (userStore.isConnected === false) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
      });
      return;
    }
    if (!client.client || !userStore.userPublicKey || !gameId) return;
    marketStore.buyGame(client.client, userStore.userPublicKey, gameId);
    console.log("Buying game id: ", gameId);
  };
  return (
    <Button variant={"default"} onClick={handleGameBuy}>
      Buy Game
    </Button>
  );
}
