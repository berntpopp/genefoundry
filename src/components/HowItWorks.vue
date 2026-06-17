<script setup lang="ts">
import { Plug, Search, Play } from 'lucide-vue-next'
import { ADD_COMMAND, TOOL_COUNT } from '../data/servers'

const steps = [
  {
    n: '01',
    icon: Plug,
    title: 'Add one endpoint',
    body: 'Point any MCP host at the hosted router. No install, no per-server setup, no keys.',
    code: ADD_COMMAND,
  },
  {
    n: '02',
    icon: Search,
    title: 'Discover with search_tools',
    body: `Your agent searches the federated catalog by relevance and pulls only the schemas it needs, not all ${TOOL_COUNT}.`,
    code: 'search_tools("splice impact of a variant")',
  },
  {
    n: '03',
    icon: Play,
    title: 'Run with call_tool',
    body: 'Invoke any hit by its namespaced name. Results stay grounded in the source, with citations, never rewritten.',
    code: 'call_tool("spliceai_predict_variant", { … })',
  },
]
</script>

<template>
  <section id="how" class="relative py-24 sm:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Problem framing -->
      <div class="mx-auto max-w-3xl text-center">
        <p class="font-mono text-xs uppercase tracking-[0.2em] text-primary-light">The 218-tool problem</p>
        <h2 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          One search box, not a wall of tools.
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-slate-400">
          Mounting {{ TOOL_COUNT }} tools into a model burns tens of thousands of tokens before any
          work starts, and floods the context with schemas it will never call. GeneFoundry exposes a
          <span class="font-mono text-slate-200">search surface</span> instead.
        </p>
      </div>

      <!-- Steps -->
      <div class="relative mt-16">
        <!-- connecting line -->
        <div class="absolute left-0 top-12 hidden h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent md:block"></div>

        <div class="grid gap-6 md:grid-cols-3">
          <div
            v-for="step in steps"
            :key="step.n"
            class="group relative flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-panel/60 p-6 transition-colors hover:border-primary/30"
          >
            <div class="mb-5 flex items-center justify-between">
              <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-primary/20 to-accent/20 text-primary-light">
                <component :is="step.icon" class="h-5 w-5" />
              </div>
              <span class="font-mono text-sm text-slate-400">{{ step.n }}</span>
            </div>
            <h3 class="text-lg font-semibold text-white">{{ step.title }}</h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{{ step.body }}</p>
            <code class="mt-5 block overflow-x-auto whitespace-nowrap rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 font-mono text-xs text-slate-300">
              <span class="mr-1.5 text-accent">›</span>{{ step.code }}
            </code>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
