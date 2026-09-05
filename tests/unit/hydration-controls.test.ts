import { expect, test } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import ConnectSection from '../../src/components/ConnectSection.vue'
import CommandCard from '../../src/components/ui/CommandCard.vue'
import WorkflowPage from '../../src/pages/WorkflowPage.vue'
import { WORKFLOWS } from '../../src/data/workflows'

test('server-rendered setup controls cannot accept actions before their handlers mount', async () => {
  const html = await renderToString(createSSRApp({ render: () => h(ConnectSection) }))
  expect(html.match(/<select\b[^>]*>/)?.[0]).toMatch(/\bdisabled\b/)
  for (const button of html.match(/<button\b[^>]*>/g) ?? []) expect(button).toMatch(/\bdisabled\b/)
  expect(html).toContain('https://genefoundry.org/mcp')
  expect(html).toContain('/connect/claude-ai/')
})

test('server-rendered copy controls preserve readable text without claiming interactivity', async () => {
  for (const node of [
    h(CommandCard, { command: 'Readable setup command' }),
    h(WorkflowPage, { workflow: WORKFLOWS[0]! })
  ]) {
    const html = await renderToString(createSSRApp({ render: () => node }))
    expect(html.match(/<button\b[^>]*>/)?.[0]).toMatch(/\bdisabled\b/)
  }
})
