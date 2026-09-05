<script setup lang="ts">
import { GITHUB_URL } from '../data/servers'
import { FAQS } from '../data/faq'
import { siteHref } from '../lib/urls'
import FaqSection from '../components/FaqSection.vue'
</script>
<template>
  <article class="container section about-page">
    <header class="page-header">
      <h1>About GeneFoundry</h1>
      <p class="lead">GeneFoundry is a gateway for a catalog of biomedical MCP servers.</p>
    </header>
    <div class="about-columns">
      <section class="about-project" aria-labelledby="project-purpose">
        <h2 id="project-purpose">A connection to biomedical sources</h2>
        <p>
          The website helps researchers and developers choose a source and connect an AI client.
          Source entries link to the upstream resource and integration code. The project is
          maintained by Bernt Popp.
        </p>
        <p>
          Model Context Protocol (MCP) lets compatible AI tools connect to external data and tools.
          GeneFoundry’s catalog describes the listed integrations; it does not establish a
          partnership with an upstream resource or confirm current service availability.
        </p>
        <div class="inline-links">
          <a :href="siteHref('/sources/')">Browse sources</a>
          <a :href="siteHref('/connect/')">Connect your client</a>
        </div>
      </section>
      <div class="about-details">
        <section aria-labelledby="project-maintenance">
          <h2 id="project-maintenance">Maintained in the open</h2>
          <p>
            Explore the router code and the repositories behind the listed source integrations.
            Report an integration issue with the source name, client and steps needed to reproduce
            it.
          </p>
          <div class="inline-links">
            <a :href="GITHUB_URL">Router repository</a>
            <a href="mailto:support@genefoundry.org">Contact</a>
          </div>
        </section>
        <section aria-labelledby="project-evidence">
          <h2 id="project-evidence">Review the evidence</h2>
          <p>
            GeneFoundry is for research use only and is not clinical decision support. Check
            upstream records, dataset context and source terms before relying on a result.
          </p>
          <a :href="siteHref('/limitations/')">Read the limitations</a>
        </section>
      </div>
    </div>
    <div class="about-faq"><FaqSection :items="FAQS" /></div>
  </article>
</template>
<style scoped>
.about-columns {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 64px;
}
.about-columns > * {
  min-width: 0;
}
.about-columns h2 {
  font-size: 1.75rem;
  max-width: 27ch;
  margin-bottom: 20px;
}
.about-columns p {
  margin-bottom: 20px;
  max-width: 65ch;
}
.about-project,
.about-details > section {
  border-top: 1px solid var(--color-rule);
  padding-top: 24px;
}
.about-details > section + section {
  margin-top: 32px;
}
.about-faq {
  margin-top: 64px;
}
.about-faq :deep(.faq-section) {
  margin-block: 0;
}
@media (max-width: 760px) {
  .about-columns {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
  }
  .about-faq {
    margin-top: 48px;
  }
}
</style>
