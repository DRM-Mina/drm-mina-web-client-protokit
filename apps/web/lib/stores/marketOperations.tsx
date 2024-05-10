import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { TokenId, UInt64 } from "@proto-kit/library";
import { Field, JsonProof, PublicKey } from "o1js";
import { useCallback } from "react";
import { useUserStore } from "./userWallet";
import { useTransactionStore } from "./transactionStore";
import { useToast } from "@/components/ui/use-toast";
import { useChainStore } from "./chain";
import { useEffect } from "react";
import { UserKey } from "chain/dist/GameToken";
import { fetchSlotNames } from "../api";
import { DeviceIdentifierProof, DeviceKey } from "chain/dist/DRM";

export interface MarketState {
  buyGame: (
    client: Client,
    address: string,
    gameId: number,
  ) => Promise<PendingTransaction>;

  assignDevice: (
    client: Client,
    address: string,
    gameId: number,
    slot: number,
    deviceProofStringify: string,
  ) => Promise<PendingTransaction>;
}

function isPendingTransaction(
  transaction: PendingTransaction | UnsignedTransaction | undefined,
): asserts transaction is PendingTransaction {
  if (!(transaction instanceof PendingTransaction))
    throw new Error("Transaction is not a PendingTransaction");
}

export const tokenId = TokenId.from(0);

export const useMarketStore = create<MarketState, [["zustand/immer", never]]>(
  immer((set) => ({
    async buyGame(client, address, gameId) {
      const gameToken = client.runtime.resolve("GameToken");
      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, () => {
        gameToken.buyGame(UInt64.from(gameId));
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },

    async assignDevice(client, address, gameId, slot, deviceProofStringify) {
      const drm = client.runtime.resolve("DRM");
      const sender = PublicKey.fromBase58(address);
      const deviceProof = DeviceIdentifierProof.fromJSON(
        JSON.parse(deviceProofStringify) as JsonProof,
      );

      const tx = await client.transaction(sender, () => {
        drm.addOrChangeDevice(
          deviceProof,
          UInt64.from(gameId),
          UInt64.from(slot),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },
  })),
);

export const useBuyGame = (gameId?: number) => {
  const marketStore = useMarketStore();
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
    if (!client.client || !userStore.userPublicKey || !gameId) return;

    const pendingTransaction = await marketStore.buyGame(
      client.client,
      userStore.userPublicKey,
      gameId,
    );

    transactions.addPendingTransaction(pendingTransaction);
  }, [client.client, userStore.userPublicKey]);
};

export const useAssignDevice = (
  gameId: number,
  slot: number,
  deviceProofStringify: string,
) => {
  const client = useClientStore();
  const marketStore = useMarketStore();
  const transactions = useTransactionStore();
  const userStore = useUserStore();
  const { toast } = useToast();

  return useCallback(async () => {
    if (userStore.isConnected === false) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet",
      });
      return;
    }
    if (!client.client || !userStore.userPublicKey || !gameId) return;
    const pendingTransaction = await marketStore.assignDevice(
      client.client,
      userStore.userPublicKey,
      gameId,
      slot,
      deviceProofStringify,
    );

    transactions.addPendingTransaction(pendingTransaction);
  }, [client.client, userStore.userPublicKey]);
};

export const useObserveLibrary = () => {
  const client = useClientStore();
  // const chain = useChainStore();
  const wallet = useUserStore();
  const userStore = useUserStore();
  const transactions = useTransactionStore();

  useEffect(() => {
    if (!client.client || !userStore.userPublicKey) return;
    (async () => {
      const totalGames =
        await client.client!.query.runtime.GameToken.totalGameNumber.get();
      const gameIds = Array.from(
        { length: Number(totalGames?.toString()) },
        (_, i) => i + 1,
      );
      let library: number[] = [];
      for (const gameId of gameIds) {
        const userKey = UserKey.from(
          UInt64.from(gameId),
          PublicKey.fromBase58(userStore.userPublicKey!),
        );
        const query =
          await client.client!.query.runtime.GameToken.users.get(userKey);
        if (query?.value) {
          library.push(gameId);
        }
      }
      userStore.setLibrary(library);
    })();
  }, [
    client.client,
    transactions.pendingTransactions,
    wallet.userPublicKey || "",
  ]);
};

export const useObserveSlots = (gameId: number) => {
  const client = useClientStore();
  const wallet = useUserStore();
  const userStore = useUserStore();
  const transactions = useTransactionStore();

  useEffect(() => {
    if (
      !client.client ||
      !userStore.userPublicKey ||
      !userStore.library.includes(gameId)
    ) {
      return;
    }
    (async () => {
      const slotCountQuery =
        await client.client!.query.runtime.GameToken.number_of_devices_allowed.get(
          UInt64.from(gameId),
        );
      if (slotCountQuery?.value) {
        const slotCount = Number(slotCountQuery.value.toString());
        let slotNamesArray = await fetchSlotNames(
          userStore.userPublicKey!,
          gameId,
        );
        slotNamesArray = slotNamesArray.slice(0, slotCount);

        let slotArray: string[] = [];

        const deviceKey = DeviceKey.from(
          UInt64.from(gameId),
          PublicKey.fromBase58(userStore.userPublicKey!),
        );
        const slotQuery =
          await client.client!.query.runtime.DRM.devices.get(deviceKey);

        if (slotQuery) {
          for (let i = 1; i <= slotCount; i++) {
            const device = Field.from(slotQuery[`device_${i}`]);
            slotArray.push(
              device.toString() === "0"
                ? "Empty"
                : device.toString().slice(0, 6) + "...",
            );
          }
        } else {
          for (let i = 0; i < slotCount; i++) {
            slotArray.push("Empty");
          }
        }
        userStore.setSlots(gameId, slotNamesArray, slotArray);
      }
    })();
  }, [
    client.client,
    userStore.library,
    transactions.pendingTransactions,
    wallet.userPublicKey || "",
  ]);
};
