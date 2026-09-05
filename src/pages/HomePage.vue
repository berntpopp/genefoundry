<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue'
import SourceList from '../components/SourceList.vue'
import ConnectSection from '../components/ConnectSection.vue'
import { COPY } from '../data/copy'
import { SERVERS, SERVER_COUNT } from '../data/servers'
import { FEATURED_NAMESPACES } from '../data/site'
import { WORKFLOWS } from '../data/workflows'
import { siteHref } from '../lib/urls'
const featured = FEATURED_NAMESPACES.flatMap((namespace) =>
  SERVERS.filter((source) => source.namespace === namespace)
)
</script>
<template>
  <HeroSection />
  <section id="catalog" class="section source-preview" aria-labelledby="preview-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <h2 id="preview-title">{{ COPY.sources.heading }}</h2>
          <p>{{ COPY.sources.lead }}</p>
        </div>
        <a :href="siteHref('/sources/')" class="text-link">{{ COPY.sources.previewAction }}</a>
      </div>
      <form class="preview-search" role="search" :action="siteHref('/sources/')" method="get">
        <label for="preview-search">{{ COPY.sources.searchLabel }}</label>
        <div>
          <input
            id="preview-search"
            name="q"
            type="search"
            maxlength="200"
            :placeholder="COPY.sources.searchPlaceholder"
          /><button type="submit" class="button-secondary">Search all sources</button>
        </div>
      </form>
      <SourceList :sources="featured" />
      <p class="preview-caption metadata">
        Showing {{ featured.length }} of {{ SERVER_COUNT }} catalog entries
      </p>
    </div>
  </section>
  <section id="how" class="section" aria-labelledby="workflows-title">
    <div class="container">
      <div class="section-heading">
        <div>
          <h2 id="workflows-title">See what you can ask</h2>
          <p>
            Try these prompts in a connected client. Each example explains the tool calls and source
            records to review.
          </p>
        </div>
        <a class="text-link" :href="siteHref('/workflows/')">All worked examples</a>
      </div>
      <div class="workflow-previews">
        <article v-for="workflow in WORKFLOWS" :key="workflow.id">
          <h3>
            <a :href="siteHref(`/workflows/${workflow.id}/`)">{{ workflow.title }}</a>
          </h3>
          <blockquote class="example-prompt">
            <p>{{ workflow.prompt }}</p>
          </blockquote>
          <a
            :href="siteHref(`/workflows/${workflow.id}/`)"
            :aria-label="`View worked example: ${workflow.title}`"
            >View worked example</a
          >
        </article>
      </div>
    </div>
  </section>
  <ConnectSection />
</template>
<style scoped>
.source-preview {
  border-top: 1px solid var(--color-rule);
}
.preview-search {
  max-width: 720px;
  margin-bottom: 32px;
}
.preview-search label {
  display: block;
  margin-bottom: 8px;
}
.preview-search > div {
  display: flex;
  gap: 12px;
}
.preview-search button {
  flex-shrink: 0;
}
.preview-caption {
  margin-top: 20px;
}
.workflow-previews {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}
.workflow-previews article {
  min-width: 0;
  border-top: 1px solid var(--color-control-border);
  padding-top: 24px;
}
.workflow-previews h3 {
  max-width: 29ch;
  margin-block: 12px 16px;
  font-size: 1.5rem;
}
.workflow-previews h3 a {
  color: var(--color-ink);
  text-decoration: none;
}
.workflow-previews h3 a:hover {
  color: var(--color-brand);
  text-decoration: underline;
}
.workflow-previews article > p:not(.metadata) {
  max-width: 54ch;
  color: var(--color-muted);
  margin-bottom: 20px;
}
.example-prompt {
  margin: 0 0 24px;
  padding: 0;
  max-width: 54ch;
  color: var(--color-ink);
}
.example-prompt p::before {
  content: '“';
}
.example-prompt p::after {
  content: '”';
}
@media (max-width: 640px) {
  .preview-search > div {
    flex-direction: column;
    align-items: stretch;
  }
  .workflow-previews {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
}
</style>
