import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface DeviceStoreState {
  isDeviceSet: boolean;
  device: RawIdentifiers;
  setDevice: (device: RawIdentifiers) => void;
}

export const useDeviceStore = create<
  DeviceStoreState,
  [["zustand/immer", never]]
>(
  immer((set) => ({
    isDeviceSet: false,
    device: {
      cpuId: "",
      systemSerial: "",
      systemUUID: "",
      baseboardSerial: "",
      macAddress: [],
      diskSerial: "",
    },
    setDevice(device) {
      set((state) => {
        state.isDeviceSet = true;
        state.device = device;
      });
    },
  })),
);
