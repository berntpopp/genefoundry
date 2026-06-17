import { ref, onUnmounted } from 'vue'

/**
 * Copy-to-clipboard with a transient "copied" confirmation state.
 * Single Responsibility: owns only the copy action + feedback timer.
 *
 * @param resetMs - how long the `copied` flag stays true after a copy
 */
export function useClipboard(resetMs = 2000) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  const copy = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for non-secure contexts / older browsers
        const el = document.createElement('textarea')
        el.value = text
        el.setAttribute('readonly', '')
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      copied.value = true
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => (copied.value = false), resetMs)
    } catch {
      copied.value = false
    }
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { copied, copy }
}
