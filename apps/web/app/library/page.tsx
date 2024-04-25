"use client";
import { useUserStore } from "@/lib/stores/userWallet";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

const DynamicLibrary = dynamic(() => import("@/app/library/library"));

export default function Library() {
  const userStore = useUserStore();
  const router = useRouter();

  return (
    <div className=" p-8">
      {userStore.isConnected ? (
        userStore.library.length === 0 ? (
          <div className=" flex w-full justify-center ">
            <h2 className="mb-2 text-lg font-medium tracking-tight">
              Your Library Is Empty
            </h2>

            <h3
              className="absolute top-1/2 mb-2 cursor-pointer align-middle text-lg font-medium tracking-tight underline underline-offset-2 hover:underline-offset-4"
              onClick={() => router.push("/store")}
            >
              Explore the store
            </h3>
          </div>
        ) : (
          <DynamicLibrary />
        )
      ) : (
        <div className="flex h-[80vh] items-center justify-center">
          <h3 className="text-3xl font-medium">
            Please connect your wallet to view your library
          </h3>
        </div>
      )}
    </div>
  );
}
