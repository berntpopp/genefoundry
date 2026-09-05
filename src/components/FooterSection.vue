<script setup lang="ts">
import { COPY } from '../data/copy'
import { SITE } from '../data/site'
import { GITHUB_URL, HEALTH_URL, HOSTED_ENDPOINT } from '../data/servers'
import { siteHref, assetHref } from '../lib/urls'
const groups = [
  {
    title: 'Explore',
    links: [
      { label: 'Sources', href: siteHref('/sources/') },
      { label: 'Workflows', href: siteHref('/workflows/') },
      { label: 'Connect your client', href: siteHref('/connect/') }
    ]
  },
  {
    title: 'Project',
    links: [
      { label: 'About', href: siteHref('/about/') },
      { label: 'Scope and limitations', href: siteHref('/limitations/') },
      { label: 'GitHub repository', href: GITHUB_URL },
      { label: 'Contact', href: 'mailto:support@genefoundry.org' }
    ]
  }
]
</script>
<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-identity">
          <a :href="siteHref('/')" class="footer-brand"
            ><img
              :src="assetHref('/genefoundry_logo.svg')"
              alt=""
              width="32"
              height="32"
            />GeneFoundry</a
          >
          <p>{{ COPY.footer.description }}</p>
          <p class="metadata endpoint">
            Hosted MCP endpoint<br /><a :href="HOSTED_ENDPOINT">{{ HOSTED_ENDPOINT }}</a>
          </p>
        </div>
        <div v-for="group in groups" :key="group.title">
          <h2>{{ group.title }}</h2>
          <ul>
            <li v-for="link in group.links" :key="link.label">
              <a
                :id="link.label === 'Scope and limitations' ? 'features' : undefined"
                :href="link.href"
                >{{ link.label }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom metadata">
        <p>© {{ SITE.buildYear }} Bernt Popp · {{ COPY.footer.researchNotice }}</p>
        <div class="inline-links">
          <a :href="HEALTH_URL">Open endpoint health check</a
          ><a :href="siteHref('/imprint/')">Imprint</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped>
.site-footer {
  border-top: 1px solid var(--color-rule);
  padding-block: 48px 24px;
}
.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 64px;
  padding-bottom: 40px;
}
.footer-main > * {
  min-width: 0;
}
.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
}
.footer-identity p {
  max-width: 42ch;
  color: var(--color-muted);
  margin-top: 16px;
  font-size: 0.875rem;
}
h2 {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  margin: 8px 0 16px;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li + li {
  margin-top: 8px;
}
li a {
  font-size: 0.875rem;
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 24px;
  border-top: 1px solid var(--color-rule);
  padding-top: 24px;
}
@media (max-width: 700px) {
  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 32px 24px;
  }
  .footer-identity {
    grid-column: 1 / -1;
  }
  .footer-bottom {
    flex-direction: column;
  }
}
</style>
