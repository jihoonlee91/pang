# PWA and offline behavior

`manifest.webmanifest` configures standalone landscape launch under the GitHub Pages base path. The service worker uses a network-first strategy and caches the application shell and successfully fetched runtime assets.

The service worker is registered only in production. Deploy smoke tests should confirm `index.html`, the JavaScript/CSS bundles, manifest, icon, and `sw.js` are all served below `/pang/`.
