import type { Article, ResourceItem } from '../types';
import { assetUrl } from './assetUrl';

/**
 * Generated editorial cover art.
 *
 * Every resource / article gets its own cover, derived deterministically from its slug
 * (same item -> same cover, different items -> different covers). The motif follows the
 * subject (justice -> scales, international relations -> globe, rules -> columns, ...),
 * while palette, geometry and decoration vary per item. Output is a self-contained SVG
 * data URI, so there are no extra files to host and nothing to 404.
 */

interface Palette {
  bg1: string;
  bg2: string;
  ink: string;
  accent: string;
}

const PALETTES: Palette[] = [
  { bg1: '#681F2B', bg2: '#35101A', ink: '#EFE8DA', accent: '#E3C27A' }, // burgundy
  { bg1: '#1F2D4A', bg2: '#0F1829', ink: '#EFE8DA', accent: '#D9A66B' }, // navy
  { bg1: '#2F4A3A', bg2: '#16281E', ink: '#EFE8DA', accent: '#E0C27A' }, // forest
  { bg1: '#2A5560', bg2: '#122E36', ink: '#EFE8DA', accent: '#E6B979' }, // teal
  { bg1: '#4B2A4A', bg2: '#251326', ink: '#EFE8DA', accent: '#E8C08A' }, // plum
  { bg1: '#5A4326', bg2: '#2B2012', ink: '#F4EAD3', accent: '#F0D9A0' }, // umber
  { bg1: '#34404F', bg2: '#181F28', ink: '#EFE8DA', accent: '#DDB36E' }, // slate
  { bg1: '#7A3B22', bg2: '#3C1B0E', ink: '#F4EAD3', accent: '#EBC987' }, // terracotta
];

type Rng = () => number;
type Motif = (r: Rng, p: Palette, cx: number, cy: number) => string;

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number): Rng {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

/* ----------------------------- motifs ----------------------------- */

const scales: Motif = (r, p, cx, cy) => {
  const w = 130 + r() * 40;
  const tilt = (r() - 0.5) * 16;
  const top = cy - 70;
  const pan = (x: number, filled: boolean) => `
    <line x1="${f(x)}" y1="${top}" x2="${f(x - 52)}" y2="${top + 78}" stroke="${p.ink}" stroke-width="2"/>
    <line x1="${f(x)}" y1="${top}" x2="${f(x + 52)}" y2="${top + 78}" stroke="${p.ink}" stroke-width="2"/>
    <path d="M ${f(x - 62)} ${top + 78} A 62 32 0 0 0 ${f(x + 62)} ${top + 78} Z"
      fill="${filled ? p.accent : p.ink}" fill-opacity="${filled ? 0.95 : 0.18}" stroke="${p.ink}" stroke-width="2"/>`;
  return `
    <line x1="${cx}" y1="${top}" x2="${cx}" y2="${cy + 110}" stroke="${p.ink}" stroke-width="3"/>
    <line x1="${cx - 70}" y1="${cy + 110}" x2="${cx + 70}" y2="${cy + 110}" stroke="${p.ink}" stroke-width="4"/>
    <g transform="rotate(${f(tilt)} ${cx} ${top})">
      <line x1="${f(cx - w)}" y1="${top}" x2="${f(cx + w)}" y2="${top}" stroke="${p.ink}" stroke-width="4" stroke-linecap="round"/>
      ${pan(cx - w, r() > 0.5)}
      ${pan(cx + w, r() > 0.5)}
    </g>
    <circle cx="${cx}" cy="${top}" r="10" fill="${p.accent}" stroke="${p.ink}" stroke-width="2"/>`;
};

const globe: Motif = (r, p, cx, cy) => {
  const R = 105 + r() * 25;
  const tilt = (r() - 0.5) * 50;
  const meridians = [0.25, 0.55, 0.85].map(
    (k) => `<ellipse cx="${cx}" cy="${cy}" rx="${f(R * k)}" ry="${R}" fill="none" stroke="${p.ink}" stroke-opacity="0.8" stroke-width="1.6"/>`
  );
  const lats = [-0.55, -0.2, 0.2, 0.55].map((k) => {
    const y = cy + R * k;
    const half = Math.sqrt(R * R - (R * k) ** 2);
    return `<line x1="${f(cx - half)}" y1="${f(y)}" x2="${f(cx + half)}" y2="${f(y)}" stroke="${p.ink}" stroke-opacity="0.7" stroke-width="1.4"/>`;
  });
  const ang = r() * Math.PI * 2;
  const ox = R * 1.55;
  const oy = R * 0.42;
  const dx = Math.cos(ang) * ox;
  const dy = Math.sin(ang) * oy;
  return `
    <circle cx="${cx}" cy="${cy}" r="${f(R)}" fill="${p.ink}" fill-opacity="0.07" stroke="${p.ink}" stroke-width="2.5"/>
    <g transform="rotate(${f(tilt)} ${cx} ${cy})">
      ${meridians.join('')}${lats.join('')}
      <ellipse cx="${cx}" cy="${cy}" rx="${f(ox)}" ry="${f(oy)}" fill="none" stroke="${p.accent}" stroke-width="2" stroke-dasharray="3 7"/>
      <circle cx="${f(cx + dx)}" cy="${f(cy + dy)}" r="10" fill="${p.accent}"/>
    </g>`;
};

const columns: Motif = (r, p, cx, cy) => {
  const n = 4 + Math.floor(r() * 3);
  const cw = 30;
  const gap = 24;
  const total = n * cw + (n - 1) * gap;
  const x0 = cx - total / 2;
  const hi = Math.floor(r() * n);
  const top = cy - 40;
  const bottom = cy + 95;
  const cols = Array.from({ length: n }, (_, i) => {
    const x = x0 + i * (cw + gap);
    const flutes = [0.33, 0.66]
      .map((k) => `<line x1="${f(x + cw * k)}" y1="${top + 8}" x2="${f(x + cw * k)}" y2="${bottom - 6}" stroke="${p.ink}" stroke-opacity="0.45" stroke-width="1.3"/>`)
      .join('');
    return `<rect x="${f(x)}" y="${top}" width="${cw}" height="${bottom - top}" fill="${i === hi ? p.accent : p.ink}" fill-opacity="${i === hi ? 0.9 : 0.14}" stroke="${p.ink}" stroke-width="2"/>${i === hi ? '' : flutes}`;
  }).join('');
  return `
    <path d="M ${f(x0 - 34)} ${top - 8} L ${cx} ${top - 80} L ${f(x0 + total + 34)} ${top - 8} Z" fill="${p.ink}" fill-opacity="0.1" stroke="${p.ink}" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="${f(x0 - 34)}" y="${top - 8}" width="${f(total + 68)}" height="14" fill="${p.ink}" fill-opacity="0.2" stroke="${p.ink}" stroke-width="2"/>
    ${cols}
    <rect x="${f(x0 - 34)}" y="${bottom}" width="${f(total + 68)}" height="14" fill="${p.ink}" fill-opacity="0.2" stroke="${p.ink}" stroke-width="2"/>
    <rect x="${f(x0 - 54)}" y="${bottom + 14}" width="${f(total + 108)}" height="14" fill="${p.ink}" fill-opacity="0.12" stroke="${p.ink}" stroke-width="2"/>`;
};

const grid: Motif = (r, p, cx, cy) => {
  const cols = 5;
  const rows = 4;
  const s = 46;
  const g = 10;
  const w = cols * s + (cols - 1) * g;
  const h = rows * s + (rows - 1) * g;
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const cells: string[] = [];
  const hits: Array<[number, number]> = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = x0 + i * (s + g);
      const y = y0 + j * (s + g);
      const v = r();
      const hot = v > 0.8;
      if (hot) hits.push([x + s / 2, y + s / 2]);
      cells.push(
        `<rect x="${f(x)}" y="${f(y)}" width="${s}" height="${s}" rx="6" fill="${hot ? p.accent : p.ink}" fill-opacity="${hot ? 0.95 : v > 0.45 ? 0.2 : 0.07}" stroke="${p.ink}" stroke-opacity="${hot ? 1 : 0.7}" stroke-width="1.8"/>`
      );
    }
  }
  const path = hits.length > 1 ? `<polyline points="${hits.map((h) => `${f(h[0])},${f(h[1])}`).join(' ')}" fill="none" stroke="${p.ink}" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="2 8" stroke-linecap="round"/>` : '';
  return cells.join('') + path;
};

const network: Motif = (r, p, cx, cy) => {
  const n = 10 + Math.floor(r() * 4);
  const pts = Array.from({ length: n }, () => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r());
    return { x: cx + Math.cos(a) * d * 190, y: cy + Math.sin(a) * d * 110, r: 5 + r() * 8 };
  });
  const edges: string[] = [];
  pts.forEach((a, i) => {
    pts
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((u, v) => u.d - v.d)
      .slice(0, 2)
      .forEach((o) => {
        const b = pts[o.j];
        edges.push(`<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" stroke="${p.ink}" stroke-opacity="0.65" stroke-width="1.6"/>`);
      });
  });
  const hot = new Set([Math.floor(r() * n), Math.floor(r() * n)]);
  const nodes = pts
    .map((a, i) => `<circle cx="${f(a.x)}" cy="${f(a.y)}" r="${f(a.r)}" fill="${hot.has(i) ? p.accent : p.ink}" fill-opacity="${hot.has(i) ? 1 : 0.22}" stroke="${p.ink}" stroke-width="2"/>`)
    .join('');
  return edges.join('') + nodes;
};

const waves: Motif = (r, p, cx, cy) => {
  const bands = 6;
  const out: string[] = [];
  const bottom = cy + 112;
  const crest = { x: cx + 96, y: cy };
  for (let k = 0; k < bands; k++) {
    const base = cy - 70 + k * 26;
    const amp = 10 + r() * 18;
    const freq = 0.011 + r() * 0.012;
    const phase = r() * 6;
    const pts: string[] = [];
    for (let x = cx - 210; x <= cx + 210; x += 7) {
      const y = base + amp * Math.sin(x * freq + phase);
      pts.push(`${x},${f(y)}`);
      if (k === 1 && x >= cx + 96 && crest.x === cx + 96 && Math.abs(x - (cx + 96)) < 7) crest.y = y;
    }
    const line = pts.join(' ');
    out.push(`<polygon points="${line} ${cx + 210},${bottom} ${cx - 210},${bottom}" fill="${p.ink}" fill-opacity="${(0.05 + k * 0.035).toFixed(3)}"/>`);
    out.push(`<polyline points="${line}" fill="none" stroke="${p.ink}" stroke-opacity="${(0.95 - k * 0.08).toFixed(2)}" stroke-width="${k === 1 ? 3.4 : 2.2}" stroke-linecap="round"/>`);
  }
  return `${out.join('')}
    <circle cx="${crest.x}" cy="${f(crest.y)}" r="13" fill="${p.accent}" stroke="${p.ink}" stroke-width="2.4"/>`;
};

const sun: Motif = (r, p, cx, cy) => {
  const rays = 22 + Math.floor(r() * 8);
  const out: string[] = [];
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const len = 26 + r() * 52;
    const r0 = 78;
    out.push(`<line x1="${f(cx + Math.cos(a) * r0)}" y1="${f(cy - 10 + Math.sin(a) * r0)}" x2="${f(cx + Math.cos(a) * (r0 + len))}" y2="${f(cy - 10 + Math.sin(a) * (r0 + len))}" stroke="${p.ink}" stroke-opacity="0.85" stroke-width="2.4" stroke-linecap="round"/>`);
  }
  return `${out.join('')}
    <circle cx="${cx}" cy="${cy - 10}" r="58" fill="${p.accent}" stroke="${p.ink}" stroke-width="2.5"/>
    <path d="M ${cx - 230} ${cy + 120} Q ${cx - 90} ${cy + 40} ${cx} ${cy + 78} T ${cx + 230} ${cy + 100} L ${cx + 230} ${cy + 140} L ${cx - 230} ${cy + 140} Z" fill="${p.ink}" fill-opacity="0.16" stroke="${p.ink}" stroke-width="2"/>`;
};

const speech: Motif = (r, p, cx, cy) => {
  const flip = r() > 0.5 ? -1 : 1;
  const lines = (x: number, y: number, w: number, n: number) =>
    Array.from({ length: n }, (_, i) => `<line x1="${f(x)}" y1="${f(y + i * 20)}" x2="${f(x + w * (i === n - 1 ? 0.55 : 1))}" y2="${f(y + i * 20)}" stroke="${p.ink}" stroke-opacity="0.6" stroke-width="3.2" stroke-linecap="round"/>`).join('');
  return `
    <g transform="translate(${flip === -1 ? 2 * cx : 0} 0) scale(${flip} 1)">
      <rect x="${cx - 200}" y="${cy - 100}" width="250" height="118" rx="24" fill="${p.ink}" fill-opacity="0.12" stroke="${p.ink}" stroke-width="2.5"/>
      <path d="M ${cx - 150} ${cy + 17} L ${cx - 168} ${cy + 52} L ${cx - 110} ${cy + 17} Z" fill="${p.ink}" fill-opacity="0.12" stroke="${p.ink}" stroke-width="2.5" stroke-linejoin="round"/>
      ${lines(cx - 170, cy - 62, 190, 3)}
      <rect x="${cx - 20}" y="${cy - 10}" width="230" height="110" rx="24" fill="${p.accent}" fill-opacity="0.95" stroke="${p.ink}" stroke-width="2.5"/>
      <path d="M ${cx + 150} ${cy + 99} L ${cx + 176} ${cy + 130} L ${cx + 110} ${cy + 99} Z" fill="${p.accent}" stroke="${p.ink}" stroke-width="2.5" stroke-linejoin="round"/>
      ${[0, 1, 2].map((i) => `<circle cx="${cx + 50 + i * 40}" cy="${cy + 45}" r="9" fill="${p.bg2}" fill-opacity="0.85"/>`).join('')}
    </g>`;
};

const compass: Motif = (r, p, cx, cy) => {
  const R = 112 + r() * 14;
  const rot = Math.floor(r() * 90) - 45;
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const long = i % 3 === 0;
    const r1 = R - (long ? 16 : 9);
    return `<line x1="${f(cx + Math.cos(a) * r1)}" y1="${f(cy + Math.sin(a) * r1)}" x2="${f(cx + Math.cos(a) * R)}" y2="${f(cy + Math.sin(a) * R)}" stroke="${p.ink}" stroke-opacity="0.85" stroke-width="${long ? 2.4 : 1.4}"/>`;
  }).join('');
  const star = (len: number, w: number, fill: string, op: number) =>
    `<path d="M ${cx} ${f(cy - len)} L ${f(cx + w)} ${cy} L ${cx} ${f(cy + len)} L ${f(cx - w)} ${cy} Z" fill="${fill}" fill-opacity="${op}" stroke="${p.ink}" stroke-width="2" stroke-linejoin="round"/>`;
  return `
    <circle cx="${cx}" cy="${cy}" r="${f(R)}" fill="${p.ink}" fill-opacity="0.06" stroke="${p.ink}" stroke-width="2.5"/>
    ${ticks}
    <g transform="rotate(${rot} ${cx} ${cy})">
      <g transform="rotate(45 ${cx} ${cy})">${star(R * 0.62, 12, p.ink, 0.2)}</g>
      <g transform="rotate(90 ${cx} ${cy})">${star(R * 0.78, 16, p.ink, 0.25)}</g>
      ${star(R * 0.78, 16, p.accent, 0.95)}
    </g>
    <circle cx="${cx}" cy="${cy}" r="7" fill="${p.bg2}" stroke="${p.ink}" stroke-width="2"/>`;
};

const topo: Motif = (r, p, cx, cy) => {
  const rings = 6;
  const ph1 = r() * 6;
  const ph2 = r() * 6;
  const paths = Array.from({ length: rings }, (_, k) => {
    const base = 28 + k * 26;
    const pts: string[] = [];
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const rr = base * (1 + 0.14 * Math.sin(a * 3 + ph1 + k * 0.4) + 0.08 * Math.sin(a * 5 + ph2));
      pts.push(`${f(cx + Math.cos(a) * rr * 1.45)},${f(cy + Math.sin(a) * rr * 0.95)}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="${p.ink}" fill-opacity="${k === rings - 1 ? 0.05 : 0.02}" stroke="${p.ink}" stroke-opacity="${0.95 - k * 0.1}" stroke-width="${k % 3 === 0 ? 2.4 : 1.5}" stroke-linejoin="round"/>`;
  }).join('');
  const px = cx + (r() - 0.5) * 70;
  const py = cy + (r() - 0.5) * 40;
  return `${paths}
    <path d="M ${f(px)} ${f(py + 4)} C ${f(px - 26)} ${f(py - 28)} ${f(px - 18)} ${f(py - 58)} ${f(px)} ${f(py - 58)} C ${f(px + 18)} ${f(py - 58)} ${f(px + 26)} ${f(py - 28)} ${f(px)} ${f(py + 4)} Z" fill="${p.accent}" stroke="${p.ink}" stroke-width="2.4" stroke-linejoin="round"/>
    <circle cx="${f(px)}" cy="${f(py - 36)}" r="8" fill="${p.bg2}"/>`;
};

const book: Motif = (r, p, cx, cy) => {
  const page = (s: number) => `
    <path d="M ${cx} ${cy - 62} Q ${cx + s * 85} ${cy - 96} ${cx + s * 175} ${cy - 66} L ${cx + s * 175} ${cy + 84} Q ${cx + s * 85} ${cy + 52} ${cx} ${cy + 86} Z" fill="${p.ink}" fill-opacity="0.13" stroke="${p.ink}" stroke-width="2.5" stroke-linejoin="round"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M ${cx + s * 22} ${cy - 40 + i * 24} Q ${cx + s * 85} ${cy - 64 + i * 24} ${cx + s * (i === 4 ? 100 : 150)} ${cy - 44 + i * 24}" fill="none" stroke="${p.ink}" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round"/>`).join('')}`;
  const ribbonX = cx + (r() > 0.5 ? 1 : -1) * (40 + r() * 70);
  return `${page(-1)}${page(1)}
    <line x1="${cx}" y1="${cy - 62}" x2="${cx}" y2="${cy + 86}" stroke="${p.ink}" stroke-width="3"/>
    <path d="M ${f(ribbonX)} ${cy - 76} L ${f(ribbonX)} ${cy - 6} L ${f(ribbonX + 14)} ${cy - 20} L ${f(ribbonX + 28)} ${cy - 6} L ${f(ribbonX + 28)} ${cy - 80} Z" fill="${p.accent}" stroke="${p.ink}" stroke-width="2" stroke-linejoin="round"/>`;
};

const tree: Motif = (r, p, cx, cy) => {
  const levels = 4;
  const W = 450;
  const topY = cy - 92;
  const dy = 55;
  type N = { x: number; y: number };
  const rows: Array<Array<N | null>> = [[{ x: cx, y: topY }]];
  const edges: string[] = [];
  for (let l = 1; l <= levels; l++) {
    const row: Array<N | null> = [];
    rows[l - 1].forEach((par, i) => {
      [0, 1].forEach((c) => {
        const idx = i * 2 + c;
        const x = cx - W / 2 + ((idx + 0.5) * W) / 2 ** l;
        const keep = par && (l < 3 || r() > 0.28);
        const n = keep ? { x: x + (r() - 0.5) * 8, y: topY + l * dy } : null;
        row.push(n);
        if (par && n) edges.push(`<line x1="${f(par.x)}" y1="${f(par.y)}" x2="${f(n.x)}" y2="${f(n.y)}" stroke="${p.ink}" stroke-opacity="0.8" stroke-width="2"/>`);
      });
    });
    rows.push(row);
  }
  const leaves = rows[levels].filter(Boolean) as N[];
  const hot = leaves[Math.floor(r() * leaves.length)];
  const nodes = rows
    .flat()
    .filter(Boolean)
    .map((n) => {
      const nn = n as N;
      const isHot = hot && nn.x === hot.x && nn.y === hot.y;
      return `<rect x="${f(nn.x - 8)}" y="${f(nn.y - 8)}" width="16" height="16" rx="4.5" fill="${isHot ? p.accent : p.ink}" fill-opacity="${isHot ? 1 : 0.2}" stroke="${p.ink}" stroke-width="2"/>`;
    })
    .join('');
  return edges.join('') + nodes;
};

const dna: Motif = (r, p, cx, cy) => {
  const tilt = (r() - 0.5) * 36;
  const amp = 56;
  const freq = 0.026 + r() * 0.01;
  const ph = r() * 6;
  const a: string[] = [];
  const b: string[] = [];
  const rungs: string[] = [];
  for (let x = cx - 200; x <= cx + 200; x += 6) {
    a.push(`${x},${f(cy + amp * Math.sin(x * freq + ph))}`);
    b.push(`${x},${f(cy - amp * Math.sin(x * freq + ph))}`);
  }
  for (let x = cx - 196; x <= cx + 196; x += 20) {
    const y = amp * Math.sin(x * freq + ph);
    rungs.push(`<line x1="${x}" y1="${f(cy + y)}" x2="${x}" y2="${f(cy - y)}" stroke="${p.ink}" stroke-opacity="0.55" stroke-width="2"/><circle cx="${x}" cy="${f(cy + y)}" r="4.5" fill="${p.accent}"/><circle cx="${x}" cy="${f(cy - y)}" r="4.5" fill="${p.ink}" fill-opacity="0.85"/>`);
  }
  return `<g transform="rotate(${f(tilt)} ${cx} ${cy})">${rungs.join('')}
    <polyline points="${a.join(' ')}" fill="none" stroke="${p.ink}" stroke-width="3.4" stroke-linecap="round"/>
    <polyline points="${b.join(' ')}" fill="none" stroke="${p.accent}" stroke-width="3.4" stroke-linecap="round"/></g>`;
};

const bars: Motif = (r, p, cx, cy) => {
  const n = 7;
  const bw = 34;
  const gap = 16;
  const x0 = cx - (n * bw + (n - 1) * gap) / 2;
  const base = cy + 100;
  const pts: string[] = [];
  const out = Array.from({ length: n }, (_, i) => {
    const h = 40 + i * 21 + r() * 26;
    const x = x0 + i * (bw + gap);
    const top = base - h;
    pts.push(`${f(x + bw / 2)},${f(top - 16)}`);
    const last = i === n - 1;
    return `<rect x="${f(x)}" y="${f(top)}" width="${bw}" height="${f(h)}" rx="3" fill="${last ? p.accent : p.ink}" fill-opacity="${last ? 0.95 : 0.15 + i * 0.03}" stroke="${p.ink}" stroke-width="2"/>`;
  }).join('');
  return `<line x1="${x0 - 20}" y1="${base}" x2="${f(cx + (n * bw + (n - 1) * gap) / 2 + 20)}" y2="${base}" stroke="${p.ink}" stroke-width="3"/>${out}
    <polyline points="${pts.join(' ')}" fill="none" stroke="${p.ink}" stroke-width="2.4" stroke-dasharray="2 8" stroke-linecap="round"/>`;
};

const target: Motif = (r, p, cx, cy) => {
  const R = 112;
  const rings = [1, 0.74, 0.48, 0.22].map((k, i) => `<circle cx="${cx}" cy="${cy}" r="${f(R * k)}" fill="${i % 2 === 0 ? p.ink : p.accent}" fill-opacity="${i % 2 === 0 ? 0.12 : i === 3 ? 0.95 : 0.35}" stroke="${p.ink}" stroke-width="2.4"/>`).join('');
  const ang = -Math.PI / 4 + (r() - 0.5) * 0.7;
  const len = 190;
  const tx = cx + Math.cos(ang) * 8;
  const ty = cy + Math.sin(ang) * 8;
  const ex = cx + Math.cos(ang) * len;
  const ey = cy + Math.sin(ang) * len;
  const fl = [0, 1, 2].map((i) => {
    const t = 0.78 + i * 0.07;
    const bx = tx + (ex - tx) * t;
    const by = ty + (ey - ty) * t;
    const px = -Math.sin(ang) * 11;
    const py = Math.cos(ang) * 11;
    return `<line x1="${f(bx)}" y1="${f(by)}" x2="${f(bx + px + Math.cos(ang) * 12)}" y2="${f(by + py + Math.sin(ang) * 12)}" stroke="${p.ink}" stroke-width="3" stroke-linecap="round"/><line x1="${f(bx)}" y1="${f(by)}" x2="${f(bx - px + Math.cos(ang) * 12)}" y2="${f(by - py + Math.sin(ang) * 12)}" stroke="${p.ink}" stroke-width="3" stroke-linecap="round"/>`;
  }).join('');
  return `${rings}<line x1="${f(tx)}" y1="${f(ty)}" x2="${f(ex)}" y2="${f(ey)}" stroke="${p.ink}" stroke-width="4" stroke-linecap="round"/>${fl}`;
};

const bulb: Motif = (r, p, cx, cy) => {
  const rays = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI + (i / 10) * Math.PI;
    const r0 = 96 + r() * 6;
    const r1 = r0 + 22 + r() * 24;
    return `<line x1="${f(cx + Math.cos(a) * r0)}" y1="${f(cy - 24 + Math.sin(a) * r0)}" x2="${f(cx + Math.cos(a) * r1)}" y2="${f(cy - 24 + Math.sin(a) * r1)}" stroke="${p.ink}" stroke-opacity="0.8" stroke-width="2.6" stroke-linecap="round"/>`;
  }).join('');
  return `${rays}
    <circle cx="${cx}" cy="${cy - 24}" r="72" fill="${p.accent}" fill-opacity="0.92" stroke="${p.ink}" stroke-width="3"/>
    <path d="M ${cx - 24} ${cy + 36} L ${cx - 24} ${cy + 66} L ${cx + 24} ${cy + 66} L ${cx + 24} ${cy + 36}" fill="${p.ink}" fill-opacity="0.18" stroke="${p.ink}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="${cx - 24}" y="${cy + 66}" width="48" height="12" rx="4" fill="${p.ink}" fill-opacity="0.25" stroke="${p.ink}" stroke-width="2.4"/>
    <rect x="${cx - 17}" y="${cy + 78}" width="34" height="10" rx="4" fill="${p.ink}" fill-opacity="0.25" stroke="${p.ink}" stroke-width="2.4"/>
    <path d="M ${cx - 20} ${cy + 36} L ${cx - 20} ${cy - 2} Q ${cx - 4} ${cy - 22} ${cx} ${cy - 2} Q ${cx + 4} ${cy - 22} ${cx + 20} ${cy - 2} L ${cx + 20} ${cy + 36}" fill="none" stroke="${p.bg2}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
};

const lock: Motif = (r, p, cx, cy) => `
    <path d="M ${cx - 52} ${cy - 8} L ${cx - 52} ${cy - 56} A 52 52 0 0 1 ${cx + 52} ${cy - 56} L ${cx + 52} ${cy - 8}" fill="none" stroke="${p.ink}" stroke-width="14" stroke-linecap="round"/>
    <path d="M ${cx - 52} ${cy - 8} L ${cx - 52} ${cy - 56} A 52 52 0 0 1 ${cx + 52} ${cy - 56} L ${cx + 52} ${cy - 8}" fill="none" stroke="${p.bg1}" stroke-width="6" stroke-linecap="round"/>
    <rect x="${cx - 88}" y="${cy - 8}" width="176" height="130" rx="18" fill="${p.ink}" fill-opacity="0.16" stroke="${p.ink}" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy + 42}" r="20" fill="${p.accent}" stroke="${p.ink}" stroke-width="2.6"/>
    <path d="M ${cx - 7} ${cy + 56} L ${cx - 12} ${cy + 94} L ${cx + 12} ${cy + 94} L ${cx + 7} ${cy + 56} Z" fill="${p.accent}" stroke="${p.ink}" stroke-width="2.6" stroke-linejoin="round"/>
    <circle cx="${cx}" cy="${cy + 42}" r="7" fill="${p.bg2}"/>`;

const gavel: Motif = (r, p, cx, cy) => {
  const rot = -28 + (r() - 0.5) * 16;
  return `
    <ellipse cx="${cx}" cy="${cy + 108}" rx="150" ry="22" fill="${p.ink}" fill-opacity="0.14" stroke="${p.ink}" stroke-width="2.6"/>
    <rect x="${cx - 82}" y="${cy + 74}" width="164" height="34" rx="8" fill="${p.ink}" fill-opacity="0.22" stroke="${p.ink}" stroke-width="2.6"/>
    <g transform="rotate(${f(rot)} ${cx} ${cy + 20})">
      <rect x="${cx - 12}" y="${cy - 10}" width="24" height="170" rx="10" fill="${p.ink}" fill-opacity="0.2" stroke="${p.ink}" stroke-width="2.6"/>
      <rect x="${cx - 88}" y="${cy - 62}" width="176" height="64" rx="14" fill="${p.accent}" fill-opacity="0.95" stroke="${p.ink}" stroke-width="3"/>
      <line x1="${cx - 56}" y1="${cy - 62}" x2="${cx - 56}" y2="${cy + 2}" stroke="${p.ink}" stroke-width="2.4"/>
      <line x1="${cx + 56}" y1="${cy - 62}" x2="${cx + 56}" y2="${cy + 2}" stroke="${p.ink}" stroke-width="2.4"/>
    </g>`;
};

const steps: Motif = (r, p, cx, cy) => {
  const n = 5;
  const h = 36;
  const out = Array.from({ length: n }, (_, i) => {
    const w = 360 - i * 66;
    const y = cy + 100 - (i + 1) * h;
    const top = i === n - 1;
    return `<rect x="${f(cx - w / 2)}" y="${y}" width="${w}" height="${h}" fill="${top ? p.accent : p.ink}" fill-opacity="${top ? 0.95 : 0.1 + i * 0.05}" stroke="${p.ink}" stroke-width="2.4"/>`;
  }).join('');
  const flag = r() > 0.5;
  return `${out}${flag ? `<line x1="${cx}" y1="${cy - 80}" x2="${cx}" y2="${cy - 38}" stroke="${p.ink}" stroke-width="3"/><path d="M ${cx} ${cy - 80} L ${cx + 34} ${cy - 68} L ${cx} ${cy - 56} Z" fill="${p.ink}" stroke="${p.ink}" stroke-width="2" stroke-linejoin="round"/>` : ''}`;
};

const arrows: Motif = (r, p, cx, cy) => {
  const rows = 3;
  const out: string[] = [];
  for (let j = 0; j < rows; j++) {
    const y = cy - 70 + j * 70;
    const off = (r() - 0.5) * 60;
    const n = 4 + Math.floor(r() * 2);
    const hot = Math.floor(r() * n);
    for (let i = 0; i < n; i++) {
      const x = cx - 150 + off + i * 58;
      out.push(`<polyline points="${f(x)},${y - 26} ${f(x + 28)},${y} ${f(x)},${y + 26}" fill="none" stroke="${i === hot && j === 1 ? p.accent : p.ink}" stroke-opacity="${i === hot && j === 1 ? 1 : 0.35 + i * 0.12}" stroke-width="${i === hot && j === 1 ? 9 : 6}" stroke-linecap="round" stroke-linejoin="round"/>`);
    }
  }
  return out.join('');
};

const MOTIFS: Record<string, Motif> = {
  scales, globe, columns, grid, network, waves, sun, speech,
  compass, topo, book, tree, dna, bars, target, bulb, lock, gavel, steps, arrows,
};
const MOTIF_ORDER = Object.keys(MOTIFS);

/** Subject -> pool of fitting motifs. The item's hash picks one, so related items still differ. */
const MOTIF_RULES: Array<[RegExp, string[]]> = [
  [/(bioethic|genetic|health|pharma|medical|patent|innovation)/, ['dna', 'lock', 'scales', 'sun']],
  [/\b(ai|artificial intelligence|technology|open[- ]source|digital|algorithm|data)\b/, ['network', 'bulb', 'grid', 'lock']],
  [/(environment|climate|carbon|ecotage|activis)/, ['sun', 'topo', 'tree', 'waves']],
  [/(education|equity|welfare|gender|feminis)/, ['book', 'steps', 'sun', 'speech']],
  [/(econom|\btax|labou?r|financ|wealth|inherit|fiscal|market|energy|utilit|trade|strike)/, ['bars', 'waves', 'steps', 'compass']],
  [/(migration|refugee|aid\b)/, ['arrows', 'globe', 'compass', 'topo']],
  [/(international|geopolit|relations|state power|foreign|security|nation|development|governance|treaty|world|dictator)/, ['globe', 'compass', 'topo', 'steps', 'arrows', 'target']],
  [/(philosoph|ethic|moral|first principles|theor|justice|sandel)/, ['book', 'scales', 'bulb', 'tree', 'topo']],
  [/(law\b|legal|rights?\b|liberties|criminal|jurisdiction|defamation|free speech|speech protections|icc\b)/, ['gavel', 'scales', 'lock', 'columns', 'book']],
  [/(adjudicat|manual|handbook|rubric|tabmaster|tournament|judging|format rules|standard|rules)/, ['columns', 'gavel', 'tree', 'grid', 'book']],
  [/(delivery|\bpoi\b|interrupt|video|lecture|speech|masterclass|workshop|notes)/, ['speech', 'target', 'bulb', 'book']],
  [/(strategy|prep|matrix|grid|workflow|extension|rebuttal|refutation|argument|framework|structure|blueprint|clash|tactic|decision|motion)/, ['grid', 'target', 'tree', 'compass', 'bulb']],
];

function pickMotif(text: string, seed: number): string {
  const t = text.toLowerCase();
  for (const [re, pool] of MOTIF_RULES) {
    if (re.test(t)) return pool[seed % pool.length];
  }
  return MOTIF_ORDER[seed % MOTIF_ORDER.length];
}

/* --------------------------- cover builder --------------------------- */

const cache = new Map<string, string>();

export function generateCover(seedText: string, subjectText = ''): string {
  const key = `${seedText}|${subjectText}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const seed = hashString(seedText);
  const r = makeRng(seed);
  const p = PALETTES[seed % PALETTES.length];
  const motif = MOTIFS[pickMotif(`${seedText} ${subjectText}`, seed >>> 3)];

  const angle = Math.floor(r() * 360);
  const cx = 400 + Math.round((r() - 0.5) * 50);
  const cy = 225 + Math.round((r() - 0.5) * 24);

  // Decorative backdrop - one of several layouts, so covers sharing a motif still differ.
  const variant = Math.floor(r() * 4);
  let backdrop = '';
  if (variant === 0) {
    backdrop = Array.from({ length: 3 }, () => {
      const x = Math.round(r() * 800);
      const y = Math.round(r() * 450);
      const rad = 90 + Math.round(r() * 170);
      return `<circle cx="${x}" cy="${y}" r="${rad}" fill="none" stroke="${p.ink}" stroke-opacity="0.09" stroke-width="${1.5 + Math.round(r() * 20)}"/>`;
    }).join('');
  } else if (variant === 1) {
    const skew = (r() > 0.5 ? 1 : -1) * (120 + Math.round(r() * 120));
    backdrop = Array.from({ length: 3 }, (_, i) => {
      const x = -200 + Math.round(r() * 700) + i * 40;
      const w = 40 + Math.round(r() * 120);
      return `<polygon points="${x},0 ${x + w},0 ${x + w + skew},450 ${x + skew},450" fill="${p.ink}" fill-opacity="${(0.035 + r() * 0.04).toFixed(3)}"/>`;
    }).join('');
  } else if (variant === 2) {
    const step = 22 + Math.round(r() * 10);
    const dotsGrid: string[] = [];
    for (let y = step; y < 450; y += step) {
      for (let x = step; x < 800; x += step) {
        dotsGrid.push(`<circle cx="${x}" cy="${y}" r="1.6" fill="${p.ink}" fill-opacity="0.12"/>`);
      }
    }
    backdrop = dotsGrid.join('') + `<circle cx="${Math.round(r() * 800)}" cy="${Math.round(r() * 450)}" r="${150 + Math.round(r() * 100)}" fill="${p.accent}" fill-opacity="0.07"/>`;
  } else {
    backdrop = Array.from({ length: 9 }, (_, i) => {
      const y = 30 + i * 48;
      const amp = 8 + r() * 14;
      const ph = r() * 6;
      const pts: string[] = [];
      for (let x = 0; x <= 800; x += 20) pts.push(`${x},${f(y + amp * Math.sin(x * 0.012 + ph))}`);
      return `<polyline points="${pts.join(' ')}" fill="none" stroke="${p.ink}" stroke-opacity="0.07" stroke-width="2"/>`;
    }).join('');
  }
  const dots = Array.from({ length: 14 }, () => `<circle cx="${Math.round(r() * 800)}" cy="${Math.round(r() * 450)}" r="${(1 + r() * 2.2).toFixed(1)}" fill="${p.accent}" fill-opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`).join('');
  const rule = Math.round(70 + r() * 310);
  const scale = (1.08 + r() * 0.2).toFixed(3);

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">` +
    `<defs><linearGradient id="g" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${p.bg1}"/><stop offset="1" stop-color="${p.bg2}"/></linearGradient></defs>` +
    `<rect width="800" height="450" fill="url(#g)"/>` +
    backdrop +
    dots +
    `<line x1="${rule}" y1="40" x2="${rule}" y2="410" stroke="${p.ink}" stroke-opacity="0.07" stroke-width="1.5"/>` +
    `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})">${motif(r, p, cx, cy)}</g>` +
    `<rect x="16" y="16" width="768" height="418" fill="none" stroke="${p.accent}" stroke-opacity="0.55" stroke-width="1.5"/>` +
    `<rect x="26" y="26" width="748" height="398" fill="none" stroke="${p.ink}" stroke-opacity="0.18" stroke-width="1"/>` +
    `</svg>`;

  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  cache.set(key, uri);
  return uri;
}

/* ----------------------------- public API ----------------------------- */

/** The shared stock photos bundled with the site - these are what caused repetition. */
function isStockPhoto(url: string): boolean {
  return !/^(https?:|data:|blob:)/i.test(url) && url.includes('/assets/images/');
}

/**
 * Uses the item's own cover when it is genuinely custom (external URL, uploaded data URL);
 * otherwise (empty, or one of the shared stock photos) falls back to a unique generated cover.
 */
function resolveCover(raw: string | undefined, seed: string, subject: string): string {
  if (raw && !isStockPhoto(raw)) return assetUrl(raw);
  return generateCover(seed, subject);
}

export function getResourceCoverImage(resource: ResourceItem): string {
  const subject = [resource.title, resource.topic, resource.skill_area, resource.format, ...(resource.tags || [])].join(' ');
  return resolveCover(resource.cover_image_url, `resource:${resource.slug}`, subject);
}

export function getArticleCoverImage(article: Pick<Article, 'slug' | 'title' | 'category' | 'cover_image_url' | 'tags'>): string {
  const subject = [article.title, article.category, ...(article.tags || [])].join(' ');
  return resolveCover(article.cover_image_url, `article:${article.slug}`, subject);
}
