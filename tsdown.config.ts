import { defineConfig } from 'tsdown'
import type { UserConfig } from 'tsdown'
import { granularEntries, moduleEntries, umdEntries } from './build/entries.ts'
import { generateGranularTypes } from './build/generate-types.ts'

/**
 * Each entry is built on its own so every output file is fully self-contained,
 * without runtime imports or shared chunks. Full bundles and the Oniguruma
 * engine also inline the WASM binary.
 */
export default defineConfig([
  // ESM builds, single file per entry
  ...moduleEntries.map(({ name, entry }, index): UserConfig => {
    const config: UserConfig = {
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
    }

    if (index === 0) {
      config.hooks = {
        'build:done': () => generateGranularTypes(granularEntries),
      }
    }

    return config
  }),
  // Fine-grained ESM builds and declarations, one self-contained file per entry
  ...granularEntries.map(({ name, entry }): UserConfig => ({
    clean: false,
    deps: { onlyBundle: false },
    dts: false,
    entry: { [name]: entry },
    format: 'es',
    minify: true,
    outputOptions: {
      codeSplitting: false,
    },
    platform: 'browser',
  })),
  // UMD builds for direct <script> usage, with one global per entry
  ...umdEntries.map(({ name, entry, exportMode, globalName }): UserConfig => ({
    clean: false,
    deps: { onlyBundle: false },
    dts: false,
    entry: { [name]: entry },
    format: 'umd',
    globalName,
    minify: true,
    outputOptions: {
      codeSplitting: false,
      exports: exportMode,
    },
    platform: 'browser',
  })),
])
