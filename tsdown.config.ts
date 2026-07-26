import { defineConfig } from 'tsdown'
import type { UserConfig } from 'tsdown'

const entries = {
  index: 'src/index.ts',
  web: 'src/web.ts',
}

/**
 * Each entry is built on its own so every output file is fully self-contained,
 * with shiki, its grammars, themes and the oniguruma wasm binary all inlined.
 */
export default defineConfig([
  // ESM builds, single file per entry
  ...Object.entries(entries).map(
    ([name, entry], index): UserConfig => ({
      clean: index === 0,
      // Bundling everything is the point of this package
      deps: { onlyBundle: false },
      dts: {
        tsgo: true,
      },
      entry: { [name]: entry },
      format: 'es',
      minify: true,
      outputOptions: {
        codeSplitting: false,
      },
      platform: 'browser',
    }),
  ),
  // UMD builds for direct <script> usage, exposed as the `Shiki` global
  ...Object.entries(entries).map(
    ([name, entry]): UserConfig => ({
      clean: false,
      deps: { onlyBundle: false },
      dts: false,
      entry: { [name]: entry },
      format: 'umd',
      globalName: 'Shiki',
      minify: true,
      platform: 'browser',
    }),
  ),
])
