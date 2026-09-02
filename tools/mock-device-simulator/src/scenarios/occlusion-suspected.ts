import type { ScenarioFn } from "../types";

// Weight stays flat despite the bag being "in use" — exercises
// alerts.type = "occlusion_suspected" (Database.md), which the API's alert
// engine should detect as "no expected flow over N minutes".
export const occlusionSuspected: ScenarioFn = (state) => ({
  ...state,
  weight: state.weight, // intentionally not decreasing
  battery: Math.max(0, state.battery - 0.001),
  rssi: -55 + Math.round(Math.random() * 10 - 5),
  tick: state.tick + 1,
});
