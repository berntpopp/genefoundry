<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { GITHUB_URL } from '../data/servers'

const isScrolled = ref(false)
const isMenuOpen = ref(false)
// Disable transitions until after first paint to prevent flicker
const enableTransitions = ref(false)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const scrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' })
  closeMenu()
}

let observer: IntersectionObserver | null = null
let sentinel: HTMLElement | null = null

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  // IntersectionObserver beats scroll listeners (callbacks run off main thread)
  sentinel = document.createElement('div')
  sentinel.style.cssText = 'position:absolute;top:0;left:0;height:1px;width:100%;pointer-events:none'
  sentinel.setAttribute('aria-hidden', 'true')
  document.body.prepend(sentinel)

  observer = new IntersectionObserver(
    ([entry]) => {
      isScrolled.value = !entry.isIntersecting
    },
    { rootMargin: '-20px 0px 0px 0px' },
  )
  observer.observe(sentinel)

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
    sentinel.parentNode?.removeChild(sentinel)
    sentinel = null
  }
})

const links = [
  { name: 'How it works', href: '#how' },
  { name: 'Catalog', href: '#catalog' },
  { name: 'Why', href: '#features' },
  { name: 'Connect', href: '#connect' },
]
</script>

<template>
  <nav
    class="fixed inset-x-0 top-0 z-50 border-b"
    :class="[
      enableTransitions ? 'transition-[background-color,padding,border-color,backdrop-filter] duration-300' : '',
      isScrolled || isMenuOpen
        ? 'border-white/10 bg-ink/80 py-3 backdrop-blur-xl'
        : 'border-transparent bg-transparent py-5',
    ]"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Brand -->
      <a
        href="#"
        @click.prevent="scrollToTop"
        class="group relative z-50 flex cursor-pointer items-center gap-2.5"
        aria-label="Scroll to top of page"
      >
        <img
          src="/genefoundry_logo.svg"
          alt="GeneFoundry logo"
          width="36"
          height="36"
          class="h-9 w-9 animate-float drop-shadow-[0_0_12px_rgba(190,62,130,0.5)] transition-transform duration-200 group-hover:scale-105"
        />
        <span class="text-lg font-bold tracking-tight text-white">
          Gene<span class="text-primary-light">Foundry</span>
        </span>
      </a>

      <!-- Desktop links -->
      <div class="hidden items-center gap-7 md:flex">
        <a
          v-for="link in links"
          :key="link.name"
          :href="link.href"
          class="text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          {{ link.name }}
        </a>
        <a
          :href="GITHUB_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-slate-400 transition-colors hover:text-white"
        >
          GitHub
        </a>
        <a
          href="#connect"
          class="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:brightness-110"
        >
          Add the endpoint
        </a>
      </div>

      <!-- Mobile toggle -->
      <button
        @click="toggleMenu"
        class="relative z-50 rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 md:hidden"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle menu"
      >
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>

      <!-- Mobile menu -->
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
          class="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-white/10 bg-ink/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
        >
          <a
            v-for="link in links"
            :key="link.name"
            :href="link.href"
            @click="closeMenu"
            class="rounded-lg px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            {{ link.name }}
          </a>
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu"
            class="rounded-lg px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            GitHub
          </a>
          <a
            href="#connect"
            @click="closeMenu"
            class="mt-1 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-3 text-center text-base font-semibold text-white"
          >
            Add the endpoint
          </a>
        </div>
      </transition>
    </div>
  </nav>
</template>

<style scoped>
nav {
  contain: layout style;
}
</style>
