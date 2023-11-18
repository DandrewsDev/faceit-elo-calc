import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/icon-512.png',
    },
    browser_specific_settings: {
      gecko: {
        id: 'faceitelocalc@dandrews.net',
      },
    },
    icons: {
      16: './assets/icon-512.png',
      48: './assets/icon-512.png',
      128: './assets/icon-512.png',
    },
    permissions: [
      'https://*.faceit.com/en/csgo/room/*',
      'https://*.faceit.com/en/cs2/room/*',
      'storage',
    ],
    content_scripts: [{
      matches: ['https://*.faceit.com/en/csgo/room/*', 'https://*.faceit.com/en/cs2/room/*'],
      js: ['./dist/contentScripts/index.global.js'],
    }],
    web_accessible_resources: [
      'dist/contentScripts/style.css',
    ],
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')
    // this is required on dev for Vite script to load
  }

  return manifest
}
