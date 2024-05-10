"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDeviceStore } from "@/lib/stores/deviceStore";
import Store from "@/app/store/page";

export default function Home() {
  const gameName = useSearchParams()?.get("game");

  const device = useSearchParams()?.get("device");

  const router = useRouter();
  const deviceStore = useDeviceStore();

  useEffect(() => {
    if (device || gameName) {
      if (device) {
        deviceStore.setDevice(JSON.parse(device));
      }
      if (gameName) router.push("/game-detail?game=" + gameName);
    }
  }, []);

  return <Store />;
}
