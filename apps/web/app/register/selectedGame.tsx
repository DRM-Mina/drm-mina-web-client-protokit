import { useRegisterStore } from "@/lib/stores/gameRegister";
import React from "react";
import ChangeOnChain from "./changeOnChain";
import ChangeOffChain from "./changeOffChain";

export default function SelectedGame({ gameId }: { gameId: number }) {
  const registerStore = useRegisterStore();

  let game = registerStore.registeredGameList.find(
    (game) => game.gameId === gameId,
  );

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div className=" grid w-full grid-cols-2">
      <ChangeOnChain gameId={gameId} />
      <ChangeOffChain gameId={gameId} />
    </div>
  );
}
