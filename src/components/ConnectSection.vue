<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ClientId } from '../data/contracts'
import { CLIENT_GUIDES } from '../data/clients'
import { COPY } from '../data/copy'
import { HOSTED_ENDPOINT } from '../data/servers'
import { siteHref } from '../lib/urls'
import CommandCard from './ui/CommandCard.vue'
const props = defineProps<{ initialClientId?: ClientId }>()
const selectedId = ref<ClientId>(props.initialClientId ?? 'claude-ai')
const guide = computed(
  () => CLIENT_GUIDES.find((client) => client.id === selectedId.value) ?? CLIENT_GUIDES[0]!
)
</script>
<template>
  <section id="connect" class="connect-section section" aria-labelledby="connect-heading">
    <div class="container">
      <div class="section-heading">
        <div>
          <h2 id="connect-heading">{{ COPY.connect.heading }}</h2>
          <p class="lead">{{ COPY.connect.intro }}</p>
        </div>
      </div>
      <div class="connect-layout">
        <div class="connect-setup">
          <label for="client-select">{{ COPY.connect.clientLabel }}</label>
          <select id="client-select" v-model="selectedId">
            <option v-for="client in CLIENT_GUIDES" :key="client.id" :value="client.id">
              {{ client.label }}
            </option>
          </select>
          <div :key="guide.id" class="selected-guide">
            <p class="client-summary">{{ guide.summary }}</p>
            <ol class="setup-steps">
              <li v-for="step in guide.steps" :key="step">{{ step }}</li>
            </ol>
            <p class="oauth-note">{{ COPY.connect.oauthNote }}</p>
            <CommandCard
              :command="HOSTED_ENDPOINT"
              :label="COPY.connect.endpointLabel"
              copy-kind="endpoint"
            />
            <CommandCard
              v-if="guide.code !== null"
              :command="guide.code"
              :label="`${guide.label} setup`"
              copy-kind="setup"
            />
            <div class="inline-links">
              <a :href="siteHref(`/connect/${guide.id}/`)">Open {{ guide.label }} guide</a
              ><a v-for="doc in guide.documentation" :key="doc.url" :href="doc.url"
                >Official instructions</a
              >
            </div>
            <p v-if="guide.recipeState === 'documented'" class="setup-status metadata">
              Instructions checked against official documentation on {{ guide.review.reviewedAt }}.
            </p>
            <p v-if="guide.recipeState === 'verified'" class="setup-status metadata">
              Setup verified on {{ guide.recipeTest.testedAt }}.
            </p>
            <p v-if="guide.recipeState === 'documentation-only'" class="setup-status metadata">
              Setup not tested with this client.
            </p>
          </div>
        </div>
        <div class="connect-guidance">
          <h3>Once you’re connected</h3>
          <p>Ask your client to discover GeneFoundry’s tools, then try a research question.</p>
          <div class="next-example">
            <p>Start with a concrete example</p>
            <a :href="siteHref('/workflows/variant-evidence/')"
              >See actual HNF1B gene and variant results</a
            >
          </div>
          <h3>Need help?</h3>
          <p>Check the endpoint and complete any pending browser sign-in.</p>
          <p>
            <a :href="siteHref(`/connect/${guide.id}/#troubleshooting`)">Open troubleshooting</a>
          </p>
          <nav aria-label="All client guides" class="all-client-guides">
            <h3>Other clients</h3>
            <ul>
              <li v-for="client in CLIENT_GUIDES" :key="client.id">
                <a :href="siteHref(`/connect/${client.id}/`)">{{ client.label }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.connect-section {
  border-top: 1px solid var(--color-rule);
}
.connect-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 5rem);
}
.connect-layout > * {
  min-width: 0;
}
.connect-setup label {
  display: block;
  margin-block: 0 0.5rem;
  font-weight: 600;
}
.connect-setup select {
  width: 100%;
  min-width: 0;
  min-height: 48px;
}
.client-summary {
  margin-top: 1.25rem;
}
.setup-steps {
  padding-left: 1.5rem;
  margin-block: 1.25rem;
}
.setup-steps li {
  padding-left: 0.25rem;
  margin-block: 0.75rem;
}
.oauth-note {
  color: var(--color-muted);
  font-size: 0.875rem;
  margin-top: 1.25rem;
}
.setup-status {
  margin-top: 0.75rem;
}
.connect-guidance h3:not(:first-child) {
  margin-top: 2rem;
}
.connect-guidance p {
  margin-block: 0.75rem;
}
.next-example {
  margin-block: 1.5rem;
  padding-block: 1rem;
  border-block: 1px solid var(--color-rule);
}
.next-example p {
  font-size: 0.875rem;
  color: var(--color-muted);
}
.all-client-guides ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 1rem;
  list-style: none;
  padding: 0;
}
.all-client-guides a {
  display: inline-block;
  padding-block: 0.4rem;
}
@media (max-width: 760px) {
  .connect-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 360px) {
  .all-client-guides ul {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
