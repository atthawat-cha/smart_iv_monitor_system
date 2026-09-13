// Single bed-card view-model + renderer, reused by dashboard "urgent list", ward-detail grid,
// and the patients list' "view bed" link — so every screen agrees on the same bed's status.
window.SMIS = window.SMIS || {};

SMIS.BedCard = (function () {
  const RING_COLOR = { green: '#34d399', yellow: '#ffd166', orange: '#ff9d42', red: '#f5455c', gray: '#6b7280' };
  const PRIORITY_COLOR = {
    P1: { bg: 'rgba(245,69,92,0.18)', color: '#ff8a97' },
    P2: { bg: 'rgba(255,157,66,0.18)', color: '#ffb578' },
    P3: { bg: 'rgba(255,209,102,0.18)', color: '#ffdd8a' },
    P4: { bg: 'rgba(52,211,153,0.16)', color: '#86eec1' },
    OFFLINE: { bg: 'rgba(148,163,184,0.16)', color: '#cbd5e1' },
  };
  const DASHED_RING = 'repeating-conic-gradient(rgba(255,255,255,0.16) 0deg 10deg, transparent 10deg 20deg)';

  function ring(percent, color) {
    return `conic-gradient(${color} ${percent}%, rgba(255,255,255,0.10) 0)`;
  }

  function viewModel(state, bedId) {
    const bed = state.beds.find((b) => b.id === bedId);
    if (!bed) return null;
    const ward = state.wards.find((w) => w.id === bed.wardId);
    if (bed.status === 'vacant') {
      return { bed, ward, vacant: true, badgeText: 'VACANT', badgeColors: { bg: 'rgba(157,140,255,0.12)', color: '#9d8cff' } };
    }
    const device = state.devices.find((d) => d.id === bed.deviceId);
    const ivs = state.ivStatus[bedId] || {};
    const F = SMIS.Formulas;

    const offline = device && device.status === 'offline';
    const remainingPercent = ivs.remainingPercent || 0;
    const flowRate = ivs.flowRate || 0;
    const ete = F.computeEte(ivs.remainingMl || 0, flowRate);
    const isEmpty = !offline && remainingPercent <= 0;
    let band = offline ? 'OFFLINE' : (isEmpty ? 'P1' : F.priorityBand(ete));
    const bandLabel = offline ? 'OFFLINE' : (isEmpty ? 'EMPTY' : F.PRIORITY_BAND_LABEL[band]);
    let badgeText = offline ? 'OFFLINE' : `${band} · ${bandLabel}`;
    let badgeColors = PRIORITY_COLOR[offline ? 'OFFLINE' : band];
    const colorBand = offline ? 'gray' : F.colorBand(remainingPercent);
    const ringStyle = offline ? DASHED_RING : ring(remainingPercent, RING_COLOR[colorBand]);
    const urgent = !offline && band === 'P1' && !isEmpty;
    const occlusionAlert = SMIS.Alerts.openAlertOf(state, bedId, 'occlusion_suspected');
    const openAlert = SMIS.Alerts.openAlertOf(state, bedId, 'critical_low')
      || SMIS.Alerts.openAlertOf(state, bedId, 'empty')
      || SMIS.Alerts.openAlertOf(state, bedId, 'device_offline')
      || occlusionAlert;

    // An occlusion-suspected bed still has volume and a "fine-looking" ETE band, but flow has
    // stalled unexpectedly — that's a real concern a plain P4/NORMAL badge would hide. Flag it
    // with its own orange badge regardless of what the ETE-based band would otherwise say.
    const isOcclusion = !!(occlusionAlert && !offline && !isEmpty);
    if (isOcclusion) {
      band = 'P2';
      badgeText = 'OCCLUSION?';
      badgeColors = PRIORITY_COLOR.P2;
    }

    const fluidType = state.fluidTypes.find((f) => f.id === bed.fluidTypeId);

    return {
      bed, device, ward, ivs,
      remainingPercent, flowRate, ete,
      offline, isEmpty, isOcclusion, band, badgeText, badgeColors, colorBand, ringStyle, urgent,
      isMobility: !!ivs.isMobilityMode,
      note: bed.note,
      openAlert,
      fluidTypeName: fluidType ? fluidType.name : null,
      eteColor: offline ? '#cbd5e1' : (badgeColors ? badgeColors.color : '#e6ecf2'),
    };
  }

  function renderCard(vm) {
    const el = document.createElement('div');
    el.dataset.bedId = vm.bed.id;

    if (vm.vacant) {
      el.className = 'bed-card offline';
      el.innerHTML = `
        <div class="bed-card-head">
          <div>
            <div class="bed-no">${vm.bed.id}</div>
            <div class="bed-hn">No device assigned</div>
          </div>
          <div class="badge-pill" style="background:${vm.badgeColors.bg}; color:${vm.badgeColors.color};">${vm.badgeText}</div>
        </div>
        <div class="bed-note">Assign a device from Settings to start monitoring this bed.</div>
      `;
      return el;
    }

    el.className = 'bed-card' + (vm.urgent ? ' urgent' : '') + (vm.offline ? ' offline' : '') + (vm.isMobility ? ' mobility' : '');
    el.innerHTML = `
      ${vm.urgent ? `<div class="bed-live-badge"><span class="bed-live-dot"></span><span class="bed-live-label">LIVE</span></div>` : ''}
      <div class="bed-card-head">
        <div>
          <div class="bed-no">${vm.bed.id}</div>
          <div class="bed-hn">${vm.bed.patientHn}</div>
        </div>
        <div class="badge-pill" style="background:${vm.badgeColors.bg}; color:${vm.badgeColors.color};">${vm.badgeText}</div>
      </div>
      <div class="bed-body">
        <div class="bed-ring" style="background:${vm.ringStyle};">
          <div class="bed-ring-inner">${vm.offline ? '—' : Math.round(vm.remainingPercent) + '%'}</div>
        </div>
        <div class="bed-metrics">
          <div class="bed-metric-row"><span class="label">Remaining</span><span class="value">${vm.offline ? '—' : SMIS.Format.ml(vm.ivs.remainingMl)}</span></div>
          <div class="bed-metric-row"><span class="label">Flow rate</span><span class="value">${vm.offline ? '—' : SMIS.Format.flow(vm.flowRate)}</span></div>
          <div class="bed-metric-row"><span class="label">ETE</span><span class="value" style="color:${vm.eteColor}; font-weight:700;">${vm.offline ? '—' : SMIS.Format.ete(vm.ete)}</span></div>
        </div>
      </div>
      ${vm.isMobility ? `<div class="bed-mobility-tag">Temporary mobility</div>` : ''}
      ${vm.note ? `<div class="bed-note">${vm.note}</div>` : ''}
    `;
    return el;
  }

  function renderGrid(container, vms, onOpen) {
    container.innerHTML = '';
    if (vms.length === 0) {
      container.innerHTML = `<div class="empty-grid-note">No beds match this filter.</div>`;
      return;
    }
    vms.forEach((vm) => {
      const card = renderCard(vm);
      if (vm.vacant) { card.style.cursor = 'default'; } else { card.addEventListener('click', () => onOpen(vm.bed.id)); }
      container.appendChild(card);
    });
  }

  return { viewModel, renderCard, renderGrid, RING_COLOR, PRIORITY_COLOR, ring, DASHED_RING };
})();
