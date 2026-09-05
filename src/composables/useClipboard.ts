import { ref, onUnmounted } from 'vue'
import { COPY } from '../data/copy'

/** Local clipboard feedback only; never represents an external client's connection state. */
export function useClipboard(resetMs = 2000) {
  const copied = ref(false)
  const pending = ref(false)
  const error = ref<string | null>(null)
  let operation = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  function reset() {
    operation++
    if (timer) clearTimeout(timer)
    timer = null
    copied.value = false
    pending.value = false
    error.value = null
  }
  async function copy(text: string) {
    if (pending.value) return
    reset()
    const currentOperation = operation
    pending.value = true
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const previousFocus =
          document.activeElement instanceof HTMLElement ? document.activeElement : null
        const selection = window.getSelection()
        const ranges = selection
          ? Array.from({ length: selection.rangeCount }, (_, index) =>
              selection.getRangeAt(index).cloneRange()
            )
          : []
        const inputSelection =
          previousFocus instanceof HTMLInputElement || previousFocus instanceof HTMLTextAreaElement
            ? {
                start: previousFocus.selectionStart,
                end: previousFocus.selectionEnd,
                direction: previousFocus.selectionDirection
              }
            : null
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.cssText = 'position:fixed;inset:0 auto auto 0;opacity:0;pointer-events:none'
        document.body.appendChild(textarea)
        try {
          textarea.select()
          if (!document.execCommand('copy')) throw new Error('Copy was not confirmed')
        } finally {
          textarea.remove()
          previousFocus?.focus({ preventScroll: true })
          if (selection) {
            selection.removeAllRanges()
            for (const range of ranges) selection.addRange(range)
          }
          if (
            inputSelection &&
            (previousFocus instanceof HTMLInputElement ||
              previousFocus instanceof HTMLTextAreaElement) &&
            inputSelection.start !== null &&
            inputSelection.end !== null
          ) {
            previousFocus.setSelectionRange(
              inputSelection.start,
              inputSelection.end,
              inputSelection.direction ?? undefined
            )
          }
        }
      }
      if (operation !== currentOperation) return
      copied.value = true
      timer = setTimeout(reset, resetMs)
    } catch {
      if (operation === currentOperation) error.value = COPY.states.copyFailure
    } finally {
      if (operation === currentOperation) pending.value = false
    }
  }
  onUnmounted(reset)
  return { copied, pending, error, copy, reset }
}
