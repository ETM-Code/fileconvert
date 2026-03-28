"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileIcon,
  ArrowRight,
  Download,
  X,
  Wrench,
  Check,
  Film,
  Music,
  ImageIcon,
  FileText,
  Table,
  Archive,
  Type,
  Box,
  PenTool,
  Braces,
  BookOpen,
  ChevronDown,
  Loader2,
  RotateCcw,
  Minimize2,
} from "lucide-react"
import Showcase from "@/components/showcase"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  type FileFormat,
  type FormatCategory,
  FORMAT_GROUPS,
  getOutputFormats,
  detectMimeType,
  formatFileSize,
} from "@/lib/formats"
import {
  convert,
  type ConversionOptions,
  type ConversionProgress,
  type ConversionResult,
} from "@/lib/converter"

const CATEGORY_ICONS: Record<FormatCategory, React.ReactNode> = {
  video: <Film className="size-3.5" />,
  audio: <Music className="size-3.5" />,
  image: <ImageIcon className="size-3.5" />,
  document: <FileText className="size-3.5" />,
  spreadsheet: <Table className="size-3.5" />,
  presentation: <FileText className="size-3.5" />,
  ebook: <BookOpen className="size-3.5" />,
  archive: <Archive className="size-3.5" />,
  font: <Type className="size-3.5" />,
  "3d": <Box className="size-3.5" />,
  vector: <PenTool className="size-3.5" />,
  data: <Braces className="size-3.5" />,
  compress: <Minimize2 className="size-3.5" />,
}

type AppState = "idle" | "file-selected" | "converting" | "done" | "error"

export default function Home() {
  const [state, setState] = useState<AppState>("idle")
  const [file, setFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<FileFormat | null>(null)
  const [formatPickerOpen, setFormatPickerOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [options, setOptions] = useState<ConversionOptions>({})
  const [progress, setProgress] = useState<ConversionProgress>({ percent: 0, stage: "" })
  const [result, setResult] = useState<ConversionResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const availableFormats = file ? getOutputFormats(detectMimeType(file)) : FORMAT_GROUPS

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      setState("file-selected")
      setSelectedFormat(null)
      setResult(null)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setState("file-selected")
      setSelectedFormat(null)
      setResult(null)
    }
  }, [])

  const handleConvert = useCallback(async () => {
    if (!file || !selectedFormat) return
    setState("converting")
    setProgress({ percent: 0, stage: "Starting..." })

    try {
      const conversionResult = await convert(file, selectedFormat, options, (p) => {
        setProgress(p)
      })
      setResult(conversionResult)
      setState("done")
      toast.success("Conversion complete", {
        description: `${formatFileSize(conversionResult.size)} in ${(conversionResult.duration / 1000).toFixed(1)}s`,
      })
    } catch (err) {
      setState("error")
      toast.error("Conversion failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }, [file, selectedFormat, options])

  const handleDownload = useCallback(() => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = result.filename
    a.click()
    URL.revokeObjectURL(url)
  }, [result])

  const handleReset = useCallback(() => {
    setFile(null)
    setSelectedFormat(null)
    setResult(null)
    setProgress({ percent: 0, stage: "" })
    setOptions({})
    setState("idle")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  useEffect(() => {
    if (state === "file-selected" && !selectedFormat) {
      const timer = setTimeout(() => setFormatPickerOpen(true), 400)
      return () => clearTimeout(timer)
    }
  }, [state, selectedFormat])

  const showControls = file && (state === "file-selected" || state === "error")
  const showProgress = state === "converting"
  const showResult = state === "done" && result

  return (
    <div className="flex min-h-full flex-col items-center bg-[#FAFAF9]">
      {/* Subtle grain texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 flex w-full items-center justify-between px-6 pt-6 pb-4 sm:px-10"
      >
        <a
          href="https://eltrus.net"
          className="flex items-center gap-1.5 rounded-lg border border-[#E5E5E0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#555] shadow-sm transition-all hover:border-[#D0D0CB] hover:text-[#1A1A1A] hover:shadow-md"
        >
          <ArrowRight className="size-3 rotate-180" />
          more by Eltrus
        </a>
        <Badge variant="outline" className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
          100% Client-side
        </Badge>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 pb-20">
        {/* Logo (front and centre) */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
          className="mb-8"
        >
          <img src="/logo.svg" alt="FileConvert" className="h-52 w-auto sm:h-72" />
        </motion.div>

        {/* Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="w-full"
        >
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
            className="group relative"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />

            <motion.div
              animate={{
                borderColor: isDragOver
                  ? "rgb(139, 92, 246)"
                  : file
                    ? "rgb(229, 229, 224)"
                    : "rgb(214, 214, 209)",
                backgroundColor: isDragOver
                  ? "rgba(139, 92, 246, 0.04)"
                  : "rgba(255, 255, 255, 0.8)",
                scale: isDragOver ? 1.02 : 1,
              }}
              transition={{ duration: 0.2, scale: { type: "spring", stiffness: 300, damping: 25 } }}
              className={`relative flex min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-10 backdrop-blur-sm transition-shadow ${!file ? "cursor-pointer hover:border-[#C0C0BA] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]" : ""}`}
            >
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-5"
                  >
                    <motion.div
                      animate={{
                        y: isDragOver ? -8 : 0,
                        scale: isDragOver ? 1.15 : 1,
                        rotate: isDragOver ? -5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F0F0ED] to-[#E8E8E3] shadow-sm transition-colors group-hover:from-[#E8E8E3] group-hover:to-[#DDDDD8]"
                    >
                      <Upload className="size-6 text-[#777]" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-[18px] font-medium text-[#333]">
                        Drop a file here, or click to browse
                      </p>
                      <p className="mt-1.5 text-[14px] text-[#999]">
                        Video, audio, images, documents, spreadsheets, and more
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex w-full items-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F0F0ED] to-[#E8E8E3]"
                    >
                      <FileIcon className="size-6 text-[#555]" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[16px] font-medium text-[#1A1A1A]">
                        {file.name}
                      </p>
                      <p className="mt-0.5 text-[13px] text-[#999]">
                        {formatFileSize(file.size)}
                        {file.type && (
                          <span className="ml-2 text-[#BBB]">{file.type}</span>
                        )}
                      </p>
                    </div>
                    {state === "file-selected" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReset()
                        }}
                        className="shrink-0 text-[#999] hover:text-[#444]"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Tagline (below drop zone) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center text-[22px] font-semibold tracking-[-0.02em] text-[#1A1A1A] font-[family-name:var(--font-bricolage-grotesque)] sm:text-[28px]"
        >
          Convert anything. <span className="text-[#999]">Right here in your browser.</span>
        </motion.p>

        {/* Format Picker + Convert */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              key="controls"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="mt-5 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <Popover open={formatPickerOpen} onOpenChange={setFormatPickerOpen}>
                <PopoverTrigger
                  className="flex h-10 w-full items-center justify-between rounded-xl border border-[#E5E5E0] bg-white px-4 text-[14px] text-[#444] transition-colors hover:border-[#D5D5D0] sm:flex-1"
                >
                  {selectedFormat ? (
                    <span className="flex items-center gap-2">
                      {CATEGORY_ICONS[selectedFormat.category]}
                      <span className="font-medium">{selectedFormat.name}</span>
                      <span className="text-[12px] text-[#999]">{selectedFormat.extension}</span>
                    </span>
                  ) : (
                    <span className="text-[#999]">Choose output format...</span>
                  )}
                  <ChevronDown className="size-4 text-[#BBB]" />
                </PopoverTrigger>
                <PopoverContent className="w-[var(--anchor-width)] p-0" align="start" side="bottom" sideOffset={6}>
                  <Command>
                    <CommandInput placeholder="Search formats..." />
                    <CommandList className="max-h-64">
                      <CommandEmpty>No format found.</CommandEmpty>
                      {availableFormats.map((group) => (
                        <CommandGroup key={group.category} heading={group.label}>
                          {group.formats.map((fmt) => (
                            <CommandItem
                              key={fmt.id}
                              value={`${fmt.name} ${fmt.extension} ${fmt.description}`}
                              onSelect={() => {
                                setSelectedFormat(fmt)
                                setFormatPickerOpen(false)
                              }}
                              data-checked={selectedFormat?.id === fmt.id || undefined}
                            >
                              <span className="flex items-center gap-2">
                                {CATEGORY_ICONS[fmt.category]}
                                <span className="font-medium">{fmt.name}</span>
                              </span>
                              <span className="ml-auto text-[11px] text-[#999]">
                                {fmt.description}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSettingsOpen(true)}
                  className="shrink-0"
                  aria-label="Conversion settings"
                >
                  <Wrench className="size-4" />
                </Button>

                <Button
                  size="lg"
                  onClick={handleConvert}
                  disabled={!selectedFormat}
                  className="bg-[#1A1A1A] px-6 font-medium text-white hover:bg-[#333] disabled:opacity-40"
                >
                  Convert
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 w-full"
            >
              <Progress value={progress.percent} className="w-full">
                <ProgressLabel className="flex items-center gap-2 text-[13px] text-[#666]">
                  <Loader2 className="size-3 animate-spin" />
                  {progress.stage}
                </ProgressLabel>
                <ProgressValue className="text-[13px] text-[#999]" />
              </Progress>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex w-full flex-col items-center gap-4"
            >
              <div className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100">
                    <Check className="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#1A1A1A]">{result.filename}</p>
                    <p className="text-[12px] text-[#999]">
                      {formatFileSize(result.size)} in {(result.duration / 1000).toFixed(1)}s
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleDownload}
                  className="bg-emerald-600 font-medium text-white hover:bg-emerald-700"
                >
                  <Download className="mr-1.5 size-4" />
                  Download
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-[13px] text-[#999] hover:text-[#666]"
              >
                <RotateCcw className="mr-1.5 size-3" />
                Convert another file
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conversion Settings</DialogTitle>
            <DialogDescription>
              Fine-tune the output for {selectedFormat?.name || "your format"}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            {selectedFormat?.engine === "ffmpeg" && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Video Bitrate</span>
                  <Input
                    placeholder="e.g. 1000k"
                    value={options.videoBitrate || ""}
                    onChange={(e) => setOptions({ ...options, videoBitrate: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Audio Bitrate</span>
                  <Input
                    placeholder="e.g. 128k"
                    value={options.audioBitrate || ""}
                    onChange={(e) => setOptions({ ...options, audioBitrate: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Resolution</span>
                  <Input
                    placeholder="e.g. 1920x1080"
                    value={options.resolution || ""}
                    onChange={(e) => setOptions({ ...options, resolution: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">FPS</span>
                  <Input
                    type="number"
                    placeholder="e.g. 30"
                    value={options.fps || ""}
                    onChange={(e) => setOptions({ ...options, fps: Number(e.target.value) })}
                  />
                </label>
              </>
            )}
            {selectedFormat?.engine === "magick" && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Quality (1-100)</span>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    placeholder="85"
                    value={options.quality || ""}
                    onChange={(e) => setOptions({ ...options, quality: Number(e.target.value) })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Width (px)</span>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={options.width || ""}
                    onChange={(e) => setOptions({ ...options, width: Number(e.target.value) })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Height (px)</span>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={options.height || ""}
                    onChange={(e) => setOptions({ ...options, height: Number(e.target.value) })}
                  />
                </label>
              </>
            )}
            {!selectedFormat && (
              <p className="text-[13px] text-[#999]">Select an output format first to see available settings.</p>
            )}
            {selectedFormat?.engine === "magick-compress" && (
              <label className="flex flex-col gap-1">
                <span className="text-[12px] font-medium text-[#666]">Quality (1-100, lower = smaller file)</span>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="75"
                  value={options.quality || ""}
                  onChange={(e) => setOptions({ ...options, quality: Number(e.target.value) })}
                />
              </label>
            )}
            {selectedFormat?.engine === "ffmpeg-compress" && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Video Bitrate (override)</span>
                  <Input
                    placeholder="e.g. 500k"
                    value={options.videoBitrate || ""}
                    onChange={(e) => setOptions({ ...options, videoBitrate: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium text-[#666]">Audio Bitrate (override)</span>
                  <Input
                    placeholder="e.g. 96k"
                    value={options.audioBitrate || ""}
                    onChange={(e) => setOptions({ ...options, audioBitrate: e.target.value })}
                  />
                </label>
              </>
            )}
            {selectedFormat && !["ffmpeg", "magick", "magick-compress", "ffmpeg-compress", "pdf-compress"].includes(selectedFormat.engine) && (
              <p className="text-[13px] text-[#999]">No additional settings for {selectedFormat.name} conversion.</p>
            )}
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* Showcase sections */}
      <Showcase />
    </div>
  )
}
