// Builds the initial demo state: 3 wards, ~26 beds, devices, users, pre-seeded reading
// history (so flow rate / ETE / priority score are already meaningful at first paint),
// and a few alerts already open (mirrors the "Critical Alert - Bed 10A-05" scenario from
// 018 UXUI/Main.dc.html so the demo opens already telling its hero story).
window.SMIS = window.SMIS || {};

SMIS.Seed = (function () {
  const F = () => SMIS.Formulas;

  // Master catalog of IV fluid types — admin-manageable from Settings. `defaultVolumeMl` is
  // the bag size used to seed remainingMl to 100% whenever this type is assigned to a bed.
  const FLUID_TYPES = [
    { id: 'FT-NSS09-1000', name: '0.9% NSS', defaultVolumeMl: 1000 },
    { id: 'FT-NSS09-500', name: '0.9% NSS', defaultVolumeMl: 500 },
    { id: 'FT-D5W-500', name: '5% Dextrose in Water (D5W)', defaultVolumeMl: 500 },
    { id: 'FT-RL-1000', name: "Ringer's Lactate", defaultVolumeMl: 1000 },
    { id: 'FT-D5NSS-1000', name: '5% Dextrose in NSS', defaultVolumeMl: 1000 },
    { id: 'FT-ACETAR-1000', name: "Acetar (Acetated Ringer's)", defaultVolumeMl: 1000 },
  ];

  function synthesizeReadings(bedId, deviceId, currentMl, flowRateTarget, now) {
    const N = 12;
    const readings = [];
    for (let i = 0; i < N; i++) {
      const minutesAgo = (N - 1 - i);
      const recordedAt = now - minutesAgo * 60000;
      const remainingMl = Math.max(0, currentMl + flowRateTarget * minutesAgo);
      readings.push({ bedId, deviceId, remainingMl, recordedAt });
    }
    return readings;
  }

  function buildIvStatus(bedId, currentMl, initialMl, readings) {
    const remainingPercent = F().remainingPercent(currentMl, initialMl);
    const flowRate = F().computeFlowRate(readings);
    const ete = F().computeEte(currentMl, flowRate);
    const priorityScore = F().computePriorityScore(remainingPercent, flowRate, ete);
    return {
      bedId,
      remainingMl: Math.round(currentMl * 10) / 10,
      remainingPercent,
      flowRate,
      priorityScore,
      isMobilityMode: false,
    };
  }

  // { bedNumber, hn, percent, ml, initialMl, flow, scenario, offlineAlready, note }
  function wardBedSpecs(wardCode) {
    if (wardCode === '10A') {
      return [
        { bedNumber: '01', percent: 55, ml: 275, initialMl: 500, flow: 5.0, scenario: 'normal' },
        { bedNumber: '02', percent: 28, ml: 140, initialMl: 500, flow: 3.2, scenario: 'normal' },
        { bedNumber: '03', percent: 91, ml: 455, initialMl: 500, flow: 3.8, scenario: 'normal' },
        { bedNumber: '04', percent: 68, ml: 340, initialMl: 500, flow: 3.0, scenario: 'normal' },
        { bedNumber: '05', percent: 12, ml: 58, initialMl: 480, flow: 4.0, scenario: 'criticalLow', preAlert: 'critical_low' },
        { bedNumber: '06', percent: 82, ml: 410, initialMl: 500, flow: 4.1, scenario: 'normal' },
        { bedNumber: '07', percent: 75, ml: 375, initialMl: 500, flow: 2.5, scenario: 'normal' },
        { bedNumber: '08', percent: 0, ml: 0, initialMl: 460, flow: 0, scenario: 'empty', preAlert: 'empty', note: 'Bag exhausted — awaiting change' },
        { bedNumber: '09', percent: 47, ml: 235, initialMl: 500, flow: 0, scenario: 'offline', offlineAlready: true, preAlert: 'device_offline', note: 'No signal · last seen 2 min ago' },
        { bedNumber: '10', percent: 60, ml: 300, initialMl: 500, flow: 2.8, scenario: 'normal' },
        { bedNumber: '11', percent: 33, ml: 165, initialMl: 500, flow: 3.5, scenario: 'normal' },
        { bedNumber: '12', percent: 45, ml: 225, initialMl: 500, flow: 0.03, scenario: 'occlusionSuspected', note: 'Flow expected, volume nearly unchanged' },
      ];
    }
    if (wardCode === '10B') {
      return [
        { bedNumber: '01', percent: 88, ml: 440, initialMl: 500, flow: 3.0, scenario: 'normal' },
        { bedNumber: '02', percent: 72, ml: 360, initialMl: 500, flow: 2.6, scenario: 'normal' },
        { bedNumber: '03', percent: 95, ml: 475, initialMl: 500, flow: 2.2, scenario: 'normal' },
        { bedNumber: '04', percent: 65, ml: 325, initialMl: 500, flow: 3.4, scenario: 'normal' },
        { bedNumber: '05', percent: 58, ml: 290, initialMl: 500, flow: 3.8, scenario: 'normal' },
        { bedNumber: '06', percent: 80, ml: 400, initialMl: 500, flow: 2.9, scenario: 'normal', lowBattery: true },
        { bedNumber: '07', percent: 90, ml: 450, initialMl: 500, flow: 2.4, scenario: 'normal' },
        { bedNumber: '08', percent: 70, ml: 350, initialMl: 500, flow: 3.1, scenario: 'normal' },
      ];
    }
    // ICU-1
    return [
      { bedNumber: '01', percent: 40, ml: 200, initialMl: 500, flow: 4.5, scenario: 'normal' },
      { bedNumber: '02', percent: 50, ml: 250, initialMl: 500, flow: 4.0, scenario: 'normal' },
      { bedNumber: '03', percent: 85, ml: 425, initialMl: 500, flow: 3.5, scenario: 'normal' },
      { bedNumber: '04', percent: 30, ml: 150, initialMl: 500, flow: 4.2, scenario: 'normal' },
      { bedNumber: '05', percent: 95, ml: 475, initialMl: 500, flow: 2.0, scenario: 'normal' },
      { bedNumber: '06', percent: 65, ml: 325, initialMl: 500, flow: 3.3, scenario: 'normal' },
    ];
  }

  function build() {
    const now = Date.now();
    const wardDefs = [
      { code: '10A', name: 'Ward 10A', floor: 10, building: 'Building B' },
      { code: '10B', name: 'Ward 10B', floor: 10, building: 'Building B' },
      { code: 'ICU1', name: 'ICU 1', floor: 4, building: 'Building A' },
    ];

    const wards = [];
    const beds = [];
    const devices = [];
    const ivStatus = {};
    const readings = {};
    const alerts = [];
    let hnCounter = 245650;
    let alertIdCounter = 1;
    let fluidIdx = 0;

    wardDefs.forEach((wd) => {
      wards.push({ id: wd.code, name: wd.name, floor: wd.floor, building: wd.building });
      const specs = wardBedSpecs(wd.code);
      specs.forEach((spec) => {
        const bedId = `${wd.code}-${spec.bedNumber}`;
        const fluidTypeId = FLUID_TYPES[fluidIdx % FLUID_TYPES.length].id;
        fluidIdx += 1;
        const deviceId = `IV-${wd.code}-${spec.bedNumber}`;
        hnCounter += 1;
        const patientHn = `HN-${hnCounter}`;

        const startTick = spec.offlineAlready ? 30 : Math.floor(Math.random() * 25);
        const battery = spec.lowBattery ? 8 : Math.round(70 + Math.random() * 28);
        const raw = {
          remainingMl: spec.ml,
          battery,
          rssi: -55 + Math.round(Math.random() * 10 - 5),
          online: !spec.offlineAlready,
          tick: startTick,
        };

        const device = {
          id: deviceId,
          deviceCode: deviceId,
          firmwareVersion: '1.0.0',
          battery,
          rssi: raw.rssi,
          lastSeen: spec.offlineAlready ? now - 130000 : now,
          status: spec.offlineAlready ? 'offline' : (SMIS.Formulas.batteryBand(battery) === 'critical' ? 'low_battery' : 'online'),
          simScenario: spec.scenario,
          _raw: raw,
        };
        devices.push(device);

        beds.push({
          id: bedId,
          wardId: wd.code,
          bedNumber: spec.bedNumber,
          patientHn,
          deviceId,
          status: 'occupied',
          initialMl: spec.initialMl,
          fluidTypeId,
          note: spec.note || null,
        });

        const bedReadings = synthesizeReadings(bedId, deviceId, spec.ml, spec.flow, now);
        readings[bedId] = bedReadings;
        ivStatus[bedId] = buildIvStatus(bedId, spec.ml, spec.initialMl, bedReadings);

        if (spec.preAlert) {
          alerts.push({
            id: `AL-${alertIdCounter++}`,
            bedId,
            type: spec.preAlert,
            message: alertMessage(spec.preAlert, bedId, patientHn, ivStatus[bedId]),
            isRead: false,
            resolvedAt: null,
            createdAt: now - 25000,
          });
        }
      });
    });

    const users = [
      { id: 'u1', name: 'Nurse Suphada', username: 'suphada', role: 'nurse', wardId: '10A', isActive: true },
      { id: 'u2', name: 'Head Nurse Ananya', username: 'ananya', role: 'head_nurse', wardId: null, isActive: true },
      { id: 'u3', name: 'Admin Somchai', username: 'somchai', role: 'admin', wardId: null, isActive: true },
      { id: 'u4', name: 'Superadmin Kritsada', username: 'kritsada', role: 'superadmin', wardId: null, isActive: true },
      { id: 'u5', name: 'Public Display', username: 'guest', role: 'guest', wardId: null, isActive: true },
    ];

    return {
      meta: { simSpeedMultiplier: 1, simClockMs: now, lastRealCheckpoint: now, demoSeededAt: now },
      session: { userId: null, role: null, name: null, wardId: null },
      wards, beds, devices, ivStatus, readings, alerts, users,
      fluidTypes: FLUID_TYPES.map((f) => ({ ...f })),
      ivChangeLog: [],
      settings: {
        criticalLowPct: 20,
        offlineWarnSec: 30,
        offlineAlertSec: 60,
        occlusionWindowSec: 180,
        occlusionEpsilonMl: 0.1,
      },
    };
  }

  function alertMessage(type, bedId, patientHn, ivs) {
    const pct = Math.round(ivs.remainingPercent);
    const ete = SMIS.Formulas.computeEte(ivs.remainingMl, ivs.flowRate);
    if (type === 'critical_low') return `Remaining ${pct}% · ETE ~${Math.round(ete || 0)} min · Bed ${bedId} (${patientHn})`;
    if (type === 'empty') return `Bag exhausted on bed ${bedId} (${patientHn}) — awaiting change`;
    if (type === 'device_offline') return `No telemetry from bed ${bedId}'s device for over 60s`;
    if (type === 'occlusion_suspected') return `Possible flow blockage suspected on bed ${bedId} — volume nearly unchanged`;
    return '';
  }

  return { build, alertMessage, synthesizeReadings, buildIvStatus, FLUID_TYPES };
})();
