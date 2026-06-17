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
  <!-- Fixed ambient background: aurora mesh + engineered grid -->
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden="true">
    <div class="absolute inset-0 bg-grid opacity-[0.55]"></div>
    <!-- aurora blobs -->
    <div class="animate-aurora absolute -left-40 -top-48 h-[40rem] w-[40rem] rounded-full bg-primary/20 blur-[120px]"></div>
    <div class="animate-aurora-2 absolute -right-32 top-24 h-[34rem] w-[34rem] rounded-full bg-accent/15 blur-[120px]"></div>
    <div class="animate-aurora absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full bg-accent-2/15 blur-[130px]"></div>
    <!-- top vignette to seat the navbar -->
    <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent"></div>
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
