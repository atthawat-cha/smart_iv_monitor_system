import "dotenv/config";
import devices from "./config/devices.json";
import { VirtualDevice } from "./virtual-device";
import type { DeviceConfig } from "./types";

const deviceCount = Number(process.env.DEVICE_COUNT ?? devices.length);
const selected = (devices as DeviceConfig[]).slice(0, deviceCount);

console.log(`Starting ${selected.length} virtual IV device(s) against ${process.env.API_BASE_URL}`);

const virtualDevices = selected.map((config) => new VirtualDevice(config));
virtualDevices.forEach((device) => device.start());

process.on("SIGINT", () => {
  virtualDevices.forEach((device) => device.stop());
  process.exit(0);
});
