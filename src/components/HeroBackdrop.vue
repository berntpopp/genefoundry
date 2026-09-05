<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
const backdrop = ref<HTMLElement | null>(null)
const mounted = ref(false)
const visible = ref(false)
const hidden = ref(false)
const reduced = ref(true)
const userPaused = ref(false)
const paused = computed(
  () => !mounted.value || !visible.value || hidden.value || reduced.value || userPaused.value
)
let observer: IntersectionObserver | undefined
let media: MediaQueryList | undefined
const updateVisibility = () => {
  hidden.value = document.hidden
}
const updateMotion = () => {
  reduced.value = media?.matches ?? true
}
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotion()
  updateVisibility()
  media.addEventListener('change', updateMotion)
  document.addEventListener('visibilitychange', updateVisibility)
  observer = new IntersectionObserver(
    ([entry]) => {
      visible.value = entry?.isIntersecting ?? false
    },
    { threshold: 0 }
  )
  if (backdrop.value) observer.observe(backdrop.value)
  mounted.value = true
})
onUnmounted(() => {
  observer?.disconnect()
  media?.removeEventListener('change', updateMotion)
  document.removeEventListener('visibilitychange', updateVisibility)
})
const contours = [
  'M-160 424C130 110 380 588 656 378S922-118 1172 24S1448 598 1654 228',
  'M-160 448C138 144 380 608 658 400S936-88 1186 50S1452 616 1654 252',
  'M-160 472C146 178 380 628 660 422S950-58 1200 76S1456 634 1654 276',
  'M-160 496C154 212 380 648 662 444S964-28 1214 102S1460 652 1654 300',
  'M-160 520C162 246 380 668 664 466S978 2 1228 128S1464 670 1654 324',
  'M-160 544C170 280 380 688 666 488S992 32 1242 154S1468 688 1654 348',
  'M-160 568C178 314 380 708 668 510S1006 62 1256 180S1472 706 1654 372',
  'M-160 592C186 348 380 728 670 532S1020 92 1270 206S1476 724 1654 396',
  'M-160 616C194 382 380 748 672 554S1034 122 1284 232S1480 742 1654 420',
  'M-160 640C202 416 380 768 674 576S1048 152 1298 258S1484 760 1654 444'
]
</script>
<template>
  <div ref="backdrop" class="hero-backdrop" :class="{ 'motion-paused': paused }" aria-hidden="true">
    <svg viewBox="0 0 1440 680" fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="hero-contour-visibility" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="white" stop-opacity=".4" />
          <stop offset=".38" stop-color="white" stop-opacity=".22" />
          <stop offset=".66" stop-color="white" />
        </linearGradient>
        <mask id="hero-contour-mask" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#hero-contour-visibility)" />
        </mask>
      </defs>
      <g mask="url(#hero-contour-mask)">
        <path
          class="contour-wash"
          d="M-160 424C130 110 380 588 656 378S922-118 1172 24S1448 598 1654 228L1654 444C1484 760 1548 400 1298 258S952 366 674 576S202 416-160 640Z"
        />
        <g class="contour-lines"><path v-for="path in contours" :key="path" :d="path" /></g>
        <g class="contour-current">
          <path
            v-for="(index, order) in [1, 4, 8]"
            :key="index"
            :d="contours[index]"
            pathLength="1000"
            :style="{ animationDelay: `${order * -4}s` }"
          />
        </g>
      </g>
    </svg>
  </div>
  <button
    v-if="mounted && !reduced"
    type="button"
    class="hero-motion-control"
    @click="userPaused = !userPaused"
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path v-if="userPaused" d="m5 3 7 5-7 5Z" />
      <path v-else d="M5 3v10M11 3v10" />
    </svg>
    {{ userPaused ? 'Resume animation' : 'Pause animation' }}
  </button>
</template>
<style scoped>
.hero-backdrop {
  position: absolute;
  inset-block: 0;
  left: 50%;
  width: 100vw;
  transform: translateX(-50%);
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.hero-backdrop > svg {
  width: 100%;
  height: 100%;
}
.contour-wash {
  fill: var(--color-brand);
  opacity: 0.035;
}
.contour-lines {
  stroke: var(--color-brand);
  stroke-width: 1;
  opacity: 0.24;
}
.contour-current {
  stroke: var(--color-brand);
  stroke-width: 1.8;
  opacity: 0.65;
}
.contour-current path {
  stroke-dasharray: 90 410;
  stroke-linecap: round;
  animation: contour-flow 14s linear infinite;
}
.motion-paused .contour-current path {
  animation-play-state: paused;
}
.hero-motion-control {
  position: absolute;
  bottom: 10px;
  right: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid var(--color-control-border);
  border-radius: 8px;
  background: var(--color-canvas);
  color: var(--color-muted);
  font-size: 0.875rem;
  z-index: 1;
}
.hero-motion-control:hover {
  color: var(--color-brand);
  border-color: var(--color-brand);
}
@keyframes contour-flow {
  to {
    stroke-dashoffset: -1000;
  }
}
@media (prefers-reduced-motion: reduce) {
  .contour-current path {
    animation: none;
    stroke-dasharray: none;
    opacity: 0.3;
  }
}
</style>
