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
  Image,
  FileText,
  Table,
  Archive,
  Type,
  Box,
  PenTool,
  Braces,
  BookOpen,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react"
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
  image: <Image className="size-3.5" />,
  document: <FileText className="size-3.5" />,
  spreadsheet: <Table className="size-3.5" />,
  presentation: <FileText className="size-3.5" />,
  ebook: <BookOpen className="size-3.5" />,
  archive: <Archive className="size-3.5" />,
  font: <Type className="size-3.5" />,
  "3d": <Box className="size-3.5" />,
  vector: <PenTool className="size-3.5" />,
  data: <Braces className="size-3.5" />,
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
  }, [])

  // Auto-open format picker after file drop
  useEffect(() => {
    if (state === "file-selected" && !selectedFormat) {
      const timer = setTimeout(() => setFormatPickerOpen(true), 400)
      return () => clearTimeout(timer)
    }
  }, [state, selectedFormat])

  return (
    <div className="flex flex-1 flex-col items-center bg-[#FAFAF9]">
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
        className="relative z-10 flex w-full items-center justify-between px-6 pt-8 pb-4 sm:px-10"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-[#1A1A1A]">
            <Sparkles className="size-3.5 text-amber-400" />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#1A1A1A]">
            Convertify
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
            100% Client-side
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 pb-20">
        <AnimatePresence mode="wait">
          {/* Tagline */}
          <motion.div
            key="tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="mb-10 text-center"
          >
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1A1A1A] sm:text-[34px]">
              Convert anything.
              <br />
              <span className="text-[#999]">Right here in your browser.</span>
            </h1>
          </motion.div>

          {/* Drop Zone */}
          <motion.div
            key="dropzone"
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
              onClick={() => state === "idle" && fileInputRef.current?.click()}
              className="group relative"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Drop zone container */}
              <motion.div
                animate={{
                  borderColor: isDragOver
                    ? "rgb(217, 163, 30)"
                    : file
                      ? "rgb(229, 229, 224)"
                      : "rgb(214, 214, 209)",
                  backgroundColor: isDragOver
                    ? "rgba(229, 160, 0, 0.03)"
                    : "rgba(255, 255, 255, 0.8)",
                }}
                transition={{ duration: 0.2 }}
                className="relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-10 backdrop-blur-sm transition-shadow hover:shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
              >
                <AnimatePresence mode="wait">
                  {!file ? (
                    /* Empty state */
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <motion.div
                        animate={{
                          y: isDragOver ? -6 : 0,
                          scale: isDragOver ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex size-14 items-center justify-center rounded-xl bg-[#F0F0ED] transition-colors group-hover:bg-[#E8E8E3]"
                      >
                        <Upload className="size-5 text-[#888]" />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-[15px] font-medium text-[#444]">
                          Drop a file here
                        </p>
                        <p className="mt-1 text-[13px] text-[#999]">
                          or click to browse. Video, audio, images, documents, and more.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* File info */
                    <motion.div
                      key="file-info"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex w-full items-center gap-4"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#F0F0ED]">
                        <FileIcon className="size-5 text-[#666]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium text-[#1A1A1A]">
                          {file.name}
                        </p>
                        <p className="mt-0.5 text-[13px] text-[#999]">
                          {formatFileSize(file.size)}
                          {file.type && (
                            <span className="ml-2 text-[#BBB]">{file.type}</span>
                          )}
                        </p>
                      </div>
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          {/* Format Picker + Convert */}
          <AnimatePresence>
            {file && state !== "converting" && state !== "done" && (
              <motion.div
                key="controls"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="mt-6 flex w-full flex-col items-center gap-4 sm:flex-row"
              >
                {/* Format Picker */}
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
                  <PopoverContent className="w-[var(--anchor-width)] p-0" align="start" sideOffset={6}>
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

                {/* Settings + Convert */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSettingsOpen(true)}
                    className="shrink-0"
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
            {state === "converting" && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 w-full"
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
            {state === "done" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-8 flex w-full flex-col items-center gap-4"
              >
                <div className="flex w-full items-center justify-between rounded-xl border border-[#E5E5E0] bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50">
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
                    className="bg-[#1A1A1A] font-medium text-white hover:bg-[#333]"
                  >
                    <Download className="mr-1.5 size-4" />
                    Download
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="text-[13px] text-[#999]"
                >
                  Convert another file
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
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
            {selectedFormat && !["ffmpeg", "magick"].includes(selectedFormat.engine) && (
              <p className="text-[13px] text-[#999]">No additional settings for {selectedFormat.name} conversion.</p>
            )}
          </div>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 w-full py-6 text-center text-[11px] text-[#BBB]"
      >
        Your files never leave your browser. All processing happens locally via WebAssembly.
      </motion.footer>
    </div>
  )
}
