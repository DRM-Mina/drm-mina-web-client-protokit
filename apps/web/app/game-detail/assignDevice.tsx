import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { postSlotNames } from "@/lib/api";
import { useDeviceStore } from "@/lib/stores/deviceStore";
import { useObserveSlots } from "@/lib/stores/marketOperations";
import { useUserStore } from "@/lib/stores/userWallet";
import React, { useEffect, useState } from "react";

interface AssignDeviceProps {
  gameId: number;
}

export default function AssignDevice({ gameId }: AssignDeviceProps) {
  const userStore = useUserStore();
  const deviceStore = useDeviceStore();
  const [slotNames, setSlotNames] = useState<string[]>([]);

  const { toast } = useToast();
  useObserveSlots(gameId);

  useEffect(() => {
    setSlotNames(userStore.slotNames);
  }, [userStore.slotNames, userStore.userPublicKey]);

  return (
    <div className=" col-span-3">
      {userStore.isConnected &&
      userStore.library.includes(gameId) &&
      userStore.gameId === gameId ? (
        <div className=" grid h-full w-full grid-cols-4 p-4">
          {userStore.slotNames.map((_, index) => {
            return (
              <div
                key={index}
                className=" col-span-1 grid h-full grid-rows-2 items-center justify-center px-4"
              >
                <Input
                  className=" row-span-1 "
                  type="text"
                  value={slotNames[index]}
                  placeholder="Give a name"
                  onChange={(event) => {
                    const newSlotNames = [...slotNames];
                    newSlotNames[index] = event.target.value;
                    setSlotNames(newSlotNames);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      (async () => {
                        const res = await postSlotNames(
                          userStore.userPublicKey!,
                          gameId,
                          slotNames,
                        );
                        if (res) {
                          toast({
                            description: "Slot names updated",
                          });
                        } else {
                          toast({
                            description: "Failed to update slot names",
                          });
                        }
                      })();
                    }
                  }}
                ></Input>
                <div className=" row-span-1 flex w-full flex-col items-center justify-center gap-2">
                  <h3 className=" text-center">{userStore.slots[index]}</h3>
                  <Button
                    variant={"secondary"}
                    onClick={() => {
                      if (!deviceStore.isDeviceSet) {
                        toast({
                          title: "No device information provided",
                          description:
                            "Please try to connect through the our desktop app",
                        });
                        return;
                      }
                    }}
                  >
                    Assign This
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
