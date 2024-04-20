"use client";
import { useGamesStore } from "@/lib/stores/gameStore";
import { useUserStore } from "@/lib/stores/userWallet";
import React from "react";

export default function Library() {
    const userStore = useUserStore();
    const gameStore = useGamesStore();

    return (
        <div className=" p-8">
            {userStore.isConnected ? (
                <></>
            ) : (
                <div className="flex justify-center items-center h-[80vh]">
                    <h3 className="text-3xl font-medium">
                        Please connect your wallet to view your library
                    </h3>
                </div>
            )}
        </div>
    );
}
