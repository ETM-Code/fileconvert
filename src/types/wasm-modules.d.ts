declare module "opentype.js" {
  export function parse(buffer: ArrayBuffer): {
    download(): ArrayBuffer | undefined
    names: Record<string, unknown>
    glyphs: { length: number }
  }
}

declare module "resvg-wasm" {
  export function initWasm(input: Promise<Response> | Response): Promise<void>
  export class Resvg {
    constructor(svg: string, options?: Record<string, unknown>)
    render(): ResvgRenderResult
  }
  interface ResvgRenderResult {
    asPng(): Uint8Array
    width: number
    height: number
  }
}
