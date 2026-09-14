// Presentation/TV board — a kiosk view meant for a wall-mounted monitor or a ward's own
// nurse-station screen. No sidebar/devtools. Supports two shapes via query params:
//   tv.html               -> hospital-wide overview (KPIs + every bed, priority-sorted)
//   tv.html?ward=10A      -> that single ward's board (for mounting inside the ward itself)
//   tv.html?rotate=8      -> auto-rotate every 8s through: overview, then each ward in turn
(function () {
  const params = new URLSearchParams(window.location.search);
  const pinnedWard = params.get('ward');
  const rotateSeconds = Number(params.get('rotate')) || 0;

  let rotationIds = null; // built once wards are known: [null, wardId1, wardId2, ...]
  let rotationIndex = 0;

  function currentWardId(state) {
    if (rotateSeconds > 0) {
      if (!rotationIds) rotationIds = [null, ...state.wards.map((w) => w.id)];
      return rotationIds[rotationIndex % rotationIds.length];
    }
    return pinnedWard || null;
  }

  function computeOverviewKpis(state) {
    const F = SMIS.Formulas;
    let critical = 0, warning = 0, connected = 0, flowSum = 0, flowCount = 0;
    state.beds.forEach((bed) => {
      const ivs = state.ivStatus[bed.id];
      const device = state.devices.find((d) => d.id === bed.deviceId);
      if (device && (device.status === 'online' || device.status === 'low_battery')) connected++;
      if (!ivs || !device || device.status === 'offline') return;
      if (ivs.remainingPercent < state.settings.criticalLowPct) critical++;
      else if (ivs.remainingPercent < 50) warning++;
      if (ivs.flowRate > 0) { flowSum += ivs.flowRate; flowCount++; }
    });
    return {
      activeBeds: state.beds.filter((b) => b.status === 'occupied').length,
      critical, warning, connected,
      totalDevices: state.beds.filter((b) => b.deviceId).length,
      avgFlow: flowCount ? flowSum / flowCount : 0,
      openAlerts: state.alerts.filter((a) => !a.resolvedAt).length,
    };
  }

  function sortedVms(vms) {
    const sorted = vms.slice();
    sorted.sort((a, b) => {
      if (a.vacant && b.vacant) return a.bed.bedNumber.localeCompare(b.bed.bedNumber);
      if (a.vacant) return 1;
      if (b.vacant) return -1;
      return b.ivs.priorityScore - a.ivs.priorityScore;
    });
    return sorted;
  }

  const ALERT_ICON_COLOR = { critical_low: '#ff8a97', empty: '#ff8a97', device_offline: '#cbd5e1', occlusion_suspected: '#ffdd8a' };

  function renderTicker(state, wardId) {
    const isGuest = SMIS.Permissions.isGuest(state);
    const alerts = state.alerts
      .filter((a) => !wardId || state.beds.find((b) => b.id === a.bedId && b.wardId === wardId))
      .slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
    if (!alerts.length) return `<div class="chart-empty">No alerts.</div>`;
    return alerts.map((a) => `
      <div class="tv-ticker-item">
        <div class="tv-ticker-dot" style="background:${ALERT_ICON_COLOR[a.type] || '#c3cadb'};"></div>
        <div style="flex:1; min-width:0;">
          <div class="tv-ticker-title">Bed ${a.bedId} — ${a.type.replace('_', ' ')}${a.resolvedAt ? ' (resolved)' : ''}</div>
          <div class="tv-ticker-sub">${isGuest ? a.message.replace(/\s*\(HN-[^)]*\)/g, '') : a.message}</div>
        </div>
        <div style="font-size:11px; color:var(--text-quaternary); white-space:nowrap;">${SMIS.Format.timeAgo(a.createdAt)}</div>
      </div>`).join('');
  }

  function render() {
    const state = SMIS.Store.get();
    const wardId = currentWardId(state);
    const ward = wardId ? state.wards.find((w) => w.id === wardId) : null;

    const now = new Date(state.meta.simClockMs);
    document.getElementById('tv-clock').textContent = now.toTimeString().slice(0, 8);
    document.getElementById('tv-date').textContent = now.toDateString();
    document.getElementById('tv-title').textContent = ward ? ward.name : 'Hospital Overview';
    document.getElementById('tv-subtitle').textContent = ward
      ? `${ward.building} · Floor ${ward.floor} · ${state.beds.filter((b) => b.wardId === ward.id).length} beds`
      : `${state.wards.length} wards · ${state.beds.length} beds`;

    const kpis = computeOverviewKpis(state);
    document.getElementById('tv-kpis').innerHTML = `
      <div class="kpi-card"><div class="kpi-card-head"><div class="kpi-label">ACTIVE BEDS</div></div><div class="kpi-value">${kpis.activeBeds}</div></div>
      <div class="kpi-card tint-critical"><div class="kpi-card-head"><div class="kpi-label">CRITICAL IV</div></div><div class="kpi-value">${kpis.critical}</div></div>
      <div class="kpi-card tint-warning"><div class="kpi-card-head"><div class="kpi-label">WARNING IV</div></div><div class="kpi-value">${kpis.warning}</div></div>
      <div class="kpi-card tint-normal"><div class="kpi-card-head"><div class="kpi-label">CONNECTED</div></div><div class="kpi-value">${kpis.connected}/${kpis.totalDevices}</div></div>
      <div class="kpi-card"><div class="kpi-card-head"><div class="kpi-label">AVG FLOW</div></div><div class="kpi-value" style="font-size:22px;">${SMIS.Format.flow(kpis.avgFlow)}</div></div>
      <div class="kpi-card ${kpis.openAlerts > 0 ? 'tint-critical' : ''}"><div class="kpi-card-head"><div class="kpi-label">OPEN ALERTS</div></div><div class="kpi-value">${kpis.openAlerts}</div></div>
    `;

    const isGuest = SMIS.Permissions.isGuest(state);
    const beds = ward ? state.beds.filter((b) => b.wardId === ward.id) : state.beds;
    const vms = sortedVms(beds.map((b) => SMIS.BedCard.viewModel(state, b.id, { maskPatient: isGuest })));
    // Public/guest boards are look-only: no drilling into a patient's detail drawer.
    SMIS.BedCard.renderGrid(document.getElementById('tv-bed-grid'), vms, isGuest ? null : (bedId) => SMIS.Drawer.open(bedId));

    document.getElementById('tv-ticker').innerHTML = renderTicker(state, wardId);
  }

  function startRotation() {
    if (rotateSeconds <= 0) return;
    setInterval(() => { rotationIndex += 1; render(); }, rotateSeconds * 1000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const state = SMIS.Store.load();
    if (!state.session.role) { window.location.href = 'login.html'; return; }
    SMIS.Engine.start();
    render();
    SMIS.Store.subscribe(render);
    startRotation();

    document.getElementById('tv-fullscreen').addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    });
  });
})();
