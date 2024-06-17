"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/lib/stores/userWallet";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FirstForm = dynamic(() => import("./firstForm"));
const SecondForm = dynamic(() => import("./secondForm"));

export default function Register() {
  const userStore = useUserStore();
  const [form, setForm] = useState("1");
  return (
    <div className=" h-full p-8">
      <div className=" flex h-full w-full justify-center">
        {userStore.isConnected ? (
          <div className=" flex  h-full w-full flex-col gap-4">
            <div className=" p-4">
              <h1 className="text-3xl font-medium">Game Registration</h1>

              <h3 className="text-md py-4">How to Register Your Game?</h3>

              <p className="text-sm">
                1. Fill the first form with your on chain game information and
                make payment.
              </p>

              <p className="text-sm">
                2. After the payment is successful, fill the second form with
                your off chain game information.
              </p>

              <p className="text-sm">
                3. Your game will be registered and you will be able to see it
                in the store.
              </p>
            </div>

            <RadioGroup
              defaultValue="1"
              onValueChange={(value: string) => {
                setForm(value);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1">First Form</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2">Second Form</Label>
              </div>
            </RadioGroup>

            {form === "1" ? <FirstForm /> : <SecondForm />}
          </div>
        ) : (
          <div className="flex h-[80vh] items-center justify-center">
            <h3 className="text-3xl font-medium">
              Please connect your wallet for game registration
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
