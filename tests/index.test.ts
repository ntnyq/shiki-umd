import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  bundledLanguages,
  bundledThemes,
  codeToHtml,
  createHighlighter,
} from '../src'
import { codeToHtml as codeToHtmlWeb } from '../src/web'

interface ShikiBundle {
  codeToHtml: typeof codeToHtml
}

const distDir = resolve(import.meta.dirname, '../dist')

async function loadUmd(file: string): Promise<ShikiBundle> {
  const code = await readFile(resolve(distDir, file), 'utf8')
  const mod = { exports: {} }
  // eslint-disable-next-line no-new-func
  new Function('module', 'exports', code)(mod, mod.exports)
  return mod.exports as ShikiBundle
}

describe('full bundle', () => {
  it('should re-export shiki API', () => {
    expect(codeToHtml).toBeTypeOf('function')
    expect(createHighlighter).toBeTypeOf('function')
    expect(Object.keys(bundledLanguages).length).toBeGreaterThan(200)
    expect(Object.keys(bundledThemes).length).toBeGreaterThan(50)
  })

  it('should highlight code', async () => {
    const html = await codeToHtml('const hello: string = "world"', {
      lang: 'ts',
      theme: 'vitesse-dark',
    })
    expect(html).toMatch(/^<pre/u)
    expect(html).toContain('hello')
  })
})

describe('web bundle', () => {
  it('should highlight web languages', async () => {
    const html = await codeToHtmlWeb('<p>hi</p>', {
      lang: 'html',
      theme: 'nord',
    })
    expect(html).toMatch(/^<pre/u)
  })
})

// oxlint-disable-next-line node/no-sync -- `describe.skipIf` needs a sync check
describe.skipIf(!existsSync(distDir))('dist', () => {
  it.each(['index.umd.js', 'web.umd.js'])(
    '%s should work via CommonJS factory',
    async file => {
      const shiki = await loadUmd(file)
      expect(shiki.codeToHtml).toBeTypeOf('function')
      const html = await shiki.codeToHtml('let n = 1', {
        lang: 'js',
        theme: 'github-light',
      })
      expect(html).toMatch(/^<pre/u)
    },
  )

  it('index.umd.js should register the Shiki global', async () => {
    const code = await readFile(resolve(distDir, 'index.umd.js'), 'utf8')
    // eslint-disable-next-line no-new-func
    new Function(code).call(globalThis)
    const shikiGlobal = (globalThis as unknown as { Shiki: ShikiBundle }).Shiki
    expect(shikiGlobal.codeToHtml).toBeTypeOf('function')
    const html = await shikiGlobal.codeToHtml('fn main() {}', {
      lang: 'rust',
      theme: 'vitesse-light',
    })
    expect(html).toContain('main')
  })
})
