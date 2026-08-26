const CACHE="voynue-shell-v1";const SHELL=["/offline","/manifest.webmanifest","/icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||r.headers.get("authorization")||r.url.includes("/api/"))return;e.respondWith(fetch(r).catch(()=>caches.match(r).then(x=>x||caches.match("/offline"))))});
