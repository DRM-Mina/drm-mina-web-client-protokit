import { DeviceIdentifierProof } from "chain/dist/DRM";
import type {
  ZkappWorkerRequest,
  ZkappWorkerReponse,
  WorkerFunctions,
} from "./worker";

export default class WorkerClient {
  compileProgram() {
    return this._call("compileProgram", {});
  }

  createDeviceIdentifierProof({
    rawIdentifiers,
  }: {
    rawIdentifiers: RawIdentifiers;
  }): Promise<any> {
    return this._call("createDeviceIdentifierProof", {
      rawIdentifiers,
    }) as Promise<any>;
  }

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./worker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
