<script setup lang="ts">
import { Github } from 'lucide-vue-next'
import CommandCard from './ui/CommandCard.vue'
import { ADD_COMMAND, GITHUB_URL } from '../data/servers'
</script>

<template>
  <section class="relative py-24 sm:py-28">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div
        class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-ink-2 to-ink px-6 py-14 text-center sm:px-12"
      >
        <!-- glow -->
        <div
          class="pointer-events-none absolute -top-24 left-1/2 -z-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        ></div>

        <div class="relative z-10">
          <h2 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Give your agent the genome’s<br class="hidden sm:block" />
            <span class="serif-accent text-[1.1em]">data layer</span>, in one line.
          </h2>
          <p class="mx-auto mt-4 max-w-xl text-slate-400">
            One endpoint. No signup, no keys, open source.
          </p>

          <div class="mx-auto mt-8 max-w-xl">
            <CommandCard :command="ADD_COMMAND" label="add to any mcp host" />
          </div>

          <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#connect"
              class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
            >
              Connect your host
            </a>
            <a
              :href="GITHUB_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/[0.07]"
            >
              <Github class="h-4 w-4" />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
