<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Critical above-the-fold components - load synchronously
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
// Footer is small and at the end - load sync to prevent layout shift
import FooterSection from './components/FooterSection.vue'

// Below-the-fold components - lazy load for better LCP/TBT
const MethodologyFlow = defineAsyncComponent(() => import('./components/MethodologyFlow.vue'))
const RoleSwitcher = defineAsyncComponent(() => import('./components/RoleSwitcher.vue'))
const ImpactGrid = defineAsyncComponent(() => import('./components/ImpactGrid.vue'))
</script>

<template>
  <div class="min-h-screen font-sans text-secondary bg-slate-50 selection:bg-primary/20 selection:text-primary">
    <NavBar />
    <main>
      <HeroSection />
      <MethodologyFlow />
      <RoleSwitcher />
      <ImpactGrid />
    </main>
    <FooterSection />
  </div>
</template>
