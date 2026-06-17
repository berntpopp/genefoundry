<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy, Terminal } from 'lucide-vue-next'
import SectionLabel from './ui/SectionLabel.vue'
import { useClipboard } from '../composables'
import { HOSTED_ENDPOINT, HEALTH_URL } from '../data/servers'

interface Tab {
  id: string
  label: string
  hint: string
  code: string
}

const tabs: Tab[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    hint: 'Terminal',
    code: `claude mcp add --transport http genefoundry ${HOSTED_ENDPOINT}`
  },
  {
    id: 'cursor',
    label: 'Cursor',
    hint: '~/.cursor/mcp.json',
    code: `{
  "mcpServers": {
    "genefoundry": {
      "url": "${HOSTED_ENDPOINT}"
    }
  }
}`
  },
  {
    id: 'gemini',
    label: 'Gemini CLI',
    hint: '~/.gemini/settings.json',
    code: `{
  "mcpServers": {
    "genefoundry": {
      "httpUrl": "${HOSTED_ENDPOINT}"
    }
  }
}`
  },
  {
    id: 'vscode',
    label: 'VS Code',
    hint: '.vscode/mcp.json',
    code: `{
  "servers": {
    "genefoundry": {
      "type": "http",
      "url": "${HOSTED_ENDPOINT}"
    }
  }
}`
  }
]

const active = ref<Tab>(tabs[0])
const { copied, copy } = useClipboard()
</script>

<template>
  <section id="connect" class="relative border-y border-white/[0.06] bg-ink-2/50 py-24 sm:py-28">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <SectionLabel index="04" label="Connect your host" />
        <h2 class="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Drop it into the <span class="serif-accent text-[1.08em]">client</span> you already use.
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-slate-400">
          The router speaks Streamable HTTP, the config shape every MCP host expects. Pick yours.
        </p>
      </div>

      <div
        class="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-panel/60 shadow-2xl shadow-black/40"
      >
        <!-- Tabs -->
        <div
          role="tablist"
          aria-label="MCP host"
          class="flex items-center gap-1 overflow-x-auto border-b border-white/10 px-2 pt-2"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :id="`tab-${tab.id}`"
            role="tab"
            :aria-selected="active.id === tab.id"
            :aria-controls="`panel-${tab.id}`"
            @click="active = tab"
            class="relative whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            :class="active.id === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'"
          >
            {{ tab.label }}
            <span
              v-if="active.id === tab.id"
              class="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-primary to-accent"
            ></span>
          </button>
        </div>

        <!-- Code panel -->
        <div
          role="tabpanel"
          :id="`panel-${active.id}`"
          :aria-labelledby="`tab-${active.id}`"
          class="relative"
        >
          <div
            class="flex items-center justify-between border-b border-white/[0.06] bg-black/20 px-4 py-2"
          >
            <span
              class="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-400"
            >
              <Terminal class="h-3.5 w-3.5" />
              {{ active.hint }}
            </span>
            <button
              type="button"
              @click="copy(active.code)"
              class="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              :aria-label="copied ? 'Copied' : 'Copy configuration'"
            >
              <component
                :is="copied ? Check : Copy"
                class="h-3.5 w-3.5"
                :class="copied ? 'text-emerald-400' : ''"
              />
              {{ copied ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <transition name="swap" mode="out-in">
            <pre
              :key="active.id"
              class="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6 text-slate-200"
            ><code>{{ active.code }}</code></pre>
          </transition>
        </div>
      </div>

      <!-- Verify -->
      <p class="mt-6 text-center text-sm text-slate-400">
        Verify reachability:
        <a
          :href="HEALTH_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-slate-400 underline decoration-white/20 underline-offset-4 transition-colors hover:text-primary-light"
        >
          curl {{ HEALTH_URL }}
        </a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.15s ease;
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}
</style>
