import { createOnigurumaEngine as createOnigurumaEngineBase } from 'shiki/engine/oniguruma'
import getWasmInstance from 'shiki/wasm'

export * from 'shiki/engine/oniguruma'
export { default as getWasmInstance } from 'shiki/wasm'

/**
 * Create an Oniguruma engine with the inlined WASM binary by default.
 *
 * Exposed through the `ShikiEngineOniguruma` global in the UMD build.
 *
 * @param options - A custom WASM loader, or the inlined loader by default.
 * @returns The initialized Oniguruma regular expression engine.
 */
export function createOnigurumaEngine(
  options: Parameters<typeof createOnigurumaEngineBase>[0] = getWasmInstance,
): ReturnType<typeof createOnigurumaEngineBase> {
  return createOnigurumaEngineBase(options)
}
