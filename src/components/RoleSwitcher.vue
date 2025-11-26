<script setup lang="ts">
import { ref, type Component } from 'vue'
// Direct imports for better tree-shaking (especially in dev mode)
import Dna from 'lucide-vue-next/dist/esm/icons/dna.js'
import Stethoscope from 'lucide-vue-next/dist/esm/icons/stethoscope.js'
import Microscope from 'lucide-vue-next/dist/esm/icons/microscope.js'

const roles: { id: RoleId; label: string; icon: Component }[] = [
  { id: 'geneticist', label: 'Geneticist', icon: Dna },
  { id: 'clinician', label: 'Clinician', icon: Stethoscope },
  { id: 'researcher', label: 'Researcher', icon: Microscope },
]

type RoleId = 'geneticist' | 'clinician' | 'researcher'
const activeRole = ref<RoleId>('geneticist')

const content = {
  geneticist: [
    { label: 'ACMG Classification', value: 'Pathogenic', textColor: 'text-red-600', barColor: 'bg-red-500' },
    { label: 'Variant Depth', value: '120x', textColor: 'text-blue-600', barColor: 'bg-blue-500' }
  ],
  clinician: [
    { label: 'Phenotype Match', value: 'High', textColor: 'text-green-600', barColor: 'bg-green-500' },
    { label: 'Therapeutic Options', value: 'Available', textColor: 'text-purple-600', barColor: 'bg-purple-500' }
  ],
  researcher: [
    { label: 'Expression Profile', value: 'Kidney-specific', textColor: 'text-amber-600', barColor: 'bg-amber-500' },
    { label: 'Mouse Model', value: 'MGI Data', textColor: 'text-indigo-600', barColor: 'bg-indigo-500' }
  ]
}
</script>

<template>
  <section id="perspectives" class="py-24 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-secondary mb-4">One Engine, Many Perspectives.</h2>
        <p class="text-slate-600">GeneFoundry adapts the output based on who is asking.</p>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- Tabs -->
        <div class="flex justify-center mb-12">
          <div class="bg-white p-1 rounded-full shadow-sm border border-slate-200 inline-flex overflow-x-auto max-w-full">
            <button 
              v-for="role in roles" 
              :key="role.id"
              @click="activeRole = role.id"
              class="px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap"
              :class="[
                activeRole === role.id 
                  ? 'bg-secondary text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              <component :is="role.icon" class="w-4 h-4" />
              {{ role.label }}
            </button>
          </div>
        </div>

        <!-- Content Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[300px] flex items-center justify-center relative">
           <transition name="fade" mode="out-in">
             <div :key="activeRole" class="p-8 w-full">
               <div class="grid sm:grid-cols-2 gap-6">
                 <div 
                   v-for="(item, index) in content[activeRole]" 
                   :key="index"
                   class="p-8 rounded-xl border border-slate-100 flex flex-col items-center text-center hover:shadow-lg transition-all bg-slate-50/50"
                 >
                   <span class="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">{{ item.label }}</span>
                   <span class="text-3xl font-bold mb-4" :class="item.textColor">{{ item.value }}</span>
                   <div class="h-1.5 w-16 rounded-full opacity-20" :class="item.barColor"></div>
                 </div>
               </div>
             </div>
           </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
