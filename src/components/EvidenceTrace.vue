<script setup lang="ts">
import { computed } from 'vue'
import type { Workflow } from '../data/contracts'
import { siteHref } from '../lib/urls'
const props = defineProps<{ workflow: Workflow; compact?: boolean }>()
const opening = computed(() => props.workflow.prompt.split('. ')[0] + '.')
</script>
<template>
  <figure class="evidence-trace" :class="{ compact }">
    <span class="trace-badge">{{
      workflow.result ? 'Actual GeneFoundry result' : 'Research workflow'
    }}</span>
    <p class="trace-question-label">You ask</p>
    <blockquote class="trace-question">{{ opening }}</blockquote>
    <template v-if="workflow.result">
      <p class="trace-label">GeneFoundry returned</p>
      <dl class="trace-metrics">
        <div v-for="row in workflow.result.tables[0]?.rows.slice(0, 2)" :key="row[0]">
          <dt>{{ row[0] }}</dt>
          <dd>{{ row[1] }}</dd>
        </div>
      </dl>
      <p class="trace-response">
        {{
          workflow.id === 'variant-evidence'
            ? 'Plus five ClinVar variant records, each with its classification, review status and original source link.'
            : workflow.result.summary
        }}
      </p>
      <figcaption>
        Retrieved
        <time :datetime="workflow.result.executedAt">{{ workflow.result.executedAt }}</time> ·
        {{ workflow.id === 'variant-evidence' ? 'gnomAD + ClinVar' : 'HPO + ClinGen' }}
      </figcaption>
    </template>
    <p v-else class="trace-response">{{ workflow.outcome }}</p>
    <a class="trace-workflow-link" :href="siteHref(`/workflows/${workflow.id}/`)"
      >See the result and try the prompt <span aria-hidden="true">→</span></a
    >
  </figure>
</template>
<style scoped>
.evidence-trace {
  margin: 0;
  padding: 1.5rem;
  border: 1px solid var(--color-rule);
  border-radius: 0.5rem;
  background: var(--color-surface);
  min-width: 0;
}
.trace-badge {
  color: var(--color-brand);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.35rem 0.6rem;
  background: var(--color-brand-tint);
  border-radius: 0.2rem;
}
.trace-question-label {
  margin: 1.5rem 0 0.5rem;
  font-size: 0.875rem;
  color: var(--color-muted);
}
.trace-question {
  font-size: 1.125rem;
  line-height: 1.5;
  margin: 0 0 1.25rem;
  font-weight: 600;
}
.trace-label {
  color: var(--color-muted);
  font-size: 0.875rem;
  margin-top: 1rem;
}
.trace-metrics {
  margin: 0.5rem 0 1rem;
}
.trace-metrics > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  padding-block: 0.875rem;
  border-bottom: 1px solid var(--color-rule);
  align-items: baseline;
}
.trace-metrics dt {
  font-size: 0.875rem;
}
.trace-metrics dd {
  margin: 0;
  color: var(--color-brand);
  font-weight: 600;
  font-size: 1.125rem;
  text-align: right;
}
.trace-response {
  margin-top: 0.5rem;
  font-size: 0.9375rem;
  line-height: 1.6;
}
figcaption {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.6;
}
.trace-workflow-link {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.9375rem;
}
@media (max-width: 390px) {
  .trace-metrics > div {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
  .trace-metrics dd {
    text-align: left;
  }
}
</style>
