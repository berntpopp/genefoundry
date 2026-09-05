<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GITHUB_URL } from '../data/servers'
import { assetHref, siteHref, stripBase } from '../lib/urls'
const menu = ref<HTMLDetailsElement | null>(null)
const connectHref = ref(siteHref('/connect/'))
const links = [
  { label: 'Sources', href: siteHref('/sources/') },
  { label: 'Workflows', href: siteHref('/workflows/') },
  { label: 'About', href: siteHref('/about/') },
  { label: 'GitHub', href: GITHUB_URL }
]
onMounted(() => {
  if (stripBase(location.pathname) === '/') connectHref.value = siteHref('/#connect')
})
function closeMenu(restoreFocus = false) {
  if (!menu.value?.open) return
  menu.value.open = false
  if (restoreFocus) menu.value.querySelector('summary')?.focus()
}
</script>
<template>
  <header class="site-header">
    <nav class="container navigation" aria-label="Main navigation" @keydown.esc="closeMenu(true)">
      <a :href="siteHref('/')" class="brand-link" aria-label="GeneFoundry home">
        <img :src="assetHref('/genefoundry_logo.svg')" width="34" height="34" alt="" />
        <span>Gene<span class="brand-word">Foundry</span></span>
      </a>
      <div class="desktop-navigation">
        <a v-for="link in links" :key="link.label" :href="link.href">{{ link.label }}</a>
        <a :href="connectHref" class="button">Connect your client</a>
      </div>
      <details ref="menu" class="mobile-navigation">
        <summary aria-label="Open navigation menu">
          <span>Menu</span
          ><svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </summary>
        <div class="mobile-links">
          <a v-for="link in links" :key="link.label" :href="link.href" @click="closeMenu()">{{
            link.label
          }}</a>
          <a :href="connectHref" class="button" @click="closeMenu()">Connect your client</a>
          <button class="close-navigation" @click="closeMenu(true)">Close navigation</button>
        </div>
      </details>
    </nav>
  </header>
</template>
<style scoped>
.site-header {
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-canvas);
  position: relative;
  z-index: 10;
}
.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  gap: 24px;
  flex-wrap: wrap;
}
.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
}
.brand-link img {
  flex-shrink: 0;
}
.brand-word {
  color: var(--color-brand);
}
.desktop-navigation {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 0.875rem;
  font-weight: 500;
}
.desktop-navigation > a:not(.button) {
  color: var(--color-ink);
  text-decoration: none;
  padding-block: 12px;
}
.desktop-navigation > a:hover {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}
.mobile-navigation {
  display: none;
}
@media (max-width: 900px) {
  .navigation {
    min-height: 64px;
    gap: 12px;
  }
  .desktop-navigation {
    display: none;
  }
  .mobile-navigation {
    display: block;
  }
  summary {
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  .mobile-links {
    position: absolute;
    inset: 100% 0 auto;
    display: grid;
    gap: 4px;
    padding: 16px 24px;
    background: var(--color-canvas);
    border-bottom: 1px solid var(--color-control-border);
    box-shadow: 0 8px 12px #1823250a;
  }
  .mobile-links a:not(.button) {
    padding: 10px 0;
    color: var(--color-ink);
  }
  .close-navigation {
    justify-self: start;
    text-decoration: underline;
    color: var(--color-brand);
    margin-top: 4px;
  }
}
@media (max-width: 350px) {
  .brand-link {
    font-size: 1rem;
    gap: 6px;
  }
  .brand-link img {
    width: 28px;
    height: 28px;
  }
}
</style>
