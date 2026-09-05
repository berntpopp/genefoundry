<script setup lang="ts">
import { COPY } from '../data/copy'
import { SERVER_COUNT, TOOL_COUNT } from '../data/servers'
import { WORKFLOWS } from '../data/workflows'
import { siteHref } from '../lib/urls'
import EvidenceTrace from './EvidenceTrace.vue'
import HeroBackdrop from './HeroBackdrop.vue'
const workflow = WORKFLOWS.find((item) => item.id === 'variant-evidence')!
</script>
<template>
  <section id="intro" class="container hero" aria-labelledby="intro-title">
    <HeroBackdrop />
    <div class="hero-copy">
      <h1 id="intro-title">{{ COPY.hero.title }}</h1>
      <p class="lead">{{ COPY.hero.lead }}</p>
      <div class="hero-actions">
        <a class="button" :href="siteHref('/#connect')"
          >{{ COPY.hero.primaryAction
          }}<svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M12 5v14m-5-5 5 5 5-5" /></svg></a
        ><a class="text-link" :href="siteHref('/workflows/variant-evidence/')">{{
          COPY.hero.secondaryAction
        }}</a>
      </div>
      <p class="hero-requirements metadata">{{ COPY.hero.requirements }}</p>
      <p v-if="SERVER_COUNT" class="hero-catalog metadata">
        {{ SERVER_COUNT }} MCP servers · {{ TOOL_COUNT }} tools listed in the catalog
      </p>
    </div>
    <EvidenceTrace :workflow="workflow" compact />
  </section>
</template>
<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 64px;
  align-items: start;
  padding-block: 72px 80px;
}
.hero > * {
  min-width: 0;
}
.hero-copy .lead {
  margin-top: 24px;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px 24px;
  margin-top: 32px;
}
.hero-requirements {
  margin-top: 16px;
  max-width: 48ch;
}
.hero-catalog {
  border-top: 1px solid var(--color-rule);
  margin-top: 28px;
  padding-top: 16px;
  max-width: 49ch;
}
@media (max-width: 1000px) {
  .hero {
    gap: 32px;
  }
}
@media (max-width: 800px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
    padding-block: 40px 72px;
    gap: 40px;
  }
  .hero-copy {
    max-width: 620px;
  }
}
@media (max-width: 640px) {
  .hero-actions {
    gap: 16px 24px;
    margin-top: 24px;
  }
  .hero-catalog {
    margin-top: 24px;
  }
}
</style>
