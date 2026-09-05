import { createSSRApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import { resolvePage } from './lib/resolve-page'

const page = resolvePage(window.location.pathname)
createSSRApp(App, { page }).mount('#app')

if (import.meta.env.PROD) {
  registerSW({
    immediate: false,
    onRegisterError(error: Error) {
      console.error('Offline page registration failed:', error)
    }
  })
}
