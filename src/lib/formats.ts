export type FormatCategory =
  | "video"
  | "audio"
  | "image"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "ebook"
  | "archive"
  | "font"
  | "3d"
  | "vector"
  | "data"
  | "compress"

export interface FileFormat {
  id: string
  name: string
  extension: string
  mime: string
  description: string
  category: FormatCategory
  engine: string
  clientSide: boolean
}

export interface FormatGroup {
  category: FormatCategory
  label: string
  formats: FileFormat[]
}

const VIDEO_FORMATS: FileFormat[] = [
  { id: "mp4", name: "MP4", extension: ".mp4", mime: "video/mp4", description: "H.264 video, universal playback", category: "video", engine: "ffmpeg", clientSide: true },
  { id: "webm", name: "WebM", extension: ".webm", mime: "video/webm", description: "VP9 video, optimized for web", category: "video", engine: "ffmpeg", clientSide: true },
  { id: "mov", name: "MOV", extension: ".mov", mime: "video/quicktime", description: "Apple QuickTime format", category: "video", engine: "ffmpeg", clientSide: true },
  { id: "avi", name: "AVI", extension: ".avi", mime: "video/x-msvideo", description: "Microsoft AVI container", category: "video", engine: "ffmpeg", clientSide: true },
  { id: "mkv", name: "MKV", extension: ".mkv", mime: "video/x-matroska", description: "Matroska multimedia container", category: "video", engine: "ffmpeg", clientSide: true },
  { id: "gif", name: "GIF", extension: ".gif", mime: "image/gif", description: "Animated GIF from video", category: "video", engine: "ffmpeg", clientSide: true },
  { id: "flv", name: "FLV", extension: ".flv", mime: "video/x-flv", description: "Flash Video format", category: "video", engine: "ffmpeg", clientSide: true },
  { id: "ogv", name: "OGV", extension: ".ogv", mime: "video/ogg", description: "Ogg Theora video", category: "video", engine: "ffmpeg", clientSide: true },
]

const AUDIO_FORMATS: FileFormat[] = [
  { id: "mp3", name: "MP3", extension: ".mp3", mime: "audio/mpeg", description: "MPEG-1 Audio Layer 3", category: "audio", engine: "ffmpeg", clientSide: true },
  { id: "wav", name: "WAV", extension: ".wav", mime: "audio/wav", description: "Uncompressed waveform audio", category: "audio", engine: "ffmpeg", clientSide: true },
  { id: "ogg", name: "OGG", extension: ".ogg", mime: "audio/ogg", description: "Ogg Vorbis audio", category: "audio", engine: "ffmpeg", clientSide: true },
  { id: "flac", name: "FLAC", extension: ".flac", mime: "audio/flac", description: "Lossless audio compression", category: "audio", engine: "ffmpeg", clientSide: true },
  { id: "aac", name: "AAC", extension: ".aac", mime: "audio/aac", description: "Advanced Audio Coding", category: "audio", engine: "ffmpeg", clientSide: true },
  { id: "m4a", name: "M4A", extension: ".m4a", mime: "audio/mp4", description: "MPEG-4 audio (AAC/ALAC)", category: "audio", engine: "ffmpeg", clientSide: true },
  { id: "wma", name: "WMA", extension: ".wma", mime: "audio/x-ms-wma", description: "Windows Media Audio", category: "audio", engine: "ffmpeg", clientSide: true },
  { id: "opus", name: "Opus", extension: ".opus", mime: "audio/opus", description: "Low-latency interactive audio", category: "audio", engine: "ffmpeg", clientSide: true },
]

const IMAGE_FORMATS: FileFormat[] = [
  { id: "png", name: "PNG", extension: ".png", mime: "image/png", description: "Lossless with transparency", category: "image", engine: "magick", clientSide: true },
  { id: "jpg", name: "JPEG", extension: ".jpg", mime: "image/jpeg", description: "Lossy compressed photograph", category: "image", engine: "magick", clientSide: true },
  { id: "webp", name: "WebP", extension: ".webp", mime: "image/webp", description: "Modern web image format", category: "image", engine: "magick", clientSide: true },
  { id: "avif", name: "AVIF", extension: ".avif", mime: "image/avif", description: "AV1 Image, next-gen compression", category: "image", engine: "magick", clientSide: true },
  { id: "bmp", name: "BMP", extension: ".bmp", mime: "image/bmp", description: "Uncompressed bitmap image", category: "image", engine: "magick", clientSide: true },
  { id: "tiff", name: "TIFF", extension: ".tiff", mime: "image/tiff", description: "Tagged Image File Format", category: "image", engine: "magick", clientSide: true },
  { id: "ico", name: "ICO", extension: ".ico", mime: "image/x-icon", description: "Windows icon format", category: "image", engine: "magick", clientSide: true },
]

const VECTOR_FORMATS: FileFormat[] = [
  { id: "svg-to-png", name: "SVG to PNG", extension: ".png", mime: "image/png", description: "Rasterize vector to bitmap", category: "vector", engine: "resvg", clientSide: true },
  { id: "svg-to-pdf", name: "SVG to PDF", extension: ".pdf", mime: "application/pdf", description: "Vector-preserving PDF", category: "vector", engine: "svg2pdf", clientSide: true },
]

const DOCUMENT_FORMATS: FileFormat[] = [
  { id: "pdf", name: "PDF", extension: ".pdf", mime: "application/pdf", description: "Portable Document Format", category: "document", engine: "paged", clientSide: true },
  { id: "html", name: "HTML", extension: ".html", mime: "text/html", description: "Web page markup", category: "document", engine: "mammoth", clientSide: true },
  { id: "txt", name: "Plain Text", extension: ".txt", mime: "text/plain", description: "Unformatted text content", category: "document", engine: "mammoth", clientSide: true },
  { id: "md", name: "Markdown", extension: ".md", mime: "text/markdown", description: "Lightweight markup language", category: "document", engine: "pandoc", clientSide: true },
  { id: "docx-html", name: "DOCX to HTML", extension: ".html", mime: "text/html", description: "Word document to web page", category: "document", engine: "mammoth", clientSide: true },
  { id: "rst", name: "reStructuredText", extension: ".rst", mime: "text/x-rst", description: "Python documentation format", category: "document", engine: "pandoc", clientSide: true },
  { id: "latex", name: "LaTeX", extension: ".tex", mime: "application/x-latex", description: "Typesetting markup language", category: "document", engine: "pandoc", clientSide: true },
  { id: "epub", name: "EPUB", extension: ".epub", mime: "application/epub+zip", description: "Electronic publication format", category: "ebook", engine: "pandoc", clientSide: true },
]

const SPREADSHEET_FORMATS: FileFormat[] = [
  { id: "csv", name: "CSV", extension: ".csv", mime: "text/csv", description: "Comma-separated values", category: "spreadsheet", engine: "sheetjs", clientSide: true },
  { id: "xlsx-csv", name: "XLSX to CSV", extension: ".csv", mime: "text/csv", description: "Extract spreadsheet data", category: "spreadsheet", engine: "sheetjs", clientSide: true },
  { id: "json-from-xlsx", name: "XLSX to JSON", extension: ".json", mime: "application/json", description: "Structured data extraction", category: "spreadsheet", engine: "sheetjs", clientSide: true },
  { id: "tsv", name: "TSV", extension: ".tsv", mime: "text/tab-separated-values", description: "Tab-separated values", category: "spreadsheet", engine: "sheetjs", clientSide: true },
]

const ARCHIVE_FORMATS: FileFormat[] = [
  { id: "zip", name: "ZIP", extension: ".zip", mime: "application/zip", description: "Compressed archive", category: "archive", engine: "fflate", clientSide: true },
  { id: "gzip", name: "GZIP", extension: ".gz", mime: "application/gzip", description: "GNU zip compression", category: "archive", engine: "fflate", clientSide: true },
]

const FONT_FORMATS: FileFormat[] = [
  { id: "woff2", name: "WOFF2", extension: ".woff2", mime: "font/woff2", description: "Web Open Font Format 2", category: "font", engine: "opentype", clientSide: true },
  { id: "woff", name: "WOFF", extension: ".woff", mime: "font/woff", description: "Web Open Font Format", category: "font", engine: "opentype", clientSide: true },
  { id: "ttf", name: "TTF", extension: ".ttf", mime: "font/ttf", description: "TrueType font", category: "font", engine: "opentype", clientSide: true },
  { id: "otf", name: "OTF", extension: ".otf", mime: "font/otf", description: "OpenType font", category: "font", engine: "opentype", clientSide: true },
]

const THREE_D_FORMATS: FileFormat[] = [
  { id: "gltf", name: "glTF", extension: ".gltf", mime: "model/gltf+json", description: "GL Transmission Format", category: "3d", engine: "three", clientSide: true },
  { id: "glb", name: "GLB", extension: ".glb", mime: "model/gltf-binary", description: "Binary glTF", category: "3d", engine: "three", clientSide: true },
  { id: "obj", name: "OBJ", extension: ".obj", mime: "model/obj", description: "Wavefront 3D object", category: "3d", engine: "three", clientSide: true },
  { id: "stl", name: "STL", extension: ".stl", mime: "model/stl", description: "3D printing format", category: "3d", engine: "three", clientSide: true },
]

const DATA_FORMATS: FileFormat[] = [
  { id: "json", name: "JSON", extension: ".json", mime: "application/json", description: "JavaScript Object Notation", category: "data", engine: "native", clientSide: true },
  { id: "yaml", name: "YAML", extension: ".yaml", mime: "application/yaml", description: "YAML Ain't Markup Language", category: "data", engine: "native", clientSide: true },
  { id: "xml", name: "XML", extension: ".xml", mime: "application/xml", description: "Extensible Markup Language", category: "data", engine: "native", clientSide: true },
  { id: "toml", name: "TOML", extension: ".toml", mime: "application/toml", description: "Tom's Obvious Minimal Language", category: "data", engine: "native", clientSide: true },
]

const COMPRESS_IMAGE_FORMATS: FileFormat[] = [
  { id: "compress-jpeg", name: "Compress JPEG", extension: ".jpg", mime: "image/jpeg", description: "Reduce quality to shrink file size", category: "compress", engine: "magick-compress", clientSide: true },
  { id: "compress-webp", name: "Compress to WebP", extension: ".webp", mime: "image/webp", description: "WebP is ~30% smaller than JPEG", category: "compress", engine: "magick-compress", clientSide: true },
  { id: "compress-png", name: "Compress PNG", extension: ".png", mime: "image/png", description: "Re-encode with optimal compression", category: "compress", engine: "magick-compress", clientSide: true },
]

const COMPRESS_VIDEO_FORMATS: FileFormat[] = [
  { id: "compress-mp4-low", name: "Compress MP4 (low)", extension: ".mp4", mime: "video/mp4", description: "CRF 28, visually acceptable", category: "compress", engine: "ffmpeg-compress", clientSide: true },
  { id: "compress-mp4-med", name: "Compress MP4 (medium)", extension: ".mp4", mime: "video/mp4", description: "CRF 23, good balance", category: "compress", engine: "ffmpeg-compress", clientSide: true },
  { id: "compress-mp4-small", name: "Compress to 720p", extension: ".mp4", mime: "video/mp4", description: "Scale down + compress", category: "compress", engine: "ffmpeg-compress", clientSide: true },
  { id: "compress-webm", name: "Compress to WebM", extension: ".webm", mime: "video/webm", description: "VP9, efficient for web", category: "compress", engine: "ffmpeg-compress", clientSide: true },
]

const COMPRESS_AUDIO_FORMATS: FileFormat[] = [
  { id: "compress-mp3-128", name: "Compress to MP3 128k", extension: ".mp3", mime: "audio/mpeg", description: "Good quality, small size", category: "compress", engine: "ffmpeg-compress", clientSide: true },
  { id: "compress-mp3-64", name: "Compress to MP3 64k", extension: ".mp3", mime: "audio/mpeg", description: "Voice/podcast quality", category: "compress", engine: "ffmpeg-compress", clientSide: true },
  { id: "compress-opus", name: "Compress to Opus", extension: ".opus", mime: "audio/opus", description: "Best compression for any bitrate", category: "compress", engine: "ffmpeg-compress", clientSide: true },
]

const COMPRESS_PDF_FORMATS: FileFormat[] = [
  { id: "compress-pdf", name: "Compress PDF", extension: ".pdf", mime: "application/pdf", description: "Re-render at lower DPI", category: "compress", engine: "pdf-compress", clientSide: true },
]

export const ALL_FORMATS: FileFormat[] = [
  ...VIDEO_FORMATS,
  ...AUDIO_FORMATS,
  ...IMAGE_FORMATS,
  ...VECTOR_FORMATS,
  ...DOCUMENT_FORMATS,
  ...SPREADSHEET_FORMATS,
  ...ARCHIVE_FORMATS,
  ...FONT_FORMATS,
  ...THREE_D_FORMATS,
  ...DATA_FORMATS,
  ...COMPRESS_IMAGE_FORMATS,
  ...COMPRESS_VIDEO_FORMATS,
  ...COMPRESS_AUDIO_FORMATS,
  ...COMPRESS_PDF_FORMATS,
]

export const FORMAT_GROUPS: FormatGroup[] = [
  { category: "video", label: "Video", formats: VIDEO_FORMATS },
  { category: "audio", label: "Audio", formats: AUDIO_FORMATS },
  { category: "image", label: "Image", formats: IMAGE_FORMATS },
  { category: "vector", label: "Vector", formats: VECTOR_FORMATS },
  { category: "document", label: "Document", formats: DOCUMENT_FORMATS },
  { category: "spreadsheet", label: "Spreadsheet", formats: SPREADSHEET_FORMATS },
  { category: "archive", label: "Archive", formats: ARCHIVE_FORMATS },
  { category: "font", label: "Font", formats: FONT_FORMATS },
  { category: "3d", label: "3D Model", formats: THREE_D_FORMATS },
  { category: "data", label: "Data", formats: DATA_FORMATS },
]

const MIME_TO_CATEGORY: Record<string, FormatCategory[]> = {
  "video/": ["video", "audio", "image"],
  "audio/": ["audio", "video"],
  "image/svg": ["vector", "image"],
  "image/": ["image", "vector"],
  "application/pdf": ["document", "image"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml": ["document"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml": ["spreadsheet", "data"],
  "application/vnd.openxmlformats-officedocument.presentationml": ["document"],
  "text/html": ["document"],
  "text/markdown": ["document"],
  "text/plain": ["document", "data"],
  "text/csv": ["spreadsheet", "data"],
  "application/json": ["data"],
  "application/xml": ["data"],
  "application/zip": ["archive"],
  "application/gzip": ["archive"],
  "application/x-tar": ["archive"],
  "application/x-7z-compressed": ["archive"],
  "application/x-rar-compressed": ["archive"],
  "font/": ["font"],
  "model/": ["3d"],
}

export function getOutputFormats(inputMime: string): FormatGroup[] {
  const matchingCategories = new Set<FormatCategory>()

  for (const [prefix, categories] of Object.entries(MIME_TO_CATEGORY)) {
    if (inputMime.startsWith(prefix) || inputMime === prefix) {
      categories.forEach((c) => matchingCategories.add(c))
    }
  }

  // Always include archive (any file can be compressed)
  matchingCategories.add("archive")

  if (matchingCategories.size <= 1) {
    return FORMAT_GROUPS
  }

  const groups = FORMAT_GROUPS.filter((g) => matchingCategories.has(g.category))

  // Add compression options based on input type
  const compressFormats: FileFormat[] = []
  if (inputMime.startsWith("image/")) compressFormats.push(...COMPRESS_IMAGE_FORMATS)
  if (inputMime.startsWith("video/")) compressFormats.push(...COMPRESS_VIDEO_FORMATS)
  if (inputMime.startsWith("audio/")) compressFormats.push(...COMPRESS_AUDIO_FORMATS)
  if (inputMime === "application/pdf") compressFormats.push(...COMPRESS_PDF_FORMATS)

  if (compressFormats.length > 0) {
    groups.unshift({ category: "compress", label: "Compress / Reduce Size", formats: compressFormats })
  }

  return groups
}

export function detectMimeType(file: File): string {
  if (file.type) return file.type
  const ext = file.name.split(".").pop()?.toLowerCase()
  const extMap: Record<string, string> = {
    mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime", avi: "video/x-msvideo",
    mkv: "video/x-matroska", flv: "video/x-flv", ogv: "video/ogg",
    mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", flac: "audio/flac",
    aac: "audio/aac", m4a: "audio/mp4", wma: "audio/x-ms-wma", opus: "audio/opus",
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp",
    avif: "image/avif", bmp: "image/bmp", tiff: "image/tiff", ico: "image/x-icon",
    gif: "image/gif", svg: "image/svg+xml",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    csv: "text/csv", tsv: "text/tab-separated-values",
    json: "application/json", xml: "application/xml", yaml: "application/yaml",
    html: "text/html", md: "text/markdown", txt: "text/plain",
    tex: "application/x-latex", rst: "text/x-rst",
    epub: "application/epub+zip",
    zip: "application/zip", gz: "application/gzip", tar: "application/x-tar",
    "7z": "application/x-7z-compressed", rar: "application/x-rar-compressed",
    ttf: "font/ttf", otf: "font/otf", woff: "font/woff", woff2: "font/woff2",
    gltf: "model/gltf+json", glb: "model/gltf-binary", obj: "model/obj", stl: "model/stl",
    toml: "application/toml",
  }
  return extMap[ext || ""] || "application/octet-stream"
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function getCategoryIcon(category: FormatCategory): string {
  const icons: Record<FormatCategory, string> = {
    video: "film",
    audio: "music",
    image: "image",
    document: "file-text",
    spreadsheet: "table",
    presentation: "presentation",
    ebook: "book-open",
    archive: "archive",
    font: "type",
    "3d": "box",
    vector: "pen-tool",
    data: "braces",
    compress: "minimize-2",
  }
  return icons[category]
}
