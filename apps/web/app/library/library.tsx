import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useGamesStore } from "@/lib/stores/gameStore";
import { useUserStore } from "@/lib/stores/userWallet";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export default function DynamicLibrary() {
  const router = useRouter();
  const userStore = useUserStore();
  const gameStore = useGamesStore();

  const { toast } = useToast();

  const handleGameDownload = () => {
    toast({
      title: "Download started",
      description: "Just kidding we do not have this feature yet 🚀",
    });
  };

  return userStore.library.length === 0 ? (
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
    <div className=" flex w-full flex-col items-center justify-center gap-6">
      <h3 className="mb-2 text-lg font-medium tracking-tight">Owned Games</h3>
      {gameStore.games
        .filter((game: Game) => userStore.library.includes(game.gameId))
        .map((game, index) => {
          return (
            <Card
              key={index}
              className=" card-hover-effect grid w-2/3 cursor-pointer grid-cols-8"
              onClick={() => router.push("/game-detail?game=" + game.name)}
            >
              <CardContent className=" col-span-3 aspect-video items-center justify-center  p-4">
                <img
                  src={
                    ENDPOINT +
                    "images/" +
                    game.imageFolder +
                    "/10/" +
                    game.imageFolder +
                    ".webp"
                  }
                  crossOrigin="anonymous"
                  alt={game.name}
                  className="flex h-full w-full rounded-lg object-cover"
                />
              </CardContent>

              <CardContent className=" col-span-3 items-center">
                <CardTitle className=" pb-2 pt-6">{game.name}</CardTitle>
                <CardDescription className="py-2">
                  {game.description}
                </CardDescription>
              </CardContent>
              <CardContent className=" col-span-2 flex items-center justify-center">
                <Button
                  className=" "
                  variant={"link"}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleGameDownload();
                  }}
                >
                  <Download size={24} />
                  Download Game
                </Button>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
