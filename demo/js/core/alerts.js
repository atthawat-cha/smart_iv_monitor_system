// Alert condition evaluation, debouncing, and lifecycle actions (read / resolve).
window.SMIS = window.SMIS || {};

SMIS.Alerts = (function () {
  let alertSeq = 1000;

  function openAlertOf(state, bedId, type) {
    return state.alerts.find((a) => a.bedId === bedId && a.type === type && !a.resolvedAt);
  }

  function fire(state, bedId, type, message, onNew) {
    if (openAlertOf(state, bedId, type)) return; // debounced: one open alert per bed+type
    const alert = {
      id: `AL-${alertSeq++}`,
      bedId, type, message,
      isRead: false,
      resolvedAt: null,
      createdAt: state.meta.simClockMs,
    };
    state.alerts.unshift(alert);
    if (typeof onNew === 'function') onNew(alert);
  }

  // Runs once per engine tick over every bed. `onNew` is called for each freshly created alert
  // (used to pop a toast only on the page that's actually open).
  function evaluateAll(state, onNew) {
    const now = state.meta.simClockMs;
    state.beds.forEach((bed) => {
      const ivs = state.ivStatus[bed.id];
      const device = state.devices.find((d) => d.id === bed.deviceId);
      if (!ivs || !device) return;

      // --- device connectivity ---
      const elapsedSinceSeen = now - device.lastSeen;
      if (elapsedSinceSeen > state.settings.offlineAlertSec * 1000) {
        if (device.status !== 'offline') device.status = 'offline';
        // Temporary Mobility Mode suspends every alert type for this bed, offline included —
        // the patient may be carrying the pole out of WiFi range on purpose.
        if (!ivs.isMobilityMode) {
          fire(state, bed.id, 'device_offline',
            SMIS.Seed.alertMessage('device_offline', bed.id, bed.patientHn, ivs), onNew);
        }
      } else if (device.status === 'offline' && device._raw.online) {
        // came back online this tick
        device.status = SMIS.Formulas.batteryBand(device.battery) === 'critical' ? 'low_battery' : 'online';
      } else if (device.status !== 'offline') {
        device.status = SMIS.Formulas.batteryBand(device.battery) === 'critical' ? 'low_battery' : 'online';
      }

      if (ivs.isMobilityMode) return; // mobility mode suspends the remaining IV-condition alerts

      if (device.status === 'offline') return; // no fresh readings to evaluate

      if (ivs.remainingPercent <= 0) {
        fire(state, bed.id, 'empty', SMIS.Seed.alertMessage('empty', bed.id, bed.patientHn, ivs), onNew);
      } else if (ivs.remainingPercent < state.settings.criticalLowPct) {
        fire(state, bed.id, 'critical_low', SMIS.Seed.alertMessage('critical_low', bed.id, bed.patientHn, ivs), onNew);
      }

      const hist = (state.readings[bed.id] || []);
      const windowMs = state.settings.occlusionWindowSec * 1000;
      const windowReadings = hist.filter((r) => now - r.recordedAt <= windowMs);
      const enoughHistory = windowReadings.length >= 5;
      if (enoughHistory && ivs.remainingPercent > 0 && ivs.remainingPercent < 100 &&
          ivs.flowRate < state.settings.occlusionEpsilonMl) {
        fire(state, bed.id, 'occlusion_suspected',
          SMIS.Seed.alertMessage('occlusion_suspected', bed.id, bed.patientHn, ivs), onNew);
      }
    });
  }

  function markRead(state, alertId) {
    const a = state.alerts.find((x) => x.id === alertId);
    if (a) a.isRead = true;
  }

  function resolve(state, alertId) {
    const a = state.alerts.find((x) => x.id === alertId);
    if (a && !a.resolvedAt) a.resolvedAt = state.meta.simClockMs;
  }

  function resolveBed(state, bedId) {
    state.alerts.forEach((a) => {
      if (a.bedId === bedId && !a.resolvedAt) { a.resolvedAt = state.meta.simClockMs; a.isRead = true; }
    });
  }

  function unreadOpenCount(state, alertList) {
    return (alertList || state.alerts).filter((a) => !a.resolvedAt && !a.isRead).length;
  }

  return { evaluateAll, fire, openAlertOf, markRead, resolve, resolveBed, unreadOpenCount };
})();
