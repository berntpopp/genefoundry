<script setup lang="ts">
import { Boxes, ScanSearch, FileCheck2, Cable, Github } from 'lucide-vue-next'
import SectionLabel from './ui/SectionLabel.vue'
import { GITHUB_URL, TOOL_COUNT } from '../data/servers'

const features = [
  {
    icon: Boxes,
    title: 'Collision-free namespacing',
    body: 'Backends keep clean, unprefixed names; the router owns the <namespace>_<tool> prefix at the edge. Mount a dozen servers and nothing collides. Names stay valid for Gemini Remote MCP too.',
    span: 'lg:col-span-2',
    featured: true,
  },
  {
    icon: ScanSearch,
    title: 'Search-based discovery',
    body: `search_tools ranks the catalog by BM25 relevance, so models pull schemas on demand instead of paying for all ${TOOL_COUNT} up front.`,
    span: 'lg:col-span-1',
  },
  {
    icon: FileCheck2,
    title: 'Faithful by design',
    body: 'The router shapes the surface but never rewrites a backend’s data. Every result mirrors its source.',
    span: 'lg:col-span-1',
  },
  {
    icon: Cable,
    title: 'One config, every host',
    body: 'A single Streamable-HTTP endpoint works with Claude, Cursor, Gemini and any MCP client. Swap or add backends without touching host config.',
    span: 'lg:col-span-2',
  },
]
</script>

<template>
  <section id="features" class="relative py-24 sm:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <SectionLabel index="03" label="Built for trust" />
        <h2 class="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          A thin <span class="serif-accent text-[1.08em]">gateway</span> that gets out of the way.
        </h2>
        <p class="mt-5 text-lg leading-relaxed text-slate-400">
          A client to each backend, a server to your host. GeneFoundry shapes the surface
          without standing between your agent and the evidence.
        </p>
      </div>

      <div class="mt-14 grid gap-3.5 lg:grid-cols-3">
        <article
          v-for="f in features"
          :key="f.title"
          class="group relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 transition-colors hover:border-primary/30"
          :class="[
            f.span,
            f.featured ? 'bg-gradient-to-br from-primary/[0.12] via-accent/[0.06] to-transparent' : 'bg-panel/50',
          ]"
        >
          <div class="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-primary-light">
            <component :is="f.icon" class="h-5 w-5" />
          </div>
          <h3 class="text-lg font-semibold text-white">{{ f.title }}</h3>
          <p class="mt-2 max-w-prose text-sm leading-relaxed text-slate-400">{{ f.body }}</p>
        </article>

        <!-- Open source CTA card (full width) -->
        <article
          class="group relative flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-panel/50 p-6 sm:flex-row sm:items-center lg:col-span-3"
        >
          <div class="flex items-start gap-4">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-primary-light">
              <Github class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">Open source, MIT licensed</h3>
              <p class="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
                A ~600-LOC FastMCP 3.x router: config-driven, mypy-strict, tested. Self-host it
                or use the hosted endpoint. Read the code, file an issue, add a server.
              </p>
            </div>
          </div>
          <a
            :href="GITHUB_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
          >
            <Github class="h-4 w-4" />
            genefoundry-router
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
