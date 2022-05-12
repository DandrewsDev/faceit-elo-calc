import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './views/App.vue'
import 'quasar/src/css/index.sass'
// eslint-disable-next-line import/order
import quasarIconSet from 'quasar/icon-set/svg-material-icons'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  function waitForElm(selector: any) {
    if (document.querySelector(selector).shadowRoot && document.querySelector(selector).shadowRoot.querySelector('#MATCHROOM-OVERVIEW')) {
      embedApp()
      return
    }
    setTimeout(() => {
      waitForElm(selector)
    }, 250)
  }
  const currentURL = window.location.pathname
  const display = currentURL.includes('/en/csgo/room')
  if (!display)
    return

  // Wait for Faceit to load and injection location to be ready.
  waitForElm('#parasite-container')

  // Embed Vue JS app.
  function embedApp() {
    const parasite_container = document.querySelector('#parasite-container')
    if (!parasite_container || !parasite_container.shadowRoot)
      return
    const match_overview = parasite_container.shadowRoot.querySelector('#MATCHROOM-OVERVIEW')
    if (!match_overview)
      return
    const container = document.createElement('div')
    container.id = 'faceit-elo-calc-container'
    const root = document.createElement('div')
    const styleEl = document.createElement('link')
    const shadowDOM = container.attachShadow?.({ mode: 'open' }) || container
    const app = createApp(App)
    styleEl.setAttribute('rel', 'stylesheet')
    styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
    shadowDOM.appendChild(styleEl)
    shadowDOM.appendChild(root)
    match_overview.prepend(container)
    app.use(Quasar, {
      plugins: {}, // import Quasar plugins and add here
      iconSet: quasarIconSet,
    })
    app.mount(root)
  }
})()
