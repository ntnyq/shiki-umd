# shiki-umd

[![CI](https://github.com/ntnyq/shiki-umd/workflows/CI/badge.svg)](https://github.com/ntnyq/shiki-umd/actions)
[![NPM VERSION](https://img.shields.io/npm/v/shiki-umd.svg)](https://www.npmjs.com/package/shiki-umd)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/shiki-umd.svg)](https://www.npmjs.com/package/shiki-umd)
[![LICENSE](https://img.shields.io/github/license/ntnyq/shiki-umd.svg)](https://github.com/ntnyq/shiki-umd/blob/main/LICENSE)

[Shiki](https://shiki.style) bundled as self-contained UMD / ESM files, for direct `<script>` and CDN usage — no build step required. Grammars, themes and the Oniguruma wasm binary are all inlined.

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

> [!TIP]
> If you have a build step, prefer using [shiki](https://www.npmjs.com/package/shiki) directly for fine-grained bundles and tree-shaking.

## API

Everything exported by [shiki](https://shiki.style) is re-exported as-is: `codeToHtml`, `codeToTokens`, `createHighlighter`, `bundledLanguages`, `bundledThemes`, etc. See the [Shiki documentation](https://shiki.style) for details.

## License

[MIT](./LICENSE) License © 2026-PRESENT [ntnyq](https://github.com/ntnyq)
