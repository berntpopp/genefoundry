// Type declarations for lucide-vue-next direct icon imports
// These bypass the barrel file for better tree-shaking in dev mode
declare module 'lucide-vue-next/dist/esm/icons/*.js' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'
  const component: FunctionalComponent<SVGAttributes>
  export default component
}
