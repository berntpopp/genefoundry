<script setup lang="ts">
import { ArrowRight, Github, ShieldAlert } from 'lucide-vue-next'
import CommandCard from './ui/CommandCard.vue'
import ConsoleDemo from './ui/ConsoleDemo.vue'
import { ADD_COMMAND, GITHUB_URL, SERVER_COUNT, TOOL_COUNT } from '../data/servers'
</script>

<template>
  <section class="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <!-- Copy -->
        <div class="min-w-0 text-center lg:text-left">
          <!-- Status pill -->
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur"
          >
            <span class="relative flex h-2 w-2">
              <span
                class="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400"
              ></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </span>
            <span>Live</span>
            <span class="text-slate-600">·</span>
            <span class="font-mono text-slate-400"
              >{{ SERVER_COUNT }} servers · {{ TOOL_COUNT }} tools</span
            >
          </div>

          <h1
            class="text-[2.65rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[4rem]"
          >
            Every biomedical MCP,<br class="hidden sm:block" />
            behind <span class="serif-accent text-[1.08em]">one endpoint.</span>
          </h1>

          <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0">
            Add one endpoint and your AI host taps {{ SERVER_COUNT }} biomedical MCP servers:
            gnomAD, Orphanet, HPO, MaveDB, ClinGen, GTEx and more.
            <span class="text-slate-200">All {{ TOOL_COUNT }} tools, discovered on demand.</span>
          </p>

          <!-- Command -->
          <div class="mx-auto mt-8 max-w-xl lg:mx-0">
            <CommandCard :command="ADD_COMMAND" label="add to any mcp host" />
            <p class="mt-2.5 text-center font-mono text-xs text-slate-400 lg:text-left">
              No signup · one line · works with Claude, Cursor &amp; Gemini
            </p>
          </div>

          <!-- CTAs -->
          <div class="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#how"
              class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
            >
              See how it works
              <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              :href="GITHUB_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
            >
              <Github class="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          <!-- Research-use disclaimer -->
          <div class="mt-7 inline-flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert class="h-3.5 w-3.5 text-amber-400/80" />
            <span>Research use only. Not clinical decision support.</span>
          </div>
        </div>

        <!-- Visual -->
        <div class="relative min-w-0">
          <!-- Single magenta glow behind the console, not a rainbow wash -->
          <div class="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/15 blur-3xl"></div>
          <ConsoleDemo />
        </div>
      </div>
    </div>
  </section>
</template>
