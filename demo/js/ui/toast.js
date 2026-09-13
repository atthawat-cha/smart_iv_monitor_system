// Pops a toast whenever the engine fires a new alert on the currently-open page.
window.SMIS = window.SMIS || {};

SMIS.Toast = (function () {
  const ALERT_TITLES = {
    critical_low: 'Critical IV Alert',
    empty: 'IV Bag Empty',
    device_offline: 'Device Offline',
    occlusion_suspected: 'Possible Flow Blockage',
  };

  function mount() {
    let host = document.getElementById('smis-toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'smis-toast-host';
      host.className = 'toast-container';
      document.body.appendChild(host);
    }
    return host;
  }

  function push(alert) {
    const host = mount();
    const node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = `
      <div class="toast-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4"/><path d="M12 16.5v.01"/></svg>
      </div>
      <div style="flex:1; min-width:0;">
        <div class="toast-title">${ALERT_TITLES[alert.type] || 'Alert'} — Bed ${alert.bedId}</div>
        <div class="toast-body">${alert.message}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;
    node.querySelector('.toast-close').addEventListener('click', () => node.remove());
    host.prepend(node);
    setTimeout(() => node.remove(), 7000);
  }

  return { push };
})();
