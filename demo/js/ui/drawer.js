// Patient Detail Drawer — ported from the slide-in panel in 018 UXUI/Main.dc.html.
// Reused from Ward Detail, Patients list, and Dashboard's urgent-bed list.
window.SMIS = window.SMIS || {};

SMIS.Drawer = (function () {
  let openBedId = null;
  let range = '1h'; // 30m | 1h | 24h
  let mounted = false;
  let overlayEl, drawerEl;

  const RANGE_MS = { '30m': 30 * 60000, '1h': 60 * 60000, '24h': 24 * 60 * 60000 };
  const RANGE_LABEL = { '30m': '30 min', '1h': '1 hour', '24h': '24 hours' };

  function mount() {
    if (mounted) return;
    overlayEl = document.createElement('div');
    overlayEl.className = 'drawer-overlay';
    overlayEl.style.display = 'none';
    overlayEl.addEventListener('click', close);

    drawerEl = document.createElement('div');
    drawerEl.className = 'drawer';
    drawerEl.style.display = 'none';
    drawerEl.addEventListener('click', (e) => e.stopPropagation());

    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);
    mounted = true;
    SMIS.Store.subscribe(() => { if (isOpen()) render(); });
  }

  function open(bedId) {
    mount();
    openBedId = bedId;
    range = '1h';
    render();
    overlayEl.style.display = 'block';
    drawerEl.style.display = 'flex';
  }

  function close() {
    openBedId = null;
    if (mounted) { overlayEl.style.display = 'none'; drawerEl.style.display = 'none'; }
  }

  function isOpen() { return !!openBedId; }

  function historyForRange(state, bedId) {
    const cutoff = state.meta.simClockMs - RANGE_MS[range];
    const all = (state.readings[bedId] || []).filter((r) => r.recordedAt >= cutoff);
    const MAX_POINTS = 60;
    const step = Math.max(1, Math.floor(all.length / MAX_POINTS));
    return all.filter((_, i) => i % step === 0).map((r) => ({ v: r.remainingMl }));
  }

  function render() {
    if (!openBedId || !mounted) return;
    const state = SMIS.Store.get();
    const vm = SMIS.BedCard.viewModel(state, openBedId);
    if (!vm) { close(); return; }

    const points = historyForRange(state, openBedId);
    const chart = SMIS.Charts.sparkline(points, { color: vm.eteColor });
    const startedAt = (state.readings[openBedId] || [])[0];

    drawerEl.innerHTML = `
      <div class="drawer-header">
        <div>
          <div class="drawer-eyebrow">PATIENT DETAIL</div>
          <div class="drawer-title">Bed ${vm.bed.id}</div>
          <div class="drawer-sub">${vm.displayHn} · ${vm.ward ? vm.ward.name : ''}</div>
        </div>
        <button class="drawer-close" aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="drawer-hero band-${vm.offline ? 'gray' : vm.colorBand}">
        <div class="drawer-hero-ring" style="background:${vm.ringStyle};">
          <div class="drawer-hero-ring-inner" style="color:${vm.eteColor};">${vm.offline ? '—' : Math.round(vm.remainingPercent) + '%'}</div>
        </div>
        <div style="flex:1;">
          <div class="drawer-hero-status" style="color:${vm.eteColor};">${vm.offline ? 'Offline · no signal' : (vm.isEmpty ? 'Empty · bag exhausted' : (vm.isOcclusion ? 'Possible blockage · flow stalled' : (vm.band === 'P1' ? 'Critical · needs attention soon' : SMIS.Formulas.PRIORITY_BAND_LABEL[vm.band])))}</div>
          <div class="drawer-hero-ete-label">Estimated time to empty</div>
          <div class="drawer-hero-ete" style="color:${vm.eteColor};">${vm.offline ? '—' : SMIS.Format.ete(vm.ete)}</div>
        </div>
      </div>

      <div class="drawer-metrics-grid">
        <div class="metric-box"><div class="metric-label">Remaining volume</div><div class="metric-value">${vm.offline ? '—' : SMIS.Format.ml(vm.ivs.remainingMl)}</div></div>
        <div class="metric-box"><div class="metric-label">Flow rate</div><div class="metric-value">${vm.offline ? '—' : SMIS.Format.flow(vm.flowRate)}</div></div>
        <div class="metric-box"><div class="metric-label">Fluid type</div><div class="metric-value" style="font-size:14px;">${vm.fluidTypeName || '—'}</div></div>
        <div class="metric-box"><div class="metric-label">Started</div><div class="metric-value">${startedAt ? SMIS.Format.clock(startedAt.recordedAt) : '—'}</div></div>
        <div class="metric-box"><div class="metric-label">Device</div><div class="metric-value" style="font-size:14px;">${vm.device ? vm.device.deviceCode : '—'}</div></div>
        <div class="metric-box"><div class="metric-label">Ward</div><div class="metric-value" style="font-size:14px;">${vm.ward ? vm.ward.name : '—'}</div></div>
      </div>

      <div>
        <div class="chart-section-head">
          <div class="chart-section-title">Remaining volume · last ${RANGE_LABEL[range]}</div>
          <div class="chart-range-pills">
            ${['30m', '1h', '24h'].map((r) => `<button class="pill ${r === range ? 'active' : ''}" data-range="${r}">${r}</button>`).join('')}
          </div>
        </div>
        <div class="chart-box">${chart}</div>
      </div>

      ${SMIS.Permissions.canAct(state) ? `
      <div class="drawer-actions">
        <button class="btn-primary" data-action="acknowledge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4l3 3-3 3M16 7H5M5 20l3-3-3-3M2 17h11"/></svg>
          Acknowledge &amp; head to bed
        </button>
        <button class="btn-danger-outline" data-action="resolve">Mark IV changed / Resolve</button>
        <button class="btn-secondary ${vm.isMobility ? 'active-mobility' : ''}" data-action="mobility">
          ${vm.isMobility ? 'Resume alerts' : 'Pause alerts · Temporary Mobility'}
        </button>
      </div>` : `
      <div style="text-align:center; color:var(--text-tertiary); font-size:12.5px; padding:10px 0;">View only — clinical actions are restricted to nursing staff.</div>`}
    `;

    drawerEl.querySelector('.drawer-close').addEventListener('click', close);
    drawerEl.querySelectorAll('[data-range]').forEach((btn) => {
      btn.addEventListener('click', () => { range = btn.dataset.range; render(); });
    });
    const ackBtn = drawerEl.querySelector('[data-action="acknowledge"]');
    if (ackBtn) ackBtn.addEventListener('click', () => {
      if (vm.openAlert) SMIS.Actions.markAlertRead(vm.openAlert.id);
      if (window.SMIS.Toast) window.SMIS.Toast.push({ type: 'critical_low', bedId: vm.bed.id, message: 'Acknowledged — heading to bed.' });
    });
    const resolveBtn = drawerEl.querySelector('[data-action="resolve"]');
    if (resolveBtn) resolveBtn.addEventListener('click', () => {
      SMIS.Actions.resolveBed(vm.bed.id);
    });
    const mobilityBtn = drawerEl.querySelector('[data-action="mobility"]');
    if (mobilityBtn) mobilityBtn.addEventListener('click', () => {
      SMIS.Actions.toggleMobility(vm.bed.id);
    });
  }

  return { open, close, isOpen, render, get openBedId() { return openBedId; } };
})();
