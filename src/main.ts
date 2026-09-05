import { createApp, createSSRApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import { getPage, PAGES } from './data/pages'
import { stripBase } from './lib/urls'
import { pageHead } from './lib/metadata'
import './style.css'

// Directory indexes are alternate URLs for the same finite static page.
const path = stripBase(window.location.pathname).replace(/\/index\.html$/, '/')
const page = getPage(path) ?? PAGES.find((entry) => entry.kind === 'not-found')
if (!page) throw new Error('The page registry must include a not-found document')
if (import.meta.env.DEV) document.head.insertAdjacentHTML('beforeend', pageHead(page))
const container = document.getElementById('app')!
const prerendered = container.children.length > 0
;(prerendered ? createSSRApp(App, { page }) : createApp(App, { page })).mount(container)

if (import.meta.env.PROD) {
  registerSW({
    immediate: false,
    onRegisterError(error: Error) {
      console.error('Offline page registration failed:', error)
    }
  })
}
