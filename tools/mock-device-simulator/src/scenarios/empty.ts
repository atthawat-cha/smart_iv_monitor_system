import type { ScenarioFn } from "../types";

// Drains straight to ~0g — exercises the alerts.type = "empty" path (Database.md).
const FLOW_RATE_G_PER_TICK = 0.5;

export const empty: ScenarioFn = (state) => ({
  ...state,
  weight: Math.max(0, state.weight - FLOW_RATE_G_PER_TICK),
  battery: Math.max(0, state.battery - 0.001),
  rssi: -55 + Math.round(Math.random() * 10 - 5),
  tick: state.tick + 1,
});
