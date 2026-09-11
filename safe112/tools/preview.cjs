// Local-only preview. Run: node tools/preview.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req, res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400); res.end(); return; }
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  if (file === root || (fs.existsSync(file) && fs.statSync(file).isDirectory())) file = path.join(file, 'index.html');
  fs.readFile(file, (err, body) => {
    res.writeHead(err ? 404 : 200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache'});
    res.end(err ? 'Not found' : body);
  });
}).listen(8112, '127.0.0.1', () => console.log('SAFE112: http://127.0.0.1:8112'));
