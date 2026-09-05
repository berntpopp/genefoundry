<script setup lang="ts">
import { siteHref } from '../lib/urls'
</script>
<template>
  <article class="reading-page">
    <header class="page-header">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <p class="lead">The address may have changed. Browse sources or return home.</p>
    </header>
    <div class="inline-links">
      <a class="button" :href="siteHref('/sources/')">Browse sources</a
      ><a :href="siteHref('/')">Return home</a>
    </div>
  </article>
</template>
