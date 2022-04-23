import { createApp } from 'vue'
import { Quasar } from 'quasar'
import 'quasar/src/css/index.sass'
import quasarIconSet from 'quasar/icon-set/svg-material-icons'
import App from './Popup.vue'
import '../styles'

const app = createApp(App)
app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  iconSet: quasarIconSet,
})
app.mount('#app')
