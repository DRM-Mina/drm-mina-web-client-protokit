import { create } from "zustand";
import { Client, useClientStore } from "./client";
import { immer } from "zustand/middleware/immer";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import { TokenId, UInt64 } from "@proto-kit/library";
import { PublicKey } from "o1js";
import { useEffect } from "react";
import { useChainStore } from "./chain";
import { useWalletStore } from "./wallet";
import { fetchWishlist } from "../api";
import { client } from "chain";
import { UserKey } from "chain/dist/GameToken";

export interface MarketState {
  wishlist: number[];
  library: number[];

  setWishlist: (wishlist: number[]) => void;
  loadWishlist: (address: string) => void;
  loadLibrary: (address: string) => void;
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
    wishlist: [],
    library: [],
    setWishlist(wishlist) {
      set((state) => {
        state.wishlist = wishlist;
      });
    },
    async loadWishlist(address) {
      const wishlist = await fetchWishlist(address);
      set((state) => {
        state.wishlist = wishlist;
      });
    },
    async loadLibrary(address) {
      const totalGames =
        await client.query.runtime.GameToken.totalGameNumber.get();
      const gameIds = Array.from(
        { length: totalGames?.toNumber() - 1 },
        (_, i) => i + 1,
      );
      let library: number[] = [];
      gameIds.map(async (gameId) => {
        const userKey = UserKey.from(
          UInt64.from(gameId),
          PublicKey.fromBase58(address),
        );
        const query = await client.query.runtime.GameToken.users.get(userKey);
        if (query?.value) {
          library.push(gameId);
        }
      });
      set((state) => {
        state.library = library;
      });
    },
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

export const useObserveLibrary = () => {
  const client = useClientStore();
  const chain = useChainStore();
  const wallet = useWalletStore();
  const market = useMarketStore();

  useEffect(() => {
    if (!client.client || !wallet.wallet) return;

    market.loadWishlist(wallet.wallet);
    market.loadLibrary(wallet.wallet);
  }, [client.client, chain.block?.height, wallet.wallet]);
};
