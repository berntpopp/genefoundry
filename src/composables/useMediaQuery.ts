import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Reactive composable for CSS media queries
 * Follows Single Responsibility Principle - only handles media query state
 *
 * @param query - CSS media query string (e.g., '(max-width: 639px)')
 * @returns Reactive boolean ref that updates when media query matches change
 */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  let mediaQuery: MediaQueryList | null = null

  const handleChange = (e: MediaQueryListEvent) => {
    matches.value = e.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    // Initialize directly instead of through event handler for type safety
    matches.value = mediaQuery.matches
    mediaQuery.addEventListener('change', handleChange)
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleChange)
    }
  })

  return matches
}

/**
 * Check if user prefers reduced motion
 * Critical for WCAG 2.2.2 compliance
 */
export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

/**
 * Check if viewport is mobile-sized
 * Uses matchMedia to avoid forced reflows (vs window.innerWidth)
 */
export function useIsMobile(breakpoint = 639) {
  return useMediaQuery(`(max-width: ${breakpoint}px)`)
}
