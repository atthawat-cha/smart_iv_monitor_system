(function () {
  let filter = 'all';
  let sortKey = 'priority';
  let wardId = null;

  function group(vm) {
    if (vm.vacant) return 'vacant';
    if (vm.offline) return 'offline';
    if (vm.band === 'P1') return 'critical';
    if (vm.band === 'P2' || vm.band === 'P3') return 'warning';
    return 'normal';
  }

  // vacant beds have no ivStatus at all — always push them to the end regardless of sort key.
  function sortVms(vms) {
    const sorted = vms.slice();
    sorted.sort((a, b) => {
      if (a.vacant && b.vacant) return a.bed.bedNumber.localeCompare(b.bed.bedNumber);
      if (a.vacant) return 1;
      if (b.vacant) return -1;
      if (sortKey === 'priority') return b.ivs.priorityScore - a.ivs.priorityScore;
      if (sortKey === 'remaining') return (b.remainingPercent || 0) - (a.remainingPercent || 0);
      if (sortKey === 'ml') return (b.ivs.remainingMl || 0) - (a.ivs.remainingMl || 0);
      if (sortKey === 'ete') return (a.ete == null ? 999999 : a.ete) - (b.ete == null ? 999999 : b.ete);
      if (sortKey === 'bedNumber') return a.bed.bedNumber.localeCompare(b.bed.bedNumber);
      return 0;
    });
    return sorted;
  }

  function renderBanner(vms) {
    const urgentAlert = vms
      .map((vm) => vm.openAlert && (vm.openAlert.type === 'critical_low' || vm.openAlert.type === 'empty') ? { vm, alert: vm.openAlert } : null)
      .filter(Boolean)
      .sort((a, b) => b.alert.createdAt - a.alert.createdAt)[0];

    if (!urgentAlert) {
      return `<div class="alert-banner-empty">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        All beds in this ward are within normal range.
      </div>`;
    }
    const { vm, alert } = urgentAlert;
    return `
      <div class="alert-banner">
        <div class="alert-banner-icon">
          <div class="ping-ring"></div>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ff8a97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:relative;"><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4"/><path d="M12 16.5v.01"/></svg>
        </div>
        <div class="alert-banner-body">
          <div class="alert-banner-title">Critical Alert — Bed ${vm.bed.id}</div>
          <div class="alert-banner-sub">${alert.message}</div>
        </div>
        <div class="alert-banner-right">
          <div class="alert-banner-chip">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 3.3L2.7 10.8c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 1.9 6c.2.6.4.8.9.8s.7-.2 1-.5l2.6-2.5 5 3.7c.9.6 1.6.3 1.8-.9L23.9 4.5c.3-1.4-.5-2-2-1.2z"/></svg>
            Sent
          </div>
          <div class="alert-banner-time">${SMIS.Format.timeAgo(alert.createdAt)}</div>
        </div>
      </div>`;
  }

  function render() {
    const state = SMIS.Store.get();
    const params = new URLSearchParams(window.location.search);
    wardId = params.get('ward') || (state.wards[0] && state.wards[0].id);
    const ward = state.wards.find((w) => w.id === wardId) || state.wards[0];
    wardId = ward.id;

    SMIS.Shell.render({ page: 'ward-detail', breadcrumb: 'WARDS / ' + ward.name.toUpperCase(), title: ward.name, meta: `${ward.building} · Floor ${ward.floor} · ${state.beds.filter((b) => b.wardId === ward.id).length} beds`, presentHref: `tv.html?ward=${ward.id}` });

    const bedsInWard = state.beds.filter((b) => b.wardId === ward.id);
    const vms = bedsInWard.map((b) => SMIS.BedCard.viewModel(state, b.id));
    const counts = { all: vms.length, critical: 0, warning: 0, normal: 0, offline: 0, vacant: 0 };
    vms.forEach((vm) => counts[group(vm)]++);

    const filtered = filter === 'all' ? vms : vms.filter((vm) => group(vm) === filter);
    const sorted = sortVms(filtered);

    const body = document.getElementById('page-body');
    body.innerHTML = `
      ${renderBanner(vms)}

      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-card-head"><div class="kpi-label">TOTAL BEDS</div></div><div class="kpi-value">${counts.all}</div><div class="kpi-caption">Full ward · all monitored</div></div>
        <div class="kpi-card tint-critical"><div class="kpi-card-head"><div class="kpi-label">CRITICAL IV</div></div><div class="kpi-value">${counts.critical}</div><div class="kpi-caption">Needs attention now</div></div>
        <div class="kpi-card tint-warning"><div class="kpi-card-head"><div class="kpi-label">WARNING IV</div></div><div class="kpi-value">${counts.warning}</div><div class="kpi-caption">Plan the next round</div></div>
        <div class="kpi-card tint-normal"><div class="kpi-card-head"><div class="kpi-label">NORMAL BEDS</div></div><div class="kpi-value">${counts.normal}</div><div class="kpi-caption">On track · no action needed</div></div>
      </div>

      <div class="controls-row">
        <div class="filter-pills">
          <button class="pill ${filter === 'all' ? 'active' : ''}" data-filter="all">All · ${counts.all}</button>
          <button class="pill tone-critical ${filter === 'critical' ? 'active' : ''}" data-filter="critical">Critical · ${counts.critical}</button>
          <button class="pill tone-warning ${filter === 'warning' ? 'active' : ''}" data-filter="warning">Warning · ${counts.warning}</button>
          <button class="pill tone-normal ${filter === 'normal' ? 'active' : ''}" data-filter="normal">Normal · ${counts.normal}</button>
          <button class="pill tone-offline ${filter === 'offline' ? 'active' : ''}" data-filter="offline">Offline · ${counts.offline}</button>
          <button class="pill tone-offline ${filter === 'vacant' ? 'active' : ''}" data-filter="vacant">Vacant · ${counts.vacant}</button>
        </div>
        <div class="sort-select">
          <span>Sort by</span>
          <select id="sort-select">
            <option value="priority">Priority Score</option>
            <option value="remaining">Remaining %</option>
            <option value="ml">Remaining ml</option>
            <option value="ete">ETE</option>
            <option value="bedNumber">Bed No.</option>
          </select>
        </div>
      </div>

      <div class="bed-grid" id="bed-grid"></div>
    `;
    document.getElementById('sort-select').value = sortKey;

    SMIS.BedCard.renderGrid(document.getElementById('bed-grid'), sorted, (bedId) => SMIS.Drawer.open(bedId));

    body.querySelectorAll('[data-filter]').forEach((btn) => {
      btn.addEventListener('click', () => { filter = btn.dataset.filter; render(); });
    });
    document.getElementById('sort-select').addEventListener('change', (e) => { sortKey = e.target.value; render(); });
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
