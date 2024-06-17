import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useObserveRegisteredGameList,
  useObserveRegisteredGames,
  useRegisterStore,
} from "@/lib/stores/gameRegister";
import React, { useState } from "react";
import SelectedGame from "./selectedGame";

export default function SecondForm() {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const registerStore = useRegisterStore();
  useObserveRegisteredGames();
  useObserveRegisteredGameList();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">GameId</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Timeout Interval</TableHead>
            <TableHead>Number of Devices Allowed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registerStore.registeredGameList.map((game) => (
            <TableRow key={game.gameId}>
              <TableCell className="font-medium">{game.gameId}</TableCell>
              <TableCell>{game.price}</TableCell>
              <TableCell>{game.discount}</TableCell>
              <TableCell>{game.timeoutInterval}</TableCell>
              <TableCell>{game.numberOfDevices}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="secondary"
                  onClick={() => {
                    console.log(game.gameId);
                    setSelectedGame(game.gameId);
                    console.log(selectedGame);
                  }}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedGame !== null && <SelectedGame gameId={selectedGame} />}
    </>
  );
}
