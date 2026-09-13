// localStorage-backed state store. One page (whichever is open) ticks the engine and writes
// here; navigating to another .html file just re-loads the same blob, so the "backend" persists
// across the multi-page demo exactly like a real server would.
window.SMIS = window.SMIS || {};

SMIS.Store = (function () {
  const KEY = 'smis_demo_state_v1';
  const SCHEMA_VERSION = 2; // bump whenever seed.js's state shape changes, to force a clean reseed
  let state = null;
  let listeners = [];

  function seedFresh() {
    state = SMIS.Seed.build();
    state.schemaVersion = SCHEMA_VERSION;
    save();
    return state;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.schemaVersion === SCHEMA_VERSION) {
          state = parsed;
          return state;
        }
      }
    } catch (e) {
      console.warn('[SMIS] store load failed, reseeding', e);
    }
    return seedFresh();
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[SMIS] store save failed', e);
    }
  }

  function get() {
    return state;
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  }

  function publish() {
    listeners.forEach((fn) => {
      try { fn(state); } catch (e) { console.error('[SMIS] subscriber error', e); }
    });
  }

  function reset() {
    localStorage.removeItem(KEY);
    seedFresh();
    publish();
  }

  return { load, save, get, subscribe, publish, reset, KEY, SCHEMA_VERSION };
})();
