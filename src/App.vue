<script setup lang="ts">
// All components loaded synchronously to eliminate CLS.
// Total JS stays small for a landing page, so lazy loading would only add
// layout shift for negligible benefit.
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import TrustBar from './components/TrustBar.vue'
import HowItWorks from './components/HowItWorks.vue'
import ServerCatalog from './components/ServerCatalog.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import ConnectSection from './components/ConnectSection.vue'
import CtaSection from './components/CtaSection.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <!-- Fixed ambient background: one intentional brand spotlight + drafting grid -->
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
    <div class="absolute inset-0 bg-spotlight"></div>
    <div class="absolute inset-0 bg-grid"></div>
    <!-- a single slow magenta glow for ambient life, not a rainbow of blobs -->
    <div
      class="animate-aurora absolute -left-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-[130px]"
    ></div>
    <!-- bottom fade so content settles into pure ink -->
    <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent"></div>
  </div>

  <!-- Skip link for keyboard / screen-reader users -->
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
  >
    Skip to content
  </a>

  <div class="min-h-screen font-sans">
    <NavBar />
    <main id="main">
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <ServerCatalog />
      <FeatureGrid />
      <ConnectSection />
      <CtaSection />
    </main>
    <FooterSection />
  </div>
</template>
