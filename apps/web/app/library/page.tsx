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
        <DynamicLibrary />
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
