import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { fetchWishlist } from "@/lib/api";
import { useUserStore } from "@/lib/stores/userWallet";
import { Wallet } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

const Web3walletPopover = dynamic(() => import("./web3walletPopover"));

export default function Web3wallet() {
  const userWallet = useUserStore();

  const connect = async () => {
    userWallet.setConnecting(true);
    if (!window.mina) {
      toast({
        title: "Wallet not found",
        description: "Please install the Auro wallet",
      });
      userWallet.setConnecting(false);
      return;
    }
    const addresses = await window.mina!.requestAccounts();
    if (addresses[0]) {
      userWallet.setUserPublicKey(addresses[0]);
      userWallet.setConnected(true);
      userWallet.setConnecting(false);
      const wishlist = await fetchWishlist(addresses[0]);
      userWallet.setWishlist(wishlist);
    }
  };

  return (
    <div>
      {userWallet.isConnected ? (
        <Web3walletPopover />
      ) : (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => connect()}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
