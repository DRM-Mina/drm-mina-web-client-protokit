import { create } from "zustand";

interface DeviceStoreState {
    isDeviceSet: boolean;
    device: RawIdentifiers;
    setDevice: (device: RawIdentifiers) => void;
}

export const useDeviceStore = create<DeviceStoreState>()((set) => ({
    isDeviceSet: false,
    device: {
        cpuId: "",
        systemSerial: "",
        systemUUID: "",
        baseboardSerial: "",
        macAddress: [],
        diskSerial: "",
    },

    setDevice: (device) => set({ isDeviceSet: true, device: device }),
}));
