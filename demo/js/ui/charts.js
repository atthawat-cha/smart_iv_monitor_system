// Hand-rolled inline-SVG chart builders — no chart library, matching the sparkline already
// hand-built in 018 UXUI/Main.dc.html. Every function returns an HTML string.
window.SMIS = window.SMIS || {};

SMIS.Charts = (function () {
  function sparkline(points, opts) {
    opts = opts || {};
    const w = opts.width || 340, h = opts.height || 84;
    const color = opts.color || '#ff8a97';
    if (!points || points.length < 2) {
      return `<div class="chart-empty">Not enough history yet</div>`;
    }
    const values = points.map((p) => p.v);
    const min = Math.min(...values), max = Math.max(...values);
    const range = (max - min) || 1;
    const stepX = w / (points.length - 1);
    const coords = points.map((p, i) => {
      const x = i * stepX;
      const y = h - ((p.v - min) / range) * (h - 8) - 4;
      return [x, y];
    });
    const polyline = coords.map((c) => c.join(',')).join(' ');
    const area = `0,${h} ` + polyline + ` ${w},${h}`;
    const last = coords[coords.length - 1];
    const gradId = 'sparkFill' + Math.random().toString(36).slice(2, 8);
    return `
      <svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="${area}" fill="url(#${gradId})"/>
        <polyline points="${polyline}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${last[0]}" cy="${last[1]}" r="3.6" fill="${color}"/>
      </svg>`;
  }

  function multiLine(series, opts) {
    opts = opts || {};
    const w = opts.width || 560, h = opts.height || 160;
    const all = series.flatMap((s) => s.points.map((p) => p.v));
    if (all.length < 2) return `<div class="chart-empty">Not enough history yet</div>`;
    const min = Math.min(0, ...all), max = Math.max(...all) || 1;
    const range = (max - min) || 1;
    const lines = series.map((s) => {
      const stepX = w / Math.max(1, s.points.length - 1);
      const pts = s.points.map((p, i) => `${i * stepX},${h - ((p.v - min) / range) * (h - 10) - 5}`).join(' ');
      return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join('');
    return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${lines}</svg>`;
  }

  function donut(segments, opts) {
    opts = opts || {};
    const size = opts.size || 140;
    const stroke = opts.stroke || 20;
    const r = (size - stroke) / 2;
    const c = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = segments.reduce((a, s) => a + s.value, 0) || 1;
    let offset = 0;
    const arcs = segments.map((s) => {
      const frac = s.value / total;
      const dash = frac * circumference;
      const el = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${stroke}"
        stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" stroke-linecap="butt"
        transform="rotate(-90 ${c} ${c})"/>`;
      offset += dash;
      return el;
    }).join('');
    return `<svg class="chart-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="${stroke}"/>
      ${arcs}
      <text x="${c}" y="${c + 5}" text-anchor="middle" font-family="Space Grotesk" font-size="20" font-weight="700" fill="#f4f6fb">${total}</text>
    </svg>`;
  }

  function bars(items, opts) {
    opts = opts || {};
    const max = Math.max(...items.map((i) => i.value), 1);
    return `<div style="display:flex; flex-direction:column; gap:10px;">${items.map((i) => `
      <div>
        <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--text-tertiary); margin-bottom:4px;">
          <span>${i.label}</span><span style="color:var(--text-primary); font-weight:600;">${i.value}${opts.unit || ''}</span>
        </div>
        <div style="height:8px; border-radius:6px; background:rgba(255,255,255,0.06); overflow:hidden;">
          <div style="height:100%; width:${Math.max(2, (i.value / max) * 100)}%; background:${i.color || 'var(--accent)'}; border-radius:6px;"></div>
        </div>
      </div>`).join('')}</div>`;
  }

  return { sparkline, multiLine, donut, bars };
})();
