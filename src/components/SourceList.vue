<script setup lang="ts">
import type { ServerEntry } from '../data/servers'
import { siteHref } from '../lib/urls'
withDefaults(defineProps<{ sources: readonly ServerEntry[]; headingLevel?: 2 | 3 }>(), {
  headingLevel: 3
})
</script>
<template>
  <div class="source-list">
    <div class="source-columns metadata" aria-hidden="true">
      <span>Source</span><span>Research task</span><span>Listed tools</span><span>Details</span>
    </div>
    <ul>
      <li v-for="source in sources" :key="source.namespace">
        <article class="source-record" data-testid="source-record">
          <div>
            <component :is="`h${headingLevel}`" class="source-name">
              <a :href="siteHref(`/sources/${source.namespace}/`)">{{ source.source }}</a>
            </component>
            <p class="source-namespace metadata">{{ source.namespace }}</p>
          </div>
          <p class="source-task">
            <span class="mobile-label metadata">Research task</span>{{ source.domain }}
          </p>
          <p class="source-count">
            <span class="mobile-label metadata">Listed tools</span
            ><span
              :aria-label="`${source.tools} listed ${source.tools === 1 ? 'tool' : 'tools'}`"
              >{{ source.tools }}</span
            >
          </p>
          <a
            class="source-detail-link"
            :href="siteHref(`/sources/${source.namespace}/`)"
            :aria-label="`View source: ${source.source} details`"
            >View source<svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M5 12h14m-5-5 5 5-5 5" /></svg
          ></a>
        </article>
      </li>
    </ul>
  </div>
</template>
<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.source-columns,
.source-record {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr) minmax(90px, 0.45fr) 120px;
  gap: 24px;
  align-items: center;
}
.source-columns {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-control-border);
}
.source-record {
  padding: 24px 0;
  border-bottom: 1px solid var(--color-rule);
}
.source-record > * {
  min-width: 0;
}
.source-name {
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: normal;
  font-size: 1rem;
  line-height: 1.5;
}
.source-name a {
  color: var(--color-ink);
  text-decoration: none;
}
.source-name a:hover {
  color: var(--color-brand);
  text-decoration: underline;
}
.source-namespace {
  margin-top: 4px;
}
.source-task {
  color: var(--color-muted);
  font-size: 0.9375rem;
}
.source-count {
  font-variant-numeric: tabular-nums;
}
.source-detail-link {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 0.875rem;
  min-height: 44px;
}
.source-detail-link svg {
  flex-shrink: 0;
}
.mobile-label {
  display: none;
}
@media (max-width: 700px) {
  .source-columns {
    display: none;
  }
  .source-list {
    border-top: 1px solid var(--color-control-border);
  }
  .source-record {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 16px 24px;
    padding-block: 24px;
  }
  .source-record > :first-child,
  .source-task {
    grid-column: 1 / -1;
  }
  .source-name {
    font-size: 1.125rem;
  }
  .mobile-label {
    display: block;
    margin-bottom: 4px;
  }
  .source-count {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }
  .source-count .mobile-label {
    margin: 0;
  }
}
</style>
