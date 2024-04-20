"use client";
import React from "react";
import { useRouter } from "next/navigation";
import WishlistItems from "../components/wishlist";
import { useUserStore } from "@/lib/stores/userWallet";

export default function Wishlist() {
    const router = useRouter();
    const wishlist = useUserStore((state) => state.wishlist);
    const isConnected = useUserStore((state) => state.isConnected);

    return isConnected ? (
        <div className=" p-8">
            {wishlist.length === 0 ? (
                <div className=" flex w-full justify-center ">
                    <h2 className="mb-2 text-lg font-medium tracking-tight">
                        Your Wishlist Is Empty
                    </h2>

                    <h3
                        className="mb-2 text-lg absolute align-middle top-1/2 font-medium tracking-tight underline underline-offset-2 hover:underline-offset-4 cursor-pointer"
                        onClick={() => router.push("/store")}
                    >
                        Explore the store
                    </h3>
                </div>
            ) : (
                <WishlistItems />
            )}
        </div>
    ) : (
        <div className="flex justify-center items-center h-[80vh]">
            <h3 className="text-3xl font-medium">
                Please connect your wallet to view your wishlist
            </h3>
        </div>
    );
}
