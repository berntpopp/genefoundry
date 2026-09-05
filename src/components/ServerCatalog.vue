<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { CATEGORIES, SERVERS, GITHUB_URL, type ServerCategory } from '../data/servers'
import { SOURCE_DETAILS } from '../data/source-details'
import { COPY } from '../data/copy'
import { filterSources } from '../lib/catalog'
import SourceList from './SourceList.vue'
const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const category = ref<ServerCategory | 'all'>('all')
const mounted = ref(false)
const filtered = computed(() => filterSources(SERVERS, SOURCE_DETAILS, query.value, category.value))
const countText = computed(
  () => `${filtered.value.length} ${filtered.value.length === 1 ? 'source' : 'sources'} found`
)
const announcedCount = ref(countText.value)
let timer: ReturnType<typeof setTimeout> | undefined
function restore() {
  const params = new URLSearchParams(location.search)
  query.value = (params.get('q') ?? '').slice(0, 200)
  const candidate = params.get('category')
  category.value = CATEGORIES.some((item) => item.id === candidate)
    ? (candidate as ServerCategory)
    : 'all'
}
function clearSearch() {
  query.value = ''
  searchInput.value?.focus()
}
function clear() {
  clearSearch()
  category.value = 'all'
}
onMounted(() => {
  restore()
  mounted.value = true
  window.addEventListener('popstate', restore)
})
onUnmounted(() => {
  clearTimeout(timer)
  window.removeEventListener('popstate', restore)
})
watch([query, category], () => {
  if (!mounted.value) return
  const url = new URL(location.href)
  if (query.value.trim()) url.searchParams.set('q', query.value)
  else url.searchParams.delete('q')
  if (category.value !== 'all') url.searchParams.set('category', category.value)
  else url.searchParams.delete('category')
  history.replaceState(history.state, '', url)
  clearTimeout(timer)
  timer = setTimeout(() => {
    announcedCount.value = countText.value
  }, 180)
})
</script>
<template>
  <div>
    <noscript>Search and filters need JavaScript. Browse all sources below.</noscript>
    <template v-if="SERVERS.length">
      <form class="catalog-filters" role="search" @submit.prevent>
        <div class="search-field">
          <label for="source-search">{{ COPY.sources.searchLabel }}</label
          ><input
            id="source-search"
            ref="searchInput"
            v-model="query"
            :disabled="!mounted"
            type="search"
            maxlength="200"
            :placeholder="COPY.sources.searchPlaceholder"
            autocomplete="off"
          /><button v-if="query" type="button" class="clear-search" @click="clearSearch">
            {{ COPY.sources.clearSearch }}
          </button>
        </div>
        <div class="category-field">
          <label for="source-category">{{ COPY.sources.categoryLabel }}</label
          ><select id="source-category" v-model="category" :disabled="!mounted">
            <option value="all">{{ COPY.sources.allCategories }}</option>
            <option v-for="item in CATEGORIES" :key="item.id" :value="item.id">
              {{ item.label }}
            </option>
          </select>
        </div>
      </form>
      <div class="catalog-status">
        <p role="status" aria-live="polite" aria-atomic="true">{{ announcedCount }}</p>
        <button
          v-if="query || category !== 'all'"
          type="button"
          class="clear-filters"
          @click="clear"
        >
          {{ COPY.sources.clearFilters }}
        </button>
      </div>
      <p v-if="category !== 'all'" class="metadata active-category">
        Research area: {{ CATEGORIES.find((item) => item.id === category)?.label }}
      </p>
      <SourceList v-if="filtered.length" :sources="filtered" :heading-level="2" />
      <div v-else class="empty-state">
        <h2>{{ COPY.sources.noResults }}</h2>
        <p>{{ COPY.sources.noResultsHelp }}</p>
        <button class="button-secondary" type="button" @click="clear">
          {{ COPY.sources.clearFilters }}
        </button>
      </div>
    </template>
    <div v-else class="empty-state">
      <h2>The source catalog is unavailable.</h2>
      <p>Reload the page or open the router repository.</p>
      <div class="inline-links">
        <a href="">Reload page</a><a :href="GITHUB_URL">Open repository</a>
      </div>
    </div>
  </div>
</template>
<style scoped>
.catalog-filters {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;
  padding: 24px;
  border: 1px solid var(--color-rule);
  background: var(--color-surface);
  border-radius: 8px;
}
.catalog-filters label {
  display: block;
  margin-bottom: 8px;
}
.catalog-filters select {
  width: 100%;
}
.search-field,
.category-field {
  min-width: 0;
}
.clear-search,
.clear-filters {
  color: var(--color-brand);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  font-size: 0.875rem;
}
.clear-search {
  margin-top: 4px;
}
.catalog-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 80px;
}
.catalog-status p {
  font-size: 0.875rem;
  color: var(--color-muted);
}
.active-category {
  margin-bottom: 16px;
}
.empty-state {
  border-block: 1px solid var(--color-rule);
  padding-block: 48px;
}
.empty-state h2 {
  font-size: 1.5rem;
}
.empty-state p {
  margin-block: 16px 24px;
}
@media (max-width: 640px) {
  .catalog-filters {
    grid-template-columns: minmax(0, 1fr);
    padding: 20px;
  }
}
</style>
