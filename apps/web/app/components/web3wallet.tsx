import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { fetchWishlist } from "@/lib/api";
import { useUserStore } from "@/lib/stores/userWallet";
import { Wallet } from "lucide-react";
import React, { useEffect } from "react";

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

  const disconnect = async () => {
    userWallet.disconnect();
  };

  const user = useUserStore();

  return (
    <div>
      {user.isConnected ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-start px-2 ">
              {/* <Wallet className="mr-2 h-4 w-4" /> */}
              <span className="ml-4 truncate">{userWallet.userPublicKey}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" ml-2 w-auto">
            <h4 className="w-full text-wrap px-4 text-sm font-normal tracking-tight">
              {userWallet.userPublicKey}
            </h4>
            <p className=" w-full text-wrap px-4 pt-2 text-xs font-normal tracking-tight">
              {String(userWallet.userMinaBalance)} MINA
            </p>
            <p className=" w-full text-wrap px-4 pt-2 text-xs font-normal tracking-tight">
              {userWallet.library.length} Games
            </p>
            <Button
              className=" mt-2"
              variant="ghost"
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          </PopoverContent>
        </Popover>
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
