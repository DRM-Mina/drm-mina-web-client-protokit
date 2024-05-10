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
  const [canAssign, setCanAssign] = useState<boolean>(false);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

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
      // TODO: enable in prod
      // && deviceStore.isDeviceSet
    ) {
      toast({
        title: "Web workers loading",
        description:
          "Our web workers working hard to getting ready things up, computer's fans could speed up a little 😬",
      });
      (async () => {
        if (workerStore.isLoading || workerStore.isReady) {
          return;
        }

        await workerStore.startWorker();

        toast({
          title: "Web workers loaded",
          description: "Web workers are ready",
        });
      })();
    }
  }, [hasMounted]);

  useEffect(() => {
    console.log(
      userStore.isConnected,
      userStore.library,
      userStore.gameId,
      workerStore.isReady,
    );
    if (
      // TODO: enable in prod
      // deviceStore.isDeviceSet &&
      workerStore.isReady &&
      userStore.isConnected &&
      userStore.library.includes(gameId) &&
      userStore.gameId === gameId
    ) {
      setCanAssign(true);
    }
  }, [
    userStore.isConnected,
    userStore.library,
    userStore.gameId,
    workerStore.isReady,
  ]);

  return (
    <div className=" col-span-3">
      {canAssign ? (
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
                  value={slotNames[index] || ""}
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
                    key={index + 1}
                    variant={"secondary"}
                    disabled={isAssigning}
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

                      if (!client.client || !userStore.userPublicKey || !gameId)
                        return;

                      if (isAssigning) {
                        toast({
                          title: "Still assigning",
                          description:
                            "Please wait for the previous assignment to complete",
                        });
                        return;
                      }

                      setIsAssigning(true);

                      (async () => {
                        const deviceProofStringify =
                          await workerStore.worker?.createDeviceIdentifierProof(
                            {
                              rawIdentifiers: deviceStore.device,
                            },
                          );
                        if (deviceProofStringify) {
                          const pendingTransaction =
                            await marketStore.assignDevice(
                              client.client!,
                              userStore.userPublicKey!,
                              gameId,
                              index + 1,
                              deviceProofStringify,
                            );

                          transactions.addPendingTransaction(
                            pendingTransaction,
                          );
                        }
                        setIsAssigning(false);
                      })();
                    }}
                  >
                    {isAssigning ? "Assigning" : "Assign This"}
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
