<script setup lang="ts">
import type { ClientGuide } from '../data/contracts'
import { COPY } from '../data/copy'
import { HOSTED_ENDPOINT } from '../data/servers'
import { siteHref } from '../lib/urls'
import CommandCard from '../components/ui/CommandCard.vue'
defineProps<{ guide: ClientGuide }>()
</script>
<template>
  <article class="reading-page prose">
    <header class="page-header">
      <p class="eyebrow"><a :href="siteHref('/connect/')">Client guides</a> / {{ guide.label }}</p>
      <h1>Connect {{ guide.label }} to GeneFoundry</h1>
      <p class="lead">
        Use GeneFoundry’s hosted MCP endpoint with {{ guide.label }}. Review sign-in requirements
        before setting up the connection.
      </p>
    </header>
    <div class="client-content">
      <div>
        <section>
          <h2>Before you begin</h2>
          <p class="notice">{{ COPY.connect.oauthNote }}</p>
          <ul>
            <li v-for="item in guide.prerequisites" :key="item">{{ item }}</li>
          </ul>
        </section>
        <section>
          <h2>Add GeneFoundry</h2>
          <ol>
            <li v-for="step in guide.steps" :key="step">{{ step }}</li>
          </ol>
          <CommandCard
            :key="`${guide.id}-endpoint`"
            :command="HOSTED_ENDPOINT"
            :label="COPY.connect.endpointLabel"
            copy-kind="endpoint"
          /><CommandCard
            v-if="guide.code !== null"
            :key="`${guide.id}-setup`"
            :command="guide.code"
            :label="`${guide.label} setup`"
            copy-kind="setup"
          />
          <p v-if="guide.recipeState === 'documentation-only'" class="metadata">
            Setup not tested with this client. Official instructions reviewed
            <time :datetime="guide.review.reviewedAt">{{ guide.review.reviewedAt }}</time
            >.
          </p>
          <p v-else-if="guide.recipeState === 'verified'" class="metadata">
            Setup verified
            {{ guide.recipeTest.clientVersion ? `with ${guide.recipeTest.clientVersion}` : '' }} on
            {{ guide.recipeTest.testedAt }} ({{ guide.recipeTest.platform }}).
          </p>
          <p v-if="guide.recipeState === 'documented'" class="metadata">
            Instructions checked against official documentation on {{ guide.review.reviewedAt }}.
          </p>
          <p v-for="doc in guide.documentation" :key="doc.url">
            <a :href="doc.url">{{ doc.label }}</a>
          </p>
        </section>
        <section>
          <h2>Sign in</h2>
          <p>
            Complete the browser sign-in requested by your client. Return to the client to continue.
          </p>
        </section>
      </div>
      <aside class="client-help">
        <section>
          <h2>Check the connection</h2>
          <ul>
            <li v-for="item in guide.verification" :key="item">{{ item }}</li>
          </ul>
          <p>A successful copy does not confirm a connection.</p>
        </section>
        <section id="troubleshooting">
          <h2>Troubleshooting</h2>
          <ul>
            <li v-for="item in guide.troubleshooting" :key="item">{{ item }}</li>
          </ul>
          <p>{{ COPY.connect.backendNote }}</p>
          <p>
            For setup help, <a href="mailto:support@genefoundry.org">contact GeneFoundry</a>.
            Include your client version and reproducible steps, with credentials and personal data
            removed.
          </p>
        </section>
        <section>
          <h2>Next steps</h2>
          <div class="inline-links">
            <a :href="siteHref('/sources/')">Explore sources</a
            ><a :href="siteHref('/workflows/')">Follow a workflow</a>
          </div>
        </section>
      </aside>
    </div>
  </article>
</template>

<style scoped>
.client-content {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 4rem;
  align-items: start;
}
.client-content > * {
  min-width: 0;
}
.client-content > div > section:first-child {
  margin-top: 0;
}
.client-help {
  padding-left: 2rem;
  border-left: 1px solid var(--color-rule);
}
.client-help section:first-child {
  margin-top: 0;
}
.client-help h2 {
  font-size: 1.375rem;
}
@media (max-width: 760px) {
  .client-content {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
  .client-help {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
