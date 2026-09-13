// Floating "Demo Control Panel" — lets a presenter skip past real-time waiting: speed up
// the simulation, force a bed straight into a scenario, jump the clock, or reset the demo.
window.SMIS = window.SMIS || {};

SMIS.ControlPanel = (function () {
  let collapsed = false;
  let selectedBed = null;

  const SCENARIOS = [
    { key: 'normal', label: 'Normal' },
    { key: 'criticalLow', label: 'Critical Low' },
    { key: 'empty', label: 'Empty' },
    { key: 'offline', label: 'Offline' },
    { key: 'occlusionSuspected', label: 'Occlusion' },
  ];
  const SPEEDS = [1, 5, 20, 60];

  function mount() {
    if (document.getElementById('smis-control-panel')) return;
    const el = document.createElement('div');
    el.id = 'smis-control-panel';
    el.className = 'control-panel';
    document.body.appendChild(el);
    render();
    SMIS.Store.subscribe(render);
  }

  function render() {
    const el = document.getElementById('smis-control-panel');
    if (!el) return;
    const state = SMIS.Store.get();
    if (!selectedBed && state.beds.length) selectedBed = state.beds[0].id;
    const speed = state.meta.simSpeedMultiplier || 1;

    el.classList.toggle('collapsed', collapsed);
    el.innerHTML = `
      <div class="control-panel-head">
        <span>Demo Control Panel</span>
        <button class="control-panel-toggle" data-action="toggle">${collapsed ? '▲' : '▼'}</button>
      </div>
      <div class="control-panel-body">
        <div>
          <div class="control-panel-section-title">Simulation speed</div>
          <div class="control-panel-row">
            ${SPEEDS.map((s) => `<button data-speed="${s}" class="${speed === s ? 'active' : ''}">${s}x</button>`).join('')}
            <button data-action="advance1">+1 min</button>
          </div>
        </div>
        <div>
          <div class="control-panel-section-title">Force scenario on bed</div>
          <select data-action="select-bed">
            ${state.beds.map((b) => `<option value="${b.id}" ${b.id === selectedBed ? 'selected' : ''}>${b.id} (${b.patientHn})</option>`).join('')}
          </select>
          <div class="control-panel-row" style="margin-top:6px;">
            ${SCENARIOS.map((s) => `<button data-scenario="${s.key}">${s.label}</button>`).join('')}
          </div>
        </div>
        <div>
          <div class="control-panel-section-title">Demo</div>
          <div class="control-panel-row">
            <button data-action="reset">Reset demo</button>
          </div>
        </div>
      </div>
    `;

    el.querySelector('[data-action="toggle"]').addEventListener('click', () => { collapsed = !collapsed; render(); });
    el.querySelectorAll('[data-speed]').forEach((btn) => {
      btn.addEventListener('click', () => SMIS.Actions.setSimSpeed(Number(btn.dataset.speed)));
    });
    el.querySelector('[data-action="advance1"]').addEventListener('click', () => SMIS.Actions.advanceMinutes(1));
    el.querySelector('[data-action="select-bed"]').addEventListener('change', (e) => { selectedBed = e.target.value; });
    el.querySelectorAll('[data-scenario]').forEach((btn) => {
      btn.addEventListener('click', () => SMIS.Actions.forceScenario(selectedBed, btn.dataset.scenario));
    });
    el.querySelector('[data-action="reset"]').addEventListener('click', () => {
      if (confirm('Reset the demo? This clears all simulated state.')) SMIS.Store.reset();
    });
  }

  return { mount };
})();
