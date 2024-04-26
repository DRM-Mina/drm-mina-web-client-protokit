import { useToast } from "@/components/ui/use-toast";
import { toggleGameWishlist } from "@/lib/api";
import { useUserStore } from "@/lib/stores/userWallet";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import React from "react";

export default function GameBookmark({
  className,
  gameId,
}: {
  className?: string;
  gameId: number;
}) {
  const userStore = useUserStore();
  const { toast } = useToast();
  return (
    <Bookmark
      className={cn(
        `absolute right-2 top-2 h-6 w-6 cursor-pointer ${
          userStore.wishlist.includes(gameId) ? " fill-current" : "fill-card"
        }`,
        className,
      )}
      onClick={async (e) => {
        e.stopPropagation();
        if (userStore.isConnected) {
          const status = await toggleGameWishlist(
            // @ts-ignore
            userStore.userPublicKey,
            gameId,
          );
          if (!status) {
            toast({
              description: "Removed from wishlist",
            });
            userStore.removeWishlist(gameId);
          } else {
            toast({ description: "Added to wishlist" });
            userStore.addWishlist(gameId);
          }
        } else {
          toast({
            description: "Please connect your wallet",
          });
        }
      }}
    ></Bookmark>
  );
}
