<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowUpRight, Github } from 'lucide-vue-next'
import SectionLabel from './ui/SectionLabel.vue'
import { SERVERS, CATEGORIES, SERVER_COUNT, type ServerCategory } from '../data/servers'

type Filter = ServerCategory | 'all'
const active = ref<Filter>('all')

const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

const filtered = computed(() =>
  active.value === 'all' ? SERVERS : SERVERS.filter((s) => s.category === active.value)
)

const countFor = (id: Filter) =>
  id === 'all' ? SERVER_COUNT : SERVERS.filter((s) => s.category === id).length
</script>

<template>
  <section id="catalog" class="relative py-24 sm:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <SectionLabel index="02" label="Inside the fleet" />
        <h2 class="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          One <span class="serif-accent text-[1.08em]">namespace scheme</span>, zero collisions.
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-slate-400">
          Every backend keeps its clean tool names; the gateway owns the
          <span class="font-mono text-slate-200">&lt;namespace&gt;_&lt;tool&gt;</span> prefix, so
          <span class="font-mono text-slate-200">gnomad_search_genes</span> and
          <span class="font-mono text-slate-200">gtex_search</span> never clash.
        </p>
      </div>

      <!-- Filter chips -->
      <div class="mt-10 flex flex-wrap justify-center gap-2">
        <button
          @click="active = 'all'"
          :aria-pressed="active === 'all'"
          class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          :class="
            active === 'all'
              ? 'border-primary/40 bg-primary/15 text-white'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
          "
        >
          All <span class="ml-1 font-mono text-xs opacity-70">{{ countFor('all') }}</span>
        </button>
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          @click="active = cat.id"
          :aria-pressed="active === cat.id"
          class="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          :class="
            active === cat.id
              ? 'border-primary/40 bg-primary/15 text-white'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
          "
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="cat.dot"></span>
          {{ cat.label }}
          <span class="font-mono text-xs opacity-70">{{ countFor(cat.id) }}</span>
        </button>
      </div>

      <!-- Cards -->
      <div class="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="server in filtered"
          :key="server.namespace"
          class="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-panel/50 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-panel"
        >
          <div class="flex items-start justify-between gap-3">
            <code class="font-mono text-[15px] font-semibold text-primary-light">{{
              server.namespace
            }}</code>
            <span
              class="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-400"
            >
              {{ server.tools }} tools
            </span>
          </div>

          <p class="mt-2 text-sm leading-snug text-slate-300">{{ server.domain }}</p>

          <div class="mt-auto flex items-center justify-between gap-2 pt-4">
            <!-- Upstream data source -->
            <a
              :href="server.sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white"
              :class="categoryMap[server.category].text"
              :aria-label="`Open the ${server.source} data source`"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="categoryMap[server.category].dot"
              ></span>
              {{ server.source }}
              <ArrowUpRight class="h-3 w-3 opacity-60" />
            </a>

            <!-- MCP server repo -->
            <a
              :href="`https://github.com/${server.repo}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-white/20 hover:text-white"
              :aria-label="`${server.namespace}-link on GitHub`"
            >
              <Github class="h-3 w-3" />
              {{ server.namespace }}-link
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
