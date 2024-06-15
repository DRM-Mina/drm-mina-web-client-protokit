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
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";

export default function FirstForm() {
  const [form, setForm] = useState({
    price: 0,
    discount: 0,
    timeoutInterval: 120,
    numberOfDevices: 2,
  });

  const { toast } = useToast();

  const handleToast = (msg: string) => {
    toast({
      title: msg,
    });
  };

  const handleSubmit = () => {
    if (form.price < 0) {
      handleToast("Price cannot be negative");
      return;
    }

    if (form.discount < 0) {
      handleToast("Discount cannot be negative");
      return;
    }

    if (form.timeoutInterval < 120) {
      handleToast("Timeout interval cannot be less than 120 minutes");
      return;
    }

    if (form.numberOfDevices < 2) {
      handleToast("Number of devices cannot be less than 2");
      return;
    }

    handleToast("Game registered successfully");
  };
  return (
    <>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="price">Price</Label>
          <Input
            onChange={(event) => {
              let value = parseInt(event.target.value);
              if (value < 0) {
                value = 0;
              }
              setForm((prev) => ({ ...prev, price: value }));
            }}
            value={form.price}
            defaultValue={0}
            type="number"
            id="price"
          />
        </div>
      </div>

      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="discount">{"Discount Amount (Optional)"}</Label>
          <Input
            onChange={(event) => {
              let value = parseInt(event.target.value);
              if (value < 0) {
                value = 0;
              }
              setForm((prev) => ({ ...prev, discount: value }));
            }}
            value={form.discount}
            defaultValue={0}
            type="number"
            id="discount"
          />
        </div>
      </div>

      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="timeoutInterval">
            {"Timeout Interval For Sessions (120 minutes min)"}
          </Label>
          <Input
            onChange={(event) => {
              let value = parseInt(event.target.value);
              if (value < 120) {
                value = 120;
              }
              setForm((prev) => ({ ...prev, timeoutInterval: value }));
            }}
            value={form.timeoutInterval}
            defaultValue={120}
            type="number"
            id="timeoutInterval"
          />
        </div>
      </div>

      <div>
        <Label>Number of Devices Allowed</Label>
        <Select
          defaultValue="2"
          onValueChange={(value) => {
            setForm((prev) => ({ ...prev, numberOfDevices: parseInt(value) }));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Number of Devices" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-md py-4">
          50 Mina{" "}
          {/* <img
            src={"/mina.webp"}
            alt="mina"
            className=" inline-block h-4 w-4"
          />{" "} */}
          will be charged for registration. Can not be refunded.
        </p>
      </div>

      <div>
        <Button className=" p-4" onClick={handleSubmit}>
          Register Game
        </Button>
      </div>
    </>
  );
}
