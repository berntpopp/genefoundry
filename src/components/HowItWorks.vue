<script setup lang="ts">
import SectionLabel from './ui/SectionLabel.vue'
import { ADD_COMMAND, TOOL_COUNT } from '../data/servers'

const steps = [
  {
    title: 'Add one endpoint',
    body: 'Point any MCP host at the hosted router. No install, no per-server setup, no keys.',
    code: ADD_COMMAND
  },
  {
    title: 'Discover with search_tools',
    body: `Your agent searches the federated catalog by relevance and pulls only the schemas it needs, not all ${TOOL_COUNT}.`,
    code: 'search_tools("splice impact of a variant")'
  },
  {
    title: 'Run with call_tool',
    body: 'Invoke any hit by its namespaced name. Results stay grounded in the source, with citations, never rewritten.',
    code: 'call_tool("spliceai_predict_splicing", { … })'
  }
]
</script>

<template>
  <section id="how" class="relative py-24 sm:py-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <!-- Left: sticky editorial intro -->
        <div class="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <SectionLabel index="01" label="How it works" align="start" />
          <h2
            class="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl"
          >
            One <span class="serif-accent text-[1.1em]">search box</span>,<br />
            not a wall of tools.
          </h2>
          <p class="mt-5 max-w-md text-lg leading-relaxed text-slate-400">
            Mounting {{ TOOL_COUNT }} tools into a model burns tens of thousands of tokens before
            any work starts, and floods the context with schemas it will never call. GeneFoundry
            exposes a <span class="font-mono text-slate-200">search surface</span> instead.
          </p>
        </div>

        <!-- Right: stepped sequence with serif numerals -->
        <div class="relative min-w-0">
          <!-- vertical connecting rule (sibling of the list, not a list child) -->
          <div
            class="absolute bottom-6 left-[1.4rem] top-4 hidden w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent sm:block"
          ></div>

          <ol>
            <li
              v-for="(step, i) in steps"
              :key="step.title"
              class="relative flex gap-5 pb-10 last:pb-0"
            >
              <!-- numbered node -->
              <div
                class="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-panel shadow-lg shadow-black/30"
              >
                <span class="font-display text-2xl italic leading-none text-primary-light">{{
                  i + 1
                }}</span>
              </div>

              <div class="min-w-0 flex-1 pt-1.5">
                <h3 class="text-lg font-semibold text-white">{{ step.title }}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-slate-400">{{ step.body }}</p>
                <code
                  class="mt-3.5 block overflow-x-auto whitespace-nowrap rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5 font-mono text-xs text-slate-300"
                >
                  <span class="mr-1.5 text-accent">›</span>{{ step.code }}
                </code>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
