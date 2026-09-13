(function () {
  function topCriticalBeds(state, n) {
    return state.beds
      .map((bed) => ({ bed, vm: SMIS.BedCard.viewModel(state, bed.id) }))
      .filter((x) => !x.vm.offline)
      .sort((a, b) => b.vm.ivs.priorityScore - a.vm.ivs.priorityScore)
      .slice(0, n);
  }

  function avgConsumptionPerWard(state) {
    return state.wards.map((ward) => {
      const beds = state.beds.filter((b) => b.wardId === ward.id);
      const flows = beds.map((b) => (state.ivStatus[b.id] || {}).flowRate || 0).filter((f) => f > 0);
      const avg = flows.length ? flows.reduce((a, b) => a + b, 0) / flows.length : 0;
      return { label: ward.name, value: Math.round(avg * 10) / 10, color: 'var(--accent)' };
    });
  }

  function deviceReliability(state) {
    return state.devices.map((device) => {
      const bed = state.beds.find((b) => b.deviceId === device.id);
      const offlineEvents = bed ? state.alerts.filter((a) => a.bedId === bed.id && a.type === 'device_offline').length : 0;
      return { device, bed, offlineEvents };
    }).sort((a, b) => b.offlineEvents - a.offlineEvents);
  }

  function dailyStats(state) {
    const resolved = state.alerts.filter((a) => a.resolvedAt);
    const avgResponseMin = resolved.length
      ? resolved.reduce((sum, a) => sum + (a.resolvedAt - a.createdAt), 0) / resolved.length / 60000
      : null;
    const activeEtes = state.beds
      .map((b) => { const ivs = state.ivStatus[b.id]; return ivs ? SMIS.Formulas.computeEte(ivs.remainingMl, ivs.flowRate) : null; })
      .filter((e) => e != null);
    const avgEte = activeEtes.length ? activeEtes.reduce((a, b) => a + b, 0) / activeEtes.length : null;
    return {
      ivChangeCount: state.ivChangeLog.length,
      alertCount: state.alerts.length,
      avgEte, avgResponseMin,
    };
  }

  function nurseWorkload(state) {
    const byUser = {};
    state.ivChangeLog.forEach((e) => { byUser[e.by] = (byUser[e.by] || 0) + 1; });
    return state.users.map((u) => ({ label: u.name, value: byUser[u.id] || 0, color: 'var(--accent-cyan)' }));
  }

  function render() {
    const state = SMIS.Store.get();
    SMIS.Shell.render({ page: 'analytics', breadcrumb: 'ANALYTICS', title: 'Analytics', meta: 'Ward performance & staffing evidence' });

    const top = topCriticalBeds(state, 5);
    const stats = dailyStats(state);
    const reliability = deviceReliability(state);

    const body = document.getElementById('page-body');
    body.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">IV BAGS CHANGED</div><div class="kpi-value">${stats.ivChangeCount}</div><div class="kpi-caption">This session</div></div>
        <div class="kpi-card"><div class="kpi-label">TOTAL ALERTS</div><div class="kpi-value">${stats.alertCount}</div><div class="kpi-caption">Since demo start</div></div>
        <div class="kpi-card"><div class="kpi-label">AVG ETE (ACTIVE BEDS)</div><div class="kpi-value" style="font-size:24px;">${stats.avgEte != null ? SMIS.Format.ete(stats.avgEte) : '—'}</div></div>
        <div class="kpi-card"><div class="kpi-label">AVG RESPONSE TIME</div><div class="kpi-value" style="font-size:24px;">${stats.avgResponseMin != null ? Math.round(stats.avgResponseMin) + ' min' : '—'}</div></div>
      </div>

      <div class="grid-2">
        <div class="card-panel" style="padding:18px;">
          <div class="section-title" style="margin-bottom:10px;">Top Critical Beds</div>
          <table class="data-table">
            <thead><tr><th>Bed</th><th>Ward</th><th>Remaining</th><th>ETE</th><th>Priority Score</th></tr></thead>
            <tbody>
              ${top.map((x) => `<tr><td>${x.bed.id}</td><td>${x.vm.ward ? x.vm.ward.name : ''}</td><td>${SMIS.Format.percent(x.vm.remainingPercent)}</td><td>${SMIS.Format.ete(x.vm.ete)}</td><td>${x.vm.ivs.priorityScore.toFixed(1)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-panel" style="padding:18px;">
          <div class="section-title" style="margin-bottom:10px;">Avg Consumption per Ward</div>
          ${SMIS.Charts.bars(avgConsumptionPerWard(state), { unit: ' ml/min' })}
        </div>
      </div>

      <div class="grid-2">
        <div class="card-panel" style="padding:18px; overflow-x:auto;">
          <div class="section-title" style="margin-bottom:10px;">Device Reliability</div>
          <table class="data-table">
            <thead><tr><th>Device</th><th>Bed</th><th>Status</th><th>Battery</th><th>Offline events</th></tr></thead>
            <tbody>
              ${reliability.map((r) => `<tr><td>${r.device.deviceCode}</td><td>${r.bed ? r.bed.id : '—'}</td><td>${r.device.status.replace('_', ' ')}</td><td>${r.device.battery}%</td><td>${r.offlineEvents}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="card-panel" style="padding:18px;">
          <div class="section-title" style="margin-bottom:10px;">Nurse Workload Report</div>
          <div style="font-size:11.5px; color:var(--text-tertiary); margin-bottom:10px;">IV bags changed per staff member (this session)</div>
          ${SMIS.Charts.bars(nurseWorkload(state))}
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    SMIS.Store.load();
    if (!SMIS.Shell.requireLogin()) return;
    SMIS.Engine.start();
    SMIS.ControlPanel.mount();
    render();
    SMIS.Store.subscribe(render);
  });
})();
