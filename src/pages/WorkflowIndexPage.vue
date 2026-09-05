<script setup lang="ts">
import { WORKFLOWS } from '../data/workflows'
import { siteHref } from '../lib/urls'
</script>
<template>
  <article class="container section workflow-directory">
    <header class="page-header">
      <h1>Research workflows</h1>
      <p class="lead">
        Choose a task, copy the prompt and compare the result. These {{ WORKFLOWS.length }} examples
        were run through GeneFoundry, from variant annotation and literature review to mouse models
        and tissue expression.
      </p>
    </header>
    <div class="worked-examples">
      <section v-for="workflow in WORKFLOWS" :key="workflow.id">
        <h2>
          <a :href="siteHref(`/workflows/${workflow.id}/`)">{{ workflow.title }}</a>
        </h2>
        <p>{{ workflow.summary }}</p>
        <blockquote>{{ workflow.prompt }}</blockquote>
        <a class="button-secondary" :href="siteHref(`/workflows/${workflow.id}/`)"
          >Try this example <span aria-hidden="true">→</span></a
        >
      </section>
    </div>
  </article>
</template>
<style scoped>
.worked-examples {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 3rem;
}
.worked-examples section {
  min-width: 0;
  border-top: 1px solid var(--color-rule);
  padding-top: 1.5rem;
}
.worked-examples h2 {
  font-size: 1.5rem;
  line-height: 1.35;
}
.worked-examples h2 a {
  color: var(--color-ink);
  text-decoration: none;
}
.worked-examples h2 a:hover {
  text-decoration: underline;
}
.worked-examples section > p {
  margin-top: 1rem;
  color: var(--color-muted);
}
.worked-examples blockquote {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 2px solid var(--color-brand);
  line-height: 1.7;
}
@media (max-width: 760px) {
  .worked-examples {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
