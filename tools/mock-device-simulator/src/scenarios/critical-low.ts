import type { ScenarioFn } from "../types";

// Fast depletion so remaining % crosses the critical threshold quickly —
// exercises the alerts.type = "critical_low" path (Database.md).
const FLOW_RATE_G_PER_TICK = 0.3;

export const criticalLow: ScenarioFn = (state) => ({
  ...state,
  weight: Math.max(0, state.weight - FLOW_RATE_G_PER_TICK),
  battery: Math.max(0, state.battery - 0.001),
  rssi: -55 + Math.round(Math.random() * 10 - 5),
  tick: state.tick + 1,
});
