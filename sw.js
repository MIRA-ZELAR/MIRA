const CACHE='mira-zelar-v3-5-pwa-1';
const ASSETS=['./','./index.html','./manifest.json','./sw.js','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));

self.addEventListener('fetch',event=>{
  const req=event.request;
  
  // CORREÇÃO DEFINTIVA: Libera a rota certa do Apps Script para o celular funcionar
  if(req.method!=='GET' || req.url.includes('://google.com')) {
    return; 
  }
  
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});return r}).catch(()=>cached)));
});
