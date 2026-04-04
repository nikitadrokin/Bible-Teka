import { defineConfig } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

/**
 * vitefu marks `nuqs` as optimizeDeps.exclude (framework peer of TanStack Router).
 * Vite still pre-bundles it as an entry; esbuild then errors because exclude becomes `external`.
 */
function nuqsOptimizeDepsFix(): Plugin {
  return {
    name: 'nuqs-optimize-deps-fix',
    enforce: 'post',
    configResolved(config: ResolvedConfig) {
      const stripNuqs = (exclude: string[] | undefined) =>
        exclude?.filter((dep) => dep !== 'nuqs')

      if (config.optimizeDeps.exclude?.length) {
        const next = stripNuqs(config.optimizeDeps.exclude)
        if (next) config.optimizeDeps.exclude = next
      }
      for (const env of Object.values(config.environments ?? {})) {
        if (env.optimizeDeps.exclude?.length) {
          const next = stripNuqs(env.optimizeDeps.exclude)
          if (next) env.optimizeDeps.exclude = next
        }
      }
    },
  }
}

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
    }),
    nuqsOptimizeDepsFix(),
    viteReact(),
  ],
})

export default config
