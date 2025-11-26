<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
// Disable transitions until after first paint to prevent flicker
const enableTransitions = ref(false)

// IntersectionObserver instance and sentinel element for cleanup
let observer: IntersectionObserver | null = null
let sentinel: HTMLElement | null = null

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  // Create invisible sentinel element at top of page
  // IntersectionObserver is more performant than scroll listeners
  // as callbacks run off the main thread
  sentinel = document.createElement('div')
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:100%;pointer-events:none'
  sentinel.setAttribute('aria-hidden', 'true')
  document.body.prepend(sentinel)

  // Use IntersectionObserver to detect scroll position
  // rootMargin of -20px triggers when scrolled past 20px
  observer = new IntersectionObserver(
    ([entry]) => {
      isScrolled.value = !entry.isIntersecting
    },
    { rootMargin: '-20px 0px 0px 0px' }
  )
  observer.observe(sentinel)

  // Enable transitions after first paint to prevent initial flicker
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      enableTransitions.value = true
    })
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (sentinel) {
    // Use parentNode?.removeChild for safer cleanup in case element was already removed
    sentinel.parentNode?.removeChild(sentinel)
    sentinel = null
  }
})

const links = [
  { name: 'Methodology', href: '#methodology' },
  { name: 'Perspectives', href: '#perspectives' },
  { name: 'Impact', href: '#impact' },
  { name: 'GitHub', href: 'https://github.com/berntpopp/genefoundry' },
]
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 border-b"
    :class="[
      // Only enable transitions after first paint to prevent flicker
      enableTransitions ? 'transition-[background-color,padding,border-color,box-shadow] duration-300' : '',
      isScrolled || isMenuOpen
        ? 'bg-white/90 backdrop-blur-md border-slate-200 py-3 shadow-sm'
        : 'bg-transparent border-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3 relative z-50">
        <img
          src="/genefoundry_logo.svg"
          alt="GeneFoundry Logo"
          width="40"
          height="40"
          class="h-10 w-10 drop-shadow-lg animate-float"
        />
        <span class="text-xl font-bold tracking-tight text-secondary">
          Gene<span class="text-primary">Foundry</span>
        </span>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        <a 
          v-for="link in links" 
          :key="link.name" 
          :href="link.href"
          class="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
        >
          {{ link.name }}
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        @click="toggleMenu"
        class="md:hidden text-slate-600 relative z-50 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <!-- Mobile Menu Overlay -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div 
          v-if="isMenuOpen"
          class="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden flex flex-col p-4 gap-2"
        >
          <a 
            v-for="link in links" 
            :key="link.name" 
            :href="link.href"
            @click="closeMenu"
            class="px-4 py-3 text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
          >
            {{ link.name }}
          </a>
        </div>
      </transition>
    </div>
  </nav>
</template>

<style scoped>
/* Prevent navbar from causing layout shifts in other elements */
nav {
  contain: layout style;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
