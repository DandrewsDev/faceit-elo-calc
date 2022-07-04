// generate stub index.html files for dev entry
import { execSync } from 'child_process'

function writeManifest() {
  execSync('npx esno ./scripts/manifest-firefox.ts', { stdio: 'inherit' })
}

writeManifest()
