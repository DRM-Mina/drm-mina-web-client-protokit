import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useChangeDiscountOnChain,
  useChangeNumberOfDevicesOnChain,
  useChangePriceOnChain,
  useChangeTimeoutIntervalOnChain,
  useRegisterStore,
} from "@/lib/stores/gameRegister";
import { useGamesStore } from "@/lib/stores/gameStore";
import { tagList } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function SelectedGame({ gameId }: { gameId: number }) {
  const registerStore = useRegisterStore();
  const gameStore = useGamesStore();

  let game = registerStore.registeredGameList.find(
    (game) => game.gameId === gameId,
  );

  if (!game) {
    return <div>Game not found</div>;
  }

  const [onChainForm, setOnChainForm] = useState({
    price: game.price,
    discount: game.discount,
    timeoutInterval: game.timeoutInterval,
    numberOfDevices: game.numberOfDevices,
  });

  const [offChainForm, setOffChainForm] = useState({
    name: "",
    description: "",
    creator: "",
    tags: [] as string[],
  });

  useEffect(() => {
    game = registerStore.registeredGameList.find(
      (game) => game.gameId === gameId,
    );
    if (!game) {
      return;
    }
    setOnChainForm({
      price: game.price,
      discount: game.discount,
      timeoutInterval: game.timeoutInterval,
      numberOfDevices: game.numberOfDevices,
    });

    const gameOffChainProps = gameStore.games.find(
      (game) => game.gameId === gameId,
    );
    console.log(gameOffChainProps);
    if (!gameOffChainProps) {
      setOffChainForm({
        name: "",
        description: "",
        creator: "",
        tags: [],
      });
      return;
    }

    setOffChainForm({
      name: gameOffChainProps.name,
      description: gameOffChainProps.description,
      creator: gameOffChainProps.creator,
      tags: gameOffChainProps.tags,
    });
  }, [gameId, registerStore.registeredGameList]);

  const changePrice = useChangePriceOnChain(gameId, onChainForm.price);
  const changeDiscount = useChangeDiscountOnChain(gameId, onChainForm.discount);
  const changeTimeoutInterval = useChangeTimeoutIntervalOnChain(
    gameId,
    onChainForm.timeoutInterval,
  );
  const changeNumberOfDevices = useChangeNumberOfDevicesOnChain(
    gameId,
    onChainForm.numberOfDevices,
  );

  const handleOffChainDataSubmit = () => {
    console.table(offChainForm);
  };

  return (
    <div className=" grid w-full grid-cols-2">
      <div className=" col-span-1 border-r-2">
        <h3 className="p-4 text-lg font-semibold">
          {"Edit Game " + gameId + " OnChain"}
        </h3>

        <div className="">
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-2 items-center gap-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                onChange={(event) => {
                  let value = parseInt(event.target.value);
                  if (value < 0) {
                    value = 0;
                  }
                  setOnChainForm((prev) => ({ ...prev, price: value }));
                }}
                value={onChainForm.price}
                defaultValue={0}
                type="number"
                id="price"
              />
            </div>
            <div className="col-span-1"></div>
            <Button className="col-span-1 self-end" onClick={changePrice}>
              Change
            </Button>
          </div>
        </div>

        <div>
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-2 items-center gap-1.5">
              <Label htmlFor="discount">{"Discount Amount"}</Label>
              <Input
                onChange={(event) => {
                  let value = parseInt(event.target.value);
                  if (value < 0) {
                    value = 0;
                  }
                  setOnChainForm((prev) => ({ ...prev, discount: value }));
                }}
                value={onChainForm.discount}
                defaultValue={0}
                type="number"
                id="discount"
              />
            </div>
            <div className="col-span-1"></div>
            <Button className="col-span-1 self-end" onClick={changeDiscount}>
              Change
            </Button>
          </div>
        </div>

        <div>
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-2 items-center gap-1.5">
              <Label htmlFor="timeoutInterval">
                {"Timeout Interval For Sessions (120 minutes minimum)"}
              </Label>
              <Input
                onChange={(event) => {
                  let value = parseInt(event.target.value);
                  if (value < 120) {
                    value = 120;
                  }
                  setOnChainForm((prev) => ({
                    ...prev,
                    timeoutInterval: value,
                  }));
                }}
                value={onChainForm.timeoutInterval}
                defaultValue={120}
                type="number"
                id="timeoutInterval"
              />
            </div>
            <div className="col-span-1"></div>
            <Button
              className="col-span-1 self-end"
              onClick={changeTimeoutInterval}
            >
              Change
            </Button>
          </div>
        </div>

        <div>
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-2 items-center gap-1.5">
              <Label>Number of Devices Allowed</Label>
              <Select
                defaultValue="1"
                onValueChange={(value) => {
                  setOnChainForm((prev) => ({
                    ...prev,
                    numberOfDevices: parseInt(value),
                  }));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Number of Devices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1"></div>
            <Button
              className="col-span-1 self-end"
              onClick={changeNumberOfDevices}
            >
              Change
            </Button>
          </div>
        </div>
      </div>
      <div className=" col-span-1">
        <h3 className="p-4 text-lg font-semibold">
          {"Edit Game " + gameId + " OffChain"}
        </h3>

        <div>
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-4 items-center gap-1.5">
              <Label htmlFor="name">Name of the Game</Label>
              <Input
                onChange={(event) => {
                  setOffChainForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                }}
                value={offChainForm.name}
                defaultValue={""}
                type="text"
                id="name"
              />
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>

        <div>
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-4 items-center gap-1.5">
              <Label htmlFor="description">Description of the Game</Label>
              <Textarea
                onChange={(event) => {
                  setOffChainForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }));
                }}
                value={offChainForm.description}
                defaultValue={""}
                id="description"
              />
            </div>
          </div>
        </div>

        <div>
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-4 items-center gap-1.5">
              <Label htmlFor="creator">Creator of the Game</Label>
              <Input
                onChange={(event) => {
                  setOffChainForm((prev) => ({
                    ...prev,
                    creator: event.target.value,
                  }));
                }}
                value={offChainForm.creator}
                defaultValue={""}
                type="text"
                id="creator"
              />
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>

        <div>
          <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
            <div className=" col-span-4 items-center gap-1.5">
              <Label htmlFor="tags">Available Tags</Label>
              <ScrollArea id="tags" className=" h-32 w-full rounded-sm border">
                <div className="flex flex-col gap-3 p-2">
                  {tagList.map((tag) => (
                    <div className=" flex gap-2" key={tag}>
                      <Checkbox
                        key={tag}
                        checked={offChainForm.tags.includes(tag)}
                        onClick={() => {
                          if (offChainForm.tags.includes(tag)) {
                            setOffChainForm((prev) => ({
                              ...prev,
                              tags: prev.tags.filter((t) => t !== tag),
                            }));
                          } else {
                            setOffChainForm((prev) => ({
                              ...prev,
                              tags: [...prev.tags, tag],
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={tag}>{tag}</Label>
                    </div>
                  ))}
                </div>
                <ScrollBar />
              </ScrollArea>
            </div>
          </div>
        </div>

        <div className=" p-4">
          <Button onClick={handleOffChainDataSubmit}>Update</Button>
        </div>
      </div>
    </div>
  );
}
