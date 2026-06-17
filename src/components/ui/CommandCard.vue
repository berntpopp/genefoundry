<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'
import { useClipboard } from '../../composables'

/**
 * Glass "copy this command" card: the page's signature interaction.
 * Renders a monospace command with a one-click copy button.
 */
const props = withDefaults(
  defineProps<{
    /** Raw text copied to the clipboard. */
    command: string
    /** Optional terminal-style label shown in the title bar. */
    label?: string
    /** Optional leading prompt glyph rendered before the command (not copied). */
    prompt?: string
  }>(),
  { label: 'terminal', prompt: '$' },
)

const { copied, copy } = useClipboard()
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-2xl shadow-black/40"
  >
    <!-- Title bar -->
    <div class="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
      <div class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-white/15"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-white/15"></span>
        <span class="h-2.5 w-2.5 rounded-full bg-white/15"></span>
      </div>
      <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{{ label }}</span>
    </div>

    <!-- Command row -->
    <div class="flex items-center gap-3 px-4 py-4">
      <code class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-200">
        <span v-if="prompt" class="mr-2 select-none text-accent">{{ prompt }}</span><span>{{ command }}</span>
      </code>
      <button
        type="button"
        @click="copy(props.command)"
        class="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        :aria-label="copied ? 'Command copied' : 'Copy command to clipboard'"
      >
        <component :is="copied ? Check : Copy" class="h-3.5 w-3.5" :class="copied ? 'text-emerald-400' : ''" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>
  </div>
</template>
