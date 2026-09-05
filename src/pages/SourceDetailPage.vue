<script setup lang="ts">
import type { SourceDetail } from '../data/contracts'
import { CATEGORIES, type ServerEntry } from '../data/servers'
import { siteHref } from '../lib/urls'
defineProps<{ source: ServerEntry; detail: SourceDetail }>()
</script>
<template>
  <article class="reading-page prose source-detail-page">
    <nav class="breadcrumbs metadata" aria-label="Breadcrumb">
      <a :href="siteHref('/')">Home</a><span aria-hidden="true">/</span
      ><a :href="siteHref('/sources/')">Sources</a><span aria-hidden="true">/</span
      ><span>{{ source.source }}</span>
    </nav>
    <header class="page-header">
      <h1>{{ source.source }} through GeneFoundry</h1>
      <p class="lead">{{ detail.summary }}</p>
    </header>
    <dl class="source-facts">
      <div>
        <dt>Research area</dt>
        <dd>{{ CATEGORIES.find((item) => item.id === source.category)?.label }}</dd>
      </div>
      <div>
        <dt>Namespace</dt>
        <dd>
          <code>{{ source.namespace }}</code>
        </dd>
      </div>
      <div>
        <dt>Listed tools</dt>
        <dd>{{ source.tools }}</dd>
      </div>
      <div>
        <dt>Upstream source</dt>
        <dd>
          <a :href="source.sourceUrl">{{ source.source }}</a>
        </dd>
      </div>
    </dl>
    <div class="source-layout">
      <div class="source-research">
        <section>
          <h2>Research tasks</h2>
          <ul>
            <li v-for="task in detail.tasks" :key="task">{{ task }}</li>
          </ul>
        </section>
        <section>
          <h2>Start with tool discovery</h2>
          <p>
            The catalog lists <code class="listed-tool">{{ source.sampleTool }}</code> as a
            representative tool. After connecting your client, inspect the tools and input
            requirements returned by the service before submitting a query.
          </p>
          <h3 class="identifiers-heading">Identifiers to prepare</h3>
          <ul>
            <li v-for="identifier in detail.identifiers" :key="identifier">{{ identifier }}</li>
          </ul>
          <p class="metadata">
            {{
              detail.dataVersion
                ? `Source version: ${detail.dataVersion}`
                : 'Source version not supplied by this website catalog.'
            }}
          </p>
        </section>
        <section>
          <h2>Review the response</h2>
          <p>
            Keep the source record link and submitted identifiers with your notes. Record the
            dataset version and retrieval date when available. This page does not contain a captured
            {{ source.source }} response.
          </p>
        </section>
      </div>
      <aside class="source-context" aria-label="Source context and documentation">
        <section>
          <h2>Scope and limitations</h2>
          <ul>
            <li v-for="limitation in detail.limitations" :key="limitation">{{ limitation }}</li>
          </ul>
          <p>
            The listed tool count describes this website’s catalog. It does not confirm current
            service availability. GeneFoundry is for research use only.
          </p>
        </section>
        <section>
          <h2>Source documentation and terms</h2>
          <ul>
            <li v-for="link in detail.terms" :key="link.url">
              <a :href="link.url">{{ link.label }}</a>
            </li>
          </ul>
          <div class="inline-links">
            <a :href="source.sourceUrl">Open {{ source.source }}</a
            ><a :href="`https://github.com/${source.repo}`">View integration code</a>
          </div>
        </section>
        <section class="review-note">
          <h2>Review record</h2>
          <p class="metadata">
            Documentation reviewed
            <time :datetime="detail.review.reviewedAt">{{ detail.review.reviewedAt }}</time>
          </p>
          <p>{{ detail.review.limitation }}</p>
          <ul>
            <li v-for="link in detail.review.sources" :key="link.url">
              <a :href="link.url">{{ link.label }}</a>
            </li>
          </ul>
        </section>
      </aside>
    </div>
    <div class="inline-links">
      <a class="button" :href="siteHref('/connect/')">Connect your client</a
      ><a :href="siteHref('/sources/')">All sources</a
      ><a v-if="source.namespace === 'gnomad'" :href="siteHref('/workflows/variant-evidence/')"
        >Variant evidence workflow</a
      >
    </div>
  </article>
</template>
<style scoped>
.source-detail-page h1 {
  max-width: 28ch;
}
.source-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 64px;
}
.source-layout > * {
  min-width: 0;
}
.source-layout p,
.source-layout ul {
  max-width: 65ch;
}
.source-context h2 {
  font-size: 1.5rem;
}
.source-detail-page > .inline-links {
  border-top: 1px solid var(--color-rule);
  margin-top: 40px;
  padding-top: 32px;
}
@media (max-width: 760px) {
  .source-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
}
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}
.source-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  border-block: 1px solid var(--color-rule);
  padding-block: 24px;
  margin: 0;
}
.source-facts > div {
  min-width: 0;
}
dt {
  color: var(--color-muted);
  font-size: 0.875rem;
  margin-bottom: 4px;
}
dd {
  margin: 0;
  font-weight: 500;
}
.identifiers-heading {
  margin-top: 24px;
}
.listed-tool {
  background: var(--color-brand-tint);
  padding: 2px 5px;
  border-radius: 3px;
}
.review-note {
  border-top: 1px solid var(--color-rule);
  padding-top: 32px;
}
@media (max-width: 760px) {
  .source-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 400px) {
  .source-facts {
    grid-template-columns: 1fr;
  }
}
</style>
