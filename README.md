# shiki-umd

[![CI](https://github.com/ntnyq/shiki-umd/workflows/CI/badge.svg)](https://github.com/ntnyq/shiki-umd/actions)
[![NPM VERSION](https://img.shields.io/npm/v/shiki-umd.svg)](https://www.npmjs.com/package/shiki-umd)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/shiki-umd.svg)](https://www.npmjs.com/package/shiki-umd)
[![LICENSE](https://img.shields.io/github/license/ntnyq/shiki-umd.svg)](https://github.com/ntnyq/shiki-umd/blob/main/LICENSE)

[Shiki](https://shiki.style) bundled as self-contained UMD / ESM files, for direct `<script>` and CDN usage — no build step required. Use a complete bundle or compose the core, an engine, and only the languages and themes you need.

## Usage

### CDN / `<script>`

The UMD build registers a `Shiki` global:

```html
<script src="https://cdn.jsdelivr.net/npm/shiki-umd"></script>
<script>
  Shiki.codeToHtml('const hello = "world"', {
    lang: 'ts',
    theme: 'vitesse-dark',
  }).then(html => {
    document.querySelector('#code').innerHTML = html
  })
</script>
```

Also works on [unpkg](https://unpkg.com/shiki-umd), or with AMD loaders and CommonJS.

### Bundles

| File                | Content                                                                                    | Minified | Gzip     |
| ------------------- | ------------------------------------------------------------------------------------------ | -------- | -------- |
| `dist/index.umd.js` | Full bundle — all languages and themes                                                     | ~9.1 MB  | ~1.6 MB  |
| `dist/web.umd.js`   | Web bundle — web languages (HTML, CSS, JS, TS, JSON, Markdown, Vue, JSX, …) and all themes | ~4.9 MB  | ~0.79 MB |

The web bundle is enough for most sites and loads considerably faster:

```html
<script src="https://cdn.jsdelivr.net/npm/shiki-umd/dist/web.umd.js"></script>
```

Both files expose the same `Shiki` global.

### Fine-grained UMD

Fine-grained modules can be combined without a build step. Each file is self-contained and registers its own global:

| File                            | Global                  |
| ------------------------------- | ----------------------- |
| `dist/core.umd.js`              | `ShikiCore`             |
| `dist/langs.umd.js`             | `ShikiLangs`            |
| `dist/themes.umd.js`            | `ShikiThemes`           |
| `dist/engine-javascript.umd.js` | `ShikiEngineJavaScript` |
| `dist/engine-oniguruma.umd.js`  | `ShikiEngineOniguruma`  |

Every canonical Shiki language and theme also has a standalone UMD file. Language modules directly expose a language registration array, while theme modules directly expose a theme object—there is no `.default` wrapper.

```text
dist/langs/css.umd.js               → ShikiLangCSS
dist/langs/html.umd.js              → ShikiLangHTML
dist/themes/github-light.umd.js     → ShikiThemeGitHubLight
dist/themes/vitesse-light.umd.js    → ShikiThemeVitesseLight
```

For example, use the JavaScript regex engine for a small WASM-free setup:

```html
<script src="https://cdn.jsdelivr.net/npm/shiki-umd/dist/core.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/shiki-umd/dist/engine-javascript.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/shiki-umd/dist/langs/css.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/shiki-umd/dist/themes/github-light.umd.js"></script>
<script>
  ShikiCore.createHighlighterCore({
    engine: ShikiEngineJavaScript.createJavaScriptRegexEngine(),
    langs: [ShikiLangCSS],
    themes: [ShikiThemeGitHubLight],
  }).then(highlighter => {
    document.querySelector('#code').innerHTML = highlighter.codeToHtml(
      'body { color: red }',
      { lang: 'css', theme: 'github-light' },
    )
  })
</script>
```

`ShikiEngineOniguruma.createOnigurumaEngine()` is also ready to use without arguments; its WASM binary is inlined into `engine-oniguruma.umd.js`.

Each fine-grained module includes declarations for both its ESM default export and UMD global. The package subpaths can therefore be imported with full types:

```ts
import css from 'shiki-umd/langs/css'
import html from 'shiki-umd/langs/html'
import githubLight from 'shiki-umd/themes/github-light'
import vitesseLight from 'shiki-umd/themes/vitesse-light'
```

### Package-to-UMD mapping

All names below use the official `@shikijs/` package scope. Each path is relative to this package.

<details>
<summary>Core (3)</summary>

| Shiki package/subpath        | UMD file                        | GlobalName              |
| ---------------------------- | ------------------------------- | ----------------------- |
| `@shikijs/core`              | `dist/core.umd.js`              | `ShikiCore`             |
| `@shikijs/engine-javascript` | `dist/engine-javascript.umd.js` | `ShikiEngineJavaScript` |
| `@shikijs/engine-oniguruma`  | `dist/engine-oniguruma.umd.js`  | `ShikiEngineOniguruma`  |

</details>

<details>
<summary>Themes (66)</summary>

| Shiki package/subpath                        | UMD file                                        | GlobalName                          |
| -------------------------------------------- | ----------------------------------------------- | ----------------------------------- |
| `@shikijs/themes`                            | `dist/themes.umd.js`                            | `ShikiThemes`                       |
| `@shikijs/themes/andromeeda`                 | `dist/themes/andromeeda.umd.js`                 | `ShikiThemeAndromeeda`              |
| `@shikijs/themes/aurora-x`                   | `dist/themes/aurora-x.umd.js`                   | `ShikiThemeAuroraX`                 |
| `@shikijs/themes/ayu-dark`                   | `dist/themes/ayu-dark.umd.js`                   | `ShikiThemeAyuDark`                 |
| `@shikijs/themes/ayu-light`                  | `dist/themes/ayu-light.umd.js`                  | `ShikiThemeAyuLight`                |
| `@shikijs/themes/ayu-mirage`                 | `dist/themes/ayu-mirage.umd.js`                 | `ShikiThemeAyuMirage`               |
| `@shikijs/themes/catppuccin-frappe`          | `dist/themes/catppuccin-frappe.umd.js`          | `ShikiThemeCatppuccinFrappe`        |
| `@shikijs/themes/catppuccin-latte`           | `dist/themes/catppuccin-latte.umd.js`           | `ShikiThemeCatppuccinLatte`         |
| `@shikijs/themes/catppuccin-macchiato`       | `dist/themes/catppuccin-macchiato.umd.js`       | `ShikiThemeCatppuccinMacchiato`     |
| `@shikijs/themes/catppuccin-mocha`           | `dist/themes/catppuccin-mocha.umd.js`           | `ShikiThemeCatppuccinMocha`         |
| `@shikijs/themes/dark-plus`                  | `dist/themes/dark-plus.umd.js`                  | `ShikiThemeDarkPlus`                |
| `@shikijs/themes/dracula`                    | `dist/themes/dracula.umd.js`                    | `ShikiThemeDraculaTheme`            |
| `@shikijs/themes/dracula-soft`               | `dist/themes/dracula-soft.umd.js`               | `ShikiThemeDraculaThemeSoft`        |
| `@shikijs/themes/everforest-dark`            | `dist/themes/everforest-dark.umd.js`            | `ShikiThemeEverforestDark`          |
| `@shikijs/themes/everforest-light`           | `dist/themes/everforest-light.umd.js`           | `ShikiThemeEverforestLight`         |
| `@shikijs/themes/github-dark`                | `dist/themes/github-dark.umd.js`                | `ShikiThemeGitHubDark`              |
| `@shikijs/themes/github-dark-default`        | `dist/themes/github-dark-default.umd.js`        | `ShikiThemeGitHubDarkDefault`       |
| `@shikijs/themes/github-dark-dimmed`         | `dist/themes/github-dark-dimmed.umd.js`         | `ShikiThemeGitHubDarkDimmed`        |
| `@shikijs/themes/github-dark-high-contrast`  | `dist/themes/github-dark-high-contrast.umd.js`  | `ShikiThemeGitHubDarkHighContrast`  |
| `@shikijs/themes/github-light`               | `dist/themes/github-light.umd.js`               | `ShikiThemeGitHubLight`             |
| `@shikijs/themes/github-light-default`       | `dist/themes/github-light-default.umd.js`       | `ShikiThemeGitHubLightDefault`      |
| `@shikijs/themes/github-light-high-contrast` | `dist/themes/github-light-high-contrast.umd.js` | `ShikiThemeGitHubLightHighContrast` |
| `@shikijs/themes/gruvbox-dark-hard`          | `dist/themes/gruvbox-dark-hard.umd.js`          | `ShikiThemeGruvboxDarkHard`         |
| `@shikijs/themes/gruvbox-dark-medium`        | `dist/themes/gruvbox-dark-medium.umd.js`        | `ShikiThemeGruvboxDarkMedium`       |
| `@shikijs/themes/gruvbox-dark-soft`          | `dist/themes/gruvbox-dark-soft.umd.js`          | `ShikiThemeGruvboxDarkSoft`         |
| `@shikijs/themes/gruvbox-light-hard`         | `dist/themes/gruvbox-light-hard.umd.js`         | `ShikiThemeGruvboxLightHard`        |
| `@shikijs/themes/gruvbox-light-medium`       | `dist/themes/gruvbox-light-medium.umd.js`       | `ShikiThemeGruvboxLightMedium`      |
| `@shikijs/themes/gruvbox-light-soft`         | `dist/themes/gruvbox-light-soft.umd.js`         | `ShikiThemeGruvboxLightSoft`        |
| `@shikijs/themes/horizon`                    | `dist/themes/horizon.umd.js`                    | `ShikiThemeHorizon`                 |
| `@shikijs/themes/horizon-bright`             | `dist/themes/horizon-bright.umd.js`             | `ShikiThemeHorizonBright`           |
| `@shikijs/themes/houston`                    | `dist/themes/houston.umd.js`                    | `ShikiThemeHouston`                 |
| `@shikijs/themes/kanagawa-dragon`            | `dist/themes/kanagawa-dragon.umd.js`            | `ShikiThemeKanagawaDragon`          |
| `@shikijs/themes/kanagawa-lotus`             | `dist/themes/kanagawa-lotus.umd.js`             | `ShikiThemeKanagawaLotus`           |
| `@shikijs/themes/kanagawa-wave`              | `dist/themes/kanagawa-wave.umd.js`              | `ShikiThemeKanagawaWave`            |
| `@shikijs/themes/laserwave`                  | `dist/themes/laserwave.umd.js`                  | `ShikiThemeLaserWave`               |
| `@shikijs/themes/light-plus`                 | `dist/themes/light-plus.umd.js`                 | `ShikiThemeLightPlus`               |
| `@shikijs/themes/material-theme`             | `dist/themes/material-theme.umd.js`             | `ShikiThemeMaterialTheme`           |
| `@shikijs/themes/material-theme-darker`      | `dist/themes/material-theme-darker.umd.js`      | `ShikiThemeMaterialThemeDarker`     |
| `@shikijs/themes/material-theme-lighter`     | `dist/themes/material-theme-lighter.umd.js`     | `ShikiThemeMaterialThemeLighter`    |
| `@shikijs/themes/material-theme-ocean`       | `dist/themes/material-theme-ocean.umd.js`       | `ShikiThemeMaterialThemeOcean`      |
| `@shikijs/themes/material-theme-palenight`   | `dist/themes/material-theme-palenight.umd.js`   | `ShikiThemeMaterialThemePalenight`  |
| `@shikijs/themes/min-dark`                   | `dist/themes/min-dark.umd.js`                   | `ShikiThemeMinDark`                 |
| `@shikijs/themes/min-light`                  | `dist/themes/min-light.umd.js`                  | `ShikiThemeMinLight`                |
| `@shikijs/themes/monokai`                    | `dist/themes/monokai.umd.js`                    | `ShikiThemeMonokai`                 |
| `@shikijs/themes/night-owl`                  | `dist/themes/night-owl.umd.js`                  | `ShikiThemeNightOwl`                |
| `@shikijs/themes/night-owl-light`            | `dist/themes/night-owl-light.umd.js`            | `ShikiThemeNightOwlLight`           |
| `@shikijs/themes/nord`                       | `dist/themes/nord.umd.js`                       | `ShikiThemeNord`                    |
| `@shikijs/themes/one-dark-pro`               | `dist/themes/one-dark-pro.umd.js`               | `ShikiThemeOneDarkPro`              |
| `@shikijs/themes/one-light`                  | `dist/themes/one-light.umd.js`                  | `ShikiThemeOneLight`                |
| `@shikijs/themes/plastic`                    | `dist/themes/plastic.umd.js`                    | `ShikiThemePlastic`                 |
| `@shikijs/themes/poimandres`                 | `dist/themes/poimandres.umd.js`                 | `ShikiThemePoimandres`              |
| `@shikijs/themes/red`                        | `dist/themes/red.umd.js`                        | `ShikiThemeRed`                     |
| `@shikijs/themes/rose-pine`                  | `dist/themes/rose-pine.umd.js`                  | `ShikiThemeRosePine`                |
| `@shikijs/themes/rose-pine-dawn`             | `dist/themes/rose-pine-dawn.umd.js`             | `ShikiThemeRosePineDawn`            |
| `@shikijs/themes/rose-pine-moon`             | `dist/themes/rose-pine-moon.umd.js`             | `ShikiThemeRosePineMoon`            |
| `@shikijs/themes/slack-dark`                 | `dist/themes/slack-dark.umd.js`                 | `ShikiThemeSlackDark`               |
| `@shikijs/themes/slack-ochin`                | `dist/themes/slack-ochin.umd.js`                | `ShikiThemeSlackOchin`              |
| `@shikijs/themes/snazzy-light`               | `dist/themes/snazzy-light.umd.js`               | `ShikiThemeSnazzyLight`             |
| `@shikijs/themes/solarized-dark`             | `dist/themes/solarized-dark.umd.js`             | `ShikiThemeSolarizedDark`           |
| `@shikijs/themes/solarized-light`            | `dist/themes/solarized-light.umd.js`            | `ShikiThemeSolarizedLight`          |
| `@shikijs/themes/synthwave-84`               | `dist/themes/synthwave-84.umd.js`               | `ShikiThemeSynthwave84`             |
| `@shikijs/themes/tokyo-night`                | `dist/themes/tokyo-night.umd.js`                | `ShikiThemeTokyoNight`              |
| `@shikijs/themes/vesper`                     | `dist/themes/vesper.umd.js`                     | `ShikiThemeVesper`                  |
| `@shikijs/themes/vitesse-black`              | `dist/themes/vitesse-black.umd.js`              | `ShikiThemeVitesseBlack`            |
| `@shikijs/themes/vitesse-dark`               | `dist/themes/vitesse-dark.umd.js`               | `ShikiThemeVitesseDark`             |
| `@shikijs/themes/vitesse-light`              | `dist/themes/vitesse-light.umd.js`              | `ShikiThemeVitesseLight`            |

</details>

<details>
<summary>Languages (243)</summary>

| Shiki package/subpath               | UMD file                               | GlobalName                           |
| ----------------------------------- | -------------------------------------- | ------------------------------------ |
| `@shikijs/langs`                    | `dist/langs.umd.js`                    | `ShikiLangs`                         |
| `@shikijs/langs/abap`               | `dist/langs/abap.umd.js`               | `ShikiLangABAP`                      |
| `@shikijs/langs/actionscript-3`     | `dist/langs/actionscript-3.umd.js`     | `ShikiLangActionScript`              |
| `@shikijs/langs/ada`                | `dist/langs/ada.umd.js`                | `ShikiLangAda`                       |
| `@shikijs/langs/ahk`                | `dist/langs/ahk.umd.js`                | `ShikiLangAutoHotkey`                |
| `@shikijs/langs/ahk2`               | `dist/langs/ahk2.umd.js`               | `ShikiLangAutoHotkey2`               |
| `@shikijs/langs/angular-html`       | `dist/langs/angular-html.umd.js`       | `ShikiLangAngularHTML`               |
| `@shikijs/langs/angular-ts`         | `dist/langs/angular-ts.umd.js`         | `ShikiLangAngularTypeScript`         |
| `@shikijs/langs/apache`             | `dist/langs/apache.umd.js`             | `ShikiLangApacheConf`                |
| `@shikijs/langs/apex`               | `dist/langs/apex.umd.js`               | `ShikiLangApex`                      |
| `@shikijs/langs/apl`                | `dist/langs/apl.umd.js`                | `ShikiLangAPL`                       |
| `@shikijs/langs/applescript`        | `dist/langs/applescript.umd.js`        | `ShikiLangAppleScript`               |
| `@shikijs/langs/ara`                | `dist/langs/ara.umd.js`                | `ShikiLangAra`                       |
| `@shikijs/langs/asciidoc`           | `dist/langs/asciidoc.umd.js`           | `ShikiLangAsciiDoc`                  |
| `@shikijs/langs/asm`                | `dist/langs/asm.umd.js`                | `ShikiLangAssembly`                  |
| `@shikijs/langs/astro`              | `dist/langs/astro.umd.js`              | `ShikiLangAstro`                     |
| `@shikijs/langs/awk`                | `dist/langs/awk.umd.js`                | `ShikiLangAWK`                       |
| `@shikijs/langs/ballerina`          | `dist/langs/ballerina.umd.js`          | `ShikiLangBallerina`                 |
| `@shikijs/langs/bat`                | `dist/langs/bat.umd.js`                | `ShikiLangBatchFile`                 |
| `@shikijs/langs/beancount`          | `dist/langs/beancount.umd.js`          | `ShikiLangBeancount`                 |
| `@shikijs/langs/berry`              | `dist/langs/berry.umd.js`              | `ShikiLangBerry`                     |
| `@shikijs/langs/bibtex`             | `dist/langs/bibtex.umd.js`             | `ShikiLangBibTeX`                    |
| `@shikijs/langs/bicep`              | `dist/langs/bicep.umd.js`              | `ShikiLangBicep`                     |
| `@shikijs/langs/bird2`              | `dist/langs/bird2.umd.js`              | `ShikiLangBIRD2Configuration`        |
| `@shikijs/langs/blade`              | `dist/langs/blade.umd.js`              | `ShikiLangBlade`                     |
| `@shikijs/langs/bsl`                | `dist/langs/bsl.umd.js`                | `ShikiLang1CEnterprise`              |
| `@shikijs/langs/c`                  | `dist/langs/c.umd.js`                  | `ShikiLangC`                         |
| `@shikijs/langs/c3`                 | `dist/langs/c3.umd.js`                 | `ShikiLangC3`                        |
| `@shikijs/langs/cadence`            | `dist/langs/cadence.umd.js`            | `ShikiLangCadence`                   |
| `@shikijs/langs/cairo`              | `dist/langs/cairo.umd.js`              | `ShikiLangCairo`                     |
| `@shikijs/langs/chapel`             | `dist/langs/chapel.umd.js`             | `ShikiLangChapel`                    |
| `@shikijs/langs/clarity`            | `dist/langs/clarity.umd.js`            | `ShikiLangClarity`                   |
| `@shikijs/langs/clojure`            | `dist/langs/clojure.umd.js`            | `ShikiLangClojure`                   |
| `@shikijs/langs/cmake`              | `dist/langs/cmake.umd.js`              | `ShikiLangCMake`                     |
| `@shikijs/langs/cobol`              | `dist/langs/cobol.umd.js`              | `ShikiLangCOBOL`                     |
| `@shikijs/langs/codeowners`         | `dist/langs/codeowners.umd.js`         | `ShikiLangCODEOWNERS`                |
| `@shikijs/langs/codeql`             | `dist/langs/codeql.umd.js`             | `ShikiLangCodeQL`                    |
| `@shikijs/langs/coffee`             | `dist/langs/coffee.umd.js`             | `ShikiLangCoffeeScript`              |
| `@shikijs/langs/common-lisp`        | `dist/langs/common-lisp.umd.js`        | `ShikiLangCommonLisp`                |
| `@shikijs/langs/coq`                | `dist/langs/coq.umd.js`                | `ShikiLangRocq`                      |
| `@shikijs/langs/cpp`                | `dist/langs/cpp.umd.js`                | `ShikiLangCpp`                       |
| `@shikijs/langs/crystal`            | `dist/langs/crystal.umd.js`            | `ShikiLangCrystal`                   |
| `@shikijs/langs/csharp`             | `dist/langs/csharp.umd.js`             | `ShikiLangCSharp`                    |
| `@shikijs/langs/css`                | `dist/langs/css.umd.js`                | `ShikiLangCSS`                       |
| `@shikijs/langs/csv`                | `dist/langs/csv.umd.js`                | `ShikiLangCSV`                       |
| `@shikijs/langs/cue`                | `dist/langs/cue.umd.js`                | `ShikiLangCUE`                       |
| `@shikijs/langs/cypher`             | `dist/langs/cypher.umd.js`             | `ShikiLangCypher`                    |
| `@shikijs/langs/d`                  | `dist/langs/d.umd.js`                  | `ShikiLangD`                         |
| `@shikijs/langs/dart`               | `dist/langs/dart.umd.js`               | `ShikiLangDart`                      |
| `@shikijs/langs/dax`                | `dist/langs/dax.umd.js`                | `ShikiLangDAX`                       |
| `@shikijs/langs/desktop`            | `dist/langs/desktop.umd.js`            | `ShikiLangDesktop`                   |
| `@shikijs/langs/diff`               | `dist/langs/diff.umd.js`               | `ShikiLangDiff`                      |
| `@shikijs/langs/docker`             | `dist/langs/docker.umd.js`             | `ShikiLangDockerfile`                |
| `@shikijs/langs/dotenv`             | `dist/langs/dotenv.umd.js`             | `ShikiLangdotEnv`                    |
| `@shikijs/langs/dream-maker`        | `dist/langs/dream-maker.umd.js`        | `ShikiLangDreamMaker`                |
| `@shikijs/langs/edge`               | `dist/langs/edge.umd.js`               | `ShikiLangEdge`                      |
| `@shikijs/langs/elixir`             | `dist/langs/elixir.umd.js`             | `ShikiLangElixir`                    |
| `@shikijs/langs/elm`                | `dist/langs/elm.umd.js`                | `ShikiLangElm`                       |
| `@shikijs/langs/emacs-lisp`         | `dist/langs/emacs-lisp.umd.js`         | `ShikiLangEmacsLisp`                 |
| `@shikijs/langs/erb`                | `dist/langs/erb.umd.js`                | `ShikiLangERB`                       |
| `@shikijs/langs/erlang`             | `dist/langs/erlang.umd.js`             | `ShikiLangErlang`                    |
| `@shikijs/langs/fennel`             | `dist/langs/fennel.umd.js`             | `ShikiLangFennel`                    |
| `@shikijs/langs/fish`               | `dist/langs/fish.umd.js`               | `ShikiLangFish`                      |
| `@shikijs/langs/fluent`             | `dist/langs/fluent.umd.js`             | `ShikiLangFluent`                    |
| `@shikijs/langs/fortran-fixed-form` | `dist/langs/fortran-fixed-form.umd.js` | `ShikiLangFortranFixedForm`          |
| `@shikijs/langs/fortran-free-form`  | `dist/langs/fortran-free-form.umd.js`  | `ShikiLangFortranFreeForm`           |
| `@shikijs/langs/fsharp`             | `dist/langs/fsharp.umd.js`             | `ShikiLangFSharp`                    |
| `@shikijs/langs/gdresource`         | `dist/langs/gdresource.umd.js`         | `ShikiLangGDResource`                |
| `@shikijs/langs/gdscript`           | `dist/langs/gdscript.umd.js`           | `ShikiLangGDScript`                  |
| `@shikijs/langs/gdshader`           | `dist/langs/gdshader.umd.js`           | `ShikiLangGDShader`                  |
| `@shikijs/langs/genie`              | `dist/langs/genie.umd.js`              | `ShikiLangGenie`                     |
| `@shikijs/langs/gherkin`            | `dist/langs/gherkin.umd.js`            | `ShikiLangGherkin`                   |
| `@shikijs/langs/git-commit`         | `dist/langs/git-commit.umd.js`         | `ShikiLangGitCommitMessage`          |
| `@shikijs/langs/git-rebase`         | `dist/langs/git-rebase.umd.js`         | `ShikiLangGitRebaseMessage`          |
| `@shikijs/langs/gleam`              | `dist/langs/gleam.umd.js`              | `ShikiLangGleam`                     |
| `@shikijs/langs/glimmer-js`         | `dist/langs/glimmer-js.umd.js`         | `ShikiLangGlimmerJS`                 |
| `@shikijs/langs/glimmer-ts`         | `dist/langs/glimmer-ts.umd.js`         | `ShikiLangGlimmerTS`                 |
| `@shikijs/langs/glsl`               | `dist/langs/glsl.umd.js`               | `ShikiLangGLSL`                      |
| `@shikijs/langs/gn`                 | `dist/langs/gn.umd.js`                 | `ShikiLangGN`                        |
| `@shikijs/langs/gnuplot`            | `dist/langs/gnuplot.umd.js`            | `ShikiLangGnuplot`                   |
| `@shikijs/langs/go`                 | `dist/langs/go.umd.js`                 | `ShikiLangGo`                        |
| `@shikijs/langs/graphql`            | `dist/langs/graphql.umd.js`            | `ShikiLangGraphQL`                   |
| `@shikijs/langs/groovy`             | `dist/langs/groovy.umd.js`             | `ShikiLangGroovy`                    |
| `@shikijs/langs/hack`               | `dist/langs/hack.umd.js`               | `ShikiLangHack`                      |
| `@shikijs/langs/haml`               | `dist/langs/haml.umd.js`               | `ShikiLangRubyHaml`                  |
| `@shikijs/langs/handlebars`         | `dist/langs/handlebars.umd.js`         | `ShikiLangHandlebars`                |
| `@shikijs/langs/haskell`            | `dist/langs/haskell.umd.js`            | `ShikiLangHaskell`                   |
| `@shikijs/langs/haxe`               | `dist/langs/haxe.umd.js`               | `ShikiLangHaxe`                      |
| `@shikijs/langs/hcl`                | `dist/langs/hcl.umd.js`                | `ShikiLangHashiCorpHCL`              |
| `@shikijs/langs/hjson`              | `dist/langs/hjson.umd.js`              | `ShikiLangHjson`                     |
| `@shikijs/langs/hlsl`               | `dist/langs/hlsl.umd.js`               | `ShikiLangHLSL`                      |
| `@shikijs/langs/html`               | `dist/langs/html.umd.js`               | `ShikiLangHTML`                      |
| `@shikijs/langs/html-derivative`    | `dist/langs/html-derivative.umd.js`    | `ShikiLangHTMLDerivative`            |
| `@shikijs/langs/http`               | `dist/langs/http.umd.js`               | `ShikiLangHTTP`                      |
| `@shikijs/langs/hurl`               | `dist/langs/hurl.umd.js`               | `ShikiLangHurl`                      |
| `@shikijs/langs/hxml`               | `dist/langs/hxml.umd.js`               | `ShikiLangHXML`                      |
| `@shikijs/langs/hy`                 | `dist/langs/hy.umd.js`                 | `ShikiLangHy`                        |
| `@shikijs/langs/imba`               | `dist/langs/imba.umd.js`               | `ShikiLangImba`                      |
| `@shikijs/langs/ini`                | `dist/langs/ini.umd.js`                | `ShikiLangINI`                       |
| `@shikijs/langs/java`               | `dist/langs/java.umd.js`               | `ShikiLangJava`                      |
| `@shikijs/langs/javascript`         | `dist/langs/javascript.umd.js`         | `ShikiLangJavaScript`                |
| `@shikijs/langs/jinja`              | `dist/langs/jinja.umd.js`              | `ShikiLangJinja`                     |
| `@shikijs/langs/jison`              | `dist/langs/jison.umd.js`              | `ShikiLangJison`                     |
| `@shikijs/langs/json`               | `dist/langs/json.umd.js`               | `ShikiLangJSON`                      |
| `@shikijs/langs/json5`              | `dist/langs/json5.umd.js`              | `ShikiLangJSON5`                     |
| `@shikijs/langs/jsonc`              | `dist/langs/jsonc.umd.js`              | `ShikiLangJSONwithComments`          |
| `@shikijs/langs/jsonl`              | `dist/langs/jsonl.umd.js`              | `ShikiLangJSONLines`                 |
| `@shikijs/langs/jsonnet`            | `dist/langs/jsonnet.umd.js`            | `ShikiLangJsonnet`                   |
| `@shikijs/langs/jssm`               | `dist/langs/jssm.umd.js`               | `ShikiLangJSSM`                      |
| `@shikijs/langs/jsx`                | `dist/langs/jsx.umd.js`                | `ShikiLangJSX`                       |
| `@shikijs/langs/julia`              | `dist/langs/julia.umd.js`              | `ShikiLangJulia`                     |
| `@shikijs/langs/just`               | `dist/langs/just.umd.js`               | `ShikiLangJust`                      |
| `@shikijs/langs/kdl`                | `dist/langs/kdl.umd.js`                | `ShikiLangKDL`                       |
| `@shikijs/langs/kotlin`             | `dist/langs/kotlin.umd.js`             | `ShikiLangKotlin`                    |
| `@shikijs/langs/kusto`              | `dist/langs/kusto.umd.js`              | `ShikiLangKusto`                     |
| `@shikijs/langs/latex`              | `dist/langs/latex.umd.js`              | `ShikiLangLaTeX`                     |
| `@shikijs/langs/lean`               | `dist/langs/lean.umd.js`               | `ShikiLangLean4`                     |
| `@shikijs/langs/less`               | `dist/langs/less.umd.js`               | `ShikiLangLess`                      |
| `@shikijs/langs/liquid`             | `dist/langs/liquid.umd.js`             | `ShikiLangLiquid`                    |
| `@shikijs/langs/llvm`               | `dist/langs/llvm.umd.js`               | `ShikiLangLLVMIR`                    |
| `@shikijs/langs/log`                | `dist/langs/log.umd.js`                | `ShikiLangLogfile`                   |
| `@shikijs/langs/logo`               | `dist/langs/logo.umd.js`               | `ShikiLangLogo`                      |
| `@shikijs/langs/lua`                | `dist/langs/lua.umd.js`                | `ShikiLangLua`                       |
| `@shikijs/langs/luau`               | `dist/langs/luau.umd.js`               | `ShikiLangLuau`                      |
| `@shikijs/langs/make`               | `dist/langs/make.umd.js`               | `ShikiLangMakefile`                  |
| `@shikijs/langs/markdown`           | `dist/langs/markdown.umd.js`           | `ShikiLangMarkdown`                  |
| `@shikijs/langs/marko`              | `dist/langs/marko.umd.js`              | `ShikiLangMarko`                     |
| `@shikijs/langs/matlab`             | `dist/langs/matlab.umd.js`             | `ShikiLangMATLAB`                    |
| `@shikijs/langs/mdc`                | `dist/langs/mdc.umd.js`                | `ShikiLangMDC`                       |
| `@shikijs/langs/mdx`                | `dist/langs/mdx.umd.js`                | `ShikiLangMDX`                       |
| `@shikijs/langs/mermaid`            | `dist/langs/mermaid.umd.js`            | `ShikiLangMermaid`                   |
| `@shikijs/langs/mipsasm`            | `dist/langs/mipsasm.umd.js`            | `ShikiLangMIPSAssembly`              |
| `@shikijs/langs/mojo`               | `dist/langs/mojo.umd.js`               | `ShikiLangMojo`                      |
| `@shikijs/langs/moonbit`            | `dist/langs/moonbit.umd.js`            | `ShikiLangMoonBit`                   |
| `@shikijs/langs/move`               | `dist/langs/move.umd.js`               | `ShikiLangMove`                      |
| `@shikijs/langs/narrat`             | `dist/langs/narrat.umd.js`             | `ShikiLangNarratLanguage`            |
| `@shikijs/langs/nextflow`           | `dist/langs/nextflow.umd.js`           | `ShikiLangNextflow`                  |
| `@shikijs/langs/nextflow-groovy`    | `dist/langs/nextflow-groovy.umd.js`    | `ShikiLangNextflowGroovy`            |
| `@shikijs/langs/nginx`              | `dist/langs/nginx.umd.js`              | `ShikiLangNginx`                     |
| `@shikijs/langs/nim`                | `dist/langs/nim.umd.js`                | `ShikiLangNim`                       |
| `@shikijs/langs/nix`                | `dist/langs/nix.umd.js`                | `ShikiLangNix`                       |
| `@shikijs/langs/nsis`               | `dist/langs/nsis.umd.js`               | `ShikiLangNSIS`                      |
| `@shikijs/langs/nushell`            | `dist/langs/nushell.umd.js`            | `ShikiLangnushell`                   |
| `@shikijs/langs/objective-c`        | `dist/langs/objective-c.umd.js`        | `ShikiLangObjectiveC`                |
| `@shikijs/langs/objective-cpp`      | `dist/langs/objective-cpp.umd.js`      | `ShikiLangObjectiveCpp`              |
| `@shikijs/langs/ocaml`              | `dist/langs/ocaml.umd.js`              | `ShikiLangOCaml`                     |
| `@shikijs/langs/odin`               | `dist/langs/odin.umd.js`               | `ShikiLangOdin`                      |
| `@shikijs/langs/openscad`           | `dist/langs/openscad.umd.js`           | `ShikiLangOpenSCAD`                  |
| `@shikijs/langs/org`                | `dist/langs/org.umd.js`                | `ShikiLangOrgMarkup`                 |
| `@shikijs/langs/pascal`             | `dist/langs/pascal.umd.js`             | `ShikiLangPascal`                    |
| `@shikijs/langs/perl`               | `dist/langs/perl.umd.js`               | `ShikiLangPerl`                      |
| `@shikijs/langs/php`                | `dist/langs/php.umd.js`                | `ShikiLangPHP`                       |
| `@shikijs/langs/pkl`                | `dist/langs/pkl.umd.js`                | `ShikiLangPkl`                       |
| `@shikijs/langs/plsql`              | `dist/langs/plsql.umd.js`              | `ShikiLangPLSQL`                     |
| `@shikijs/langs/po`                 | `dist/langs/po.umd.js`                 | `ShikiLangGettextPO`                 |
| `@shikijs/langs/polar`              | `dist/langs/polar.umd.js`              | `ShikiLangPolar`                     |
| `@shikijs/langs/postcss`            | `dist/langs/postcss.umd.js`            | `ShikiLangPostCSS`                   |
| `@shikijs/langs/powerquery`         | `dist/langs/powerquery.umd.js`         | `ShikiLangPowerQuery`                |
| `@shikijs/langs/powershell`         | `dist/langs/powershell.umd.js`         | `ShikiLangPowerShell`                |
| `@shikijs/langs/prisma`             | `dist/langs/prisma.umd.js`             | `ShikiLangPrisma`                    |
| `@shikijs/langs/prolog`             | `dist/langs/prolog.umd.js`             | `ShikiLangProlog`                    |
| `@shikijs/langs/proto`              | `dist/langs/proto.umd.js`              | `ShikiLangProtocolBuffer3`           |
| `@shikijs/langs/pug`                | `dist/langs/pug.umd.js`                | `ShikiLangPug`                       |
| `@shikijs/langs/puppet`             | `dist/langs/puppet.umd.js`             | `ShikiLangPuppet`                    |
| `@shikijs/langs/purescript`         | `dist/langs/purescript.umd.js`         | `ShikiLangPureScript`                |
| `@shikijs/langs/python`             | `dist/langs/python.umd.js`             | `ShikiLangPython`                    |
| `@shikijs/langs/qml`                | `dist/langs/qml.umd.js`                | `ShikiLangQML`                       |
| `@shikijs/langs/qmldir`             | `dist/langs/qmldir.umd.js`             | `ShikiLangQMLDirectory`              |
| `@shikijs/langs/qss`                | `dist/langs/qss.umd.js`                | `ShikiLangQtStyleSheets`             |
| `@shikijs/langs/r`                  | `dist/langs/r.umd.js`                  | `ShikiLangR`                         |
| `@shikijs/langs/racket`             | `dist/langs/racket.umd.js`             | `ShikiLangRacket`                    |
| `@shikijs/langs/raku`               | `dist/langs/raku.umd.js`               | `ShikiLangRaku`                      |
| `@shikijs/langs/razor`              | `dist/langs/razor.umd.js`              | `ShikiLangASPNETRazor`               |
| `@shikijs/langs/rbs`                | `dist/langs/rbs.umd.js`                | `ShikiLangRBS`                       |
| `@shikijs/langs/reg`                | `dist/langs/reg.umd.js`                | `ShikiLangWindowsRegistryScript`     |
| `@shikijs/langs/regexp`             | `dist/langs/regexp.umd.js`             | `ShikiLangRegExp`                    |
| `@shikijs/langs/rel`                | `dist/langs/rel.umd.js`                | `ShikiLangRel`                       |
| `@shikijs/langs/riscv`              | `dist/langs/riscv.umd.js`              | `ShikiLangRISCV`                     |
| `@shikijs/langs/ron`                | `dist/langs/ron.umd.js`                | `ShikiLangRON`                       |
| `@shikijs/langs/rosmsg`             | `dist/langs/rosmsg.umd.js`             | `ShikiLangROSInterface`              |
| `@shikijs/langs/rst`                | `dist/langs/rst.umd.js`                | `ShikiLangreStructuredText`          |
| `@shikijs/langs/ruby`               | `dist/langs/ruby.umd.js`               | `ShikiLangRuby`                      |
| `@shikijs/langs/rust`               | `dist/langs/rust.umd.js`               | `ShikiLangRust`                      |
| `@shikijs/langs/sas`                | `dist/langs/sas.umd.js`                | `ShikiLangSAS`                       |
| `@shikijs/langs/sass`               | `dist/langs/sass.umd.js`               | `ShikiLangSass`                      |
| `@shikijs/langs/scala`              | `dist/langs/scala.umd.js`              | `ShikiLangScala`                     |
| `@shikijs/langs/scheme`             | `dist/langs/scheme.umd.js`             | `ShikiLangScheme`                    |
| `@shikijs/langs/scss`               | `dist/langs/scss.umd.js`               | `ShikiLangSCSS`                      |
| `@shikijs/langs/sdbl`               | `dist/langs/sdbl.umd.js`               | `ShikiLang1CQuery`                   |
| `@shikijs/langs/shaderlab`          | `dist/langs/shaderlab.umd.js`          | `ShikiLangShaderLab`                 |
| `@shikijs/langs/shellscript`        | `dist/langs/shellscript.umd.js`        | `ShikiLangShell`                     |
| `@shikijs/langs/shellsession`       | `dist/langs/shellsession.umd.js`       | `ShikiLangShellSession`              |
| `@shikijs/langs/smalltalk`          | `dist/langs/smalltalk.umd.js`          | `ShikiLangGNUSmalltalk`              |
| `@shikijs/langs/smithy`             | `dist/langs/smithy.umd.js`             | `ShikiLangSmithy`                    |
| `@shikijs/langs/solidity`           | `dist/langs/solidity.umd.js`           | `ShikiLangSolidity`                  |
| `@shikijs/langs/soy`                | `dist/langs/soy.umd.js`                | `ShikiLangClosureTemplates`          |
| `@shikijs/langs/sparql`             | `dist/langs/sparql.umd.js`             | `ShikiLangSPARQL`                    |
| `@shikijs/langs/splunk`             | `dist/langs/splunk.umd.js`             | `ShikiLangSplunkQueryLanguage`       |
| `@shikijs/langs/sql`                | `dist/langs/sql.umd.js`                | `ShikiLangSQL`                       |
| `@shikijs/langs/ssh-config`         | `dist/langs/ssh-config.umd.js`         | `ShikiLangSSHConfig`                 |
| `@shikijs/langs/stata`              | `dist/langs/stata.umd.js`              | `ShikiLangStata`                     |
| `@shikijs/langs/stylus`             | `dist/langs/stylus.umd.js`             | `ShikiLangStylus`                    |
| `@shikijs/langs/surrealql`          | `dist/langs/surrealql.umd.js`          | `ShikiLangSurrealQL`                 |
| `@shikijs/langs/svelte`             | `dist/langs/svelte.umd.js`             | `ShikiLangSvelte`                    |
| `@shikijs/langs/swift`              | `dist/langs/swift.umd.js`              | `ShikiLangSwift`                     |
| `@shikijs/langs/system-verilog`     | `dist/langs/system-verilog.umd.js`     | `ShikiLangSystemVerilog`             |
| `@shikijs/langs/systemd`            | `dist/langs/systemd.umd.js`            | `ShikiLangSystemdUnits`              |
| `@shikijs/langs/talonscript`        | `dist/langs/talonscript.umd.js`        | `ShikiLangTalonScript`               |
| `@shikijs/langs/tasl`               | `dist/langs/tasl.umd.js`               | `ShikiLangTasl`                      |
| `@shikijs/langs/tcl`                | `dist/langs/tcl.umd.js`                | `ShikiLangTcl`                       |
| `@shikijs/langs/templ`              | `dist/langs/templ.umd.js`              | `ShikiLangTempl`                     |
| `@shikijs/langs/terraform`          | `dist/langs/terraform.umd.js`          | `ShikiLangTerraform`                 |
| `@shikijs/langs/tex`                | `dist/langs/tex.umd.js`                | `ShikiLangTeX`                       |
| `@shikijs/langs/toml`               | `dist/langs/toml.umd.js`               | `ShikiLangTOML`                      |
| `@shikijs/langs/ts-tags`            | `dist/langs/ts-tags.umd.js`            | `ShikiLangTypeScriptwithTags`        |
| `@shikijs/langs/tsv`                | `dist/langs/tsv.umd.js`                | `ShikiLangTSV`                       |
| `@shikijs/langs/tsx`                | `dist/langs/tsx.umd.js`                | `ShikiLangTSX`                       |
| `@shikijs/langs/turtle`             | `dist/langs/turtle.umd.js`             | `ShikiLangTurtle`                    |
| `@shikijs/langs/twig`               | `dist/langs/twig.umd.js`               | `ShikiLangTwig`                      |
| `@shikijs/langs/typescript`         | `dist/langs/typescript.umd.js`         | `ShikiLangTypeScript`                |
| `@shikijs/langs/typespec`           | `dist/langs/typespec.umd.js`           | `ShikiLangTypeSpec`                  |
| `@shikijs/langs/typst`              | `dist/langs/typst.umd.js`              | `ShikiLangTypst`                     |
| `@shikijs/langs/v`                  | `dist/langs/v.umd.js`                  | `ShikiLangV`                         |
| `@shikijs/langs/vala`               | `dist/langs/vala.umd.js`               | `ShikiLangVala`                      |
| `@shikijs/langs/vb`                 | `dist/langs/vb.umd.js`                 | `ShikiLangVisualBasic`               |
| `@shikijs/langs/verilog`            | `dist/langs/verilog.umd.js`            | `ShikiLangVerilog`                   |
| `@shikijs/langs/vhdl`               | `dist/langs/vhdl.umd.js`               | `ShikiLangVHDL`                      |
| `@shikijs/langs/viml`               | `dist/langs/viml.umd.js`               | `ShikiLangVimScript`                 |
| `@shikijs/langs/vue`                | `dist/langs/vue.umd.js`                | `ShikiLangVue`                       |
| `@shikijs/langs/vue-html`           | `dist/langs/vue-html.umd.js`           | `ShikiLangVueHTML`                   |
| `@shikijs/langs/vue-vine`           | `dist/langs/vue-vine.umd.js`           | `ShikiLangVueVine`                   |
| `@shikijs/langs/vyper`              | `dist/langs/vyper.umd.js`              | `ShikiLangVyper`                     |
| `@shikijs/langs/wasm`               | `dist/langs/wasm.umd.js`               | `ShikiLangWebAssembly`               |
| `@shikijs/langs/wenyan`             | `dist/langs/wenyan.umd.js`             | `ShikiLangWenyan`                    |
| `@shikijs/langs/wgsl`               | `dist/langs/wgsl.umd.js`               | `ShikiLangWGSL`                      |
| `@shikijs/langs/wikitext`           | `dist/langs/wikitext.umd.js`           | `ShikiLangWikitext`                  |
| `@shikijs/langs/wit`                | `dist/langs/wit.umd.js`                | `ShikiLangWebAssemblyInterfaceTypes` |
| `@shikijs/langs/wolfram`            | `dist/langs/wolfram.umd.js`            | `ShikiLangWolfram`                   |
| `@shikijs/langs/xml`                | `dist/langs/xml.umd.js`                | `ShikiLangXML`                       |
| `@shikijs/langs/xsl`                | `dist/langs/xsl.umd.js`                | `ShikiLangXSL`                       |
| `@shikijs/langs/yaml`               | `dist/langs/yaml.umd.js`               | `ShikiLangYAML`                      |
| `@shikijs/langs/zenscript`          | `dist/langs/zenscript.umd.js`          | `ShikiLangZenScript`                 |
| `@shikijs/langs/zig`                | `dist/langs/zig.umd.js`                | `ShikiLangZig`                       |

</details>

### ESM

Self-contained single-file ESM builds are also included:

```html
<script type="module">
  import { codeToHtml } from 'https://cdn.jsdelivr.net/npm/shiki-umd/dist/web.js'

  document.querySelector('#code').innerHTML = await codeToHtml('<p>hi</p>', {
    lang: 'html',
    theme: 'nord',
  })
</script>
```

Or install it and import as usual (types included):

```shell
npm install shiki-umd
```

```ts
import { codeToHtml } from 'shiki-umd' // full bundle
import { codeToHtml } from 'shiki-umd/web' // web bundle
```

The composable modules are also available as self-contained ESM package exports:

```ts
import { createHighlighterCore } from 'shiki-umd/core'
import { createJavaScriptRegexEngine } from 'shiki-umd/engine-javascript'
import { bundledLanguages } from 'shiki-umd/langs'
import { bundledThemes } from 'shiki-umd/themes'
```

> [!TIP]
> If you have a build step, prefer using [shiki](https://www.npmjs.com/package/shiki) directly for fine-grained bundles and tree-shaking.

## API

Everything exported by [shiki](https://shiki.style) is re-exported as-is: `codeToHtml`, `codeToTokens`, `createHighlighter`, `bundledLanguages`, `bundledThemes`, etc. See the [Shiki documentation](https://shiki.style) for details.

## License

[MIT](./LICENSE) License © 2026-PRESENT [ntnyq](https://github.com/ntnyq)
