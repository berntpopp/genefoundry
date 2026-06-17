<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { X, Globe } from 'lucide-vue-next'

// Props and emits
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// Language toggle
type Language = 'en' | 'de'
const currentLang = ref<Language>('en')

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'en' ? 'de' : 'en'
}

// Close on escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Imprint content
const content = {
  en: {
    title: 'Imprint',
    projectName: 'GeneFoundry',
    responsiblePerson: 'Responsible Person',
    contact: 'Contact',
    phone: 'Phone',
    email: 'Email',
    scope: 'Scope of Responsibility',
    scopeText: 'This imprint applies only to the online presence under the address:',
    limitation: 'Limitation',
    limitationText:
      'This web presence is part of the WWW and is therefore linked to external websites that can change at any time, which are consequently not subject to this scope of responsibility. Links have been checked once before inclusion to ensure they do not violate morals or laws.',
    serviceProvider: 'Service Provider',
    copyright: 'Copyright and Usage',
    copyrightText:
      'The author grants you the specific right to make a private copy for personal use. You are not authorized to alter, distribute, or publish the materials themselves. Unless explicitly stated otherwise, all copyrights remain with the responsible person.',
    dataProtection: 'Data Protection',
    dataProtectionText:
      'Personal data is only collected with your knowledge and consent. Upon request, you can obtain free information about the personal data stored about you. Please contact the administrator for this purpose.',
    bdsgNotice: 'According to § 28 BDSG, we object to any commercial use and distribution of data.',
    disclaimer: 'Disclaimer',
    disclaimerText:
      'The content of this web project has been carefully examined and created to the best of our knowledge. However, no claim is made for the completeness, timeliness, quality, and accuracy of the information provided. No responsibility can be assumed for damages resulting from trusting the contents of this website or their use.',
    ipViolation: 'Intellectual Property',
    ipViolationText:
      'If you suspect that one of your intellectual property rights is being violated from this website, please immediately inform us by email so that prompt remedial action can be taken.',
    linkDisclaimer: 'Link Disclaimer',
    linkDisclaimerText:
      'According to the judgment of May 12, 1998 - 312 O 85/98 - "Liability for Links," the Hamburg Regional Court decided that by placing a link, you might be partly responsible for the content of the linked site. We hereby expressly distance ourselves from all contents of all linked sites on our website and do not adopt these contents as our own.'
  },
  de: {
    title: 'Impressum',
    projectName: 'GeneFoundry',
    responsiblePerson: 'Verantwortlicher',
    contact: 'Kontakt',
    phone: 'Telefon',
    email: 'E-Mail',
    scope: 'Verantwortungsbereich',
    scopeText: 'Das Impressum gilt nur für die Internetpräsenz unter der Adresse:',
    limitation: 'Abgrenzung',
    limitationText:
      'Die Web-Präsenz ist Teil des WWW und dementsprechend mit fremden, sich jederzeit wandelnden Web-Sites verknüpft, die folglich auch nicht diesem Verantwortungsbereich unterliegen. Dass die Links weder gegen Sitten noch Gesetze verstoßen, wurde genau ein Mal geprüft (bevor sie hier aufgenommen wurden).',
    serviceProvider: 'Diensteanbieter',
    copyright: 'Urheberschutz und Nutzung',
    copyrightText:
      'Der Urheber räumt Ihnen ganz konkret das Nutzungsrecht ein, sich eine private Kopie für persönliche Zwecke anzufertigen. Nicht berechtigt sind Sie dagegen, die Materialien zu verändern und/oder weiter zu geben oder gar selbst zu veröffentlichen. Wenn nicht ausdrücklich anders vermerkt, liegen die Urheberrechte beim Verantwortlichen.',
    dataProtection: 'Datenschutz',
    dataProtectionText:
      'Personenbezogene Daten werden nur mit Ihrem Wissen und Ihrer Einwilligung erhoben. Auf Antrag erhalten Sie unentgeltlich Auskunft zu den über Sie gespeicherten personenbezogenen Daten. Wenden Sie sich dazu bitte an den Administrator.',
    bdsgNotice:
      'Gemäß § 28 BDSG widersprechen wir jeder kommerziellen Verwendung und Weitergabe der Daten.',
    disclaimer: 'Keine Haftung',
    disclaimerText:
      'Die Inhalte dieses Webprojektes wurden sorgfältig geprüft und nach bestem Wissen erstellt. Aber für die hier dargebotenen Informationen wird kein Anspruch auf Vollständigkeit, Aktualität, Qualität und Richtigkeit erhoben. Es kann keine Verantwortung für Schäden übernommen werden, die durch das Vertrauen auf die Inhalte dieser Website oder deren Gebrauch entstehen.',
    ipViolation: 'Schutzrechtsverletzung',
    ipViolationText:
      'Falls Sie vermuten, dass von dieser Website aus eines Ihrer Schutzrechte verletzt wird, teilen Sie das bitte umgehend per elektronischer Post mit, damit zügig Abhilfe geschaffen werden kann.',
    linkDisclaimer: 'Haftung für Links',
    linkDisclaimerText:
      'Lt. Urteil vom 12. Mai 1998 - 312 O 85/98 - "Haftung für Links" hat das Landgericht Hamburg entschieden, dass man durch die Anbringung eines Links, die Inhalte der gelinkten Seite ggf. mit zu verantworten hat. Hiermit distanzieren wir uns ausdrücklich von allen Inhalten aller gelinkten Seiten auf unserer Website und machen uns diese Inhalte nicht zu eigen.'
  }
}

// Contact details - update these as needed
const contactInfo = {
  name: 'Bernt Popp',
  address: 'Chaussestr. 58D',
  city: '10115 Berlin',
  phone: '0162 - 1086590',
  email: 'support@genefoundry.org',
  website: 'https://genefoundry.org/'
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="content[currentLang].title"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="emit('close')" />

        <!-- Modal Content -->
        <div
          class="relative w-full max-w-3xl max-h-[90vh] bg-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <!-- Header -->
          <div
            class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-ink-2 border-b border-white/10"
          >
            <h2 class="text-2xl font-bold text-white">
              {{ content[currentLang].title }}
            </h2>
            <div class="flex items-center gap-3">
              <!-- Language Toggle -->
              <button
                @click="toggleLanguage"
                class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors"
                :aria-label="currentLang === 'en' ? 'Switch to German' : 'Switch to English'"
              >
                <Globe class="w-4 h-4" />
                <span>{{ currentLang === 'en' ? 'DE' : 'EN' }}</span>
              </button>
              <!-- Close Button -->
              <button
                @click="emit('close')"
                class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close imprint"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Scrollable Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <!-- Project Name -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-primary-light mb-4">
                {{ content[currentLang].projectName }}
              </h3>
              <div class="space-y-1 text-slate-400">
                <p class="font-medium">{{ contactInfo.name }}</p>
                <p>{{ contactInfo.address }}</p>
                <p>{{ contactInfo.city }}</p>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-4">
                {{ content[currentLang].contact }}
              </h3>
              <div class="space-y-2 text-slate-400">
                <p>
                  <span class="font-medium">{{ content[currentLang].phone }}:</span>
                  {{ contactInfo.phone }}
                </p>
                <p>
                  <span class="font-medium">{{ content[currentLang].email }}:</span>
                  <a
                    :href="`mailto:${contactInfo.email}`"
                    class="text-primary-light hover:underline"
                  >
                    {{ contactInfo.email }}
                  </a>
                </p>
              </div>
            </div>

            <!-- Responsible Person -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].responsiblePerson }}
              </h3>
              <p class="text-slate-400">{{ contactInfo.name }}</p>
              <p class="mt-3 text-sm text-slate-400 italic">
                {{ content[currentLang].bdsgNotice }}
              </p>
            </div>

            <!-- Scope -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].scope }}
              </h3>
              <p class="text-slate-400">
                {{ content[currentLang].scopeText }}
                <a
                  :href="contactInfo.website"
                  class="text-primary-light hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ contactInfo.website }}
                </a>
              </p>
            </div>

            <!-- Limitation -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].limitation }}
              </h3>
              <p class="text-slate-400">{{ content[currentLang].limitationText }}</p>
            </div>

            <!-- Service Provider -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].serviceProvider }}
              </h3>
              <p class="text-slate-400">{{ contactInfo.name }}</p>
            </div>

            <!-- Copyright -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].copyright }}
              </h3>
              <p class="text-slate-400">{{ content[currentLang].copyrightText }}</p>
            </div>

            <!-- Data Protection -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].dataProtection }}
              </h3>
              <p class="text-slate-400">{{ content[currentLang].dataProtectionText }}</p>
            </div>

            <!-- Disclaimer -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].disclaimer }}
              </h3>
              <p class="text-slate-400">{{ content[currentLang].disclaimerText }}</p>
            </div>

            <!-- IP Violation -->
            <div class="mb-8 pb-6 border-b border-white/[0.06]">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].ipViolation }}
              </h3>
              <p class="text-slate-400">{{ content[currentLang].ipViolationText }}</p>
            </div>

            <!-- Link Disclaimer -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-white mb-2">
                {{ content[currentLang].linkDisclaimer }}
              </h3>
              <p class="text-slate-400">{{ content[currentLang].linkDisclaimerText }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
