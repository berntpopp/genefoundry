<script setup lang="ts">
import ServerCatalog from '../components/ServerCatalog.vue'
import { COPY } from '../data/copy'
</script>
<template>
  <div class="container section">
    <header class="page-header">
      <h1>Biomedical sources</h1>
      <p class="lead">{{ COPY.sources.lead }}</p>
    </header>
    <ServerCatalog />
  </div>
</template>
