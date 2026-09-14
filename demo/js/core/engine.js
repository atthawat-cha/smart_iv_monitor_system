// The simulated "backend": a 1-tick-per-second loop that drains/mutates each device's raw
// weight via its scenario fn, recomputes every derived IV field, evaluates alerts, and persists.
// Also exposes SMIS.Actions — the user-triggered mutations (resolve bed, toggle mobility,
// force a scenario from the devtools control panel, change alert-threshold settings, etc).
//
// Every reading/alert/lastSeen timestamp uses state.meta.simClockMs (a virtual clock that
// advances by exactly 1000ms per tick) instead of the real Date.now(). That's what lets the
// devtools speed multiplier and "advance N minutes" burst-run many ticks synchronously without
// the flow-rate math (ml delta / minutes elapsed) blowing up — real Date.now() barely moves
// across a tight synchronous loop, but simClockMs advances exactly as far as simulated time did.
window.SMIS = window.SMIS || {};

SMIS.Engine = (function () {
  const TICK_MS = 1000;
  const MAX_CATCHUP_TICKS = 120;
  const HISTORY_CAP = 2000;
  let started = false;

  function recordReadingAndRecompute(state, bed, device, rawRemainingMl) {
    const remainingMl = SMIS.Formulas.clamp(rawRemainingMl, 0, bed.initialMl);
    const now = state.meta.simClockMs;
    const list = state.readings[bed.id] || (state.readings[bed.id] = []);
    list.push({ bedId: bed.id, deviceId: device.id, remainingMl, recordedAt: now });

    const flowRate = SMIS.Formulas.computeFlowRate(list);
    const remainingPercent = SMIS.Formulas.remainingPercent(remainingMl, bed.initialMl);
    const ete = SMIS.Formulas.computeEte(remainingMl, flowRate);
    const priorityScore = SMIS.Formulas.computePriorityScore(remainingPercent, flowRate, ete);

    const prev = state.ivStatus[bed.id] || {};
    state.ivStatus[bed.id] = {
      bedId: bed.id,
      remainingMl,
      remainingPercent,
      flowRate,
      priorityScore,
      isMobilityMode: !!prev.isMobilityMode,
    };
  }

  function tickOnce(state) {
    state.meta.simClockMs += TICK_MS;
    state.devices.forEach((device) => {
      const bed = state.beds.find((b) => b.deviceId === device.id);
      if (!bed) return;
      const scenarioFn = SMIS.Scenarios[device.simScenario];
      if (!scenarioFn) return;

      const next = scenarioFn(device._raw);
      device._raw = next;
      device.battery = Math.round(next.battery);
      device.rssi = next.rssi;

      if (next.online) {
        device.lastSeen = state.meta.simClockMs;
        recordReadingAndRecompute(state, bed, device, next.remainingMl);
      }
      // if offline: lastSeen is simply not refreshed; Alerts.evaluateAll derives status from that gap
    });
  }

  function trimHistories(state) {
    Object.keys(state.readings).forEach((bedId) => {
      const arr = state.readings[bedId];
      if (arr.length > HISTORY_CAP) arr.splice(0, arr.length - HISTORY_CAP);
    });
  }

  function onNewAlert(alert) {
    if (window.SMIS.Toast) window.SMIS.Toast.push(alert);
  }

  function runLoop() {
    const state = SMIS.Store.get();
    const speed = Math.max(1, state.meta.simSpeedMultiplier || 1);
    for (let i = 0; i < speed; i++) tickOnce(state);
    state.meta.lastRealCheckpoint = Date.now();
    SMIS.Alerts.evaluateAll(state, onNewAlert);
    trimHistories(state);
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function start() {
    if (started) return;
    started = true;
    const state = SMIS.Store.get();

    // Real time that passed since the last time any page had this engine running (e.g. the
    // demo was closed, or the browser tab sat idle) — catch the sim clock up to it, capped.
    const elapsedRealMs = Date.now() - (state.meta.lastRealCheckpoint || Date.now());
    const catchupTicks = Math.min(MAX_CATCHUP_TICKS, Math.floor(elapsedRealMs / 1000));
    for (let i = 0; i < catchupTicks; i++) tickOnce(state);
    const leftoverMs = elapsedRealMs - catchupTicks * 1000;
    if (leftoverMs > 0) state.meta.simClockMs += leftoverMs; // fast-forward without generating readings for it

    state.meta.lastRealCheckpoint = Date.now();
    SMIS.Alerts.evaluateAll(state, null); // silent: no toast spam for time that passed while away
    trimHistories(state);
    SMIS.Store.save();
    SMIS.Store.publish();
    setInterval(runLoop, TICK_MS);
  }

  return { start, tickOnce, recordReadingAndRecompute };
})();

SMIS.Actions = (function () {
  function findBedDevice(state, bedId) {
    const bed = state.beds.find((b) => b.id === bedId);
    const device = bed ? state.devices.find((d) => d.id === bed.deviceId) : null;
    return { bed, device };
  }

  function resolveBed(bedId) {
    const state = SMIS.Store.get();
    const { bed, device } = findBedDevice(state, bedId);
    if (!bed || !device) return;

    device._raw.remainingMl = bed.initialMl;
    device._raw.tick = 0;
    device._raw.online = true;
    device.status = SMIS.Formulas.batteryBand(device.battery) === 'critical' ? 'low_battery' : 'online';
    device.lastSeen = state.meta.simClockMs;
    state.readings[bed.id] = SMIS.Seed.synthesizeReadings(bed.id, device.id, bed.initialMl, 0, state.meta.simClockMs);
    SMIS.Engine.recordReadingAndRecompute(state, bed, device, bed.initialMl);

    SMIS.Alerts.resolveBed(state, bedId);
    state.ivChangeLog.push({ bedId, at: state.meta.simClockMs, by: state.session.userId || 'unknown' });

    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function toggleMobility(bedId) {
    const state = SMIS.Store.get();
    const ivs = state.ivStatus[bedId];
    if (!ivs) return;
    ivs.isMobilityMode = !ivs.isMobilityMode;
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function forceScenario(bedId, scenarioName) {
    const state = SMIS.Store.get();
    const { bed, device } = findBedDevice(state, bedId);
    if (!bed || !device) return;

    device.simScenario = scenarioName;
    if (scenarioName === 'empty') device._raw.remainingMl = 0;
    if (scenarioName === 'criticalLow') device._raw.remainingMl = Math.min(device._raw.remainingMl, bed.initialMl * 0.15);
    if (scenarioName === 'offline') { device._raw.tick = 30; device._raw.online = false; }
    if (scenarioName === 'normal' || scenarioName === 'occlusionSuspected') { device._raw.online = true; }

    if (device._raw.online) {
      device.lastSeen = state.meta.simClockMs;
      SMIS.Engine.recordReadingAndRecompute(state, bed, device, device._raw.remainingMl);
    } else {
      // "offline" forced from the devtools panel should feel instant, not wait for the
      // wall-clock-gap check in Alerts.evaluateAll to notice the silence.
      device.status = 'offline';
      SMIS.Alerts.fire(state, bed.id, 'device_offline',
        SMIS.Seed.alertMessage('device_offline', bed.id, bed.patientHn, state.ivStatus[bed.id]),
        (a) => { if (window.SMIS.Toast) window.SMIS.Toast.push(a); });
    }
    SMIS.Alerts.evaluateAll(state, (a) => { if (window.SMIS.Toast) window.SMIS.Toast.push(a); });
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function advanceMinutes(n) {
    const state = SMIS.Store.get();
    const ticks = Math.max(1, Math.round(n * 60));
    for (let i = 0; i < ticks; i++) SMIS.Engine.tickOnce(state);
    SMIS.Alerts.evaluateAll(state, (a) => { if (window.SMIS.Toast) window.SMIS.Toast.push(a); });
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function setSimSpeed(multiplier) {
    const state = SMIS.Store.get();
    state.meta.simSpeedMultiplier = multiplier;
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function markAlertRead(alertId) {
    const state = SMIS.Store.get();
    SMIS.Alerts.markRead(state, alertId);
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function resolveAlert(alertId) {
    const state = SMIS.Store.get();
    SMIS.Alerts.resolve(state, alertId);
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function updateSettings(patch) {
    const state = SMIS.Store.get();
    Object.assign(state.settings, patch);
    SMIS.Store.save();
    SMIS.Store.publish();
  }

  function addWard(name, floor, building) {
    const state = SMIS.Store.get();
    const id = 'W-' + Date.now().toString(36).toUpperCase();
    state.wards.push({ id, name, floor: Number(floor) || 1, building: building || '—' });
    SMIS.Store.save(); SMIS.Store.publish();
    return id;
  }

  function deleteWard(wardId) {
    const state = SMIS.Store.get();
    const hasBeds = state.beds.some((b) => b.wardId === wardId);
    if (hasBeds) { alert('Cannot delete a ward that still has beds assigned.'); return false; }
    state.wards = state.wards.filter((w) => w.id !== wardId);
    SMIS.Store.save(); SMIS.Store.publish();
    return true;
  }

  // Bed CRUD (FL-007) is deliberately decoupled from device provisioning (FL-012) — a bed can
  // exist empty ("vacant") before any device/patient is attached to it, matching the real API
  // shape (POST /beds vs POST /devices are separate endpoints).
  function addBed(wardId, bedNumber) {
    const state = SMIS.Store.get();
    const bedId = `${wardId}-${bedNumber}`;
    if (state.beds.some((b) => b.id === bedId)) { alert('That bed number already exists in this ward.'); return null; }
    state.beds.push({ id: bedId, wardId, bedNumber, patientHn: null, deviceId: null, status: 'vacant', initialMl: null, fluidTypeId: null, note: null });
    SMIS.Store.save(); SMIS.Store.publish();
    return bedId;
  }

  function deleteBed(bedId) {
    const state = SMIS.Store.get();
    const bed = state.beds.find((b) => b.id === bedId);
    if (!bed) return;
    if (bed.deviceId) { alert('Unassign the device from this bed before deleting it.'); return; }
    state.beds = state.beds.filter((b) => b.id !== bedId);
    delete state.readings[bedId];
    delete state.ivStatus[bedId];
    state.alerts = state.alerts.filter((a) => a.bedId !== bedId);
    SMIS.Store.save(); SMIS.Store.publish();
  }

  // Device provisioning (FL-012): a freshly provisioned device sits "unassigned" — no bed, no
  // fluid, no telemetry — until an admin attaches it to a vacant bed via assignDevice().
  function addDevice(deviceCode, firmwareVersion) {
    const state = SMIS.Store.get();
    if (state.devices.some((d) => d.id === deviceCode)) { alert('That device code is already provisioned.'); return null; }
    state.devices.push({
      id: deviceCode, deviceCode, firmwareVersion: firmwareVersion || '1.0.0',
      battery: 100, rssi: -55, lastSeen: null, status: 'unassigned', simScenario: null,
      _raw: { remainingMl: 0, battery: 100, rssi: -55, online: false, tick: 0 },
    });
    SMIS.Store.save(); SMIS.Store.publish();
    return deviceCode;
  }

  function deleteDevice(deviceId) {
    const state = SMIS.Store.get();
    const assignedBed = state.beds.find((b) => b.deviceId === deviceId);
    if (assignedBed) { alert(`Unassign this device from bed ${assignedBed.id} before deleting it.`); return; }
    state.devices = state.devices.filter((d) => d.id !== deviceId);
    SMIS.Store.save(); SMIS.Store.publish();
  }

  // The "occupy a bed" action: attaches an unassigned device + a fluid bag + (optionally) a
  // patient HN to a vacant bed, and starts it monitoring from a fresh, full bag.
  function assignDevice(bedId, deviceId, fluidTypeId, patientHn) {
    const state = SMIS.Store.get();
    const bed = state.beds.find((b) => b.id === bedId);
    const device = state.devices.find((d) => d.id === deviceId);
    const fluidType = state.fluidTypes.find((f) => f.id === fluidTypeId);
    if (!bed || !device || !fluidType) return;
    if (bed.deviceId) { alert('This bed already has a device assigned.'); return; }
    if (device.status !== 'unassigned') { alert('This device is already assigned elsewhere.'); return; }

    const now = state.meta.simClockMs;
    bed.deviceId = device.id;
    bed.fluidTypeId = fluidType.id;
    bed.initialMl = fluidType.defaultVolumeMl;
    bed.patientHn = patientHn || `HN-${Math.floor(200000 + Math.random() * 90000)}`;
    bed.status = 'occupied';

    device._raw = { remainingMl: fluidType.defaultVolumeMl, battery: device.battery, rssi: -55, online: true, tick: 0 };
    device.simScenario = 'normal';
    device.lastSeen = now;
    device.status = SMIS.Formulas.batteryBand(device.battery) === 'critical' ? 'low_battery' : 'online';

    state.readings[bedId] = SMIS.Seed.synthesizeReadings(bedId, deviceId, fluidType.defaultVolumeMl, 0, now);
    state.ivStatus[bedId] = SMIS.Seed.buildIvStatus(bedId, fluidType.defaultVolumeMl, fluidType.defaultVolumeMl, state.readings[bedId]);

    SMIS.Store.save(); SMIS.Store.publish();
  }

  function unassignDevice(bedId) {
    const state = SMIS.Store.get();
    const bed = state.beds.find((b) => b.id === bedId);
    if (!bed || !bed.deviceId) return;
    const device = state.devices.find((d) => d.id === bed.deviceId);
    if (device) {
      device.status = 'unassigned';
      device.simScenario = null;
      device.lastSeen = null;
      device._raw = { remainingMl: 0, battery: device.battery, rssi: -55, online: false, tick: 0 };
    }
    bed.deviceId = null;
    bed.fluidTypeId = null;
    bed.initialMl = null;
    bed.patientHn = null;
    bed.status = 'vacant';
    delete state.readings[bedId];
    delete state.ivStatus[bedId];
    state.alerts = state.alerts.filter((a) => a.bedId !== bedId);
    SMIS.Store.save(); SMIS.Store.publish();
  }

  function addFluidType(name, defaultVolumeMl) {
    const state = SMIS.Store.get();
    const id = 'FT-' + Date.now().toString(36).toUpperCase();
    state.fluidTypes.push({ id, name, defaultVolumeMl: Number(defaultVolumeMl) || 500 });
    SMIS.Store.save(); SMIS.Store.publish();
    return id;
  }

  function deleteFluidType(fluidTypeId) {
    const state = SMIS.Store.get();
    const inUse = state.beds.some((b) => b.fluidTypeId === fluidTypeId);
    if (inUse) { alert('This fluid type is currently assigned to a bed and cannot be removed.'); return false; }
    state.fluidTypes = state.fluidTypes.filter((f) => f.id !== fluidTypeId);
    SMIS.Store.save(); SMIS.Store.publish();
    return true;
  }

  function addUser(name, username, role) {
    const state = SMIS.Store.get();
    const id = 'u-' + Date.now().toString(36);
    state.users.push({ id, name, username, role, isActive: true });
    SMIS.Store.save(); SMIS.Store.publish();
  }

  function login(userId) {
    const state = SMIS.Store.get();
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;
    state.session = { userId: user.id, role: user.role, name: user.name, wardId: user.wardId || null };
    SMIS.Store.save();
  }

  function logout() {
    const state = SMIS.Store.get();
    state.session = { userId: null, role: null, name: null, wardId: null };
    SMIS.Store.save();
  }

  return {
    resolveBed, toggleMobility, forceScenario, advanceMinutes, setSimSpeed,
    markAlertRead, resolveAlert, updateSettings, login, logout,
    addWard, deleteWard, addBed, deleteBed, addUser,
    addDevice, deleteDevice, assignDevice, unassignDevice, addFluidType, deleteFluidType,
  };
})();
