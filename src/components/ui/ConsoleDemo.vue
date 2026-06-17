<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePrefersReducedMotion } from '../../composables'

/**
 * Decorative, looping "console" that demonstrates the router's discovery flow:
 * search_tools → ranked hits across namespaces → call_tool → grounded result.
 * Reveals one line at a time; honors prefers-reduced-motion by showing all at
 * once and never animating. Purely presentational (aria-hidden).
 */
interface Token {
  t: string
  c?: string
}
interface Line {
  tokens: Token[]
  prompt?: boolean
  indent?: number
}

const lines: Line[] = [
  { prompt: true, tokens: [{ t: 'search_tools', c: 'text-primary-light' }, { t: ' "population frequency of a kidney variant"', c: 'text-slate-200' }] },
  { tokens: [{ t: '→ 4 matches · 2 servers · ranked by BM25', c: 'text-slate-400' }] },
  { indent: 1, tokens: [{ t: 'gnomad_search_genes', c: 'text-primary-light' }, { t: '  gnomad', c: 'text-sky-300' }, { t: ' · variant·frequency', c: 'text-slate-400' }] },
  { indent: 1, tokens: [{ t: 'gnomad_resolve_variant_id', c: 'text-primary-light' }, { t: '  gnomad', c: 'text-sky-300' }, { t: ' · variant', c: 'text-slate-400' }] },
  { indent: 1, tokens: [{ t: 'gtex_get_median_expression', c: 'text-primary-light' }, { t: '  gtex', c: 'text-sky-300' }, { t: ' · expression', c: 'text-slate-400' }] },
  { tokens: [{ t: '', c: '' }] },
  { prompt: true, tokens: [{ t: 'call_tool', c: 'text-primary-light' }, { t: ' gnomad_search_genes ', c: 'text-slate-200' }, { t: '{ "query": "PKD1" }', c: 'text-violet-300' }] },
  { indent: 1, tokens: [{ t: '{', c: 'text-slate-400' }] },
  { indent: 2, tokens: [{ t: '"symbol"', c: 'text-violet-300' }, { t: ': ', c: 'text-slate-400' }, { t: '"PKD1"', c: 'text-emerald-300' }, { t: ',', c: 'text-slate-400' }] },
  { indent: 2, tokens: [{ t: '"af_popmax"', c: 'text-violet-300' }, { t: ': ', c: 'text-slate-400' }, { t: '0.000042', c: 'text-amber-300' }, { t: ',', c: 'text-slate-400' }] },
  { indent: 2, tokens: [{ t: '"source"', c: 'text-violet-300' }, { t: ': ', c: 'text-slate-400' }, { t: '"gnomAD v4.1"', c: 'text-emerald-300' }, { t: ',', c: 'text-slate-400' }] },
  { indent: 2, tokens: [{ t: '"cited"', c: 'text-violet-300' }, { t: ': ', c: 'text-slate-400' }, { t: 'true', c: 'text-emerald-400' }] },
  { indent: 1, tokens: [{ t: '}', c: 'text-slate-400' }] },
]

const reduced = usePrefersReducedMotion()
const visible = ref(0)
let timer: ReturnType<typeof setTimeout> | null = null

const shownLines = computed(() => (reduced.value ? lines.length : visible.value))

const tick = () => {
  if (visible.value < lines.length) {
    visible.value++
    timer = setTimeout(tick, 420)
  } else {
    // Hold the completed frame, then restart the loop
    timer = setTimeout(() => {
      visible.value = 0
      timer = setTimeout(tick, 600)
    }, 4200)
  }
}

onMounted(() => {
  if (reduced.value) {
    visible.value = lines.length
    return
  }
  timer = setTimeout(tick, 600)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    aria-hidden="true"
    class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]/90 shadow-2xl shadow-black/50 backdrop-blur-md"
  >
    <!-- Title bar -->
    <div class="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
      <div class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-rose-400/70"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70"></span>
      </div>
      <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">genefoundry · mcp</span>
    </div>

    <!-- Body -->
    <div class="min-h-[320px] px-5 py-4 font-mono text-[12.5px] leading-6 sm:text-[13px]">
      <transition-group name="line">
        <div
          v-for="(line, i) in lines"
          v-show="i < shownLines"
          :key="i"
          class="flex whitespace-pre"
          :style="{ paddingLeft: (line.indent || 0) * 1.1 + 'rem' }"
        >
          <span v-if="line.prompt" class="mr-2 select-none text-accent">$</span>
          <span class="min-w-0 flex-1 overflow-x-auto">
            <span v-for="(tok, j) in line.tokens" :key="j" :class="tok.c">{{ tok.t }}</span>
          </span>
        </div>
      </transition-group>
      <!-- Blinking cursor while streaming -->
      <span
        v-if="shownLines < lines.length"
        class="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent/80"
        :class="reduced ? '' : 'animate-pulse'"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.line-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.line-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
@media (prefers-reduced-motion: reduce) {
  .line-enter-active {
    transition: none;
  }
}
</style>
