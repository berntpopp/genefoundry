<script setup lang="ts">
import { ref } from 'vue'
import ImprintModal from './ImprintModal.vue'

// Modal state
const isImprintOpen = ref(false)

const openImprint = () => {
  isImprintOpen.value = true
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
}

const closeImprint = () => {
  isImprintOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-slate-200">GeneFoundry</span>
        <span class="text-slate-600">|</span>
        <span class="text-sm">To be developed at Charité / BIH</span>
      </div>

      <div class="flex gap-8 text-sm">
        <button
          @click="openImprint"
          class="hover:text-white transition-colors cursor-pointer"
        >
          Imprint
        </button>
        <a
          href="mailto:contact@genefoundry.org"
          class="hover:text-white transition-colors"
        >
          Contact
        </a>
        <a
          href="https://github.com/berntpopp/genefoundry"
          class="hover:text-white transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>

  <!-- Imprint Modal -->
  <ImprintModal
    :is-open="isImprintOpen"
    @close="closeImprint"
  />
</template>
