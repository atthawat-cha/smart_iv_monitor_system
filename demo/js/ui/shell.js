// Sidebar + topbar shell shared by every page except login.html. One source of truth,
// ported from 018 UXUI/Main.dc.html lines 37-122, injected into #app-shell on every page.
window.SMIS = window.SMIS || {};

SMIS.Shell = (function () {
  const ICONS = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    wards: '<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-8h6v8"/>',
    patients: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
    devices: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    alerts: '<path d="M18 8a6 6 0 10-12 0c0 4-2 5-2 6h16c0-1-2-2-2-6z"/><path d="M10 21a2 2 0 004 0"/>',
    analytics: '<path d="M4 20V10M11 20V4M18 20v-7"/>',
    settings: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.6a7.6 7.6 0 000-3.2l1.9-1.3-1.7-2.9-2.2.8a7.6 7.6 0 00-2.8-1.6L14.2 3h-4.4l-.4 2.4a7.6 7.6 0 00-2.8 1.6l-2.2-.8-1.7 2.9L4.6 10.4a7.6 7.6 0 000 3.2l-1.9 1.3 1.7 2.9 2.2-.8c.8.7 1.8 1.3 2.8 1.6l.4 2.4h4.4l.4-2.4c1-.3 2-.9 2.8-1.6l2.2.8 1.7-2.9-1.9-1.3z"/>',
  };

  const NAV_ITEMS = [
    { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
    { key: 'wards', label: 'Wards', href: 'wards.html', icon: 'wards' },
    { key: 'patients', label: 'Patients', href: 'patients.html', icon: 'patients' },
    { key: 'devices', label: 'Devices', href: 'devices.html', icon: 'devices' },
    { key: 'alerts', label: 'Alerts', href: 'alerts.html', icon: 'alerts', badge: true },
    { key: 'analytics', label: 'Analytics', href: 'analytics.html', icon: 'analytics' },
    { key: 'settings', label: 'Settings', href: 'settings.html', icon: 'settings', roles: ['system_admin'] },
  ];

  // sub-pages that highlight a top-level nav item without matching it exactly
  const NAV_ALIAS = { 'ward-detail': 'wards' };

  function initials(name) {
    return (name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  function svg(iconKey) {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[iconKey]}</svg>`;
  }

  function render(pageConfig) {
    const state = SMIS.Store.get();
    const role = state.session.role || 'nurse';
    const name = state.session.name || 'Guest';
    const activeKey = NAV_ALIAS[pageConfig.page] || pageConfig.page;
    const alertBadge = SMIS.Alerts.unreadOpenCount(state);

    const mount = document.getElementById('app-shell');
    if (!mount) return;

    const navHtml = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role)).map((item) => `
      <a class="nav-item ${item.key === activeKey ? 'active' : ''}" href="${item.href}">
        <span class="nav-item-left">${svg(item.icon)}<span>${item.label}</span></span>
        ${item.badge && alertBadge > 0 ? `<span class="nav-badge">${alertBadge}</span>` : ''}
      </a>
    `).join('');

    mount.innerHTML = `
      <div class="sidebar">
        <div class="sidebar-logo">
          <div class="sidebar-logo-mark">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6M12 22v-6M4.9 4.9l4.2 4.2M19.1 4.9l-4.2 4.2M2 12h6M22 12h-6M4.9 19.1l4.2-4.2M19.1 19.1l-4.2-4.2"/></svg>
          </div>
          <div class="sidebar-logo-text">SMIS</div>
        </div>
        <div class="sidebar-nav">${navHtml}</div>
        <a href="login.html" class="sidebar-user" style="text-decoration:none;">
          <div class="avatar-circle">${initials(name)}</div>
          <div style="min-width:0;">
            <div class="sidebar-user-name">${name}</div>
            <div class="sidebar-user-meta">${role.replace('_', ' ')} · Sign out</div>
          </div>
        </a>
      </div>
      <div class="main-content">
        <div class="topbar">
          <div>
            <div class="breadcrumb">${pageConfig.breadcrumb || ''}</div>
            <div class="page-title-row">
              <div class="page-title">${pageConfig.title || ''}</div>
              <div class="page-meta">${pageConfig.meta || ''}</div>
            </div>
          </div>
          <div class="topbar-right">
            <div class="search-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
              <span>Search beds, patients&hellip;</span>
              <span class="search-kbd">&#8984;K</span>
            </div>
            <a class="icon-btn" href="${pageConfig.presentHref || 'tv.html'}" target="_blank" rel="noopener" aria-label="Present on TV/monitor" title="Present on TV/monitor">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </a>
            <a class="icon-btn" href="alerts.html" aria-label="Alerts">
              ${svg('alerts')}
              ${alertBadge > 0 ? '<span class="dot"></span>' : ''}
            </a>
            <div class="topbar-avatar">${initials(name)}</div>
          </div>
        </div>
        <div id="page-body" class="stack"></div>
      </div>
    `;
  }

  function requireLogin() {
    const state = SMIS.Store.get();
    if (!state.session.role) { window.location.href = 'login.html'; return false; }
    return true;
  }

  return { render, requireLogin, NAV_ITEMS };
})();
