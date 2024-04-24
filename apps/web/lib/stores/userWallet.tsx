import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserState {
  isConnected: boolean;
  isConnecting: boolean;
  userPublicKey?: string;
  userMinaBalance: number;
  wishlist: number[];
  library: number[];

  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setUserPublicKey: (publicKey: string) => void;
  setUserMinaBalance: (balance: number) => void;
  setWishlist: (wishlist: number[]) => void;
  addWishlist: (gameId: number) => void;
  removeWishlist: (gameId: number) => void;
  setLibrary: (library: number[]) => void;
  disconnect: () => void;
}

export const useUserStore = create<UserState, [["zustand/immer", never]]>(
  immer((set) => ({
    isConnected: false,
    isConnecting: false,
    userMinaBalance: 0,
    wishlist: [],
    library: [],

    setConnected(connected) {
      set((state) => {
        state.isConnected = connected;
      });
    },
    setConnecting(connecting) {
      set((state) => {
        state.isConnecting = connecting;
      });
    },
    setUserPublicKey(publicKey) {
      set((state) => {
        state.userPublicKey = publicKey;
      });
    },
    setUserMinaBalance(balance) {
      set((state) => {
        state.userMinaBalance = balance;
      });
    },
    setWishlist(wishlist) {
      set((state) => {
        state.wishlist = wishlist;
      });
    },
    addWishlist(gameId) {
      set((state) => {
        state.wishlist.push(gameId);
      });
    },
    removeWishlist(gameId) {
      set((state) => {
        state.wishlist = state.wishlist.filter((id) => id !== gameId);
      });
    },
    setLibrary(library) {
      set((state) => {
        state.library = library;
      });
    },
    disconnect() {
      set((state) => {
        state.isConnected = false;
        state.userPublicKey = undefined;
        state.userMinaBalance = 0;
        state.wishlist = [];
        state.library = [];
      });
    },
  })),
);

// export const fetchLibrary = () => {
//   const client = useClientStore();
//   const chain = useChainStore();
//   const userStore = useUserStore();
//   if (!client.client || !userStore.userPublicKey) return;
//   const totalGames = await client.query.runtime.GameToken.totalGameNumber.get();
//   const gameIds = Array.from(
//     { length: totalGames?.toNumber() - 1 },
//     (_, i) => i + 1,
//   );
//   let library: number[] = [];
//   gameIds.map(async (gameId) => {
//     const userKey = UserKey.from(
//       UInt64.from(gameId),
//       PublicKey.fromBase58(userPublicKey),
//     );
//     const query = await client.query.runtime.GameToken.users.get(userKey);
//     if (query?.value) {
//       library.push(gameId);
//     }
//   });
//   return library;
// };
