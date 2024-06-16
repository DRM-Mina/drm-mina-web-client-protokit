import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { useUserStore } from "./userWallet";
import { useTransactionStore } from "./transactionStore";
import { useToast } from "@/components/ui/use-toast";
import { useCallback } from "react";
import { PublicKey } from "o1js";
import { UInt64 } from "@proto-kit/library";

export interface GameRegisterState {
  registerGameOnChain: (
    client: Client,
    address: string,
    price: number,
    discount: number,
    timeoutInterval: number,
    number_of_devices_allowed: number,
  ) => Promise<PendingTransaction>;
}

function isPendingTransaction(
  transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
  if (!(transaction instanceof PendingTransaction))
    throw new Error("Transaction is not a PendingTransaction");
}

export const useRegisterStore = create<
  GameRegisterState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    async registerGameOnChain(
      client: Client,
      address: string,
      price: number,
      discount: number,
      timeoutInterval: number,
      number_of_devices_allowed: number,
    ) {
      const gameToken = client.runtime.resolve("GameToken");
      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, () => {
        gameToken.createNewGame(
          sender,
          UInt64.from(price),
          UInt64.from(discount),
          UInt64.from(timeoutInterval),
          UInt64.from(number_of_devices_allowed),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
  })),
);

export const useRegisterGameOnChain = (
  price: number,
  discount: number,
  timeoutInterval: number,
  numberOfDevices: number,
) => {
  const gameRegisterStore = useRegisterStore();
  const client = useClientStore();
  const userStore = useUserStore();
  const transactions = useTransactionStore();
  const { toast } = useToast();

  return useCallback(async () => {
    if (userStore.isConnected === false) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
      });
      return;
    }
    if (!client.client || !userStore.userPublicKey) return;

    console.log(price, discount, timeoutInterval, numberOfDevices);

    const pendingTransaction = await gameRegisterStore.registerGameOnChain(
      client.client,
      userStore.userPublicKey,
      price,
      discount,
      timeoutInterval,
      numberOfDevices,
    );

    transactions.addPendingTransaction(pendingTransaction);
  }, [
    client.client,
    userStore.userPublicKey,
    price,
    discount,
    timeoutInterval,
    numberOfDevices,
  ]);
};
