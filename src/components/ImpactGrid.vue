<script setup lang="ts">
// Direct imports for better tree-shaking (especially in dev mode)
import Activity from 'lucide-vue-next/dist/esm/icons/activity.js'
import ShieldCheck from 'lucide-vue-next/dist/esm/icons/shield-check.js'
import Users from 'lucide-vue-next/dist/esm/icons/users.js'
import Globe from 'lucide-vue-next/dist/esm/icons/globe.js'
</script>

<template>
  <section id="impact" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-secondary mb-4">Real-World Impact</h2>
        <p class="text-lg text-slate-600 max-w-3xl mx-auto">
          Bridging the gap between automation and expert-level reliability in genomic medicine.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Card 1: The Diagnostic Gap -->
        <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group">
          <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <Activity class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-secondary mb-3">Closing the Diagnostic Gap</h3>
          <p class="text-slate-600 leading-relaxed">
            Up to 80% of rare disease patients remain undiagnosed. GeneFoundry explores the genetic variation that traditional methods miss, offering new hope for unsolved cases.
          </p>
        </div>

        <!-- Card 2: Trustworthy AI -->
        <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group">
          <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-secondary mb-3">Trustworthy by Design</h3>
          <p class="text-slate-600 leading-relaxed">
            We solve the "hallucination" problem. By using Model Context Protocols (MCPs) to fetch validated data, we ensure LLM outputs are traceable, accurate, and clinically relevant.
          </p>
        </div>

        <!-- Card 3: Clinical Validation -->
        <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group">
          <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <Users class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-secondary mb-3">Validated at Charité</h3>
          <p class="text-slate-600 leading-relaxed">
            Deployed in the CeRKiD cohort (~1,500 patients). GeneFoundry prioritizes variants for expert review, directly contributing to solving complex kidney disease cases.
          </p>
        </div>
      </div>
      
      <!-- Open Science Banner -->
      <div class="mt-12 p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div class="flex items-center gap-4">
            <div class="p-3 bg-white/10 rounded-full">
                <Globe class="w-6 h-6 text-primary" />
            </div>
            <div>
                <h3 class="text-lg font-bold">Open Science & Community Driven</h3>
                <p class="text-slate-400">Modular, platform-agnostic, and built for the community.</p>
            </div>
        </div>
        <a href="#" class="px-6 py-2 bg-primary hover:bg-pink-600 rounded-full font-semibold transition-colors">
            View on GitHub
        </a>
      </div>

    </div>
  </section>
</template>
