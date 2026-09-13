// Single source of truth for every derived IV/priority/alert-threshold number in the demo.
// Mirrors the formulas in "022 Detailed Design/Detailed Design.md" and the PRD v2.1 exactly.
window.SMIS = window.SMIS || {};

SMIS.Formulas = (function () {
  const NOISE_REJECT_ML = 30; // reject any single-sample jump bigger than this as sensor noise
  const FLOW_WINDOW = 10; // moving-average window, in readings

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function remainingPercent(remainingMl, initialMl) {
    if (!initialMl) return 0;
    return clamp((remainingMl / initialMl) * 100, 0, 100);
  }

  // readings: ascending-time array of {remainingMl, recordedAt}. Returns ml/min, never negative
  // (a rising weight means a sensor error, not negative flow — caller decides whether to flag it).
  function computeFlowRate(readings) {
    if (!readings || readings.length < 2) return 0;
    const window = readings.slice(-FLOW_WINDOW);
    const rates = [];
    for (let i = 1; i < window.length; i++) {
      const prev = window[i - 1];
      const cur = window[i];
      const minutesElapsed = (cur.recordedAt - prev.recordedAt) / 60000;
      if (minutesElapsed <= 0) continue;
      const mlDelta = prev.remainingMl - cur.remainingMl;
      if (Math.abs(mlDelta) > NOISE_REJECT_ML) continue; // spike rejection
      rates.push(mlDelta / minutesElapsed);
    }
    if (rates.length === 0) return 0;
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    return Math.max(0, avg);
  }

  // returns minutes; 0 when the bag is already empty (regardless of flow), null when flow is
  // negligible on a bag that still has volume left (occlusion-suspected beds included — can't
  // estimate when a stalled bed will empty, and dividing by a near-zero flow would blow up into
  // a meaningless number of minutes).
  const NEGLIGIBLE_FLOW_ML_PER_MIN = 0.05;
  function computeEte(remainingMl, flowRate) {
    if (remainingMl <= 0) return 0;
    if (!flowRate || flowRate <= NEGLIGIBLE_FLOW_ML_PER_MIN) return null;
    return remainingMl / flowRate;
  }

  const ETE_FALLBACK_MINUTES = 999; // stand-in "far away" value for beds with no estimate
  function computePriorityScore(remainingPct, flowRate, eteMinutes) {
    const ete = (eteMinutes == null || !isFinite(eteMinutes))
      ? ETE_FALLBACK_MINUTES
      : Math.min(eteMinutes, ETE_FALLBACK_MINUTES);
    return (100 - remainingPct) * 0.6 + (flowRate * 0.2) + (ete * -0.2);
  }

  // P1 Critical <15m, P2 High 15-30m, P3 Warning 30-60m, P4 Normal >=60m
  function priorityBand(eteMinutes) {
    if (eteMinutes == null) return 'P4';
    if (eteMinutes < 15) return 'P1';
    if (eteMinutes < 30) return 'P2';
    if (eteMinutes < 60) return 'P3';
    return 'P4';
  }

  const PRIORITY_BAND_LABEL = { P1: 'CRITICAL', P2: 'HIGH', P3: 'WARNING', P4: 'NORMAL' };

  // 5-tier PRD color band by remaining %: 70-100 green, 40-69 yellow, 10-39 orange, 1-9 red, 0 gray/empty
  function colorBand(remainingPct) {
    if (remainingPct <= 0) return 'gray';
    if (remainingPct < 10) return 'red';
    if (remainingPct < 40) return 'orange';
    if (remainingPct < 70) return 'yellow';
    return 'green';
  }

  // >30 normal, 10-30 warning, <10 critical/low_battery
  function batteryBand(pct) {
    if (pct < 10) return 'critical';
    if (pct <= 30) return 'warning';
    return 'normal';
  }

  return {
    NOISE_REJECT_ML, FLOW_WINDOW,
    clamp, remainingPercent, computeFlowRate, computeEte, computePriorityScore,
    priorityBand, PRIORITY_BAND_LABEL, colorBand, batteryBand,
  };
})();
