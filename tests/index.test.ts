import { describe, expect, it } from 'vitest'
import {
  bundledLanguages,
  bundledThemes,
  codeToHtml,
  createHighlighter,
} from '../src'
import { codeToHtml as codeToHtmlWeb } from '../src/web'

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
