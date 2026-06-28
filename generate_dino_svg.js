const fs = require('fs');

const DINO_RUN1 = [
  "        ████████    ",
  "       ██████████   ",
  "       ██████████   ",
  "       ███  █████   ",
  "       ██████████   ",
  "       ██████████   ",
  "       ████████     ",
  "       ██████       ",
  "█      ██████       ",
  "██     ██████  ██   ",
  "███    ██████████   ",
  " ██   ██████████    ",
  " ██████████████     ",
  "  ████████████      ",
  "   ██████████       ",
  "    ████████        ",
  "     ██████         ",
  "      ██  ██        ",
  "      ██   █        ",
  "      ██            "
];

const CACTUS = [
  "     ██     ",
  "     ██     ",
  "     ██     ",
  "█    ██     ",
  "██   ██  █  ",
  "██   ██ ██  ",
  "██████████  ",
  " ████████   ",
  "   ████     ",
  "   ████     ",
  "   ████     ",
  "   ████     "
];

function gridToSvgRects(grid, scale, offsetX, offsetY, fill) {
  let rects = '';
  grid.forEach((row, y) => {
    row.split('').forEach((char, x) => {
      if (char !== ' ') {
        rects += `<rect x="${offsetX + x * scale}" y="${offsetY + y * scale}" width="${scale}" height="${scale}" fill="${fill}" />\n`;
      }
    });
  });
  return rects;
}

const mapSvgContent = fs.readFileSync('./public/world-map.svg', 'utf-8')
  .replace(/<\?xml.*\?>/g, '')
  .replace(/<!DOCTYPE.*>/g, '')
  .match(/<svg[^>]*>([\s\S]*?)<\/svg>/)[1]; // Extract inner content of world-map.svg

const width = 800;
const height = 800;
const cx = width / 2;
const cy = height / 2;
const planetRadius = 300;
const strokeWidth = 8;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <clipPath id="planet-clip">
      <circle cx="${cx}" cy="${cy}" r="${planetRadius - strokeWidth/2}" />
    </clipPath>
  </defs>

  <g>
    <!-- Planet Base -->
    <circle cx="${cx}" cy="${cy}" r="${planetRadius}" fill="#0047FF" stroke="#1b1c15" stroke-width="${strokeWidth}" />

    <!-- Grid Pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e4e3d7" stroke-width="1" opacity="0.2"/>
    </pattern>
    <circle cx="${cx}" cy="${cy}" r="${planetRadius}" fill="url(#grid)" />

    <!-- Map -->
    <g clip-path="url(#planet-clip)">
      <g transform="translate(-100, 100) scale(1.4) translate(-30.767, -241.591)" opacity="0.9" fill="#ccff00" stroke="#1b1c15" stroke-width="1.5">
        ${mapSvgContent}
      </g>
    </g>

    <!-- Dino -->
    ${gridToSvgRects(DINO_RUN1, 2.5, cx - (20 * 2.5) / 2, cy - planetRadius - (20 * 2.5) + 5, '#ffffff')}
    
    <!-- Cacti -->
    <!-- Cactus 1 (top right) -->
    <g transform="rotate(60, ${cx}, ${cy})">
      ${gridToSvgRects(CACTUS, 3, cx - (12 * 3) / 2, cy - planetRadius - (12 * 3) + 5, '#1b1c15')}
    </g>
    <!-- Cactus 2 (bottom) -->
    <g transform="rotate(180, ${cx}, ${cy})">
      ${gridToSvgRects(CACTUS, 3, cx - (12 * 3) / 2, cy - planetRadius - (12 * 3) + 5, '#1b1c15')}
    </g>
    <!-- Cactus 3 (top left) -->
    <g transform="rotate(-60, ${cx}, ${cy})">
      ${gridToSvgRects(CACTUS, 3, cx - (12 * 3) / 2, cy - planetRadius - (12 * 3) + 5, '#1b1c15')}
    </g>
  </g>
</svg>`;

fs.writeFileSync('./public/dino-planet-export.svg', svg);
console.log('SVG exported to public/dino-planet-export.svg');
