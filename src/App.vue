<script setup lang="ts">
import type { PageDefinition } from './data/contracts'
import { SERVERS } from './data/servers'
import { SOURCE_DETAILS } from './data/source-details'
import { CLIENT_GUIDES } from './data/clients'
import { WORKFLOWS } from './data/workflows'
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
import HomePage from './pages/HomePage.vue'
import SourceIndexPage from './pages/SourceIndexPage.vue'
import SourceDetailPage from './pages/SourceDetailPage.vue'
import ConnectIndexPage from './pages/ConnectIndexPage.vue'
import ClientGuidePage from './pages/ClientGuidePage.vue'
import WorkflowIndexPage from './pages/WorkflowIndexPage.vue'
import WorkflowPage from './pages/WorkflowPage.vue'
import AboutPage from './pages/AboutPage.vue'
import LimitationsPage from './pages/LimitationsPage.vue'
import ImprintPage from './pages/ImprintPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
const props = defineProps<{ page: PageDefinition }>()
const source =
  props.page.kind === 'source'
    ? SERVERS.find((s) => s.namespace === (props.page as { namespace: string }).namespace)
    : undefined
const detail = source ? SOURCE_DETAILS.find((d) => d.namespace === source.namespace) : undefined
const guide =
  props.page.kind === 'client'
    ? CLIENT_GUIDES.find((c) => c.id === (props.page as { clientId: string }).clientId)
    : undefined
const workflow =
  props.page.kind === 'workflow'
    ? WORKFLOWS.find((w) => w.id === (props.page as { workflowId: string }).workflowId)
    : undefined
</script>
<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <NavBar />
  <main id="main" tabindex="-1">
    <HomePage v-if="page.kind === 'home'" />
    <SourceIndexPage v-else-if="page.kind === 'source-index'" />
    <SourceDetailPage v-else-if="source && detail" :source="source" :detail="detail" />
    <ConnectIndexPage v-else-if="page.kind === 'client-index'" />
    <ClientGuidePage v-else-if="guide" :guide="guide" />
    <WorkflowIndexPage v-else-if="page.kind === 'workflow-index'" />
    <WorkflowPage v-else-if="workflow" :workflow="workflow" />
    <AboutPage v-else-if="page.kind === 'about'" />
    <LimitationsPage v-else-if="page.kind === 'limitations'" />
    <ImprintPage v-else-if="page.kind === 'imprint'" />
    <NotFoundPage v-else />
  </main>
  <FooterSection />
</template>
