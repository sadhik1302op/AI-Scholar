const fs = require('fs');
const path = require('path');

function search(dir, str) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.expo' || file === 'web-build') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      search(fullPath, str);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(str)) {
        fs.appendFileSync('search2.txt', `FOUND IN: ${fullPath}\n`);
      }
    }
  }
}
fs.writeFileSync('search2.txt', '');
search('c:\\Users\\sadhi\\AI-Scolar\\frontend', 'http://localhost');
