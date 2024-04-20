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
    }))
);
