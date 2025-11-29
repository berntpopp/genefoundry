<script setup lang="ts">
// All components loaded synchronously to eliminate CLS
// For a landing page, total JS is small (~20KB) so lazy loading
// provides minimal benefit but causes significant layout shift
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import MethodologyFlow from './components/MethodologyFlow.vue'
import RoleSwitcher from './components/RoleSwitcher.vue'
import ImpactGrid from './components/ImpactGrid.vue'
import TeamSection from './components/TeamSection.vue'
import JourneyTimeline from './components/JourneyTimeline.vue'
import NewsletterSignup from './components/NewsletterSignup.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <div class="min-h-screen font-sans text-secondary bg-slate-50 selection:bg-primary/20 selection:text-primary">
    <NavBar />
    <main>
      <HeroSection />
      <MethodologyFlow />
      <RoleSwitcher />
      <ImpactGrid />
      <TeamSection />
      <JourneyTimeline />
      <NewsletterSignup />
    </main>
    <FooterSection />
  </div>
</template>
