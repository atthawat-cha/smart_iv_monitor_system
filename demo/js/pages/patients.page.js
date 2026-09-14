(function () {
  const MOCK_NAMES = [
    'James Carter', 'Maria Gonzalez', 'Wei Chen', 'Aisha Khan', 'Liam O\'Brien',
    'Sofia Rossi', 'Noah Kim', 'Emma Johansson', 'Lucas Silva', 'Olivia Dubois',
    'Ethan Novak', 'Ava Petrov', 'Mason Lee', 'Isabella Rocha', 'Henry Okafor',
    'Mia Larsson', 'Daniel Abara', 'Chloe Martins', 'Ryan Patel', 'Grace Lindqvist',
    'Adam Sørensen', 'Lily Tanaka', 'Victor Hughes', 'Nora Haddad', 'Owen Fischer',
    'Zara Ahmed',
  ];

  const BAND_LABEL_COLOR = SMIS.BedCard.PRIORITY_COLOR;

  function render() {
    const state = SMIS.Store.get();
    const occupiedBeds = SMIS.Permissions.scopedBeds(state).filter((b) => b.status === 'occupied');
    SMIS.Shell.render({ page: 'patients', breadcrumb: 'PATIENTS', title: 'Patients', meta: `${occupiedBeds.length} patients admitted` });

    const rows = occupiedBeds.map((bed, i) => {
      const vm = SMIS.BedCard.viewModel(state, bed.id);
      const name = MOCK_NAMES[i % MOCK_NAMES.length];
      const badge = vm.offline ? BAND_LABEL_COLOR.OFFLINE : BAND_LABEL_COLOR[vm.band];
      const fluid = state.fluidTypes.find((f) => f.id === bed.fluidTypeId);
      return `
        <tr class="${vm.offline ? 'row-muted' : ''}" data-bed="${bed.id}">
          <td>${bed.patientHn}</td>
          <td>${name}</td>
          <td>${vm.ward ? vm.ward.name : ''}</td>
          <td>${bed.id}</td>
          <td>${fluid ? fluid.name : '—'}</td>
          <td><span class="badge-pill" style="background:${badge.bg}; color:${badge.color};">${vm.badgeText}</span></td>
          <td>${vm.offline ? '—' : SMIS.Format.percent(vm.remainingPercent)}</td>
          <td class="table-actions"><button class="btn-chip primary" data-view="${bed.id}">View</button></td>
        </tr>`;
    }).join('');

    document.getElementById('page-body').innerHTML = `
      <div class="card-panel" style="overflow-x:auto;">
        <table class="data-table">
          <thead><tr><th>HN</th><th>Name</th><th>Ward</th><th>Bed</th><th>Fluid</th><th>Status</th><th>Remaining</th><th></th></tr></thead>
          <tbody>${rows.length ? rows : '<tr><td colspan="8" style="text-align:center; color:var(--text-tertiary); padding:24px;">No patients admitted.</td></tr>'}</tbody>
        </table>
      </div>`;

    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => SMIS.Drawer.open(btn.dataset.view));
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
