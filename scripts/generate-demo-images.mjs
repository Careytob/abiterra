// scripts/generate-demo-images.mjs
//
// Generates simple, license-free illustrated placeholder images used by the
// demo seed data and sample blog posts, so the repo ships with no third-party
// photos. Re-run with:  node scripts/generate-demo-images.mjs
//
// To use REAL photos in your demo, just drop .webp/.jpg files into
// scripts/seed-assets/ (see scripts/seed-demo.ts) — this generator is optional.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const W = 1200;
const H = 800;

const PALETTES = {
  day: { skyTop: '#7ec8f2', skyBottom: '#e8f6ff', ground: '#8fcf8a', ground2: '#76b872', sun: '#fff3b0' },
  dusk: { skyTop: '#3b3a6e', skyBottom: '#f4a77a', ground: '#4f7a5a', ground2: '#3f6649', sun: '#ffd9a0' },
};

const win = (x, y, w, h, lit = false) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${lit ? '#ffe9a8' : '#bfe3f5'}" stroke="#ffffff" stroke-width="3"/>`;

const VARIANTS = {
  modern: (c) => `
    <rect x="260" y="420" width="520" height="240" fill="${c.wall}"/>
    <rect x="360" y="270" width="480" height="170" fill="${c.wall2}"/>
    <rect x="250" y="410" width="540" height="14" fill="${c.roof}"/>
    <rect x="350" y="260" width="500" height="14" fill="${c.roof}"/>
    ${win(290, 450, 200, 150, c.lit)}${win(520, 450, 120, 150, c.lit)}${win(380, 295, 260, 110, c.lit)}${win(670, 295, 140, 110, c.lit)}
    <rect x="670" y="500" width="90" height="160" fill="${c.door}"/>`,
  gabled: (c) => `
    <rect x="330" y="400" width="440" height="260" fill="${c.wall}"/>
    <polygon points="300,410 550,230 800,410" fill="${c.roof}"/>
    <rect x="640" y="250" width="44" height="90" fill="${c.wall2}"/>
    ${win(370, 450, 110, 110, c.lit)}${win(620, 450, 110, 110, c.lit)}
    <rect x="510" y="500" width="80" height="160" rx="4" fill="${c.door}"/>
    <circle cx="580" cy="585" r="5" fill="#f2d16b"/>`,
  apartment: (c) => {
    let w = '';
    for (let r = 0; r < 5; r++)
      for (let k = 0; k < 4; k++) w += win(400 + k * 90, 200 + r * 90, 56, 56, (r + k) % 3 === 0 && c.lit);
    return `<rect x="370" y="160" width="400" height="500" fill="${c.wall}"/>
    <rect x="360" y="150" width="420" height="16" fill="${c.roof}"/>${w}
    <rect x="530" y="580" width="80" height="80" fill="${c.door}"/>`;
  },
  villa: (c) => `
    <rect x="220" y="430" width="600" height="190" fill="${c.wall}"/>
    <polygon points="190,440 330,330 710,330 850,440" fill="${c.roof}"/>
    ${win(260, 470, 130, 110, c.lit)}${win(430, 470, 130, 110, c.lit)}${win(600, 470, 130, 110, c.lit)}
    <rect x="470" y="540" width="0" height="0"/>
    <rect x="300" y="650" width="440" height="80" rx="14" fill="#5cc3e6"/>
    <rect x="320" y="662" width="400" height="12" rx="6" fill="#bfeaf7" opacity="0.8"/>`,
  townhouses: (c) => {
    const cols = [c.wall, c.wall2, c.wall];
    return cols
      .map((col, i) => {
        const x = 250 + i * 220;
        return `<rect x="${x}" y="330" width="210" height="330" fill="${col}"/>
        <polygon points="${x - 8},340 ${x + 105},250 ${x + 218},340" fill="${c.roof}"/>
        ${win(x + 25, 380, 60, 70, c.lit)}${win(x + 125, 380, 60, 70, c.lit)}
        ${win(x + 25, 490, 60, 70, c.lit)}<rect x="${x + 120}" y="530" width="64" height="130" rx="3" fill="${c.door}"/>`;
      })
      .join('');
  },
  bungalow: (c) => `
    <rect x="250" y="450" width="560" height="210" fill="${c.wall}"/>
    <polygon points="220,460 400,350 660,350 840,460" fill="${c.roof}"/>
    <rect x="250" y="600" width="560" height="14" fill="${c.wall2}"/>
    ${win(290, 490, 120, 90, c.lit)}${win(640, 490, 120, 90, c.lit)}
    <rect x="470" y="510" width="90" height="150" rx="4" fill="${c.door}"/>
    <rect x="440" y="650" width="150" height="14" fill="${c.wall2}"/>`,
};

const COLORS = {
  modern: { wall: '#f2efe9', wall2: '#d9c7a9', roof: '#3a3f47', door: '#7a5a3a' },
  gabled: { wall: '#e8d5c0', wall2: '#c9a98a', roof: '#a8483a', door: '#4c6a8a' },
  apartment: { wall: '#d7dde6', wall2: '#b9c2cf', roof: '#5b6573', door: '#3e5a78' },
  villa: { wall: '#fbf6ec', wall2: '#e6dcc4', roof: '#c8744a', door: '#6a4a32' },
  townhouses: { wall: '#e9c9c0', wall2: '#c7d6c0', roof: '#5a4a52', door: '#3f5d73' },
  bungalow: { wall: '#cfe3d6', wall2: '#a9c9b6', roof: '#7a5a48', door: '#8a4a3a' },
};

function svg(variant, palette) {
  const p = PALETTES[palette];
  const c = { ...COLORS[variant], lit: palette === 'dusk' };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.skyTop}"/><stop offset="1" stop-color="${p.skyBottom}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="${palette === 'dusk' ? 960 : 1000}" cy="${palette === 'dusk' ? 330 : 150}" r="70" fill="${p.sun}" opacity="0.9"/>
  <rect y="640" width="${W}" height="${H - 640}" fill="${p.ground}"/>
  <rect y="700" width="${W}" height="${H - 700}" fill="${p.ground2}"/>
  <circle cx="130" cy="560" r="85" fill="${p.ground2}"/><rect x="122" y="610" width="16" height="60" fill="#6b4f3a"/>
  <circle cx="1080" cy="580" r="70" fill="${p.ground2}"/><rect x="1073" y="620" width="14" height="50" fill="#6b4f3a"/>
  ${VARIANTS[variant](c)}
</svg>`;
}

function fallbackSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#e5e9ef"/>
  <polygon points="600,250 760,390 440,390" fill="#aab4c3"/>
  <rect x="470" y="390" width="260" height="170" fill="#bcc5d2"/>
  <rect x="570" y="460" width="60" height="100" fill="#98a3b5"/>
</svg>`;
}

async function write(file, svgString, format = 'webp') {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const img = sharp(Buffer.from(svgString));
  await (format === 'jpg' ? img.jpeg({ quality: 82 }) : img.webp({ quality: 78 })).toFile(file);
  console.log('wrote', file);
}

const seedDir = path.join('scripts', 'seed-assets');
for (const v of Object.keys(VARIANTS)) {
  await write(path.join(seedDir, `${v}-day.webp`), svg(v, 'day'));
  await write(path.join(seedDir, `${v}-dusk.webp`), svg(v, 'dusk'));
}

// Sample blog covers + site fallbacks served from /public
await write('public/images/blog/inspect-property.webp', svg('gabled', 'day'));
await write('public/images/blog/cost-of-buying.webp', svg('modern', 'day'));
await write('public/images/blog/rent-vs-buy.webp', svg('townhouses', 'day'));
await write('public/images/blog/blog-cover.jpg', svg('villa', 'day'), 'jpg');
await write('public/images/blog/default-cover.jpg', svg('bungalow', 'day'), 'jpg');
await write('public/images/fallback.webp', fallbackSvg());
