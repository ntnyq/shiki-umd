import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { GranularUmdEntry } from './entries.ts'

const distDir = resolve(import.meta.dirname, '../dist')

function createEsmDeclaration(entry: GranularUmdEntry): string {
  if (entry.kind === 'language') {
    return `import type { LanguageRegistration } from '../core.js'

declare const languages: LanguageRegistration[]

export default languages
`
  }

  return `import type { ThemeRegistration } from '../core.js'

declare const theme: ThemeRegistration

export default theme
`
}

function createUmdDeclaration(entry: GranularUmdEntry): string {
  const moduleName = entry.name.slice(entry.name.lastIndexOf('/') + 1)

  return `import value from './${moduleName}.js'

declare global {
  const ${entry.globalName}: typeof value
}

export {}
`
}

export async function generateGranularTypes(
  entries: readonly GranularUmdEntry[],
): Promise<void> {
  await Promise.all(
    entries.map(async entry => {
      const outputBase = resolve(distDir, entry.name)
      await mkdir(dirname(outputBase), { recursive: true })

      await Promise.all([
        writeFile(`${outputBase}.d.ts`, createEsmDeclaration(entry)),
        writeFile(`${outputBase}.umd.d.ts`, createUmdDeclaration(entry)),
      ])
    }),
  )
}
