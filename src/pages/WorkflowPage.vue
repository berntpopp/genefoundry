<script setup lang="ts">
import { watch } from 'vue'
import type { Workflow } from '../data/contracts'
import { COPY } from '../data/copy'
import { useClipboard } from '../composables/useClipboard'
import { siteHref } from '../lib/urls'
const props = defineProps<{ workflow: Workflow }>()
const { copy, copied, error, pending, reset } = useClipboard()
watch(() => props.workflow.prompt, reset)
const sourceFor = (label: string) =>
  props.workflow.result?.sources.find((source) => source.label === label)?.url
</script>
<template>
  <article class="reading-page prose workflow-page">
    <header class="page-header">
      <p class="eyebrow"><a :href="siteHref('/workflows/')">Research workflows</a></p>
      <h1>{{ workflow.title }}</h1>
      <p class="lead">{{ workflow.summary }}</p>
    </header>
    <div class="workflow-content">
      <section class="workflow-prompt" aria-labelledby="prompt-heading">
        <h2 id="prompt-heading">Ask your AI client</h2>
        <blockquote>{{ workflow.prompt }}</blockquote>
        <div class="inline-links">
          <button
            class="button-secondary"
            type="button"
            :disabled="pending"
            :aria-busy="pending"
            @click="copy(workflow.prompt)"
          >
            {{
              pending ? COPY.states.copyPending : error ? COPY.states.copyRetry : 'Copy prompt'
            }}</button
          ><a :href="siteHref('/connect/')">Connect GeneFoundry first</a>
        </div>
        <p class="prompt-status" role="status" aria-live="polite">
          {{ error || (copied ? 'Prompt copied' : '') }}
        </p>
      </section>
      <section v-if="workflow.result" class="recorded-result" aria-labelledby="result-heading">
        <h2 id="result-heading">The result</h2>
        <p>{{ workflow.result.summary }}</p>
        <div
          v-for="table in workflow.result.tables"
          :key="table.caption"
          class="result-table-wrap"
          role="region"
          :aria-label="table.caption"
          tabindex="0"
        >
          <table>
            <caption>
              {{
                table.caption
              }}
            </caption>
            <thead>
              <tr>
                <th v-for="column in table.columns" :key="column" scope="col">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in table.rows" :key="index">
                <td v-for="(cell, column) in row" :key="column">
                  <a v-if="sourceFor(cell)" :href="sourceFor(cell)">{{ cell }}</a
                  ><template v-else>{{ cell }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-for="note in workflow.result.notes" :key="note" class="result-note">{{ note }}</p>
        <p class="metadata">
          Retrieved
          <time :datetime="workflow.result.executedAt">{{ workflow.result.executedAt }}</time>
          through {{ workflow.result.client }}.
        </p>
        <details class="result-sources">
          <summary>Original source records</summary>
          <ul>
            <li v-for="source in workflow.result.sources" :key="source.url">
              <a :href="source.url">{{ source.label }}</a>
            </li>
          </ul>
        </details>
      </section>
      <section v-else>
        <h2>What your client can return</h2>
        <p>{{ workflow.outcome }}</p>
      </section>
    </div>
    <details class="workflow-method">
      <summary>How GeneFoundry got this</summary>
      <ol class="workflow-steps">
        <li v-for="step in workflow.steps" :key="step.title">
          <h3>{{ step.title }}</h3>
          <p>{{ step.instruction }}</p>
          <p>
            <code>{{ step.tool }}</code>
          </p>
          <pre
            tabindex="0"
            role="region"
            :aria-label="`${step.tool} arguments`"
          ><code>{{ JSON.stringify(step.arguments, null, 2) }}</code></pre>
          <ul class="tool-references">
            <li v-for="link in step.evidence" :key="link.url">
              <a :href="link.url">{{ link.label }}</a>
            </li>
          </ul>
        </li>
      </ol>
    </details>
    <p v-for="limit in workflow.limitations" :key="limit" class="workflow-limit">{{ limit }}</p>
    <div class="inline-links">
      <a class="button" :href="siteHref('/connect/')">Try it with your client</a
      ><a :href="siteHref('/workflows/')">More research workflows</a>
    </div>
  </article>
</template>
<style scoped>
.workflow-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 3rem;
  align-items: start;
}
.workflow-content > * {
  min-width: 0;
  margin-top: 0;
}
@media (max-width: 900px) {
  .workflow-content {
    grid-template-columns: minmax(0, 1fr);
  }
}
.workflow-prompt {
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-radius: 0.5rem;
}
.workflow-prompt h2 {
  margin-top: 0;
  font-size: 1.375rem;
}
.workflow-prompt blockquote {
  margin: 1rem 0 1.5rem;
  line-height: 1.7;
}
.prompt-status {
  min-height: 1.5rem;
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
}
.result-table-wrap {
  max-width: 100%;
  overflow-x: auto;
  margin-block: 1.75rem;
}
.result-table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}
.result-table-wrap caption {
  text-align: left;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.result-table-wrap th {
  text-align: left;
  color: var(--color-muted);
  font-weight: 500;
  border-bottom: 1px solid var(--color-control-border);
  font-size: 0.875rem;
}
.result-table-wrap :is(td, th) {
  padding: 0.875rem 0.75rem 0.875rem 0;
  vertical-align: top;
  min-width: 7rem;
}
.result-table-wrap td {
  border-bottom: 1px solid var(--color-rule);
}
.result-table-wrap td:first-child {
  min-width: 10rem;
}
.result-note {
  font-size: 0.9375rem;
}
.result-sources {
  margin-top: 1rem;
}
.workflow-method {
  margin-block: 2rem;
  border-block: 1px solid var(--color-rule);
}
.workflow-method > summary {
  padding-block: 1rem;
  font-weight: 600;
}
.workflow-steps {
  padding-left: 1.5rem;
}
.workflow-steps > li {
  padding-left: 0.5rem;
  margin-block: 2rem;
}
.workflow-steps h3 {
  font-size: 1.125rem;
}
.workflow-steps pre {
  overflow-x: auto;
  padding: 1.25rem;
  background: var(--color-code);
  color: var(--color-code-text);
  border-radius: 0.35rem;
  font-size: 0.875rem;
}
.workflow-steps pre:focus-visible {
  outline: 2px solid var(--color-code-text);
  outline-offset: -5px;
}
.workflow-steps pre code {
  color: inherit;
  background: transparent;
  padding: 0;
}
.tool-references {
  font-size: 0.875rem;
}
.workflow-limit {
  color: var(--color-muted);
  font-size: 0.9375rem;
  margin-bottom: 2rem;
}
</style>
