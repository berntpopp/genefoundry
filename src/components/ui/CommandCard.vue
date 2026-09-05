<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { useClipboard } from '../../composables'
import { COPY } from '../../data/copy'
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
const props = withDefaults(
  defineProps<{
    command: string
    label?: string
    prompt?: string
    copyKind?: 'endpoint' | 'setup'
  }>(),
  { label: 'Setup instructions', prompt: '', copyKind: 'setup' }
)
const { copied, pending, error, copy, reset } = useClipboard()
watch(() => [props.command, props.copyKind, props.label], reset)
const success = computed(() =>
  props.copyKind === 'endpoint' ? COPY.states.copyEndpointSuccess : COPY.states.copySetupSuccess
)
const action = computed(() =>
  pending.value
    ? COPY.states.copyPending
    : error.value
      ? COPY.states.copyRetry
      : props.copyKind === 'endpoint'
        ? 'Copy endpoint'
        : 'Copy setup'
)
</script>
<template>
  <div class="command-card">
    <div class="command-heading">
      <span>{{ label }}</span>
      <button
        type="button"
        :disabled="!mounted || pending"
        :aria-busy="pending"
        @click="copy(command)"
      >
        <component :is="copied ? Check : Copy" aria-hidden="true" :size="16" />
        {{ action }}
      </button>
    </div>
    <pre
      tabindex="0"
      role="region"
      :aria-label="label"
    ><code><span v-if="prompt" aria-hidden="true" class="command-prompt">{{ prompt }} </span>{{ command }}</code></pre>
    <p class="copy-feedback" role="status" aria-live="polite" :class="{ 'copy-error': error }">
      {{ pending ? COPY.states.copyPending : error || (copied ? success : '') }}
    </p>
  </div>
</template>
<style scoped>
.command-card {
  min-width: 0;
  color: var(--color-code-text);
  background: var(--color-code);
  border-radius: 0.5rem;
  margin-block: 1.5rem;
}
.command-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--color-code-muted);
  font-size: 0.875rem;
}
.command-heading button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-code-muted);
  border-radius: 0.25rem;
  color: var(--color-code-text);
  background: transparent;
  cursor: pointer;
}
.command-card :is(button, pre):focus-visible {
  outline: 2px solid var(--color-code-text);
  outline-offset: 3px;
}
.command-heading button:disabled {
  cursor: progress;
}
.command-card pre {
  margin: 0;
  padding: 1.25rem;
  overflow-x: auto;
  background: transparent;
  color: inherit;
  white-space: pre;
  font-size: 0.9375rem;
}
.command-card code {
  font-family: var(--font-mono, monospace);
  color: inherit;
  background: transparent;
  padding: 0;
}
.command-prompt {
  color: var(--color-code-muted);
  user-select: none;
}
.copy-feedback {
  padding: 0 1.25rem 1rem;
  margin: 0;
  min-height: 2.5rem;
  font-size: 0.875rem;
}
.copy-error {
  font-weight: 600;
}
</style>
