import { createApp, h, ref } from 'vue'
import ClientGuidePage from '../../src/pages/ClientGuidePage.vue'
import { CLIENT_GUIDES } from '../../src/data/clients'
import type { ClientGuide } from '../../src/data/contracts'
import '../../src/style.css'
const sample: ClientGuide = {
  ...CLIENT_GUIDES.find((guide) => guide.id === 'claude-code')!,
  recipeState: 'verified',
  code: 'Sample setup text for copy interaction testing.',
  recipeTest: {
    clientVersion: 'UI sample',
    platform: 'UI test fixture — not compatibility evidence',
    testedAt: '2026-09-05',
    verificationId: 'ui-copy-fixture'
  }
}
createApp({
  setup() {
    const alternate = ref(false)
    return () =>
      h('main', [
        h('p', 'UI test fixture — not compatibility evidence'),
        h(
          'button',
          {
            onClick: () => {
              alternate.value = !alternate.value
            }
          },
          'Change fixture content'
        ),
        h(ClientGuidePage, {
          guide: {
            ...sample,
            code: alternate.value
              ? 'Alternate sample text for copy interaction testing.'
              : sample.code
          }
        })
      ])
  }
}).mount('#fixture')
