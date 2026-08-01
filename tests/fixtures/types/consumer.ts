import type {
  LanguageRegistration,
  ThemeRegistration,
} from 'shiki-umd/core'
import css from 'shiki-umd/langs/css'
import html from 'shiki-umd/langs/html'
import githubLight from 'shiki-umd/themes/github-light'
import vitesseLight from 'shiki-umd/themes/vitesse-light'

type IsAny<T> = 0 extends 1 & T ? true : false
type AssertFalse<T extends false> = T

export type CssIsTyped = AssertFalse<IsAny<typeof css>>
export type GitHubLightIsTyped = AssertFalse<IsAny<typeof githubLight>>

export const languages: LanguageRegistration[][] = [css, html]
export const themes: ThemeRegistration[] = [githubLight, vitesseLight]
