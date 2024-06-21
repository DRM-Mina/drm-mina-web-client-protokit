import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGiftGame } from "@/lib/stores/marketOperations";
import { Gift } from "lucide-react";
import React from "react";

interface BuyGameProps {
  gameId: number | undefined;
}

export default function BuyGame({ gameId }: BuyGameProps) {
  const [recipient, setRecipient] = React.useState<string>("");
  const handleGift = useGiftGame(gameId, recipient);

  return (
    <Popover>
      <PopoverTrigger>
        <Gift />
      </PopoverTrigger>
      <PopoverContent className=" flex w-96 flex-row gap-4 p-4">
        <Input
          value={recipient}
          placeholder="Recipient address"
          onChange={(event) => setRecipient(event.target.value)}
        />
        <Button onClick={handleGift}>Gift</Button>
      </PopoverContent>
    </Popover>
  );
}
