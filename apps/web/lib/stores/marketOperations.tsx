import { create } from "zustand";
import { Client } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { TokenId, UInt64 } from "@proto-kit/library";
import { PublicKey } from "o1js";

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
