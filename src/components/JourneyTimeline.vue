<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePrefersReducedMotion } from '../composables'

// Lucide icons - direct imports for tree-shaking
import Lightbulb from 'lucide-vue-next/dist/esm/icons/lightbulb.js'
import PenLine from 'lucide-vue-next/dist/esm/icons/pen-line.js'
import Send from 'lucide-vue-next/dist/esm/icons/send.js'
import Award from 'lucide-vue-next/dist/esm/icons/award.js'
import Presentation from 'lucide-vue-next/dist/esm/icons/presentation.js'
import Rocket from 'lucide-vue-next/dist/esm/icons/rocket.js'
import Code from 'lucide-vue-next/dist/esm/icons/code.js'
import FlaskConical from 'lucide-vue-next/dist/esm/icons/flask-conical.js'
import Stethoscope from 'lucide-vue-next/dist/esm/icons/stethoscope.js'
import BookOpen from 'lucide-vue-next/dist/esm/icons/book-open.js'
import Check from 'lucide-vue-next/dist/esm/icons/check.js'

const prefersReducedMotion = usePrefersReducedMotion()

// Icon component mapping
const iconComponents: Record<string, typeof Lightbulb> = {
  Lightbulb,
  PenLine,
  Send,
  Award,
  Presentation,
  Rocket,
  Code,
  FlaskConical,
  Stethoscope,
  BookOpen
}

interface Milestone {
  id: string
  title: string
  shortTitle: string
  date: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
  icon: keyof typeof iconComponents
}

const milestones: Milestone[] = [
  {
    id: 'concept',
    title: 'Concept & Vision',
    shortTitle: 'Concept',
    date: 'May 2025',
    description: 'Initial idea development: solving AI hallucinations in genomic analysis through MCPs.',
    status: 'completed',
    icon: 'Lightbulb'
  },
  {
    id: 'proposal',
    title: 'Proposal Writing',
    shortTitle: 'Proposal',
    date: 'Jul 2025',
    description: 'DCS application preparation with methodology design and mentor alignment.',
    status: 'completed',
    icon: 'PenLine'
  },
  {
    id: 'submission',
    title: 'Submission',
    shortTitle: 'Submit',
    date: 'Sep 2025',
    description: 'Proposal submitted to BIH Digital Clinician Scientist program.',
    status: 'completed',
    icon: 'Send'
  },
  {
    id: 'selection',
    title: 'Selection',
    shortTitle: 'Selected',
    date: 'Nov 2025',
    description: 'Proposal selected for committee presentation from competitive applicant pool.',
    status: 'current',
    icon: 'Award'
  },
  {
    id: 'pitch',
    title: 'DCS Committee Pitch',
    shortTitle: 'Pitch',
    date: 'Dec 2025',
    description: 'Presentation to Digital Clinician Scientist committee at BIH.',
    status: 'upcoming',
    icon: 'Presentation'
  },
  {
    id: 'program-start',
    title: 'Program Kickoff',
    shortTitle: 'Kickoff',
    date: 'Q1 2026',
    description: 'Official DCS program start. Begin MCP core architecture design.',
    status: 'upcoming',
    icon: 'Rocket'
  },
  {
    id: 'mcp-development',
    title: 'MCP Registry',
    shortTitle: 'MCPs',
    date: '2026',
    description: 'Develop MCP prototype and series of genomic data MCPs (gnomAD, ClinVar, etc.).',
    status: 'upcoming',
    icon: 'Code'
  },
  {
    id: 'benchmarking',
    title: 'Benchmarking',
    shortTitle: 'Benchmark',
    date: '2027',
    description: 'Benchmark LLMs, evaluate ACMG reports, genotype-phenotype correlation analysis.',
    status: 'upcoming',
    icon: 'FlaskConical'
  },
  {
    id: 'clinical-pilot',
    title: 'Clinical Pilot',
    shortTitle: 'Clinical',
    date: '2027-28',
    description: 'Real-world application with CeRKiD cohort. In-depth analysis of unsolved cases.',
    status: 'upcoming',
    icon: 'Stethoscope'
  },
  {
    id: 'publication',
    title: 'Publication',
    shortTitle: 'Publish',
    date: 'Q4 2028',
    description: 'Results publication, technical documentation, and open-source community release.',
    status: 'upcoming',
    icon: 'BookOpen'
  }
]

// Track which milestone is being hovered/focused
const activeMilestone = ref<string | null>(null)
const currentMilestoneIndex = computed(() => milestones.findIndex(m => m.status === 'current'))

// Progress calculation for the line
const progressPercentage = computed(() => {
  const currentIdx = currentMilestoneIndex.value
  if (currentIdx === -1) return 0
  // Progress to middle of current milestone
  return ((currentIdx + 0.5) / milestones.length) * 100
})

function setActive(id: string | null) {
  activeMilestone.value = id
}

function getStatusClasses(status: Milestone['status']) {
  switch (status) {
    case 'completed':
      return 'bg-slate-700 text-white border-slate-700'
    case 'current':
      return 'bg-primary text-white border-primary'
    case 'upcoming':
      return 'bg-white text-slate-500 border-slate-300 border-dashed'
  }
}
</script>

<template>
  <section id="journey" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-secondary mb-4">The Journey</h2>
        <p class="text-lg text-slate-600 max-w-3xl mx-auto">
          From concept to clinical impact — follow our progress toward trustworthy genomic AI.
        </p>
      </div>

      <!-- Legend / Key (Desktop - above timeline) -->
      <div class="hidden lg:flex flex-wrap justify-center gap-6 text-sm mb-10">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center">
            <Check class="w-2.5 h-2.5 text-white" />
          </div>
          <span class="text-slate-600">Completed</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-primary" :class="!prefersReducedMotion ? 'animate-pulse' : ''" />
          <span class="text-slate-600">In Progress</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-white border-2 border-dashed border-slate-300" />
          <span class="text-slate-600">Upcoming</span>
        </div>
      </div>

      <!-- Desktop Timeline (Horizontal) -->
      <div class="hidden lg:block pb-40">
        <div class="relative">
          <!-- Background track -->
          <div class="absolute top-8 left-0 right-0 h-1 bg-slate-100 rounded-full" />

          <!-- Progress line (animated) -->
          <div
            class="absolute top-8 left-0 h-1 rounded-full transition-all duration-1000 ease-out"
            :class="[prefersReducedMotion ? 'bg-slate-700' : 'bg-gradient-to-r from-slate-700 via-slate-600 to-primary']"
            :style="{ width: `${progressPercentage}%` }"
          />

          <!-- Milestones -->
          <div class="relative flex justify-between" role="list">
            <div
              v-for="(milestone, index) in milestones"
              :key="milestone.id"
              class="flex flex-col items-center relative group"
              :style="{ width: `${100 / milestones.length}%` }"
              @mouseenter="setActive(milestone.id)"
              @mouseleave="setActive(null)"
              @focus="setActive(milestone.id)"
              @blur="setActive(null)"
              tabindex="0"
              role="listitem"
              :aria-label="`${milestone.title}, ${milestone.date}, ${milestone.status}`"
            >
              <!-- Node -->
              <div
                class="relative z-10 w-16 h-16 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 cursor-pointer"
                :class="[
                  getStatusClasses(milestone.status),
                  milestone.status === 'current' && !prefersReducedMotion ? 'animate-pulse-glow' : '',
                  activeMilestone === milestone.id ? 'scale-110 shadow-lg' : ''
                ]"
              >
                <!-- Completed checkmark overlay -->
                <div
                  v-if="milestone.status === 'completed'"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm"
                >
                  <Check class="w-3 h-3 text-white" />
                </div>

                <!-- Icon -->
                <component
                  :is="iconComponents[milestone.icon]"
                  class="w-6 h-6"
                  :class="milestone.status === 'upcoming' ? 'opacity-50' : ''"
                />
              </div>

              <!-- Date label -->
              <div
                class="mt-3 text-xs font-semibold transition-colors"
                :class="[
                  milestone.status === 'current' ? 'text-primary' : 'text-slate-500',
                  activeMilestone === milestone.id ? 'text-primary' : ''
                ]"
              >
                {{ milestone.date }}
              </div>

              <!-- Title -->
              <div
                class="mt-1 text-sm font-medium text-center transition-colors max-w-[100px]"
                :class="[
                  milestone.status === 'upcoming' ? 'text-slate-500' : 'text-secondary',
                  activeMilestone === milestone.id ? 'text-secondary' : ''
                ]"
              >
                {{ milestone.shortTitle }}
              </div>

              <!-- Hover Card -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-2"
              >
                <div
                  v-if="activeMilestone === milestone.id"
                  class="absolute top-full mt-6 w-64 p-4 bg-white rounded-xl shadow-xl border border-slate-100 z-50"
                  :class="index < milestones.length / 2 ? 'left-0' : 'right-0'"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      :class="milestone.status === 'current' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'"
                    >
                      <component :is="iconComponents[milestone.icon]" class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-secondary text-sm">{{ milestone.title }}</h4>
                      <p class="text-xs text-primary font-medium mt-0.5">{{ milestone.date }}</p>
                      <p class="text-xs text-slate-600 mt-2 leading-relaxed">{{ milestone.description }}</p>
                    </div>
                  </div>

                  <!-- Status badge -->
                  <div
                    class="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                    :class="[
                      milestone.status === 'completed' ? 'bg-green-50 text-green-700' : '',
                      milestone.status === 'current' ? 'bg-primary/10 text-primary' : '',
                      milestone.status === 'upcoming' ? 'bg-slate-100 text-slate-500' : ''
                    ]"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="[
                        milestone.status === 'completed' ? 'bg-green-500' : '',
                        milestone.status === 'current' ? `bg-primary ${!prefersReducedMotion ? 'animate-pulse' : ''}` : '',
                        milestone.status === 'upcoming' ? 'bg-slate-400' : ''
                      ]"
                    />
                    {{ milestone.status === 'completed' ? 'Completed' : milestone.status === 'current' ? 'In Progress' : 'Upcoming' }}
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Timeline (Vertical) -->
      <div class="lg:hidden">
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

          <!-- Progress line -->
          <div
            class="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-slate-700 to-primary transition-all duration-1000"
            :style="{ height: `${progressPercentage}%` }"
          />

          <!-- Milestones -->
          <div class="space-y-6" role="list">
            <div
              v-for="milestone in milestones"
              :key="milestone.id"
              class="relative flex items-start gap-4 pl-0"
              role="listitem"
              :aria-label="`${milestone.title}, ${milestone.date}, ${milestone.status}`"
            >
              <!-- Node -->
              <div
                class="relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-[3px] flex items-center justify-center transition-all duration-300"
                :class="[
                  getStatusClasses(milestone.status),
                  milestone.status === 'current' && !prefersReducedMotion ? 'animate-pulse-glow' : ''
                ]"
              >
                <!-- Completed checkmark -->
                <div
                  v-if="milestone.status === 'completed'"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check class="w-2.5 h-2.5 text-white" />
                </div>

                <component
                  :is="iconComponents[milestone.icon]"
                  class="w-5 h-5"
                  :class="milestone.status === 'upcoming' ? 'opacity-50' : ''"
                />
              </div>

              <!-- Content Card -->
              <div
                class="flex-1 p-4 rounded-xl border transition-all"
                :class="[
                  milestone.status === 'current'
                    ? 'bg-primary/5 border-primary/20 shadow-sm'
                    : 'bg-slate-50 border-slate-100',
                  milestone.status === 'upcoming' ? 'opacity-75' : ''
                ]"
              >
                <div class="flex items-center justify-between gap-2 mb-1">
                  <h4
                    class="font-bold text-sm"
                    :class="milestone.status === 'upcoming' ? 'text-slate-500' : 'text-secondary'"
                  >
                    {{ milestone.title }}
                  </h4>
                  <span
                    class="text-xs font-semibold px-2 py-0.5 rounded-full"
                    :class="[
                      milestone.status === 'completed' ? 'bg-green-100 text-green-700' : '',
                      milestone.status === 'current' ? 'bg-primary text-white' : '',
                      milestone.status === 'upcoming' ? 'bg-slate-200 text-slate-500' : ''
                    ]"
                  >
                    {{ milestone.date }}
                  </span>
                </div>
                <p
                  class="text-xs leading-relaxed"
                  :class="milestone.status === 'upcoming' ? 'text-slate-500' : 'text-slate-600'"
                >
                  {{ milestone.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend / Key (Mobile only - below timeline) -->
      <div class="lg:hidden mt-8 flex flex-wrap justify-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center">
            <Check class="w-2.5 h-2.5 text-white" />
          </div>
          <span class="text-slate-600">Completed</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-primary" :class="!prefersReducedMotion ? 'animate-pulse' : ''" />
          <span class="text-slate-600">In Progress</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-white border-2 border-dashed border-slate-300" />
          <span class="text-slate-600">Upcoming</span>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Pulse glow animation for current milestone */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(190, 62, 130, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(190, 62, 130, 0);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Ensure proper stacking for hover cards */
section {
  contain: layout style;
}
</style>
