<script setup lang="ts">
import { ref, computed } from 'vue'
import { Mail, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-vue-next'

// Form state
const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

// Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mblvnjjq'

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const canSubmit = computed(() => {
  return email.value.length > 0 && isValidEmail.value && status.value !== 'loading'
})

// Submit handler
const handleSubmit = async () => {
  if (!canSubmit.value) return

  status.value = 'loading'
  errorMessage.value = ''

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        _subject: 'New GeneFoundry Newsletter Signup'
      })
    })

    if (response.ok) {
      status.value = 'success'
      email.value = ''
    } else {
      const data = await response.json()
      throw new Error(data.error || 'Submission failed')
    }
  } catch (err) {
    status.value = 'error'
    errorMessage.value = err instanceof Error ? err.message : 'Something went wrong'
  }
}

// Reset to try again
const resetForm = () => {
  status.value = 'idle'
  errorMessage.value = ''
}
</script>

<template>
  <section class="py-16 bg-gradient-to-b from-slate-100 to-slate-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-secondary mb-3">
          Follow Our Journey
        </h2>
        <p class="text-slate-600 max-w-xl mx-auto">
          Get notified when we launch new MCP modules and reach key milestones.
          No spam, just progress updates.
        </p>
      </div>

      <!-- Success State -->
      <div
        v-if="status === 'success'"
        class="flex flex-col items-center gap-4 py-8"
      >
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check class="w-8 h-8 text-green-600" />
        </div>
        <div>
          <p class="text-lg font-semibold text-secondary">You're on the list!</p>
          <p class="text-slate-600 mt-1">We'll keep you updated on GeneFoundry's progress.</p>
        </div>
      </div>

      <!-- Form -->
      <form
        v-else
        @submit.prevent="handleSubmit"
        class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <!-- Email Input -->
        <div class="relative flex-1">
          <Mail
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            :disabled="status === 'loading'"
            class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-secondary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            :class="{
              'border-red-300 focus:ring-red-500/50 focus:border-red-500': status === 'error'
            }"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!canSubmit"
          class="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-w-[140px]"
        >
          <template v-if="status === 'loading'">
            <Loader2 class="w-5 h-5 animate-spin" />
            <span>Joining...</span>
          </template>
          <template v-else>
            <span>Get Updates</span>
            <ArrowRight class="w-5 h-5" />
          </template>
        </button>
      </form>

      <!-- Error Message -->
      <div
        v-if="status === 'error'"
        class="mt-4 flex items-center justify-center gap-2 text-red-600"
      >
        <AlertCircle class="w-4 h-4" />
        <span class="text-sm">{{ errorMessage }}</span>
        <button
          @click="resetForm"
          class="text-sm underline hover:no-underline ml-2"
        >
          Try again
        </button>
      </div>

      <!-- Privacy Note -->
      <p
        v-if="status !== 'success'"
        class="mt-4 text-xs text-slate-500"
      >
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  </section>
</template>
