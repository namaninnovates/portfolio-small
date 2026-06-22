const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/flekschas/simple-world-map/master/world-map.svg', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    // 1. Remove existing fills and strokes on paths if any
    data = data.replace(/fill="[^"]*"/g, '');
    data = data.replace(/stroke="[^"]*"/g, '');
    data = data.replace(/stroke-width="[^"]*"/g, '');
    
    // 2. Add our custom attributes to the <svg> tag
    data = data.replace(/<svg/, '<svg fill="#ccff00" stroke="#1b1c15" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"');
    
    fs.writeFileSync('public/world-map.svg', data);
    console.log('Saved to public/world-map.svg successfully!');
  });
});
