<script setup lang="ts">
import { siteHref } from '../lib/urls'
import { FAQS } from '../data/faq'
import FaqSection from '../components/FaqSection.vue'
const sections = [
  ['Research use', 'GeneFoundry is not clinical decision support.'],
  [
    'Catalog and availability',
    'Catalog entries and tool counts describe the website’s published inventory. A listed integration may be unavailable.'
  ],
  [
    'Source evidence',
    'Coverage, versions and response fields depend on the source and integration. Check the original record and note missing information.'
  ],
  [
    'AI summaries',
    'An AI-generated answer may misread or omit evidence. Review it against the source response.'
  ],
  [
    'Access and source terms',
    'Hosted OAuth sign-in is separate from upstream credentials and source terms. Review the relevant source and integration documentation.'
  ],
  [
    'Examples',
    'Recorded examples show dated source responses and link to their records. A captured result describes that execution; later source responses may differ.'
  ]
]
</script>
<template>
  <article class="reading-page prose">
    <header class="page-header">
      <p class="eyebrow">Research use only</p>
      <h1>Scope and limitations</h1>
      <p class="lead">
        Use GeneFoundry for research. Review source records and documentation before relying on a
        result.
      </p>
    </header>
    <div class="limitation-grid">
      <section v-for="[title, body] in sections" :key="title">
        <h2>{{ title }}</h2>
        <p>{{ body }}</p>
      </section>
    </div>
    <div class="inline-links">
      <a :href="siteHref('/sources/')">Review source details</a
      ><a :href="siteHref('/connect/')">Review client setup status</a>
    </div>
    <FaqSection :items="FAQS" />
  </article>
</template>

<style scoped>
.limitation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
}
.limitation-grid section {
  min-width: 0;
  margin: 0;
  border-top: 1px solid var(--color-rule);
  padding-top: 1.5rem;
}
.limitation-grid h2 {
  font-size: 1.375rem;
}
@media (max-width: 900px) {
  .limitation-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .limitation-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
