# FileConvert

A universal file converter that runs entirely in your browser. No uploads. No servers. No subscriptions.

## Why this exists

Every time you need to convert a file, you end up on some site that wants you to upload your document to a server you know nothing about, wait for it to process, then download the result through three layers of ads. Maybe you get a watermark. Maybe they want $9.99/month for the privilege of converting a PNG to a JPEG, which is, genuinely, about four lines of code.

And the privacy situation is absurd. You're sending your files (your documents, your photos, your audio) to a random server. You have no idea what happens to them after. "We delete your files after 24 hours." Sure. You also said you wouldn't sell my email.

FileConvert doesn't do any of that. Every conversion runs client-side via WebAssembly. Your files never leave your browser. There's no server receiving your data, because there's no server. It's just your machine doing the work.

## What it converts

Basically everything.

**Images** (ImageMagick WASM)
- PNG, JPEG, WebP, BMP, TIFF, ICO, GIF, AVIF
- Any of those to any of the others

**PDF** (pdf.js)
- PDF to JPEG, PDF to PNG
- Multi-page PDFs get rendered and zipped automatically

**SVG** (Canvas API + svg2pdf.js)
- SVG to PNG (rasterise at any resolution)
- SVG to PDF (vector-preserving, not rasterised)

**Video & Audio** (FFmpeg WASM)
- MP4, WebM, MOV, AVI, MKV, FLV, OGV
- MP3, WAV, OGG, FLAC, AAC, M4A, Opus
- Full FFmpeg, so custom bitrate, resolution, codec options all work

**Documents** (Mammoth, Pandoc-style, jsPDF)
- DOCX to HTML, DOCX to plain text
- Markdown to HTML, LaTeX, reStructuredText
- Plain text to PDF

**Spreadsheets** (SheetJS)
- XLSX to CSV, JSON, TSV
- CSV to JSON, TSV

**Archives** (fflate)
- Any file to ZIP or GZIP

**Data formats** (native)
- JSON to YAML, XML, TOML
- CSV to JSON

27 conversion paths tested end-to-end, all running in the browser.

## How it works

You drop a file. You pick a format. You click convert. That's it.

The app detects what kind of file you've uploaded and shows you the relevant output formats. Type to search if you know what you want. There's a wrench icon for advanced settings (bitrate, resolution, quality) on formats that support it.

Under the hood, each conversion engine loads on demand. The first time you convert a video, FFmpeg's 25MB WASM binary downloads and caches. Image conversions load ImageMagick WASM. PDF rendering uses pdf.js. Most other conversions are near-instant because the engines are small or native JavaScript.

## Running it

```bash
bun install
bun run dev
```

Opens on `localhost:3000`.

## Tech stack

- Next.js + React
- shadcn/ui components
- Tailwind CSS
- Framer Motion for animations
- FFmpeg WASM (video/audio)
- ImageMagick WASM (images)
- pdf.js (PDF rendering)
- svg2pdf.js + jsPDF (SVG/PDF)
- Mammoth (DOCX parsing)
- SheetJS (spreadsheets)
- fflate (compression)
- opentype.js (fonts)
- Tesseract.js ready (OCR, not yet wired up)

## What's next

There are a few conversion paths that still need work. DOCX to PDF is best-effort (Mammoth extracts the content, but complex layouts won't survive). Full LaTeX to PDF is possible via SwiftLaTeX WASM but not integrated yet. Video conversions are slow compared to native FFmpeg, because WASM, but they work.

The goal is to cover every common conversion entirely client-side, and to be honest about the ones that aren't perfect yet.
