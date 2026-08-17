// oxlint-disable import/max-dependencies -- integration tests cover every public bundle
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { codeToHtml } from 'shiki'
import type {
  createHighlighterCore,
  LanguageRegistration,
  ThemeRegistrationAny,
} from 'shiki/core'
import type { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import type { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import type { bundledLanguages } from 'shiki/langs'
import type { bundledThemes } from 'shiki/themes'
import { describe, expect, it } from 'vitest'
import { languageEntries, moduleEntries, themeEntries } from '../build/entries'

interface CoreBundle {
  createHighlighterCore: typeof createHighlighterCore
}

interface EngineJavaScriptBundle {
  createJavaScriptRegexEngine: typeof createJavaScriptRegexEngine
}

interface EngineOnigurumaBundle {
  createOnigurumaEngine: typeof createOnigurumaEngine
}

interface LangsBundle {
  bundledLanguages: typeof bundledLanguages
}

interface ShikiBundle {
  codeToHtml: typeof codeToHtml
}

interface ThemesBundle {
  bundledThemes: typeof bundledThemes
}

interface NamedLanguageRegistration {
  name: string
}

interface NamedThemeRegistration {
  name: string
}

const distDir = resolve(import.meta.dirname, '../dist')

function readUmd(file: string): Promise<string> {
  return readFile(resolve(distDir, file), 'utf8')
}

async function loadUmd<T>(file: string): Promise<T> {
  const code = await readUmd(file),
   mod = { exports: {} }
  // eslint-disable-next-line no-new-func
  new Function('module', 'exports', code)(mod, mod.exports)
  return mod.exports as T
}

async function loadUmdGlobal<T>(file: string, globalName: string): Promise<T> {
  const code = await readUmd(file),
   globals: Record<string, unknown> = {}
  // eslint-disable-next-line no-new-func
  new Function('globalThis', code)(globals)
  return globals[globalName] as T
}

// oxlint-disable-next-line node/no-sync -- `describe.skipIf` needs a sync check
describe.skipIf(!existsSync(distDir))('generated UMD modules', () => {
  it.each(moduleEntries)(
    '$name.umd.js should register $globalName',
    async entry => {
      const value = await loadUmdGlobal(
        `${entry.name}.umd.js`,
        entry.globalName,
      )
      expect(value).toBeDefined()
    },
  )

  it.each(languageEntries)(
    '$name.umd.js should register $globalName',
    async entry => {
      const [value, esmTypes, umdTypes] = await Promise.all([
        loadUmdGlobal<NamedLanguageRegistration[]>(
          `${entry.name}.umd.js`,
          entry.globalName,
        ),
        readUmd(`${entry.name}.d.ts`),
        readUmd(`${entry.name}.umd.d.ts`),
      ])
      expect(value).toBeInstanceOf(Array)
      expect(value.some(language => language.name === entry.id)).toBe(true)
      expect(esmTypes).toContain('LanguageRegistration[]')
      expect(umdTypes).toContain(`const ${entry.globalName}:`)
    },
  )

  it.each(themeEntries)(
    '$name.umd.js should register $globalName',
    async entry => {
      const [value, esmTypes, umdTypes] = await Promise.all([
        loadUmdGlobal<NamedThemeRegistration>(
          `${entry.name}.umd.js`,
          entry.globalName,
        ),
        readUmd(`${entry.name}.d.ts`),
        readUmd(`${entry.name}.umd.d.ts`),
      ])
      expect(value).toMatchObject({ name: entry.id })
      expect(esmTypes).toContain('ThemeRegistration')
      expect(umdTypes).toContain(`const ${entry.globalName}:`)
    },
  )

  it.each(['index.umd.js', 'web.umd.js'])(
    '%s should work via its CommonJS factory',
    async file => {
      const shiki = await loadUmd<ShikiBundle>(file),
       html = await shiki.codeToHtml('let n = 1', {
        lang: 'js',
        theme: 'github-light',
      })
      expect(html).toMatch(/^<pre/u)
    },
  )

  it('should expose every language and theme through aggregate modules', async () => {
    const [langs, themes] = await Promise.all([
      loadUmd<LangsBundle>('langs.umd.js'),
      loadUmd<ThemesBundle>('themes.umd.js'),
    ])

    expect(
      languageEntries.every(entry => entry.id in langs.bundledLanguages),
    ).toBe(true)
    expect(Object.keys(themes.bundledThemes)).toHaveLength(themeEntries.length)
  })

  it('should compose granular modules with the JavaScript engine', async () => {
    const [core, engine, css, theme] = await Promise.all([
      loadUmd<CoreBundle>('core.umd.js'),
      loadUmd<EngineJavaScriptBundle>('engine-javascript.umd.js'),
      loadUmd<LanguageRegistration[]>('langs/css.umd.js'),
      loadUmd<ThemeRegistrationAny>('themes/github-light.umd.js'),
    ]),
     highlighter = await core.createHighlighterCore({
      engine: engine.createJavaScriptRegexEngine(),
      langs: [css],
      themes: [theme],
    }),

     html = highlighter.codeToHtml('body { color: red }', {
      lang: 'css',
      theme: 'github-light',
    })
    expect(html).toContain('color')
    highlighter.dispose()
  })

  it('should compose granular modules with the inlined Oniguruma engine', async () => {
    const [core, engine, htmlLanguage, theme] = await Promise.all([
      loadUmd<CoreBundle>('core.umd.js'),
      loadUmd<EngineOnigurumaBundle>('engine-oniguruma.umd.js'),
      loadUmd<LanguageRegistration[]>('langs/html.umd.js'),
      loadUmd<ThemeRegistrationAny>('themes/vitesse-light.umd.js'),
    ]),
     highlighter = await core.createHighlighterCore({
      engine: await engine.createOnigurumaEngine(),
      langs: [htmlLanguage],
      themes: [theme],
    }),

     html = highlighter.codeToHtml('<p>hello</p>', {
      lang: 'html',
      theme: 'vitesse-light',
    })
    expect(html).toContain('hello')
    highlighter.dispose()
  })
})
