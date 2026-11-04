import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = path.resolve('dist');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.woff':'font/woff', '.woff2':'font/woff2', '.mp3':'audio/mpeg', '.mp4':'video/mp4', '.wasm':'application/wasm', '.ktx2':'image/ktx2' };
const cache = new Map();
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let target = path.resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    try { if ((await stat(target)).isDirectory()) target = path.join(target,'index.html'); }
    catch { if (!path.extname(pathname)) target = path.join(root,'index.html'); else throw new Error('missing'); }
    const info = await stat(target);
    const ext = path.extname(target);
    const headers = {'Content-Type':types[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache'};
    let data;
    if (req.headers.range) {
      const [startText,endText] = req.headers.range.replace('bytes=','').split('-');
      const start = Number(startText), end = Math.min(endText ? Number(endText) : info.size - 1, info.size - 1);
      data = (await readFile(target)).subarray(start,end+1);
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Accept-Ranges':'bytes','Content-Length':data.length});
    } else {
      data = await readFile(target);
      if (/\.(js|css|html|json|svg)$/.test(target) && /gzip/.test(req.headers['accept-encoding'] || '')) {
        const key = `${target}:${info.mtimeMs}`;
        if (!cache.has(key)) cache.set(key,gzipSync(data));
        data = cache.get(key); headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding';
      }
      res.writeHead(200,{...headers,'Content-Length':data.length});
    }
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404,{'Content-Type':'text/plain'}); res.end('Not found'); }
}).listen(4193,'127.0.0.1',() => process.stdout.write('Local: http://127.0.0.1:4193\n'));

