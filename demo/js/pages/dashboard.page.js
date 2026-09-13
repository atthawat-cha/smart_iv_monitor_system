(function () {
  const RANGE_MS = { '30m': 30 * 60000, '1h': 60 * 60000, '24h': 24 * 60 * 60000 };
  let range = '1h';

  function computeKpis(state) {
    const F = SMIS.Formulas;
    const beds = state.beds;
    let critical = 0, warning = 0, connected = 0, flowSum = 0, flowCount = 0, minEte = null, minEteBed = null;
    beds.forEach((bed) => {
      const ivs = state.ivStatus[bed.id];
      const device = state.devices.find((d) => d.id === bed.deviceId);
      if (device && (device.status === 'online' || device.status === 'low_battery')) connected++;
      if (!ivs || !device || device.status === 'offline') return;
      if (ivs.remainingPercent < 20) critical++;
      else if (ivs.remainingPercent < 50) warning++;
      if (ivs.flowRate > 0) { flowSum += ivs.flowRate; flowCount++; }
      const ete = F.computeEte(ivs.remainingMl, ivs.flowRate);
      if (ete != null && (minEte == null || ete < minEte)) { minEte = ete; minEteBed = bed.id; }
    });
    return {
      activeBeds: beds.filter((b) => b.status === 'occupied').length,
      critical, warning,
      connectedDevices: connected,
      avgFlow: flowCount ? flowSum / flowCount : 0,
      minEte, minEteBed,
    };
  }

  function wardDistribution(state) {
    const F = SMIS.Formulas;
    const counts = { green: 0, yellow: 0, orange: 0, red: 0, gray: 0 };
    state.beds.forEach((bed) => {
      const ivs = state.ivStatus[bed.id];
      const device = state.devices.find((d) => d.id === bed.deviceId);
      if (!ivs || !device) return;
      if (device.status === 'offline') { counts.gray++; return; }
      counts[F.colorBand(ivs.remainingPercent)]++;
    });
    return counts;
  }

  function findReadingAtOrBefore(readings, ts) {
    for (let i = readings.length - 1; i >= 0; i--) {
      if (readings[i].recordedAt <= ts) return readings[i];
    }
    return null;
  }

  function consumptionTrend(state) {
    const windowMs = RANGE_MS[range];
    const BUCKETS = 24;
    const now = state.meta.simClockMs;
    const bucketMs = windowMs / BUCKETS;
    const points = [];
    for (let i = 0; i < BUCKETS; i++) {
      const bucketEnd = now - windowMs + (i + 1) * bucketMs;
      let sum = 0, count = 0;
      state.beds.forEach((bed) => {
        const r = findReadingAtOrBefore(state.readings[bed.id] || [], bucketEnd);
        if (r) { sum += (r.remainingMl / bed.initialMl) * 100; count++; }
      });
      points.push({ v: count ? sum / count : 0 });
    }
    return points;
  }

  function recentAlerts(state, n) {
    return state.alerts.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, n);
  }

  const ALERT_ICON_COLOR = { critical_low: '#ff8a97', empty: '#ff8a97', device_offline: '#cbd5e1', occlusion_suspected: '#ffdd8a' };

  function renderAlertRow(a) {
    const color = ALERT_ICON_COLOR[a.type] || '#c3cadb';
    return `
      <div style="display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid var(--panel-border-soft);">
        <div style="width:8px;height:8px;border-radius:50%;background:${color};margin-top:5px;flex:none;"></div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:12.5px; font-weight:600; color:var(--text-primary);">Bed ${a.bedId} — ${a.type.replace('_', ' ')}${a.resolvedAt ? ' (resolved)' : ''}</div>
          <div style="font-size:11.5px; color:var(--text-tertiary); margin-top:2px;">${a.message}</div>
        </div>
        <div style="font-size:11px; color:var(--text-quaternary); white-space:nowrap;">${SMIS.Format.timeAgo(a.createdAt)}</div>
      </div>`;
  }

  function render() {
    const state = SMIS.Store.get();
    SMIS.Shell.render({ page: 'dashboard', breadcrumb: 'OVERVIEW', title: 'Dashboard', meta: `Welcome back, ${state.session.name || 'Guest'}` });
    const kpi = computeKpis(state);
    const dist = wardDistribution(state);
    const alerts = recentAlerts(state, 8);

    const body = document.getElementById('page-body');
    body.innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-card-head"><div class="kpi-label">ACTIVE BEDS</div></div>
          <div class="kpi-value">${kpi.activeBeds}</div>
          <div class="kpi-caption">Across ${state.wards.length} wards</div>
        </div>
        <div class="kpi-card tint-critical">
          <div class="kpi-card-head"><div class="kpi-label">CRITICAL IV &lt;20%</div></div>
          <div class="kpi-value">${kpi.critical}</div>
          <div class="kpi-caption">Needs attention now</div>
        </div>
        <div class="kpi-card tint-warning">
          <div class="kpi-card-head"><div class="kpi-label">WARNING IV &lt;50%</div></div>
          <div class="kpi-value">${kpi.warning}</div>
          <div class="kpi-caption">Plan the next round</div>
        </div>
        <div class="kpi-card tint-normal">
          <div class="kpi-card-head"><div class="kpi-label">CONNECTED DEVICES</div></div>
          <div class="kpi-value">${kpi.connectedDevices}/${state.beds.filter((b) => b.deviceId).length}</div>
          <div class="kpi-caption">Live telemetry</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card-panel" style="padding:18px;">
          <div class="section-head">
            <div class="section-title">Consumption Trend</div>
            <div class="chart-range-pills">
              ${['30m', '1h', '24h'].map((r) => `<button class="pill ${r === range ? 'active' : ''}" data-trend-range="${r}">${r}</button>`).join('')}
            </div>
          </div>
          <div class="chart-box" style="margin-top:12px;">${SMIS.Charts.sparkline(consumptionTrend(state), { color: '#7c6cff', width: 480, height: 140 })}</div>
          <div class="chart-axis-labels"><span>Avg remaining % across all beds</span></div>
        </div>
        <div class="card-panel" style="padding:18px; display:flex; flex-direction:column; align-items:center; gap:14px;">
          <div class="section-title" style="align-self:flex-start;">Ward Distribution</div>
          ${SMIS.Charts.donut([
            { value: dist.green, color: '#34d399' },
            { value: dist.yellow, color: '#ffd166' },
            { value: dist.orange, color: '#ff9d42' },
            { value: dist.red, color: '#f5455c' },
            { value: dist.gray, color: '#6b7280' },
          ])}
          <div class="chart-legend">
            <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#34d399;"></span>Normal · ${dist.green}</div>
            <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#ffd166;"></span>Yellow · ${dist.yellow}</div>
            <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#ff9d42;"></span>Warning · ${dist.orange}</div>
            <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#f5455c;"></span>Critical · ${dist.red}</div>
            <div class="chart-legend-item"><span class="chart-legend-swatch" style="background:#6b7280;"></span>Empty/Offline · ${dist.gray}</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card-panel" style="padding:18px;">
          <div class="kpi-label" style="margin-bottom:8px;">AVG FLOW RATE</div>
          <div class="kpi-value" style="font-size:24px;">${SMIS.Format.flow(kpi.avgFlow)}</div>
        </div>
        <div class="card-panel" style="padding:18px;">
          <div class="kpi-label" style="margin-bottom:8px;">ESTIMATED NEXT REFILL</div>
          <div class="kpi-value" style="font-size:24px;">${kpi.minEte != null ? SMIS.Format.ete(kpi.minEte) : '—'}</div>
          <div class="kpi-caption">${kpi.minEteBed ? `Bed ${kpi.minEteBed}` : 'No active beds'}</div>
        </div>
      </div>

      <div class="card-panel" style="padding:18px;">
        <div class="section-title" style="margin-bottom:6px;">Alert Timeline</div>
        ${alerts.length ? alerts.map(renderAlertRow).join('') : '<div class="chart-empty">No alerts yet.</div>'}
      </div>
    `;

    body.querySelectorAll('[data-trend-range]').forEach((btn) => {
      btn.addEventListener('click', () => { range = btn.dataset.trendRange; render(); });
    });
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
