/* eslint-disable no-console */

import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './views/App.vue'
import 'quasar/src/css/index.sass'
// eslint-disable-next-line import/order
import quasarIconSet from 'quasar/icon-set/svg-material-icons'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // mount component to window
  const container = document.createElement('div')
  container.id = 'faceit-elo-calc-container'
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  const app = createApp(App)
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
    iconSet: quasarIconSet,
  })
  app.mount(root)
})()
