/** Use the production renderer in development, with Vite's live module loading. */
export function devRender() {
  return {
    name: 'genefoundry-dev-render',
    apply: 'serve',
    transformIndexHtml: {
      order: 'post',
      async handler(html, context) {
        if (!context.server) return html
        const { render, resolvePage, pageHead } =
          await context.server.ssrLoadModule('/src/entry-server.ts')
        const pathname = new URL(context.originalUrl ?? context.path, 'http://localhost').pathname
        const page = resolvePage(pathname)
        const appHtml = await render(page)
        // Vue's scoped styles normally arrive through client JavaScript in dev.
        // Load the same generated CSS modules before painting the rendered HTML.
        const styles = [...context.server.environments.ssr.moduleGraph.idToModuleMap.values()]
          .filter((module) => module.url.includes('?vue&type=style&'))
          .map((module) => ({
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href:
                context.server.config.base + module.url.slice(1).replace('?vue&', '?direct&vue&')
            },
            injectTo: 'head'
          }))
        return {
          html: html
            .replace('<!--page-head-->', () => pageHead(page))
            .replace('<!--app-html-->', () => appHtml),
          tags: styles
        }
      }
    }
  }
}
