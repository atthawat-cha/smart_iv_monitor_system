(function () {
  let assigningBedId = null; // bed currently showing the inline "assign device" form

  function sliderRow(label, key, min, max, step, unit) {
    const state = SMIS.Store.get();
    const val = state.settings[key];
    return `
      <div class="field">
        <label>${label}</label>
        <div class="slider-row">
          <input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-setting="${key}">
          <div class="slider-value">${val}${unit}</div>
        </div>
      </div>`;
  }

  function assignFormRow(state, bed, wardName) {
    const unassignedDevices = state.devices.filter((d) => d.status === 'unassigned');
    if (!assigningBedId || assigningBedId !== bed.id) return '';
    if (unassignedDevices.length === 0) {
      return `<tr><td colspan="4"><div class="chart-empty" style="padding:10px 0;">No unassigned devices available — provision one below first.</div></td></tr>`;
    }
    return `
      <tr>
        <td colspan="4">
          <form data-assign-form="${bed.id}" style="display:flex; gap:8px; flex-wrap:wrap; align-items:flex-end; padding:10px 0;">
            <div class="field" style="min-width:150px;">
              <label>Device</label>
              <select name="deviceId">${unassignedDevices.map((d) => `<option value="${d.id}">${d.deviceCode}</option>`).join('')}</select>
            </div>
            <div class="field" style="min-width:150px;">
              <label>Fluid type</label>
              <select name="fluidTypeId">${state.fluidTypes.map((f) => `<option value="${f.id}">${f.name} (${f.defaultVolumeMl}ml)</option>`).join('')}</select>
            </div>
            <div class="field" style="min-width:120px;">
              <label>Patient HN (optional)</label>
              <input name="patientHn" placeholder="auto-generated">
            </div>
            <button class="btn accent" type="submit">Confirm assign</button>
            <button class="btn" type="button" data-cancel-assign="1">Cancel</button>
          </form>
        </td>
      </tr>`;
  }

  function render() {
    const state = SMIS.Store.get();
    SMIS.Shell.render({ page: 'settings', breadcrumb: 'SETTINGS', title: 'Settings', meta: 'Alert thresholds · wards, beds, devices, fluids & users' });

    if (!SMIS.Permissions.canManageSystem(state)) {
      document.getElementById('page-body').innerHTML = `<div class="not-authorized">This page is only available to superadmin accounts.<br>You're signed in as <b>${state.session.role.replace('_', ' ')}</b>.</div>`;
      return;
    }

    const wardOptions = state.wards.map((w) => `<option value="${w.id}">${w.name}</option>`).join('');
    const wardRows = state.wards.map((w) => `
      <tr><td>${w.name}</td><td>${w.building} · Floor ${w.floor}</td><td>${state.beds.filter((b) => b.wardId === w.id).length}</td>
      <td class="table-actions"><button class="btn-chip danger" data-del-ward="${w.id}">Delete</button></td></tr>`).join('');
    const userRows = state.users.map((u) => `<tr><td>${u.name}</td><td>${u.username}</td><td>${u.role.replace('_', ' ')}</td><td>${u.isActive ? 'Active' : 'Inactive'}</td></tr>`).join('');

    const fluidRows = state.fluidTypes.map((f) => `
      <tr><td>${f.name}</td><td>${f.defaultVolumeMl} ml</td>
      <td class="table-actions"><button class="btn-chip danger" data-del-fluid="${f.id}">Delete</button></td></tr>`).join('');

    const deviceRows = state.devices.map((d) => {
      const bed = state.beds.find((b) => b.deviceId === d.id);
      return `<tr><td>${d.deviceCode}</td><td>${bed ? bed.id : '<span style="color:var(--accent-strong);">Unassigned</span>'}</td>
        <td>${d.status.replace('_', ' ')}</td>
        <td class="table-actions">${!bed ? `<button class="btn-chip danger" data-del-device="${d.id}">Delete</button>` : ''}</td></tr>`;
    }).join('');

    const bedRows = state.beds.map((b) => {
      const ward = state.wards.find((w) => w.id === b.wardId);
      const fluid = state.fluidTypes.find((f) => f.id === b.fluidTypeId);
      const actions = b.status === 'vacant'
        ? `<button class="btn-chip primary" data-assign-bed="${b.id}">Assign device</button> <button class="btn-chip danger" data-del-bed="${b.id}">Delete</button>`
        : `<button class="btn-chip danger" data-unassign-bed="${b.id}">Unassign</button>`;
      return `
        <tr>
          <td>${b.id}</td><td>${ward ? ward.name : ''}</td>
          <td>${b.status === 'vacant' ? '<span style="color:var(--text-tertiary);">Vacant</span>' : b.patientHn}</td>
          <td>${fluid ? fluid.name : '—'}</td>
          <td class="table-actions">${actions}</td>
        </tr>
        ${assignFormRow(state, b, ward ? ward.name : '')}`;
    }).join('');

    document.getElementById('page-body').innerHTML = `
      <div class="card-panel" style="padding:18px; display:flex; flex-direction:column; gap:16px;">
        <div class="section-title">Alert Threshold Tuning</div>
        <div class="grid-2">
          ${sliderRow('Critical low threshold', 'criticalLowPct', 5, 40, 1, '%')}
          ${sliderRow('Device offline alert after', 'offlineAlertSec', 20, 180, 5, 's')}
          ${sliderRow('Device offline warning after', 'offlineWarnSec', 10, 90, 5, 's')}
          ${sliderRow('Occlusion detection window', 'occlusionWindowSec', 30, 600, 10, 's')}
        </div>
      </div>

      <div class="grid-2">
        <div class="card-panel" style="padding:18px;">
          <div class="section-title" style="margin-bottom:10px;">Wards</div>
          <table class="data-table"><thead><tr><th>Name</th><th>Location</th><th>Beds</th><th></th></tr></thead><tbody>${wardRows}</tbody></table>
          <form id="add-ward-form" style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <input class="field" style="flex:1; min-width:120px;" name="name" placeholder="Ward name" required>
            <input class="field" style="width:80px;" name="floor" placeholder="Floor" type="number">
            <input class="field" style="flex:1; min-width:120px;" name="building" placeholder="Building">
            <button class="btn accent" type="submit">Add ward</button>
          </form>
        </div>

        <div class="card-panel" style="padding:18px;">
          <div class="section-title" style="margin-bottom:10px;">Fluid Types</div>
          <div style="max-height:180px; overflow-y:auto;">
            <table class="data-table"><thead><tr><th>Name</th><th>Default volume</th><th></th></tr></thead><tbody>${fluidRows}</tbody></table>
          </div>
          <form id="add-fluid-form" style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <input class="field" style="flex:1; min-width:140px;" name="name" placeholder="e.g. 0.9% NSS" required>
            <input class="field" style="width:110px;" name="defaultVolumeMl" placeholder="ml" type="number" value="1000" required>
            <button class="btn accent" type="submit">Add fluid type</button>
          </form>
        </div>
      </div>

      <div class="grid-2">
        <div class="card-panel" style="padding:18px;">
          <div class="section-title" style="margin-bottom:10px;">Devices (IoT nodes)</div>
          <div style="max-height:220px; overflow-y:auto;">
            <table class="data-table"><thead><tr><th>Device</th><th>Assigned to</th><th>Status</th><th></th></tr></thead><tbody>${deviceRows}</tbody></table>
          </div>
          <form id="add-device-form" style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <input class="field" style="flex:1; min-width:140px;" name="deviceCode" placeholder="Device code, e.g. IV-10A-13" required>
            <input class="field" style="flex:1; min-width:100px;" name="firmwareVersion" placeholder="Firmware" value="1.0.0">
            <button class="btn accent" type="submit">Provision device</button>
          </form>
        </div>

        <div class="card-panel" style="padding:18px;">
          <div class="section-title" style="margin-bottom:10px;">Beds &amp; device assignment</div>
          <div style="max-height:220px; overflow-y:auto;">
            <table class="data-table"><thead><tr><th>Bed</th><th>Ward</th><th>Patient</th><th>Fluid</th><th></th></tr></thead><tbody>${bedRows}</tbody></table>
          </div>
          <form id="add-bed-form" style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <select name="wardId" class="field">${wardOptions}</select>
            <input class="field" name="bedNumber" placeholder="Bed number (e.g. 13)" required>
            <button class="btn accent" type="submit">Add vacant bed</button>
          </form>
        </div>
      </div>

      <div class="card-panel" style="padding:18px;">
        <div class="section-title" style="margin-bottom:10px;">Users</div>
        <table class="data-table"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th></tr></thead><tbody>${userRows}</tbody></table>
        <form id="add-user-form" style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
          <input class="field" style="flex:1; min-width:140px;" name="name" placeholder="Full name" required>
          <input class="field" style="flex:1; min-width:120px;" name="username" placeholder="Username" required>
          <select name="role" class="field">
            <option value="nurse">Nurse</option>
            <option value="head_nurse">Head Nurse</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Superadmin</option>
            <option value="guest">Guest / Public</option>
          </select>
          <button class="btn accent" type="submit">Add user</button>
        </form>
      </div>
    `;

    document.querySelectorAll('[data-setting]').forEach((input) => {
      input.addEventListener('input', (e) => {
        e.target.parentElement.querySelector('.slider-value').textContent = e.target.value + (input.dataset.setting.includes('Pct') ? '%' : 's');
      });
      input.addEventListener('change', (e) => SMIS.Actions.updateSettings({ [input.dataset.setting]: Number(e.target.value) }));
    });

    document.querySelectorAll('[data-del-ward]').forEach((btn) => btn.addEventListener('click', () => SMIS.Actions.deleteWard(btn.dataset.delWard)));
    document.querySelectorAll('[data-del-fluid]').forEach((btn) => btn.addEventListener('click', () => SMIS.Actions.deleteFluidType(btn.dataset.delFluid)));
    document.querySelectorAll('[data-del-device]').forEach((btn) => btn.addEventListener('click', () => {
      if (confirm(`Delete device ${btn.dataset.delDevice}?`)) SMIS.Actions.deleteDevice(btn.dataset.delDevice);
    }));
    document.querySelectorAll('[data-del-bed]').forEach((btn) => btn.addEventListener('click', () => {
      if (confirm(`Delete bed ${btn.dataset.delBed}?`)) SMIS.Actions.deleteBed(btn.dataset.delBed);
    }));
    document.querySelectorAll('[data-unassign-bed]').forEach((btn) => btn.addEventListener('click', () => {
      if (confirm(`Unassign the device from bed ${btn.dataset.unassignBed}? This discharges the current patient's monitoring.`)) {
        SMIS.Actions.unassignDevice(btn.dataset.unassignBed);
      }
    }));
    document.querySelectorAll('[data-assign-bed]').forEach((btn) => btn.addEventListener('click', () => {
      assigningBedId = btn.dataset.assignBed;
      render();
    }));
    document.querySelectorAll('[data-cancel-assign]').forEach((btn) => btn.addEventListener('click', () => {
      assigningBedId = null;
      render();
    }));
    document.querySelectorAll('[data-assign-form]').forEach((form) => form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      SMIS.Actions.assignDevice(form.dataset.assignForm, f.get('deviceId'), f.get('fluidTypeId'), f.get('patientHn'));
      assigningBedId = null;
    }));

    document.getElementById('add-ward-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      SMIS.Actions.addWard(f.get('name'), f.get('floor'), f.get('building'));
      e.target.reset();
    });
    document.getElementById('add-fluid-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      SMIS.Actions.addFluidType(f.get('name'), f.get('defaultVolumeMl'));
      e.target.reset();
    });
    document.getElementById('add-device-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      SMIS.Actions.addDevice(f.get('deviceCode'), f.get('firmwareVersion'));
      e.target.reset();
    });
    document.getElementById('add-bed-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      SMIS.Actions.addBed(f.get('wardId'), f.get('bedNumber'));
      e.target.reset();
    });
    document.getElementById('add-user-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      SMIS.Actions.addUser(f.get('name'), f.get('username'), f.get('role'));
      e.target.reset();
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
