<script setup lang="ts">
/**
 * Numbered editorial section label. Replaces the repeated
 * "mono uppercase magenta eyebrow" with a numbered index + hairline,
 * giving the page editorial rhythm instead of a templated sameness.
 */
withDefaults(
  defineProps<{
    /** Two-digit section index, e.g. "01". */
    index: string
    /** Short label, e.g. "How it works". */
    label: string
    /** Horizontal alignment of the label row. */
    align?: 'center' | 'start'
  }>(),
  { align: 'center' },
)
</script>

<template>
  <div
    class="flex items-center gap-3"
    :class="align === 'center' ? 'justify-center' : 'justify-start'"
  >
    <span class="font-mono text-[11px] tracking-[0.22em] text-primary-light">{{ index }}</span>
    <span class="h-px w-9 bg-white/15"></span>
    <span class="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-400">{{ label }}</span>
  </div>
</template>
