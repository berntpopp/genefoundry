<script setup lang="ts">
import { SERVERS, SERVER_COUNT, TOOL_COUNT } from '../data/servers'

// One label per unique upstream source, in catalog order.
const sources = Array.from(new Set(SERVERS.map((s) => s.source)))

const stats = [
  { value: '1', label: 'endpoint to add' },
  { value: String(SERVER_COUNT), label: 'federated servers' },
  { value: String(TOOL_COUNT), label: 'tools, searchable' },
]
</script>

<template>
  <section class="relative border-y border-white/[0.06] bg-ink-2/60">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Stat band -->
      <div class="grid grid-cols-3 gap-x-4 gap-y-8 py-12 sm:py-14">
        <div
          v-for="(s, i) in stats"
          :key="s.label"
          class="flex flex-col items-center text-center sm:border-r sm:border-white/[0.07]"
          :class="{ 'sm:border-r-0': i === stats.length - 1 }"
        >
          <span class="font-display text-5xl leading-none text-white sm:text-6xl">
            {{ s.value }}
          </span>
          <span class="mt-3 max-w-[10rem] text-sm text-slate-400">{{ s.label }}</span>
        </div>
      </div>

      <!-- Source marquee -->
      <div class="border-t border-white/[0.06] py-7">
        <p class="mb-5 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">
          Federating trusted biomedical sources
        </p>
        <div class="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div class="flex w-max animate-marquee gap-10 group-hover:[animation-play-state:paused]">
            <span
              v-for="(name, i) in [...sources, ...sources]"
              :key="name + i"
              class="whitespace-nowrap text-base font-semibold text-slate-400/80 transition-colors hover:text-white"
            >
              {{ name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
