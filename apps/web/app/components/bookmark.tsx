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
                `absolute top-2 right-2 w-6 h-6 cursor-pointer ${
                    userStore.wishlist.includes(gameId) ? " fill-current" : "fill-card"
                }`,
                className
            )}
            onClick={async (e) => {
                e.stopPropagation();
                if (userStore.isConnected) {
                    const status = await toggleGameWishlist(
                        // @ts-ignore
                        userStore.userPublicKey,
                        gameId
                    );
                    // if (userStore.wishlistFlag) {
                    //     toast({
                    //         description: "Chill Bro :D",
                    //     });
                    //     return;
                    // }
                    // userStore.setFlag();
                    if (!status) {
                        toast({
                            description: "Removed from wishlist",
                        });
                        userStore.removeWishlist(gameId);
                        // userStore.nullifyFlag();
                    } else {
                        toast({ description: "Added to wishlist" });
                        userStore.addWishlist(gameId);
                        // userStore.nullifyFlag();
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
