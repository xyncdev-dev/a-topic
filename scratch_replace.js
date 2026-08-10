const fs = require('fs');
const path = require('path');

const DIR = 'c:\\Users\\hupri\\OneDrive - Educacyl\\Escritorio\\a-topic web\\apps\\web\\src';

const replacements = [
  { search: /#8B5CF6/g, replace: '#E50914' },
  { search: /#06B6D4/g, replace: '#7F1D1D' },
  { search: /#7C3AED/g, replace: '#991B1B' }, // Secondary purple to a mid red
  { search: /#A78BFA/g, replace: '#FCA5A5' }, // Light purple to light red
  { search: /purple/g, replace: 'red' },      // e.g. shadow-purple-500 -> shadow-red-500
  { search: /👋/g, replace: '' },
  { search: /👑/g, replace: '' },
  { search: /🪙/g, replace: '' },
  { search: /🎁/g, replace: '' },
  { search: /📋/g, replace: '' },
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const { search, replace } of replacements) {
        if (content.match(search)) {
          content = content.replace(search, replace);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk(DIR);
