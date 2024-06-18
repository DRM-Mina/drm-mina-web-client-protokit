import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useChangeDiscountOnChain,
  useChangeNumberOfDevicesOnChain,
  useChangePriceOnChain,
  useChangeTimeoutIntervalOnChain,
  useRegisterStore,
} from "@/lib/stores/gameRegister";
import React, { useEffect, useState } from "react";

export default function ChangeOnChain({ gameId }: { gameId: number }) {
  const registerStore = useRegisterStore();

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

  return (
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
              defaultValue={onChainForm.numberOfDevices.toString()}
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
  );
}
