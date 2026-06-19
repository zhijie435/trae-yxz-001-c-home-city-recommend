import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import zhCN from './locales/zh-CN.js'
import zhTW from './locales/zh-TW.js'
import enUS from './locales/en-US.js'
import './styles/global.css'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
