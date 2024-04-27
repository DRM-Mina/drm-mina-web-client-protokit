import { Identifiers } from "chain/dist/lib/identifiers";
import {
  DeviceSession,
  DeviceIdentifier,
  DeviceSessionInput,
  DeviceSessionOutput,
} from "chain/dist/DRM.js";

const state = {
  status: "loading" as "loading" | "ready",
  deviceIdentifierProgram: null as typeof DeviceIdentifier | null,
  verificationKey: null as string | null,
};

const functions = {
  compileProgram: async (args: {}) => {
    state.deviceIdentifierProgram = DeviceIdentifier;
    const deviceIdentifierKey = await DeviceIdentifier.compile();
    state.verificationKey = deviceIdentifierKey.verificationKey;
  },
  createDeviceIdentifierProof: async (args: {
    rawIdentifiers: RawIdentifiers;
  }) => {
    if (!state.deviceIdentifierProgram) {
      throw new Error("Program not compiled");
    }

    const identifiers = Identifiers.fromRaw(args.rawIdentifiers);
    const proof =
      await state.deviceIdentifierProgram.proofForDevice(identifiers);
    return proof;
  },
};
export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== "undefined") {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    },
  );
}

console.log("Web Worker Successfully Initialized.");
