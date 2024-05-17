import { client } from "drm-mina-chain/dist/src/index.js";
import { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Client = typeof client;

export interface ClientState {
  loading: boolean;
  isReady: boolean;
  client?: Client;
  start: () => Promise<void>;
}

export const useClientStore = create<ClientState, [["zustand/immer", never]]>(
  immer((set) => ({
    loading: Boolean(false),
    isReady: false,
    async start() {
      set((state) => {
        state.loading = true;
      });

      await client.start();

      set((state) => {
        state.loading = false;
        state.client = client;
        state.isReady = true;
      });
    },
  })),
);

export const useClient = () => {
  const clientStore = useClientStore();

  useEffect(() => {
    if (!clientStore.isReady) clientStore.start();
  }, []);
};
