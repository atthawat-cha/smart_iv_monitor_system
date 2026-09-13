(function () {
  function render() {
    const state = SMIS.Store.get();
    SMIS.Shell.render({ page: 'wards', breadcrumb: 'WARDS', title: 'Wards', meta: `${state.wards.length} wards · ${state.beds.length} beds total` });

    const body = document.getElementById('page-body');
    const cards = state.wards.map((ward) => {
      const beds = state.beds.filter((b) => b.wardId === ward.id);
      const vms = beds.map((b) => SMIS.BedCard.viewModel(state, b.id));
      const counts = { critical: 0, warning: 0, normal: 0, offline: 0, vacant: 0 };
      vms.forEach((vm) => {
        if (vm.vacant) counts.vacant++;
        else if (vm.offline) counts.offline++;
        else if (vm.band === 'P1') counts.critical++;
        else if (vm.band === 'P2' || vm.band === 'P3') counts.warning++;
        else counts.normal++;
      });
      return `
        <div class="card-panel ward-card">
          <a href="ward-detail.html?ward=${ward.id}" style="text-decoration:none; color:inherit;">
            <div class="ward-card-head">
              <div>
                <div class="ward-card-title">${ward.name}</div>
                <div class="ward-card-meta">${ward.building} · Floor ${ward.floor}</div>
              </div>
              <div class="ward-card-meta">${beds.length} beds</div>
            </div>
            <div class="ward-counts">
              <div class="ward-count c-critical">Critical<b>${counts.critical}</b></div>
              <div class="ward-count c-warning">Warning<b>${counts.warning}</b></div>
              <div class="ward-count c-normal">Normal<b>${counts.normal}</b></div>
              <div class="ward-count">Offline<b>${counts.offline}</b></div>
              <div class="ward-count">Vacant<b>${counts.vacant}</b></div>
            </div>
          </a>
          <a class="btn-chip" href="tv.html?ward=${ward.id}" target="_blank" rel="noopener" style="align-self:flex-start;">Present this ward &#8599;</a>
        </div>`;
    }).join('');

    body.innerHTML = `<div class="grid-3">${cards}</div>`;
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
