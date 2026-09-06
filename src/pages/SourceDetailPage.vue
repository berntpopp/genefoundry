<script setup lang="ts">
import { computed } from 'vue'
import type { SourceDetail, FleetProvenance, BackendProvenance } from '../data/contracts'
import { CATEGORIES, type ServerEntry } from '../data/servers'
import { siteHref } from '../lib/urls'
import provenanceJson from '../data/fleet-provenance.json'

const props = defineProps<{ source: ServerEntry; detail: SourceDetail }>()

const fleetProv = provenanceJson as unknown as FleetProvenance
const backendProv = computed<BackendProvenance | undefined>(() =>
  fleetProv.backends.find((b) => b.namespace === props.source.namespace)
)
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
        <section v-if="backendProv?.tools && backendProv.tools.length > 0" class="tools-directory">
          <h2>All available tools ({{ backendProv.tools.length }})</h2>
          <p>
            The router surfaces these tools namespaced under <code>{{ source.namespace }}_*</code>:
          </p>
          <div class="tool-list">
            <details v-for="t in backendProv.tools" :key="t.name" class="tool-card">
              <summary class="tool-summary">
                <code class="tool-name">{{ t.name }}</code>
                <span class="tool-brief">{{ t.description.split('\n')[0] }}</span>
              </summary>
              <div class="tool-body">
                <p class="metadata tool-id">
                  Router invocation: <code>{{ t.federated_name }}()</code>
                </p>
                <p class="tool-full-desc">{{ t.description }}</p>
                <div
                  v-if="
                    t.inputSchema?.properties && Object.keys(t.inputSchema.properties).length > 0
                  "
                  class="tool-parameters"
                >
                  <h3 class="tool-parameters-heading">Input parameters</h3>
                  <ul class="param-list">
                    <li v-for="(prop, propName) in t.inputSchema.properties" :key="propName">
                      <code>{{ propName }}</code>
                      <span class="param-type">({{ (prop as any).type || 'any' }})</span>
                      <span
                        v-if="t.inputSchema.required?.includes(propName as string)"
                        class="param-required"
                      >
                        [required]
                      </span>
                      <span v-if="(prop as any).description" class="param-desc">
                        — {{ (prop as any).description }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </section>
        <section v-if="backendProv" class="provenance-section">
          <h2>Database &amp; release provenance</h2>
          <div class="provenance-panel">
            <dl class="provenance-facts">
              <div>
                <dt>Data mode</dt>
                <dd>
                  <code>{{ backendProv.database_provenance.mode }}</code>
                </dd>
              </div>
              <div>
                <dt>Attestation</dt>
                <dd>
                  <span class="prov-status">{{ backendProv.database_provenance.status }}</span>
                </dd>
              </div>
              <div v-if="backendProv.database_provenance.release_tag">
                <dt>Data release tag</dt>
                <dd>
                  <code>{{ backendProv.database_provenance.release_tag }}</code>
                </dd>
              </div>
              <div v-if="backendProv.release.version">
                <dt>Release version</dt>
                <dd>
                  <code>{{ backendProv.release.tag || `v${backendProv.release.version}` }}</code>
                </dd>
              </div>
            </dl>
            <div v-if="backendProv.database_provenance.asset_sha256" class="provenance-image">
              <span class="metadata">Data asset SHA-256:</span>
              <code class="break-all">{{ backendProv.database_provenance.asset_sha256 }}</code>
            </div>
            <div v-if="backendProv.release.image" class="provenance-image">
              <span class="metadata">Container image:</span>
              <code class="break-all">{{ backendProv.release.image }}</code>
            </div>
            <p class="metadata provenance-footer">
              Inspect canonical provenance artifact:
              <a href="https://genefoundry.org/provenance" target="_blank" rel="noopener"
                >genefoundry.org/provenance (JSON)</a
              >
            </p>
          </div>
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
.tools-directory {
  margin-top: 32px;
}
.tool-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
.tool-card {
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-radius: 6px;
  padding: 10px 14px;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tool-summary {
  cursor: pointer;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tool-name {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 2px;
  font-weight: 600;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tool-brief {
  color: var(--color-muted);
  font-size: 0.875rem;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tool-body {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-rule);
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tool-id {
  margin-bottom: 8px;
}
.tool-full-desc {
  font-size: 0.9rem;
  white-space: pre-wrap;
  margin-bottom: 12px;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.tool-parameters-heading {
  font-size: 0.95rem;
  margin-top: 12px;
  margin-bottom: 6px;
}
.param-list {
  font-size: 0.85rem;
  margin-left: 16px;
}
.param-type {
  color: var(--color-muted);
}
.param-required {
  color: var(--color-brand);
  font-weight: 600;
  margin-left: 4px;
}
.param-desc {
  color: var(--color-ink);
}
.provenance-section {
  margin-top: 36px;
}
.provenance-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-radius: 6px;
  padding: 16px 20px;
}
.provenance-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 0 0 16px 0;
}
.prov-status {
  display: inline-block;
  background: var(--color-brand-tint);
  color: var(--color-brand);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}
.provenance-description {
  font-size: 0.9rem;
  margin-bottom: 12px;
}
.provenance-image {
  font-size: 0.85rem;
  margin-bottom: 12px;
}
.break-all {
  word-break: break-all;
  overflow-wrap: break-word;
}
.provenance-footer {
  margin-top: 12px;
  border-top: 1px solid var(--color-rule);
  padding-top: 8px;
}
@media (max-width: 600px) {
  .provenance-facts {
    grid-template-columns: 1fr;
  }
}
</style>
