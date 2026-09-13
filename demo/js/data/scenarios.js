// Pure per-tick device-state mutators, ported (shape-for-shape) from
// 000-Project-Code/smis/tools/mock-device-simulator/src/scenarios/*.ts
// Each fn: (rawState) => newRawState, where rawState = { remainingMl, battery, rssi, online, tick }
//
// IMPORTANT: the engine calls one of these once per real second (see core/engine.js TICK_MS),
// and flow rate is derived from real elapsed time between readings (ml delta / minutes elapsed —
// see core/formulas.js computeFlowRate). So every "per tick" drain amount below is a per-minute
// ml/min target divided by 60, to keep the live-computed flow rate consistent with the ml/min
// numbers already baked into the seeded history (js/data/seed.js). The devtools speed multiplier
// (1x/5x/20x/60x) just runs more ticks per real second, which correctly speeds up depletion
// without changing the underlying ml/min rate.
window.SMIS = window.SMIS || {};

SMIS.Scenarios = (function () {
  function jitterRssi() { return -55 + Math.round(Math.random() * 10 - 5); }
  function drainBattery(battery) { return Math.max(0, battery - 0.002); }
  function perTick(mlPerMinute) { return mlPerMinute / 60; }

  const normal = (s) => ({
    ...s,
    remainingMl: Math.max(0, s.remainingMl - perTick(2.5 + Math.random() * 2.5)), // ~2.5-5 ml/min
    battery: drainBattery(s.battery),
    rssi: jitterRssi(),
    online: true,
    tick: s.tick + 1,
  });

  const criticalLow = (s) => ({
    ...s,
    remainingMl: Math.max(0, s.remainingMl - perTick(8 + Math.random() * 4)), // ~8-12 ml/min, faster than normal
    battery: drainBattery(s.battery),
    rssi: jitterRssi(),
    online: true,
    tick: s.tick + 1,
  });

  const empty = (s) => ({
    ...s,
    remainingMl: 0,
    battery: drainBattery(s.battery),
    rssi: jitterRssi(),
    online: true,
    tick: s.tick + 1,
  });

  // stays "connected" for ~30 ticks (draining normally), then goes silent (no more telemetry)
  const offline = (s) => {
    if (s.tick < 30) {
      return {
        ...s,
        remainingMl: Math.max(0, s.remainingMl - perTick(3)),
        battery: drainBattery(s.battery),
        rssi: jitterRssi(),
        online: true,
        tick: s.tick + 1,
      };
    }
    return { ...s, online: false, tick: s.tick + 1 };
  };

  // flow is "expected" (device thinks it's running) but the weight barely moves -> occlusion
  const occlusionSuspected = (s) => ({
    ...s,
    remainingMl: Math.max(0, s.remainingMl - perTick(Math.random() * 0.05)), // near-zero ml/min
    battery: drainBattery(s.battery),
    rssi: jitterRssi(),
    online: true,
    tick: s.tick + 1,
  });

  return { normal, criticalLow, empty, offline, occlusionSuspected };
})();
