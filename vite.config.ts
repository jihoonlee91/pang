import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const pkg = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./package.json', import.meta.url)),
    'utf-8',
  ),
) as { version: string }

// Stamps the built version onto index.html so a running client can poll for
// a fresh copy of the page and detect that a newer version was deployed.
function versionMetaPlugin(): Plugin {
  return {
    name: 'version-meta',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `    <meta name="app-version" content="${pkg.version}" />\n  </head>`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/orbit/',
  plugins: [react(), versionMetaPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
})
