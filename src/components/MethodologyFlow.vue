<script setup lang="ts">
import { ref } from 'vue'
// Direct imports for better tree-shaking (especially in dev mode)
import Database from 'lucide-vue-next/dist/esm/icons/database.js'
import FileText from 'lucide-vue-next/dist/esm/icons/file-text.js'
import BookOpen from 'lucide-vue-next/dist/esm/icons/book-open.js'
import FileCheck from 'lucide-vue-next/dist/esm/icons/file-check.js'
import ShieldCheck from 'lucide-vue-next/dist/esm/icons/shield-check.js'

const isHovered = ref(false)
</script>

<template>
  <section id="methodology" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-secondary">The Methodology</h2>
        <p class="mt-4 text-slate-600">From raw chaos to structured truth.</p>
      </div>

      <div class="relative">
        <!-- Connecting Line (Background) -->
        <div class="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden md:block"></div>
        <div 
          class="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-slate-200 via-primary to-slate-200 -translate-y-1/2 hidden md:block transition-opacity duration-500"
          :class="[isHovered ? 'opacity-100' : 'opacity-0']"
        ></div>

        <div class="grid md:grid-cols-3 gap-8 relative z-10">
          <!-- Step 1: Input -->
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-primary/30 transition-colors">
            <div class="flex gap-2 mb-4 text-slate-500 group-hover:text-slate-600 transition-colors">
              <Database class="w-6 h-6" />
              <FileText class="w-6 h-6" />
              <BookOpen class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-semibold text-secondary mb-2">Raw Data</h3>
            <p class="text-sm text-slate-500">gnomAD, ClinVar, Literature</p>
          </div>

          <!-- Step 2: The Forge (MCPs) -->
          <div 
            class="bg-white p-8 rounded-xl border-2 shadow-lg flex flex-col items-center text-center transform transition-all duration-300 cursor-pointer"
            :class="[isHovered ? 'border-primary scale-105 shadow-primary/20' : 'border-slate-800']"
            @mouseenter="isHovered = true"
            @mouseleave="isHovered = false"
          >
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 shadow-xl transition-colors duration-300"
              :class="[isHovered ? 'bg-primary' : 'bg-slate-800']"
            >
              <ShieldCheck class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-secondary mb-2">Model Context Protocols</h3>
            <p class="text-sm text-slate-500">Standardized, validated data retrieval.</p>
          </div>

          <!-- Step 3: Output -->
          <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-primary/30 transition-colors">
            <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-100 transition-colors">
              <FileCheck class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-semibold text-secondary mb-2">Trustworthy Analysis</h3>
            <p class="text-sm text-slate-500">Evidence-based Reports</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
