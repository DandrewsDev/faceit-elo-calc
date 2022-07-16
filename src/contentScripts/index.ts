import { createApp } from 'vue'
import App from './views/App.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  let lastUrl = location.href
  new MutationObserver(() => {
    const url = location.href
    if (url !== lastUrl) {
      lastUrl = url
      onUrlChange()
    }
  }).observe(document, { subtree: true, childList: true })
  function onUrlChange() {
    const currentURL = window.location.pathname
    const display = currentURL.match('[a-z]{2}\\/csgo\\/room\\/[1-9]-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
    if (!display)
      return
    // Wait for Faceit to load and injection location to be ready.
    waitForElm('#parasite-container')
  }
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
  const display = currentURL.match('[a-z]{2}\\/csgo\\/room\\/[1-9]-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
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
    app.mount(root)
  }
})()
