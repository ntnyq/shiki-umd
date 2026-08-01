import { describe, expect, it } from 'vitest'
import {
  granularEntries,
  languageEntries,
  moduleEntries,
  themeEntries,
  toGlobalIdentifier,
  umdEntries,
} from '../build/entries'

describe('generated entries', () => {
  it('should include every canonical language and theme', () => {
    expect(moduleEntries).toHaveLength(7)
    expect(languageEntries).toHaveLength(242)
    expect(themeEntries).toHaveLength(65)
    expect(granularEntries).toHaveLength(307)
    expect(umdEntries).toHaveLength(314)
  })

  it('should generate stable global identifiers', () => {
    expect(toGlobalIdentifier('CSS')).toBe('CSS')
    expect(toGlobalIdentifier('HTML')).toBe('HTML')
    expect(toGlobalIdentifier('GitHub Light')).toBe('GitHubLight')
    expect(toGlobalIdentifier('C++')).toBe('Cpp')
    expect(toGlobalIdentifier('C#')).toBe('CSharp')
    expect(toGlobalIdentifier('F#')).toBe('FSharp')
    expect(toGlobalIdentifier('Catppuccin Frappé')).toBe('CatppuccinFrappe')
  })

  it('should expose the documented granular globals', () => {
    expect(languageEntries.find(entry => entry.id === 'css')?.globalName).toBe(
      'ShikiLangCSS',
    )
    expect(languageEntries.find(entry => entry.id === 'html')?.globalName).toBe(
      'ShikiLangHTML',
    )
    expect(
      themeEntries.find(entry => entry.id === 'github-light')?.globalName,
    ).toBe('ShikiThemeGitHubLight')
    expect(
      themeEntries.find(entry => entry.id === 'vitesse-light')?.globalName,
    ).toBe('ShikiThemeVitesseLight')
  })

  it('should keep every granular global unique', () => {
    const globalNames = granularEntries.map(entry => entry.globalName)
    expect(new Set(globalNames).size).toBe(globalNames.length)
  })
})
