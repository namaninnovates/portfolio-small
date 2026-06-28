const fs = require('fs');

const width = 1200;
const height = 800;

// SVG representations of the Mario components
const marioCoinSvg = `
<g>
  <ellipse cx="14" cy="18" rx="14" ry="18" fill="url(#coinGrad)" stroke="#b87800" stroke-width="3" />
  <ellipse cx="14" cy="18" rx="11" ry="15" fill="none" stroke="#cc8800" stroke-width="3" />
</g>
`;

const marioPipeSvg = `
<g>
  <rect x="0" y="13" width="48" height="37" fill="#00a000" stroke="#000" stroke-width="3" />
  <rect x="-4" y="0" width="56" height="16" fill="#00c800" stroke="#000" stroke-width="3" />
  <rect x="6" y="0" width="4" height="50" fill="#fff" opacity="0.3" />
</g>
`;

const marioBrickSvg = `
<g>
  <rect x="0" y="0" width="40" height="40" fill="#c84c0c" stroke="#000" stroke-width="3" />
  <rect x="3" y="3" width="34" height="34" fill="none" stroke="#ff9c6c" stroke-width="3" />
  <rect x="6" y="6" width="28" height="28" fill="none" stroke="#6c2400" stroke-width="3" />
  <line x1="0" y1="20" x2="40" y2="20" stroke="#6c2400" stroke-width="2" />
  <line x1="20" y1="0" x2="20" y2="20" stroke="#6c2400" stroke-width="2" />
  <line x1="20" y1="20" x2="20" y2="40" stroke="#6c2400" stroke-width="2" />
</g>
`;

const marioQuestionSvg = `
<g>
  <rect x="0" y="0" width="40" height="40" fill="#e89000" stroke="#000" stroke-width="3" />
  <rect x="3" y="3" width="34" height="34" fill="none" stroke="#ffc86c" stroke-width="3" />
  <rect x="6" y="6" width="28" height="28" fill="none" stroke="#885000" stroke-width="3" />
  <text x="20" y="29" font-family="sans-serif" font-weight="900" font-size="24" fill="#e89000" stroke="#000" stroke-width="1.5" text-anchor="middle">?</text>
</g>
`;

const elements = [
  // m1Ref
  { type: 'pipe', x: 0.15, y: 0.10, rot: -12, scale: 0.75, opacity: 0.3 },
  { type: 'coin', x: 0.75, y: 0.35, rot: 25, scale: 0.5, opacity: 0.3 },
  { type: 'brick', x: 0.08, y: 0.65, rot: -6, scale: 0.9, opacity: 0.3 },
  { type: 'question', x: 0.88, y: 0.85, rot: 12, scale: 0.75, opacity: 0.3 },
  // m2Ref
  { type: 'coin', x: 0.30, y: 0.05, rot: 6, scale: 0.9, opacity: 0.5 },
  { type: 'pipe', x: 0.92, y: 0.45, rot: -15, scale: 1.0, opacity: 0.5 },
  { type: 'coin', x: 0.25, y: 0.75, rot: 30, scale: 0.75, opacity: 0.5 },
  { type: 'brick', x: 0.65, y: 0.90, rot: -12, scale: 0.9, opacity: 0.5 },
  // m3Ref
  { type: 'question', x: 0.85, y: 0.15, rot: 12, scale: 1.1, opacity: 0.8 },
  { type: 'brick', x: 0.05, y: 0.28, rot: -12, scale: 1.25, opacity: 0.8 },
  { type: 'question', x: 0.18, y: 0.55, rot: 6, scale: 1.1, opacity: 0.8 },
  { type: 'pipe', x: 0.94, y: 0.80, rot: -20, scale: 1.25, opacity: 0.8 },
];

function getElementSvg(type) {
  if (type === 'coin') return marioCoinSvg;
  if (type === 'pipe') return marioPipeSvg;
  if (type === 'brick') return marioBrickSvg;
  if (type === 'question') return marioQuestionSvg;
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="coinGrad" cx="35%" cy="35%" r="50%" fx="35%" fy="35%">
      <stop offset="0%" stop-color="#ffe066" />
      <stop offset="100%" stop-color="#e8a000" />
    </radialGradient>
    <filter id="dropShadow">
      <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="#1b1c15" />
    </filter>
  </defs>
  
  <g filter="url(#dropShadow)">
`;

elements.forEach(el => {
  const px = el.x * width;
  const py = el.y * height;
  svg += `
    <g transform="translate(${px}, ${py}) scale(${el.scale}) rotate(${el.rot})" opacity="${el.opacity}">
      ${getElementSvg(el.type)}
    </g>
  `;
});

svg += `
  </g>
</svg>`;

fs.writeFileSync('./public/mario-floaters-bg.svg', svg);
console.log('SVG exported to public/mario-floaters-bg.svg');
