(function () {
  let tab = 'open'; // all | unread | open | resolved

  const TYPE_LABEL = {
    critical_low: 'Critical Low', empty: 'Empty', device_offline: 'Device Offline', occlusion_suspected: 'Occlusion Suspected',
  };
  const TYPE_COLOR = {
    critical_low: '#ff8a97', empty: '#ff8a97', device_offline: '#cbd5e1', occlusion_suspected: '#ffdd8a',
  };

  function filterAlerts(state) {
    const sorted = state.alerts.slice().sort((a, b) => b.createdAt - a.createdAt);
    if (tab === 'unread') return sorted.filter((a) => !a.isRead && !a.resolvedAt);
    if (tab === 'open') return sorted.filter((a) => !a.resolvedAt);
    if (tab === 'resolved') return sorted.filter((a) => a.resolvedAt);
    return sorted;
  }

  function render() {
    const state = SMIS.Store.get();
    const openCount = state.alerts.filter((a) => !a.resolvedAt).length;
    SMIS.Shell.render({ page: 'alerts', breadcrumb: 'ALERTS', title: 'Alert Center', meta: `${openCount} open alert${openCount === 1 ? '' : 's'}` });

    const list = filterAlerts(state);
    const rows = list.map((a) => {
      const bed = state.beds.find((b) => b.id === a.bedId);
      const ivs = state.ivStatus[a.bedId] || {};
      return `
        <tr class="${a.resolvedAt ? 'row-muted' : ''}">
          <td><span style="color:${TYPE_COLOR[a.type]}; font-weight:600;">${TYPE_LABEL[a.type]}</span></td>
          <td>${a.bedId}</td>
          <td>${bed ? bed.patientHn : '—'}</td>
          <td>${SMIS.Format.percent(ivs.remainingPercent)}</td>
          <td style="max-width:260px;">${a.message}</td>
          <td>${SMIS.Format.timeAgo(a.createdAt)}</td>
          <td>${a.resolvedAt ? 'Resolved' : (a.isRead ? 'Read' : 'Unread')}</td>
          <td class="table-actions">
            ${!a.isRead ? `<button class="btn-chip" data-mark-read="${a.id}">Mark read</button>` : ''}
            ${!a.resolvedAt ? `<button class="btn-chip primary" data-resolve="${a.id}">Resolve</button>` : ''}
            <button class="btn-chip" data-view="${a.bedId}">View bed</button>
          </td>
        </tr>`;
    }).join('');

    document.getElementById('page-body').innerHTML = `
      <div class="filter-pills">
        <button class="pill ${tab === 'all' ? 'active' : ''}" data-tab="all">All</button>
        <button class="pill ${tab === 'unread' ? 'active' : ''}" data-tab="unread">Unread</button>
        <button class="pill ${tab === 'open' ? 'active' : ''}" data-tab="open">Open</button>
        <button class="pill ${tab === 'resolved' ? 'active' : ''}" data-tab="resolved">Resolved</button>
      </div>
      <div class="card-panel" style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr><th>Type</th><th>Bed</th><th>Patient</th><th>Remaining</th><th>Message</th><th>Created</th><th>State</th><th></th></tr></thead>
          <tbody>${rows.length ? rows : '<tr><td colspan="8" style="text-align:center; color:var(--text-tertiary); padding:24px;">No alerts in this view.</td></tr>'}</tbody>
        </table>
      </div>`;

    document.querySelectorAll('[data-tab]').forEach((btn) => btn.addEventListener('click', () => { tab = btn.dataset.tab; render(); }));
    document.querySelectorAll('[data-mark-read]').forEach((btn) => btn.addEventListener('click', () => SMIS.Actions.markAlertRead(btn.dataset.markRead)));
    document.querySelectorAll('[data-resolve]').forEach((btn) => btn.addEventListener('click', () => SMIS.Actions.resolveAlert(btn.dataset.resolve)));
    document.querySelectorAll('[data-view]').forEach((btn) => btn.addEventListener('click', () => SMIS.Drawer.open(btn.dataset.view)));
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
