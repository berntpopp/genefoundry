<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Card Data
const cards = [
  {
    id: 'gnomad',
    title: 'mcp-server-gnomad',
    content: [
      { key: 'source', value: '"gnomAD v4.0"', color: 'text-green-700' },
      { key: 'gene', value: '"PKD1"', color: 'text-blue-700' },
      { key: 'af_popmax', value: '0.000042', color: 'text-orange-700' },
      { key: 'status', value: '"VERIFIED"', color: 'text-primary font-bold' }
    ]
  },
  {
    id: 'gtex',
    title: 'mcp-server-gtex',
    content: [
      { key: 'tissue', value: '"Kidney_Cortex"', color: 'text-purple-700' },
      { key: 'tpm', value: '45.2', color: 'text-orange-700' },
      { key: 'isoform', value: '"ENST0000..."', color: 'text-blue-700' },
      { key: 'expression', value: '"HIGH"', color: 'text-primary font-bold' }
    ]
  },
  {
    id: 'pubtator',
    title: 'mcp-server-pubtator',
    content: [
      { key: 'pmid', value: '342156...', color: 'text-blue-700' },
      { key: 'entity', value: '"Polycystin-1"', color: 'text-green-700' },
      { key: 'relation', value: '"interacts_with"', color: 'text-purple-700' },
      { key: 'confidence', value: '0.98', color: 'text-primary font-bold' }
    ]
  },
  {
    id: 'mgi',
    title: 'mcp-server-mgi',
    content: [
      { key: 'model', value: '"Pkd1<tm1..."', color: 'text-purple-700' },
      { key: 'phenotype', value: '"Cystic kidney"', color: 'text-orange-700' },
      { key: 'background', value: '"C57BL/6J"', color: 'text-blue-700' },
      { key: 'zygosity', value: '"Homozygous"', color: 'text-primary font-bold' }
    ]
  }
]


// Rotation Logic
const rotation = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startRotation = ref(0)
let autoRotateInterval: number | null = null

// Use matchMedia instead of window.innerWidth to avoid forced reflow
// matchMedia doesn't trigger layout recalculation - it uses viewport dimensions
// which are always available without querying the DOM
// Reference: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
const isMobile = ref(false)
let mobileMediaQuery: MediaQueryList | null = null

const handleMobileChange = (e: MediaQueryListEvent | MediaQueryList) => {
  isMobile.value = e.matches
}

const startAutoRotate = () => {
  stopAutoRotate()
  // Use requestAnimationFrame for smoother, more efficient animation
  let lastTime = 0
  const animate = (currentTime: number) => {
    if (!isDragging.value) {
      // Throttle to ~30fps for performance while maintaining smoothness
      if (currentTime - lastTime >= 33) {
        rotation.value -= 0.3
        lastTime = currentTime
      }
    }
    autoRotateInterval = requestAnimationFrame(animate)
  }
  autoRotateInterval = requestAnimationFrame(animate)
}

const stopAutoRotate = () => {
  if (autoRotateInterval) {
    cancelAnimationFrame(autoRotateInterval)
    autoRotateInterval = null
  }
}

const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.clientX
  startRotation.value = rotation.value
  stopAutoRotate()
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  const deltaX = e.clientX - startX.value
  rotation.value = startRotation.value + deltaX * 0.5
}

const handleMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  startAutoRotate()
}

// Touch support
const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startRotation.value = rotation.value
  stopAutoRotate()
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  const deltaX = e.touches[0].clientX - startX.value
  rotation.value = startRotation.value + deltaX * 0.5
}

const handleTouchEnd = () => {
  isDragging.value = false
  startAutoRotate()
}

// 3D Position Calculation - using cached mobile state for performance
const getCardStyle = (index: number) => {
  const totalCards = cards.length
  const angleStep = 360 / totalCards
  const currentAngle = (rotation.value + index * angleStep) % 360
  const rad = (currentAngle * Math.PI) / 180

  // Use cached mobile state instead of querying window.innerWidth every frame
  const mobile = isMobile.value

  // Ellipse parameters
  const radiusX = mobile ? 140 : 240
  const radiusZ = mobile ? 80 : 120

  const x = Math.sin(rad) * radiusX
  const z = Math.cos(rad) * radiusZ

  // Tilted plane: Front (z+) is lower (y+), Back (z-) is higher (y-)
  const y = z * 0.4

  // Exaggerated scale: Front bigger, back smaller
  const scaleBase = mobile ? 0.75 : 0.85
  const scaleFactor = mobile ? 200 : 300
  const scale = scaleBase + (z / scaleFactor)

  // Opacity based on depth (removed expensive blur filter for performance)
  const opacity = (z + 200) / 320
  const zIndex = Math.round(z)

  return {
    transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
    zIndex: zIndex,
    opacity: Math.max(0.3, Math.min(1, opacity))
  }
}

onMounted(() => {
  // Use matchMedia for responsive detection - doesn't cause forced reflow
  // unlike window.innerWidth which triggers synchronous layout
  mobileMediaQuery = window.matchMedia('(max-width: 639px)')
  handleMobileChange(mobileMediaQuery)
  mobileMediaQuery.addEventListener('change', handleMobileChange)

  // Defer animation start until after first paint to prevent forced reflow
  // Double rAF ensures browser has completed initial layout before animation starts
  // Reference: https://www.debugbear.com/blog/forced-reflows
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      startAutoRotate()
    })
  })
})

onUnmounted(() => {
  stopAutoRotate()
  if (mobileMediaQuery) {
    mobileMediaQuery.removeEventListener('change', handleMobileChange)
  }
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <!-- Explicit min-height prevents CLS during load -->
  <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 min-h-[600px] lg:min-h-[700px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Text Content -->
        <div class="text-center lg:text-left pointer-events-none z-20">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-secondary mb-6 leading-tight pointer-events-auto">
            Forging Trust in <br/>
            <span class="text-primary">Genomic AI.</span>
          </h1>
          <p class="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed pointer-events-auto">
            A modular registry for customized, evidence-based genomic analysis. Powered by Model Context Protocols (MCPs).
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pointer-events-auto">
            <a href="https://github.com/berntpopp/genefoundry" class="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-pink-600 transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>Get Started on GitHub</span>
            </a>
          </div>
        </div>

        <!-- Visual: 3D Carousel -->
        <div 
          class="relative h-[400px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing perspective-1000"
          @mousedown="handleMouseDown"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- The Flow (AI) - Center Glow -->
          <div class="absolute w-64 h-64 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
          
          <!-- Rotating Cards -->
          <div class="relative w-full h-full flex items-center justify-center transform-style-3d">
            <div 
              v-for="(card, index) in cards" 
              :key="card.id"
              class="absolute w-72 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden transition-transform duration-75 will-change-transform"
              :style="getCardStyle(index)"
            >
               <!-- Header -->
               <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                     <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                     <div class="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  </div>
                  <div class="text-xs font-mono text-slate-500">{{ card.title }}</div>
               </div>
               <!-- Code/Content -->
               <div class="p-5 font-mono text-xs sm:text-sm text-slate-600 space-y-2">
                  <div v-for="(line, i) in card.content" :key="i" class="flex gap-2">
                     <span class="text-purple-700">{{ line.key }}:</span>
                     <span :class="line.color">{{ line.value }}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Background Elements -->
    <div class="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl -z-10"></div>
    <div class="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
  </section>
</template>

<style scoped>
/* CSS containment prevents layout shifts from propagating */
section {
  contain: layout style paint;
}

.perspective-1000 {
  perspective: 1000px;
}
.transform-style-3d {
  transform-style: preserve-3d;
}

.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}
</style>
