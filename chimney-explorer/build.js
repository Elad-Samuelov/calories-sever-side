// Bundles index.html + css + js into one self-contained file: dist/chimney-explorer.html
// Usage: node build.js
const fs = require('fs'); const path = require('path');
const dir = __dirname; const read = (p) => fs.readFileSync(path.join(dir, p), 'utf8');
let html = read('index.html');
html = html.replace(/<link rel="(manifest|apple-touch-icon)"[^>]*>\n/g, '');
html = html.replace('<link rel="stylesheet" href="css/app.css">', () => `<style>\n${read('css/app.css')}\n</style>`);
html = html.replace(/<script src="(js\/[\w.]+)"><\/script>/g, (_, f) => `<script>\n${read(f).replace(/<\/script/g, '<\\/script')}\n</script>`);
fs.mkdirSync(path.join(dir, 'dist'), { recursive: true });
fs.writeFileSync(path.join(dir, 'dist', 'chimney-explorer.html'), html);
console.log('Wrote dist/chimney-explorer.html (' + (html.length / 1024).toFixed(0) + ' KB)');
