import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { TokenId, UInt64 } from "@proto-kit/library";
import { PublicKey } from "o1js";
import { useCallback } from "react";
import { useUserStore } from "./userWallet";
import { useTransactionStore } from "./transactionStore";
import { useToast } from "@/components/ui/use-toast";

export interface MarketState {
  buyGame: (
    client: Client,
    address: string,
    gameId: number,
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
  })),
);

// export const useBuyGame = (gameId: number) => {
//   const marketStore = useMarketStore();
//   const client = useClientStore();
//   const userStore = useUserStore();
//   const transactions = useTransactionStore();
//   const {toast} = useToast();

//   return useCallback(async () => {
//     if (userStore.isConnected === false) {
//       toast({
//         title: "Wallet not connected",
//         description: "Please connect your wallet",
//       });
//       return;
//     }
//     if (!client.client || !userStore.userPublicKey || !gameId) return;

//     const pendingTransaction = await marketStore.buyGame(
//       client.client,
//       userStore.userPublicKey,
//       gameId,
//     );

//     transactions.addPendingTransaction(pendingTransaction);
//   }, [client.client, userStore.userPublicKey]);
// };
