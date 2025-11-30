<script setup lang="ts">
import { usePrefersReducedMotion } from '../composables'

// Import team images directly for proper Vite asset handling
// Using WebP format for optimal compression (70% smaller than JPG)
import ninaRankImg from '../assets/team/1.webp'
import berntPoppImg from '../assets/team/2.webp'
import soerenLukassenImg from '../assets/team/3.webp'
import janHalbritterImg from '../assets/team/4.webp'

// Composable for respecting user motion preferences
const prefersReducedMotion = usePrefersReducedMotion()

// Team member type definition
interface TeamMember {
  id: string
  name: string
  title: string
  image: string
  role: 'lead' | 'mentor'
  expertise: string[]
  tagline: string
  affiliation?: string
}

// Team data - Lead Applicant and Mentors
const team: TeamMember[] = [
  {
    id: 'nina-rank',
    name: 'Dr. Nina Rank',
    title: 'MD/PhD, Digital Clinician Scientist',
    image: ninaRankImg,
    role: 'lead',
    expertise: ['Rare Diseases', 'Clinical Genomics', 'Translational Medicine'],
    tagline: 'Driving GeneFoundry from concept to clinical practice',
    affiliation: 'Charité — Digital Junior Clinician Scientist Program'
  },
  {
    id: 'bernt-popp',
    name: 'Dr. med. Bernt Popp',
    title: 'MD, Board-Certified Geneticist',
    image: berntPoppImg,
    role: 'mentor',
    expertise: ['Human Genetics', 'Bioinformatics', 'NGS Analysis'],
    tagline: 'Rare disease diagnostics & sequencing pipelines',
    affiliation: 'BIH Center for Digital Health & Labor Berlin'
  },
  {
    id: 'soeren-lukassen',
    name: 'Dr. rer. nat. Sören Lukassen',
    title: 'PhD, Group Leader',
    image: soerenLukassenImg,
    role: 'mentor',
    expertise: ['Medical AI', 'Omics Integration', 'Decision Support'],
    tagline: 'AI-driven analysis of biomedical datasets',
    affiliation: 'BIH Center for Digital Health'
  },
  {
    id: 'jan-halbritter',
    name: 'Prof. Dr. med. Jan Halbritter',
    title: 'MD, Heisenberg Professor',
    image: janHalbritterImg,
    role: 'mentor',
    expertise: ['Nephrology', 'Rare Kidney Disease', 'CeRKiD'],
    tagline: 'Scientific Lead, Center for Rare Kidney Diseases',
    affiliation: 'Charité — Universitätsmedizin Berlin'
  }
]

// Separate lead and mentors for layout
const leadApplicant = team.find(m => m.role === 'lead')!
const mentors = team.filter(m => m.role === 'mentor')
</script>

<template>
  <section id="team" class="py-24 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-secondary mb-4">Meet the Team</h2>
        <p class="text-lg text-slate-600 max-w-3xl mx-auto">
          Supported by leading experts in AI, genomics, and medicine.
        </p>
      </div>

      <!-- Lead Applicant - Featured Card -->
      <!-- Using neutral slate/amber styling to avoid gendered color associations -->
      <div class="max-w-2xl mx-auto mb-16">
        <article
          class="relative p-8 rounded-2xl bg-white border-2 border-slate-200 shadow-lg group overflow-hidden"
        >
          <!-- Subtle gradient accent - neutral slate -->
          <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-transparent to-transparent pointer-events-none" />

          <div class="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <!-- Photo -->
            <div class="relative flex-shrink-0">
              <div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-200 shadow-xl">
                <img
                  :src="leadApplicant.image"
                  :alt="`Portrait of ${leadApplicant.name}`"
                  width="128"
                  height="128"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <!-- Lead badge - white bg with slate text (gender-neutral, light aesthetic) -->
              <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-slate-700 text-xs font-bold rounded-full shadow-md border border-slate-200 whitespace-nowrap">
                Lead Applicant
              </span>
            </div>

            <!-- Info -->
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-2xl font-bold text-secondary mb-1">{{ leadApplicant.name }}</h3>
              <p class="text-slate-500 mb-3">{{ leadApplicant.title }}</p>

              <!-- Expertise Tags - using neutral slate -->
              <div class="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                <span
                  v-for="tag in leadApplicant.expertise"
                  :key="tag"
                  class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                >
                  {{ tag }}
                </span>
              </div>

              <p class="text-slate-600 italic mb-2">"{{ leadApplicant.tagline }}"</p>
              <p v-if="leadApplicant.affiliation" class="text-sm text-slate-500">
                {{ leadApplicant.affiliation }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- Mentors Section Label -->
      <div class="text-center mb-8">
        <span class="inline-block px-4 py-2 bg-slate-200 text-slate-600 text-sm font-semibold rounded-full">
          Mentors & Collaborators
        </span>
      </div>

      <!-- Mentors Grid -->
      <div class="grid md:grid-cols-3 gap-8">
        <article
          v-for="mentor in mentors"
          :key="mentor.id"
          class="p-6 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group text-center"
        >
          <!-- Photo -->
          <div class="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all shadow-md">
            <img
              :src="mentor.image"
              :alt="`Portrait of ${mentor.name}`"
              width="96"
              height="96"
              class="w-full h-full object-cover transition-all duration-300"
              :class="prefersReducedMotion ? '' : 'grayscale group-hover:grayscale-0'"
              loading="lazy"
            />
          </div>

          <!-- Info -->
          <h3 class="text-lg font-bold text-secondary mb-1">{{ mentor.name }}</h3>
          <p class="text-sm text-slate-500 mb-3">{{ mentor.title }}</p>

          <!-- Expertise Tags -->
          <div class="flex flex-wrap justify-center gap-1.5 mb-3">
            <span
              v-for="tag in mentor.expertise"
              :key="tag"
              class="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors"
            >
              {{ tag }}
            </span>
          </div>

          <p class="text-sm text-slate-600">{{ mentor.tagline }}</p>
          <p v-if="mentor.affiliation" class="text-xs text-slate-500 mt-2">
            {{ mentor.affiliation }}
          </p>
        </article>
      </div>

    </div>
  </section>
</template>
