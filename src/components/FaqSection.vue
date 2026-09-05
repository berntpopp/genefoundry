<script setup lang="ts">
import type { FaqEntry } from '../data/contracts'
defineProps<{ items: readonly FaqEntry[] }>()
</script>
<template>
  <section class="faq-section" aria-labelledby="faq-heading">
    <h2 id="faq-heading">Questions before you connect</h2>
    <details v-for="item in items" :key="item.id" :id="item.id">
      <summary>{{ item.question }}</summary>
      <p>{{ item.answer }}</p>
    </details>
  </section>
</template>
<style scoped>
.faq-section {
  margin-block: 3rem;
}
.faq-section h2 {
  margin-bottom: 1.5rem;
}
.faq-section details {
  border-top: 1px solid var(--color-rule);
}
.faq-section details:last-child {
  border-bottom: 1px solid var(--color-rule);
}
.faq-section summary {
  padding-block: 1rem;
  font-weight: 600;
}
.faq-section p {
  margin: 0;
  padding-bottom: 1.5rem;
  max-width: 65ch;
}
</style>
