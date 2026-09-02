import type { ScenarioFn } from "../types";

// Steady depletion at a typical clinical flow rate; battery/rssi drift gently.
const FLOW_RATE_G_PER_TICK = 0.05;

export const normal: ScenarioFn = (state) => ({
  ...state,
  weight: Math.max(0, state.weight - FLOW_RATE_G_PER_TICK),
  battery: Math.max(0, state.battery - 0.001),
  rssi: -55 + Math.round(Math.random() * 10 - 5),
  tick: state.tick + 1,
});
