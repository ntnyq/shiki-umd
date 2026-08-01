import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundledLanguagesInfo } from 'shiki/langs'
import { bundledThemesInfo } from 'shiki/themes'

export interface UmdEntry {
  entry: string
  exportMode: 'default' | 'named'
  globalName: string
  name: string
}

export interface GranularUmdEntry extends UmdEntry {
  exportMode: 'default'
  id: string
  kind: 'language' | 'theme'
}

const projectDir = resolve(import.meta.dirname, '..')
const shikiDistDir = dirname(fileURLToPath(import.meta.resolve('shiki')))

export const moduleEntries = [
  {
    entry: resolve(projectDir, 'src/index.ts'),
    exportMode: 'named',
    globalName: 'Shiki',
    name: 'index',
  },
  {
    entry: resolve(projectDir, 'src/web.ts'),
    exportMode: 'named',
    globalName: 'Shiki',
    name: 'web',
  },
  {
    entry: resolve(projectDir, 'src/core.ts'),
    exportMode: 'named',
    globalName: 'ShikiCore',
    name: 'core',
  },
  {
    entry: resolve(projectDir, 'src/themes.ts'),
    exportMode: 'named',
    globalName: 'ShikiThemes',
    name: 'themes',
  },
  {
    entry: resolve(projectDir, 'src/langs.ts'),
    exportMode: 'named',
    globalName: 'ShikiLangs',
    name: 'langs',
  },
  {
    entry: resolve(projectDir, 'src/engine-javascript.ts'),
    exportMode: 'named',
    globalName: 'ShikiEngineJavaScript',
    name: 'engine-javascript',
  },
  {
    entry: resolve(projectDir, 'src/engine-oniguruma.ts'),
    exportMode: 'named',
    globalName: 'ShikiEngineOniguruma',
    name: 'engine-oniguruma',
  },
] as const satisfies readonly UmdEntry[]

export function toGlobalIdentifier(label: string): string {
  const identifier = label
    .normalize('NFKD')
    .replaceAll(/\p{Mark}/gu, '')
    .replaceAll('++', 'pp')
    .replaceAll('#', 'Sharp')
    .replaceAll('&', 'And')
    .replaceAll(/[^A-Za-z0-9_$]/gu, '')

  if (!identifier) {
    throw new Error(`Cannot create a global identifier from "${label}"`)
  }

  return identifier
}

export const languageEntries: readonly GranularUmdEntry[] =
  bundledLanguagesInfo.map(language => ({
    entry: resolve(shikiDistDir, 'langs', `${language.id}.mjs`),
    exportMode: 'default',
    globalName: `ShikiLang${toGlobalIdentifier(language.name)}`,
    id: language.id,
    kind: 'language',
    name: `langs/${language.id}`,
  }))

export const themeEntries: readonly GranularUmdEntry[] = bundledThemesInfo.map(
  theme => ({
    entry: resolve(shikiDistDir, 'themes', `${theme.id}.mjs`),
    exportMode: 'default',
    globalName: `ShikiTheme${toGlobalIdentifier(theme.displayName)}`,
    id: theme.id,
    kind: 'theme',
    name: `themes/${theme.id}`,
  }),
)

export const granularEntries = [
  ...languageEntries,
  ...themeEntries,
] as const satisfies readonly GranularUmdEntry[]

export const umdEntries = [
  ...moduleEntries,
  ...granularEntries,
] as const satisfies readonly UmdEntry[]

const granularGlobalNames = new Set<string>()

for (const entry of granularEntries) {
  if (granularGlobalNames.has(entry.globalName)) {
    throw new Error(`Duplicate UMD global name: ${entry.globalName}`)
  }

  granularGlobalNames.add(entry.globalName)
}
