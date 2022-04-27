let cacheData = 'app'
this.addEventListener('install', e=>{
    e.waitUntil(
        caches.open(cacheData).then(cache=>{
            cache.addAll([
                '/static/js/main.chunk.js',
                '/static/js/0.chunk.js',
                '/static/js/0.bundle.js',
                '/index.html',
                '/'
            ])
        })
    )
})
this.addEventListener('fetch', e=>{
            if(e.request.url === 'http://localhost:3000/static/js/main.chunk.js'){
        this.registration.showNotification('hello', {
            body: 'Hello from app'
        })

    }
     if(!navigator.onLine){
        e.respondWith(
            caches.match(e.request).then(res=>{
                if(res){
                    return res
                }
            })
        )
    }
})
