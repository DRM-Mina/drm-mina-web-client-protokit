import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import WorkerClient from "../workerClient";

interface WorkerStoreState {
  isReady: boolean;
  worker?: WorkerClient;
  startWorker: () => Promise<void>;
}

async function timeout(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export const useWorkerStore = create<
  WorkerStoreState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    isReady: false,
    async startWorker() {
      console.log("Worker starting");
      const worker = new WorkerClient();

      await timeout(5);

      set((state) => {
        state.worker = worker;
      });

      await worker.compileProgram();

      set((state) => {
        state.isReady = true;
      });
      return;
    },
  })),
);
