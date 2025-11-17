import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

import '@/assets/main.scss'

const app = createApp(App)

const pinia = createPinia()

const kairosDarkGrey = '#1C1C1E' // 80/20: Superfícies (Dark) / Ação (Ambos)
const kairosMidGrey = '#757575' // 80/20: Texto secundário
const kairosBg = '#F5F5F5' // 80/20: Fundo (Light)
const kairosBorder = '#E0E0E0' // 80/20: Fundo VTextField (Light)

const kairosSuccess = '#4CAF50'
const kairosError = '#F44336'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: kairosDarkGrey,
          secondary: kairosMidGrey,
          success: kairosSuccess,
          error: kairosError,
          background: kairosDarkGrey,
          surface: kairosBg,
          border: kairosBorder,
        },
      },

      light: {
        dark: false,
        colors: {
          primary: kairosDarkGrey,
          secondary: kairosMidGrey,
          success: kairosSuccess,
          error: kairosError,
          background: kairosBg,
          surface: kairosDarkGrey,
          border: kairosBorder,
        },
      },
    },
  },
})

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
