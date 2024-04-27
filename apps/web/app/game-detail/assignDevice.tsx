import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { postSlotNames } from "@/lib/api";
import useHasMounted from "@/lib/customHooks";
import { useClientStore } from "@/lib/stores/client";
import { useDeviceStore } from "@/lib/stores/deviceStore";
import { useMarketStore, useObserveSlots } from "@/lib/stores/marketOperations";
import { useTransactionStore } from "@/lib/stores/transactionStore";
import { useUserStore } from "@/lib/stores/userWallet";
import { useWorkerStore } from "@/lib/stores/workerStore";
import { Identifiers } from "chain/dist/lib/identifiers";
import React, { useEffect, useState } from "react";

interface AssignDeviceProps {
  gameId: number;
}

export default function AssignDevice({ gameId }: AssignDeviceProps) {
  const userStore = useUserStore();
  const deviceStore = useDeviceStore();
  const workerStore = useWorkerStore();
  const marketStore = useMarketStore();
  const transactions = useTransactionStore();
  const client = useClientStore();
  const [slotNames, setSlotNames] = useState<string[]>([]);

  const { toast } = useToast();
  useObserveSlots(gameId);

  useEffect(() => {
    setSlotNames(userStore.slotNames);
  }, [userStore.slotNames, userStore.userPublicKey]);

  const hasMounted = useHasMounted();
  useEffect(() => {
    if (
      hasMounted &&
      !workerStore.isReady
      // && deviceStore.isDeviceSet
    ) {
      toast({
        title: "Web workers loading",
        description:
          "Our web workers working hard to getting ready things up, computer's fans could speed up a little 😬",
      });
      (async () => {
        console.log("Starting worker");
        await workerStore.startWorker();

        toast({
          title: "Web workers loaded",
          description: "Web workers are ready",
        });
      })();
    }
  }, [hasMounted]);

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

                      if (!workerStore.isReady) {
                        toast({
                          title: "Web workers not ready",
                          description:
                            "Please wait for the web workers to get ready",
                        });
                        return;
                      }

                      (async () => {
                        console.log("Assigning device: ", deviceStore.device);
                        const deviceProof =
                          await workerStore.worker?.createDeviceIdentifierProof(
                            {
                              rawIdentifiers: deviceStore.device,
                            },
                          );
                        const computedIdentifiers = Identifiers.fromRaw(
                          deviceStore.device,
                        );
                        console.log(
                          "Computed Identifiers: ",
                          computedIdentifiers,
                        );
                        console.log(
                          "Computed Hash: ",
                          computedIdentifiers.hash().toString(),
                        );

                        console.log("Proof: ", deviceProof);
                        console.log(
                          "Proof Hash: ",
                          deviceProof?.publicOutput.toString(),
                        );
                        if (deviceProof) {
                          const pendingTransaction =
                            await marketStore.assignDevice(
                              client.client,
                              userStore.userPublicKey!,
                              gameId,
                              index + 1,
                              deviceProof,
                            );

                          transactions.addPendingTransaction(
                            pendingTransaction,
                          );
                        }
                      })();
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
