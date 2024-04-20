import { create } from "zustand";

interface GameStoreState {
    games: Game[];
    isGameSet: boolean;
    discountGames: Game[];
    setGames: (gameList: Game[]) => void;
    setDiscountGames: (gameList: Game[]) => void;
}

export const useGamesStore = create<GameStoreState>()((set) => ({
    games: [],
    isGameSet: false,
    discountGames: [],
    setGames: (gameList) => set({ games: gameList, isGameSet: true }),
    setDiscountGames: (gameList) => set({ discountGames: gameList }),
}));
