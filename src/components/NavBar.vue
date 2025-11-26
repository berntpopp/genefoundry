<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
// Disable transitions until after first paint to prevent flicker
const enableTransitions = ref(false)

// Throttled scroll handler for better performance
let ticking = false
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > 20
      ticking = false
    })
    ticking = true
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  // Set initial scroll state synchronously to avoid flicker
  isScrolled.value = window.scrollY > 20

  // Enable transitions after first paint to prevent initial flicker
  nextTick(() => {
    requestAnimationFrame(() => {
      enableTransitions.value = true
    })
  })

  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const links = [
  { name: 'Methodology', href: '#methodology' },
  { name: 'Perspectives', href: '#perspectives' },
  { name: 'Impact', href: '#impact' },
  { name: 'GitHub', href: '#' },
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
