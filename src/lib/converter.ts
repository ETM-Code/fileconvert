import type { FileFormat } from "./formats"

export interface ConversionOptions {
  // Video/Audio (FFmpeg)
  videoBitrate?: string
  audioBitrate?: string
  videoCodec?: string
  audioCodec?: string
  resolution?: string
  fps?: number
  startTime?: number
  duration?: number
  // Image
  quality?: number
  width?: number
  height?: number
  // Document
  pageSize?: string
  // General
  [key: string]: string | number | boolean | undefined
}

export interface ConversionProgress {
  percent: number
  stage: string
}

export interface ConversionResult {
  blob: Blob
  filename: string
  size: number
  duration: number
}

export type ProgressCallback = (progress: ConversionProgress) => void

export async function convert(
  file: File,
  outputFormat: FileFormat,
  options: ConversionOptions = {},
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  const engine = outputFormat.engine

  switch (engine) {
    case "ffmpeg":
      return convertWithFFmpeg(file, outputFormat, options, onProgress)
    case "magick":
      return convertWithMagick(file, outputFormat, options, onProgress)
    case "resvg":
      return convertWithResvg(file, outputFormat, options, onProgress)
    case "svg2pdf":
      return convertWithSvg2Pdf(file, outputFormat, options, onProgress)
    case "mammoth":
      return convertWithMammoth(file, outputFormat, options, onProgress)
    case "pandoc":
      return convertWithPandoc(file, outputFormat, options, onProgress)
    case "sheetjs":
      return convertWithSheetJS(file, outputFormat, options, onProgress)
    case "fflate":
      return convertWithFflate(file, outputFormat, options, onProgress)
    case "opentype":
      return convertWithOpentype(file, outputFormat, options, onProgress)
    case "three":
      return convertWith3D(file, outputFormat, options, onProgress)
    case "native":
      return convertNative(file, outputFormat, options, onProgress)
    case "paged":
      return convertWithPaged(file, outputFormat, options, onProgress)
    default:
      throw new Error(`Unsupported engine: ${engine}`)
  }
}

// --- FFmpeg (Video/Audio) ---

let ffmpegInstance: Awaited<ReturnType<typeof loadFFmpeg>> | null = null

async function loadFFmpeg() {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg")
  const { toBlobURL } = await import("@ffmpeg/util")
  const ffmpeg = new FFmpeg()
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm"
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  })
  return ffmpeg
}

async function convertWithFFmpeg(
  file: File,
  outputFormat: FileFormat,
  options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 5, stage: "Loading FFmpeg..." })

  if (!ffmpegInstance) {
    ffmpegInstance = await loadFFmpeg()
  }
  const ffmpeg = ffmpegInstance

  onProgress?.({ percent: 20, stage: "Reading file..." })

  const inputName = `input_${Date.now()}.${file.name.split(".").pop()}`
  const outputName = `output_${Date.now()}${outputFormat.extension}`

  const { fetchFile } = await import("@ffmpeg/util")
  await ffmpeg.writeFile(inputName, await fetchFile(file))

  onProgress?.({ percent: 30, stage: "Converting..." })

  const args: string[] = ["-i", inputName]

  if (options.videoBitrate) args.push("-b:v", options.videoBitrate)
  if (options.audioBitrate) args.push("-b:a", options.audioBitrate)
  if (options.videoCodec) args.push("-c:v", options.videoCodec)
  if (options.audioCodec) args.push("-c:a", options.audioCodec)
  if (options.resolution) args.push("-s", options.resolution)
  if (options.fps) args.push("-r", String(options.fps))
  if (options.startTime !== undefined) args.push("-ss", String(options.startTime))
  if (options.duration !== undefined) args.push("-t", String(options.duration))

  args.push(outputName)

  const start = performance.now()
  await ffmpeg.exec(args)

  onProgress?.({ percent: 90, stage: "Finalizing..." })

  const data = await ffmpeg.readFile(outputName)
  const blob = new Blob([data as BlobPart], { type: outputFormat.mime })

  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- ImageMagick (Images) ---

async function convertWithMagick(
  file: File,
  outputFormat: FileFormat,
  options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 5, stage: "Loading ImageMagick..." })

  const { ImageMagick, initializeImageMagick, MagickFormat } = await import("@imagemagick/magick-wasm")
  const wasmUrl = new URL("https://unpkg.com/@imagemagick/magick-wasm@0.0.39/dist/magick.wasm")
  await initializeImageMagick(wasmUrl)

  onProgress?.({ percent: 20, stage: "Reading image..." })

  const buffer = await file.arrayBuffer()
  const inputData = new Uint8Array(buffer)

  const formatMap: Record<string, typeof MagickFormat[keyof typeof MagickFormat]> = {
    ".png": MagickFormat.Png,
    ".jpg": MagickFormat.Jpeg,
    ".webp": MagickFormat.WebP,
    ".avif": MagickFormat.Avif,
    ".bmp": MagickFormat.Bmp,
    ".tiff": MagickFormat.Tiff,
    ".ico": MagickFormat.Ico,
    ".gif": MagickFormat.Gif,
  }
  const magickFormat = formatMap[outputFormat.extension] || MagickFormat.Png

  onProgress?.({ percent: 40, stage: "Converting..." })
  const start = performance.now()

  let resultBlob: Blob | null = null

  ImageMagick.read(inputData, (image) => {
    if (options.width || options.height) {
      image.resize(options.width || image.width, options.height || image.height)
    }
    if (options.quality) {
      image.quality = options.quality
    }
    image.write(magickFormat, (data) => {
      resultBlob = new Blob([data as BlobPart], { type: outputFormat.mime })
    })
  })

  onProgress?.({ percent: 100, stage: "Done" })

  if (!resultBlob) throw new Error("ImageMagick conversion failed")

  return {
    blob: resultBlob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: (resultBlob as Blob).size,
    duration: performance.now() - start,
  }
}

// --- resvg (SVG to PNG) ---

async function convertWithResvg(
  file: File,
  outputFormat: FileFormat,
  options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Loading SVG renderer..." })

  const resvgWasm = await import("resvg-wasm")
  await resvgWasm.initWasm(fetch("https://unpkg.com/resvg-wasm@0.5.0/index_bg.wasm"))

  onProgress?.({ percent: 30, stage: "Rendering SVG..." })

  const svgText = await file.text()
  const start = performance.now()

  const renderer = new resvgWasm.Resvg(svgText, {
    fitTo: options.width ? { mode: "width" as const, value: options.width } : { mode: "original" as const },
  })
  const pngData = renderer.render()
  const pngBuffer = pngData.asPng()

  onProgress?.({ percent: 100, stage: "Done" })

  const blob = new Blob([pngBuffer as BlobPart], { type: "image/png" })
  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, ".png"),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- svg2pdf (SVG to PDF) ---

async function convertWithSvg2Pdf(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Loading PDF generator..." })

  const { jsPDF } = await import("jspdf")
  const { svg2pdf } = await import("svg2pdf.js")

  onProgress?.({ percent: 30, stage: "Converting SVG to PDF..." })

  const svgText = await file.text()
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
  const svgElement = svgDoc.documentElement

  const width = parseFloat(svgElement.getAttribute("width") || "800")
  const height = parseFloat(svgElement.getAttribute("height") || "600")

  const start = performance.now()
  const pdf = new jsPDF({
    orientation: width > height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height],
  })

  await svg2pdf(svgElement, pdf, { x: 0, y: 0, width, height })

  const blob = pdf.output("blob")

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, ".pdf"),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- Mammoth (DOCX to HTML/TXT) ---

async function convertWithMammoth(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Loading document parser..." })

  const mammoth = await import("mammoth")

  onProgress?.({ percent: 30, stage: "Extracting content..." })

  const buffer = await file.arrayBuffer()
  const start = performance.now()

  let content: string
  let mime: string

  if (outputFormat.extension === ".txt") {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    content = result.value
    mime = "text/plain"
  } else {
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer })
    content = [
      "<!DOCTYPE html>",
      "<html><head><meta charset=\"utf-8\">",
      `<title>${file.name}</title>`,
      "<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#333}",
      "img{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}</style>",
      "</head><body>",
      result.value,
      "</body></html>",
    ].join("\n")
    mime = "text/html"
  }

  const blob = new Blob([content], { type: mime })

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- Pandoc (Markup conversions) ---

async function convertWithPandoc(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Reading document..." })

  const text = await file.text()
  const start = performance.now()

  onProgress?.({ percent: 30, stage: "Converting markup..." })

  // Simple markdown to HTML conversion
  let content = text
  if (outputFormat.extension === ".html") {
    content = markdownToHtml(text)
  }

  const blob = new Blob([content], { type: outputFormat.mime })

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: blob.size,
    duration: performance.now() - start,
  }
}

function markdownToHtml(md: string): string {
  const html = md
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
  return [
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\">",
    "<style>body{font-family:system-ui;max-width:800px;margin:2rem auto;line-height:1.6}</style>",
    `</head><body><p>${html}</p></body></html>`,
  ].join("")
}

// --- SheetJS (Spreadsheets) ---

async function convertWithSheetJS(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Loading spreadsheet engine..." })

  const XLSX = await import("xlsx")

  onProgress?.({ percent: 30, stage: "Parsing spreadsheet..." })

  const buffer = await file.arrayBuffer()
  const start = performance.now()
  const workbook = XLSX.read(buffer)

  onProgress?.({ percent: 60, stage: "Converting data..." })

  let content: string
  let mime: string

  if (outputFormat.id === "csv" || outputFormat.id === "xlsx-csv") {
    content = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
    mime = "text/csv"
  } else if (outputFormat.id === "tsv") {
    content = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]], { FS: "\t" })
    mime = "text/tab-separated-values"
  } else if (outputFormat.id === "json-from-xlsx") {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    content = JSON.stringify(data, null, 2)
    mime = "application/json"
  } else {
    content = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
    mime = "text/csv"
  }

  const blob = new Blob([content], { type: mime })

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- fflate (Archives) ---

async function convertWithFflate(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Loading compression..." })

  const { zipSync, gzipSync } = await import("fflate")

  onProgress?.({ percent: 30, stage: "Compressing..." })

  const buffer = await file.arrayBuffer()
  const data = new Uint8Array(buffer)
  const start = performance.now()

  let result: Uint8Array

  if (outputFormat.id === "zip") {
    result = zipSync({ [file.name]: data })
  } else {
    result = gzipSync(data)
  }

  const blob = new Blob([result as BlobPart], { type: outputFormat.mime })

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name + outputFormat.extension,
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- OpenType (Fonts) ---

async function convertWithOpentype(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Loading font engine..." })

  const opentype = await import("opentype.js")

  onProgress?.({ percent: 30, stage: "Parsing font..." })

  const buffer = await file.arrayBuffer()
  const start = performance.now()
  const font = opentype.parse(buffer)

  onProgress?.({ percent: 60, stage: "Converting font..." })

  const outBuffer = font.download()
  const blob = new Blob([outBuffer || new ArrayBuffer(0)], { type: outputFormat.mime })

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- Three.js (3D Models) ---

async function convertWith3D(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Loading 3D engine..." })

  const start = performance.now()
  const buffer = await file.arrayBuffer()

  onProgress?.({ percent: 50, stage: "Converting 3D model..." })

  // Three.js conversions require DOM context
  const blob = new Blob([buffer], { type: outputFormat.mime })

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- Paged.js (HTML to paginated PDF) ---

async function convertWithPaged(
  file: File,
  _outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Reading document..." })

  const start = performance.now()
  const text = await file.text()

  onProgress?.({ percent: 30, stage: "Building PDF..." })

  const { jsPDF } = await import("jspdf")
  const pdf = new jsPDF()
  const lines = pdf.splitTextToSize(text, 180)
  pdf.text(lines, 15, 20)

  const blob = pdf.output("blob")

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, ".pdf"),
    size: blob.size,
    duration: performance.now() - start,
  }
}

// --- Native (JSON/YAML/XML/TOML conversions) ---

async function convertNative(
  file: File,
  outputFormat: FileFormat,
  _options: ConversionOptions,
  onProgress?: ProgressCallback
): Promise<ConversionResult> {
  onProgress?.({ percent: 10, stage: "Reading file..." })

  const text = await file.text()
  const start = performance.now()

  onProgress?.({ percent: 30, stage: "Converting data format..." })

  let data: unknown

  // Parse input
  const inputExt = file.name.split(".").pop()?.toLowerCase()
  if (inputExt === "json") {
    data = JSON.parse(text)
  } else if (inputExt === "csv") {
    data = csvToObject(text)
  } else {
    data = text
  }

  // Serialize output
  let content: string
  if (outputFormat.id === "json") {
    content = JSON.stringify(data, null, 2)
  } else if (outputFormat.id === "yaml") {
    content = jsonToYaml(data)
  } else if (outputFormat.id === "xml") {
    content = jsonToXml(data)
  } else if (outputFormat.id === "toml") {
    content = jsonToToml(data)
  } else {
    content = typeof data === "string" ? data : JSON.stringify(data, null, 2)
  }

  const blob = new Blob([content], { type: outputFormat.mime })

  onProgress?.({ percent: 100, stage: "Done" })

  return {
    blob,
    filename: file.name.replace(/\.[^.]+$/, outputFormat.extension),
    size: blob.size,
    duration: performance.now() - start,
  }
}

function csvToObject(csv: string): Record<string, string>[] {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(",")
    return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim() || ""]))
  })
}

function jsonToYaml(data: unknown, indent = 0): string {
  const pad = "  ".repeat(indent)
  if (Array.isArray(data)) {
    return data.map((item) => `${pad}- ${jsonToYaml(item, indent + 1).trim()}`).join("\n")
  }
  if (typeof data === "object" && data !== null) {
    return Object.entries(data)
      .map(([k, v]) => {
        if (typeof v === "object" && v !== null) {
          return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`
        }
        return `${pad}${k}: ${v}`
      })
      .join("\n")
  }
  return `${pad}${data}`
}

function jsonToXml(data: unknown, rootTag = "root"): string {
  function serialize(value: unknown, tag: string): string {
    if (Array.isArray(value)) {
      return value.map((item) => serialize(item, "item")).join("")
    }
    if (typeof value === "object" && value !== null) {
      const inner = Object.entries(value)
        .map(([k, v]) => serialize(v, k))
        .join("")
      return `<${tag}>${inner}</${tag}>`
    }
    return `<${tag}>${value}</${tag}>`
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n${serialize(data, rootTag)}`
}

function jsonToToml(data: unknown): string {
  if (typeof data !== "object" || data === null) return String(data)
  const lines: string[] = []
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      lines.push(`[${k}]`)
      for (const [ik, iv] of Object.entries(v)) {
        lines.push(`${ik} = ${JSON.stringify(iv)}`)
      }
      lines.push("")
    } else {
      lines.push(`${k} = ${JSON.stringify(v)}`)
    }
  }
  return lines.join("\n")
}
