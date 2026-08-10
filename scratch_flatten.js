const fs = require('fs');
const path = require('path');

const DIR = 'c:\\Users\\hupri\\OneDrive - Educacyl\\Escritorio\\a-topic web\\apps\\web\\src';

const regexesToRemove = [
  /\brounded(-[a-z0-9]+)?\b/g,
  /\bshadow(-[a-z0-9]+)?\b/g,
  /\bdrop-shadow(-[a-z0-9]+)?\b/g,
  /\bglass(-strong)?\b/g,
  /\bbg-gradient-[a-z0-9-]+\b/g,
  /\bgradient-text\b/g,
  /\bfrom-[a-z0-9-\[\]#]+\b/g,
  /\bto-[a-z0-9-\[\]#]+\b/g,
  /\bbackdrop-blur(-[a-z0-9]+)?\b/g,
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
      
      for (const regex of regexesToRemove) {
        if (content.match(regex)) {
          content = content.replace(regex, '');
          modified = true;
        }
      }
      
      // Fix multiple spaces that might have been left by removing classes
      if (modified) {
        content = content.replace(/className=" +/g, 'className="');
        content = content.replace(/ +"/g, '"');
        content = content.replace(/  +/g, ' ');
        fs.writeFileSync(fullPath, content);
        console.log(`Flattened ${fullPath}`);
      }
    }
  }
}

walk(DIR);
