import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { useUserStore } from "./userWallet";
import { useTransactionStore } from "./transactionStore";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useEffect } from "react";
import { PublicKey } from "o1js";
import { UInt64 } from "@proto-kit/library";

export interface registeredGame {
  gameId: number;
  price: number;
  discount: number;
  timeoutInterval: number;
  numberOfDevices: number;
}

export interface GameRegisterState {
  registeredGames: number[];
  setRegisteredGames: (games: number[]) => void;

  registeredGameList: registeredGame[];
  setRegisteredGameList: (games: registeredGame[]) => void;

  trigger: boolean;
  setTrigger: (trigger: boolean) => void;

  registerGameOnChain: (
    client: Client,
    address: string,
    price: number,
    discount: number,
    timeoutInterval: number,
    number_of_devices_allowed: number,
  ) => Promise<PendingTransaction>;

  changePriceOnChain: (
    client: Client,
    address: string,
    gameId: number,
    price: number,
  ) => Promise<PendingTransaction>;

  changeDiscountOnChain: (
    client: Client,
    address: string,
    gameId: number,
    discount: number,
  ) => Promise<PendingTransaction>;

  changeTimeoutIntervalOnChain: (
    client: Client,
    address: string,
    gameId: number,
    timeoutInterval: number,
  ) => Promise<PendingTransaction>;

  changeNumberOfDevicesOnChain: (
    client: Client,
    address: string,
    gameId: number,
    numberOfDevices: number,
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
    registeredGames: [],
    setRegisteredGames: (games) =>
      set((state) => void (state.registeredGames = games)),

    registeredGameList: [],
    setRegisteredGameList: (gameList) =>
      set((state) => void (state.registeredGameList = gameList)),

    trigger: false,
    setTrigger: (trigger) => set((state) => void (state.trigger = trigger)),

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

    async changePriceOnChain(
      client: Client,
      address: string,
      gameId: number,
      price: number,
    ) {
      console.log("changePriceOnChain");
      console.table({ address, gameId, price });
      const gameToken = client.runtime.resolve("GameToken");

      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, () => {
        gameToken.setGamePrice(UInt64.from(gameId), UInt64.from(price));
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },

    async changeDiscountOnChain(
      client: Client,
      address: string,
      gameId: number,
      discount: number,
    ) {
      const gameToken = client.runtime.resolve("GameToken");

      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, () => {
        gameToken.setDiscount(UInt64.from(gameId), UInt64.from(discount));
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },

    async changeTimeoutIntervalOnChain(
      client: Client,
      address: string,
      gameId: number,
      timeoutInterval: number,
    ) {
      const gameToken = client.runtime.resolve("GameToken");

      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, () => {
        gameToken.setTimeoutInterval(
          UInt64.from(gameId),
          UInt64.from(timeoutInterval),
        );
      });

      await tx.sign();
      await tx.send();

      isPendingTransaction(tx.transaction);
      return tx.transaction;
    },

    async changeNumberOfDevicesOnChain(
      client: Client,
      address: string,
      gameId: number,
      numberOfDevices: number,
    ) {
      const gameToken = client.runtime.resolve("GameToken");

      const sender = PublicKey.fromBase58(address);

      const tx = await client.transaction(sender, () => {
        gameToken.setNumberOfDevicesAllowed(
          UInt64.from(gameId),
          UInt64.from(numberOfDevices),
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

export const useChangePriceOnChain = (gameId: number, price: number) => {
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

    const pendingTransaction = await gameRegisterStore.changePriceOnChain(
      client.client,
      userStore.userPublicKey,
      gameId,
      price,
    );

    transactions.addPendingTransaction(pendingTransaction);
  }, [client.client, userStore.userPublicKey, gameId, price]);
};

export const useChangeDiscountOnChain = (gameId: number, discount: number) => {
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

    const pendingTransaction = await gameRegisterStore.changeDiscountOnChain(
      client.client,
      userStore.userPublicKey,
      gameId,
      discount,
    );

    transactions.addPendingTransaction(pendingTransaction);
  }, [client.client, userStore.userPublicKey, gameId, discount]);
};

export const useChangeTimeoutIntervalOnChain = (
  gameId: number,
  timeoutInterval: number,
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

    const pendingTransaction =
      await gameRegisterStore.changeTimeoutIntervalOnChain(
        client.client,
        userStore.userPublicKey,
        gameId,
        timeoutInterval,
      );

    transactions.addPendingTransaction(pendingTransaction);
  }, [client.client, userStore.userPublicKey, gameId, timeoutInterval]);
};

export const useChangeNumberOfDevicesOnChain = (
  gameId: number,
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

    const pendingTransaction =
      await gameRegisterStore.changeNumberOfDevicesOnChain(
        client.client,
        userStore.userPublicKey,
        gameId,
        numberOfDevices,
      );

    transactions.addPendingTransaction(pendingTransaction);
  }, [client.client, userStore.userPublicKey, gameId, numberOfDevices]);
};

export const useObserveRegisteredGames = () => {
  const client = useClientStore();
  const { userPublicKey } = useUserStore();
  const registerStore = useRegisterStore();
  const transactions = useTransactionStore();

  useEffect(() => {
    if (!client.client || !userPublicKey) return;

    (async () => {
      const totalGames =
        await client.client!.query.runtime.GameToken.totalGameNumber.get();
      const gameIds = Array.from(
        { length: Number(totalGames?.toString()) },
        (_, i) => i + 1,
      );
      let registeredGames: number[] = [];

      for (const gameId of gameIds) {
        const publisherAddress =
          await client.client!.query.runtime.GameToken.publisher.get(
            UInt64.from(gameId),
          );
        if (publisherAddress?.toBase58() === userPublicKey) {
          registeredGames.push(gameId);
        }
      }
      registerStore.setRegisteredGames(registeredGames);
    })();
  }, [client.client, transactions.pendingTransactions, userPublicKey]);
};

export const useObserveRegisteredGameList = () => {
  const client = useClientStore();
  const registerStore = useRegisterStore();
  const { registeredGames } = registerStore;

  useEffect(() => {
    (async () => {
      let games: registeredGame[] = [];
      for (const gameId of registeredGames) {
        const price =
          await client.client!.query.runtime.GameToken.gamePrice.get(
            UInt64.from(gameId),
          );

        const discount =
          await client.client!.query.runtime.GameToken.discount.get(
            UInt64.from(gameId),
          );

        const timeoutInterval =
          await client.client!.query.runtime.GameToken.timeoutInterval.get(
            UInt64.from(gameId),
          );

        const numberOfDevices =
          await client.client!.query.runtime.GameToken.number_of_devices_allowed.get(
            UInt64.from(gameId),
          );

        games.push({
          gameId: gameId,
          price: Number(price?.toString()),
          discount: Number(discount?.toString()),
          timeoutInterval: Number(timeoutInterval?.toString()),
          numberOfDevices: Number(numberOfDevices?.toString()),
        });
      }
      registerStore.setRegisteredGameList(games);
    })();
  }, [registeredGames]);
};
