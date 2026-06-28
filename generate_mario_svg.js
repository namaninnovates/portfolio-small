const fs = require('fs');

const MARIO = [
  "    RRRRR       ",
  "   RRRRRRRRR    ",
  "   KKKSSKS    R ",
  "  KSKSSSKSSSS RR",
  "  KSKKSSSKSSSSRR",
  "  KKSSSKSKKKK R ",
  "    SSSSSSSS    ",
  "   RBBBRRR      ",
  "  RRRBBRRRRRR   ",
  " RRRRBBYBBRRKK  ",
  " KK RBBBBBB  K  ",
  " KK  BBBBBB     ",
  "  K  BB  BB     ",
  "     KK   KK    ",
  "     KK   KK    ",
  "                "
];

const PIPE = [
  " KKKKKKKKKKKKKK ",
  "KGLLGGGGGGGGGGKK",
  "KGGGGGGGGGGGGGGK",
  "KGGGGGGGGGGGGGGK",
  " KKKKKKKKKKKKKK ",
  "  KLLGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  ",
  "  KGGGGGGGGGGK  "
];

const COLORS = {
  'R': '#E52521', // Red
  'B': '#049CD8', // Blue
  'Y': '#FDF104', // Yellow
  'K': '#432817', // Brown/Black
  'S': '#FBD000', // Skin (or use #FAD6B1)
  'G': '#00A800', // Green
  'L': '#80D010', // Light Green
  ' ': 'transparent'
};
COLORS['S'] = '#FCE3B4'; // Better skin tone

function gridToSvgRects(grid, scale, offsetX, offsetY) {
  let rects = '';
  grid.forEach((row, y) => {
    row.split('').forEach((char, x) => {
      if (char !== ' ' && COLORS[char]) {
        rects += `<rect x="${offsetX + x * scale}" y="${offsetY + y * scale}" width="${scale}" height="${scale}" fill="${COLORS[char]}" />\n`;
      }
    });
  });
  return rects;
}

const width = 800;
const height = 600;
const scale = 15;

// We'll place a simple sky background and ground
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <!-- Background Sky -->
  <rect width="100%" height="100%" fill="#5C94FC" />
  
  <!-- Ground -->
  <rect y="${height - 100}" width="100%" height="100" fill="#C84C0C" />
  <rect y="${height - 100}" width="100%" height="10" fill="#000000" opacity="0.2" />

  <!-- Pipe (on the right) -->
  ${gridToSvgRects(PIPE, scale, width - 300, height - 100 - (16 * scale))}

  <!-- Mario (jumping over the pipe) -->
  ${gridToSvgRects(MARIO, scale, width - 400, height - 100 - (16 * scale) - 150)}
  
  <!-- Mario Shadow -->
  <ellipse cx="${width - 400 + (16 * scale) / 2}" cy="${height - 100 + 20}" rx="60" ry="15" fill="#000000" opacity="0.3" />

</svg>`;

fs.writeFileSync('./public/mario-jump.svg', svg);
console.log('SVG exported to public/mario-jump.svg');
