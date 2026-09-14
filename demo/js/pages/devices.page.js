(function () {
  const STATUS_COLOR = { online: '#86eec1', offline: '#cbd5e1', low_battery: '#ffb578', unassigned: '#9d8cff' };
  const BATTERY_COLOR = { normal: '#86eec1', warning: '#ffb578', critical: '#ff8a97' };

  function render() {
    const state = SMIS.Store.get();
    const devices = SMIS.Permissions.scopedDevices(state);
    SMIS.Shell.render({ page: 'devices', breadcrumb: 'DEVICES', title: 'Devices', meta: `${devices.length} IoT node${devices.length === 1 ? '' : 's'} provisioned` });

    const rows = devices.map((device) => {
      const bed = state.beds.find((b) => b.deviceId === device.id);
      const battBand = SMIS.Formulas.batteryBand(device.battery);
      const unassigned = device.status === 'unassigned';
      return `
        <tr class="${device.status === 'offline' || unassigned ? 'row-muted' : ''}">
          <td>${device.deviceCode}</td>
          <td>${bed ? bed.id : '—'}</td>
          <td><span style="color:${BATTERY_COLOR[battBand]}; font-weight:600;">${device.battery}%</span></td>
          <td>${unassigned ? '—' : device.rssi + ' dBm'}</td>
          <td>${unassigned ? 'Never connected' : SMIS.Format.timeAgo(device.lastSeen)}</td>
          <td><span class="dot-status" style="color:${STATUS_COLOR[device.status]};">${device.status.replace('_', ' ')}</span></td>
          <td>${device.firmwareVersion}</td>
        </tr>`;
    }).join('');

    document.getElementById('page-body').innerHTML = `
      <div class="card-panel" style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr><th>Device</th><th>Bed</th><th>Battery</th><th>RSSI</th><th>Last seen</th><th>Status</th><th>Firmware</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
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
