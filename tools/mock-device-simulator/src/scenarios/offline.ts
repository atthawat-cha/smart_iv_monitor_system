import type { ScenarioFn } from "../types";

// Weight holds steady, but the device stops being "online" partway through the run —
// virtual-device.ts skips sending while online=false, exercising alerts.type = "device_offline".
const GO_OFFLINE_AFTER_TICKS = 30;

export const offline: ScenarioFn = (state) => ({
  ...state,
  online: state.tick < GO_OFFLINE_AFTER_TICKS,
  tick: state.tick + 1,
});
