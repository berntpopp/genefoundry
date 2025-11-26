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

const startAutoRotate = () => {
  stopAutoRotate()
  autoRotateInterval = window.setInterval(() => {
    if (!isDragging.value) {
      rotation.value -= 0.2 // Slow auto-rotation
    }
  }, 20)
}

const stopAutoRotate = () => {
  if (autoRotateInterval) {
    clearInterval(autoRotateInterval)
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

// 3D Position Calculation
const getCardStyle = (index: number) => {
  const totalCards = cards.length
  const angleStep = 360 / totalCards
  const currentAngle = (rotation.value + index * angleStep) % 360
  const rad = (currentAngle * Math.PI) / 180
  
  // Responsive parameters
  const isMobile = window.innerWidth < 640
  
  // Ellipse parameters
  const radiusX = isMobile ? 140 : 240 // Reduced width on mobile
  const radiusZ = isMobile ? 80 : 120 // Reduced depth on mobile
  
  const x = Math.sin(rad) * radiusX
  const z = Math.cos(rad) * radiusZ
  
  // Tilted plane: Front (z+) is lower (y+), Back (z-) is higher (y-)
  const y = z * 0.4

  // Exaggerated scale: Front bigger, back smaller
  // z range: -120 to 120 (desktop) or -80 to 80 (mobile)
  const scaleBase = isMobile ? 0.75 : 0.85
  const scaleFactor = isMobile ? 200 : 300
  const scale = scaleBase + (z / scaleFactor)
  
  const opacity = (z + 200) / 320 // Opacity based on depth
  const zIndex = Math.round(z)

  return {
    transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
    zIndex: zIndex,
    opacity: Math.max(0.3, Math.min(1, opacity)),
    filter: `blur(${Math.max(0, (120 - z) / 50)}px)` // Blur cards in back
  }
}

onMounted(() => {
  startAutoRotate()
})

onUnmounted(() => {
  stopAutoRotate()
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
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
            <a href="#" class="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-pink-600 transition-all shadow-lg hover:shadow-primary/25 flex items-center gap-2">
              <span>Get Started on GitHub</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 6 2 7.8 2 12 0 1.7-.5 3-1.5 4-1 .9-2.5 1-4.5 1-3 0-4.5-1-5.5-2.5 0-.5 0-1 .5-1.5 1 1 1.5 2 2.5 2 2.5 0 5 1 4.5 2 4 2 1.5 0 2.5-.5 3-1.5.5-1 .5-2 .5-3.5a4.8 4.8 0 0 0-1-3.5c3-1.5 3.5-1.5 5-2.5s2-1.5 3-1.5 3.5 1.5 4.5 3.5 4.5 3.5 0 1 1 1.5 1 2.5 1 4.5 0 6 1.5 7 3 7 3 0 5 1 4.5 2 4 2 1.5 0 2.5-.5 3-1.5.5-1 .5-2 .5-3.5z"/></svg>
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
