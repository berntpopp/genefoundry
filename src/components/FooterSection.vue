<script setup lang="ts">
import { ref } from 'vue'
import ImprintModal from './ImprintModal.vue'
import { GITHUB_URL, HEALTH_URL, HOSTED_ENDPOINT } from '../data/servers'

const isImprintOpen = ref(false)

const openImprint = () => {
  isImprintOpen.value = true
  document.body.style.overflow = 'hidden'
}
const closeImprint = () => {
  isImprintOpen.value = false
  document.body.style.overflow = ''
}

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const nav: Record<string, FooterLink[]> = {
  Explore: [
    { label: 'How it works', href: '#how' },
    { label: 'Server catalog', href: '#catalog' },
    { label: 'Why GeneFoundry', href: '#features' },
    { label: 'Connect a host', href: '#connect' }
  ],
  Resources: [
    { label: 'GitHub', href: GITHUB_URL, external: true },
    { label: 'Health check', href: HEALTH_URL, external: true },
    { label: 'MCP endpoint', href: HOSTED_ENDPOINT, external: true },
    { label: 'Contact', href: 'mailto:support@genefoundry.org' }
  ]
}
</script>

<template>
  <footer class="relative border-t border-white/[0.08] bg-ink-2/60">
    <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2.5">
            <img
              src="/genefoundry_logo.svg"
              alt="GeneFoundry logo"
              width="32"
              height="32"
              class="h-8 w-8"
            />
            <span class="text-lg font-bold tracking-tight text-white">
              Gene<span class="text-primary-light">Foundry</span>
            </span>
          </div>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            A FastMCP gateway federating biomedical MCP servers behind one endpoint. Trustworthy
            genomic data, federated for agents.
          </p>
          <code
            class="mt-4 inline-block rounded-lg border border-white/[0.08] bg-black/30 px-3 py-1.5 font-mono text-xs text-slate-400"
          >
            {{ HOSTED_ENDPOINT }}
          </code>
        </div>

        <!-- Link columns -->
        <div v-for="(items, heading) in nav" :key="heading">
          <h3 class="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            {{ heading }}
          </h3>
          <ul class="mt-4 space-y-2.5">
            <li v-for="item in items" :key="item.label">
              <a
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                class="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-sm text-slate-400 sm:flex-row"
      >
        <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>MIT © {{ new Date().getFullYear() }} Bernt Popp</span>
          <span class="text-slate-700">·</span>
          <button @click="openImprint" class="cursor-pointer transition-colors hover:text-white">
            Imprint
          </button>
        </div>
        <p class="text-center text-xs sm:text-right">
          Research use only. Not clinical decision support.
        </p>
      </div>
    </div>

    <ImprintModal :is-open="isImprintOpen" @close="closeImprint" />
  </footer>
</template>
