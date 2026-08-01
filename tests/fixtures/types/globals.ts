import 'shiki-umd/dist/langs/css.umd.js'
import 'shiki-umd/dist/langs/html.umd.js'
import 'shiki-umd/dist/themes/github-light.umd.js'
import 'shiki-umd/dist/themes/vitesse-light.umd.js'

const languageName: string = ShikiLangCSS.at(-1)!.name
const embeddedLanguageName: string = ShikiLangHTML.at(-1)!.name
const themeName: string | undefined = ShikiThemeGitHubLight.name
const alternateThemeName: string | undefined = ShikiThemeVitesseLight.name

void languageName
void embeddedLanguageName
void themeName
void alternateThemeName
