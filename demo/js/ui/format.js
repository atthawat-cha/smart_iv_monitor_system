window.SMIS = window.SMIS || {};

SMIS.Format = (function () {
  function timeAgo(ts) {
    if (!ts) return '—';
    const simNow = SMIS.Store.get().meta.simClockMs;
    const s = Math.max(0, Math.floor((simNow - ts) / 1000));
    if (s < 5) return 'Just now';
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  function ml(v) { return v == null ? '—' : `${Math.round(v)} ml`; }
  function flow(v) { return (v == null || v <= 0) ? '0.0 ml/min' : `${v.toFixed(1)} ml/min`; }
  function percent(v) { return v == null ? '—' : `${Math.round(v)}%`; }

  function ete(minutes) {
    if (minutes == null || !isFinite(minutes)) return '—';
    if (minutes <= 0) return 'Empty';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  }

  function clock(ts) {
    const d = new Date(ts);
    return d.toTimeString().slice(0, 5);
  }

  function dateTime(ts) {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toTimeString().slice(0, 5)}`;
  }

  return { timeAgo, ml, flow, percent, ete, clock, dateTime };
})();
