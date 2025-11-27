import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import './style.css'
import App from './App.vue'

// Mount the Vue app
createApp(App).mount('#app')

// PWA Service Worker Registration with Periodic Updates
// This ensures users always get the latest version of the app

// Check for updates every 60 minutes (in milliseconds)
const UPDATE_INTERVAL_MS = 60 * 60 * 1000

const updateSW = registerSW({
  // Called when a new service worker is installed and waiting
  // With autoUpdate + skipWaiting, this triggers an immediate page reload
  onNeedRefresh() {
    // With registerType: 'autoUpdate', the new SW activates immediately
    // and the page will reload automatically. This callback is mainly
    // for logging or analytics.
    console.log('[PWA] New content available, reloading...')
  },

  // Called when the app is ready to work offline
  onOfflineReady() {
    console.log('[PWA] App ready to work offline')
  },

  // Called when the service worker is registered
  // Set up periodic update checks for users who keep tabs open
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    if (registration) {
      console.log('[PWA] Service worker registered')

      // Periodic check for updates
      // This is critical for users who keep tabs open for extended periods
      setInterval(async () => {
        // Only check if we're online
        if (!navigator.onLine) return

        try {
          await registration.update()
          console.log('[PWA] Checked for updates')
        } catch (error) {
          console.error('[PWA] Update check failed:', error)
        }
      }, UPDATE_INTERVAL_MS)
    }
  },

  // Called if service worker registration fails
  onRegisterError(error: Error) {
    console.error('[PWA] Service worker registration failed:', error)
  }
})

// Force update check on page visibility change
// When user returns to a tab after being away, check for updates
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && navigator.onLine) {
    updateSW(false) // false = don't force reload, just check
  }
})
