"use client"

import { useEffect, useRef, useState } from "react"

function useInView(ref: React.RefObject<HTMLElement | null>, margin = "-40% 0px -40% 0px") {
  const [active, setActive] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: margin }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, margin])
  return active
}

function SectionVideoAudio() {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref)
  return (
    <section ref={ref} className="flex min-h-[80vh] items-center justify-center px-6 py-16 max-w-[1200px] mx-auto relative">
      <svg className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.15] w-full pointer-events-none" viewBox="0 0 1000 200" preserveAspectRatio="none">
        <path d="M0,100 Q50,0 100,100 T200,100 T300,100 T400,20 T500,100 T600,180 T700,100 T800,100 T900,100 T1000,100" fill="none" stroke="url(#wavGrad)" strokeWidth="6"/>
        <defs><linearGradient id="wavGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38BDF8"/><stop offset="100%" stopColor="#EC4899"/></linearGradient></defs>
      </svg>
      <div className="flex items-center justify-between gap-16 w-full flex-wrap">
        <div className="flex-1 min-w-[300px] relative flex justify-center items-center h-[400px]" style={{ perspective: 1200 }}>
          <div className="relative w-[250px] h-[250px]" style={{ transformStyle: "preserve-3d", transition: "transform 1.2s cubic-bezier(0.25,1,0.5,1)", transform: active ? "rotateY(180deg) scale(1.05)" : "rotateY(0deg) scale(1)" }}>
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-[20px] shadow-lg" style={{ backfaceVisibility: "hidden" }}>
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <rect x="20" y="40" width="160" height="120" rx="12" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="6"/>
                <rect x="20" y="40" width="20" height="120" fill="#E2E8F0"/><rect x="160" y="40" width="20" height="120" fill="#E2E8F0"/>
                <circle cx="30" cy="55" r="3" fill="#38BDF8"/><circle cx="30" cy="85" r="3" fill="#38BDF8"/>
                <circle cx="30" cy="115" r="3" fill="#38BDF8"/><circle cx="30" cy="145" r="3" fill="#38BDF8"/>
                <circle cx="170" cy="55" r="3" fill="#38BDF8"/><circle cx="170" cy="85" r="3" fill="#38BDF8"/>
                <circle cx="170" cy="115" r="3" fill="#38BDF8"/><circle cx="170" cy="145" r="3" fill="#38BDF8"/>
                <circle cx="100" cy="100" r="25" fill="#38BDF8" opacity="0.2"/>
                <polygon points="90,85 120,100 90,115" fill="#38BDF8"/>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-[20px] shadow-lg" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              <svg viewBox="0 0 200 200" width="100%" height="100%">
                <rect x="20" y="40" width="160" height="120" rx="12" fill="#F8FAFC" stroke="#EC4899" strokeWidth="6"/>
                <g fill="#EC4899">
                  <rect x="50" y="85" width="10" height="30" rx="5"/><rect x="70" y="65" width="10" height="70" rx="5"/>
                  <rect x="90" y="45" width="10" height="110" rx="5"/><rect x="110" y="75" width="10" height="50" rx="5"/>
                  <rect x="130" y="55" width="10" height="90" rx="5"/><rect x="150" y="90" width="10" height="20" rx="5"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[300px] flex flex-col gap-5 relative z-[1]">
          <h2 className="text-[3rem] font-extrabold leading-[1.1]">Video & <span className="bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Audio</span></h2>
          <p className="text-[1.25rem] text-[#475569] leading-relaxed">Extract sound from visuals or convert between codecs instantly. From heavy MP4, WebM, and MOV to crisp MP3, WAV, or lossless FLAC. All processing happens locally.</p>
        </div>
      </div>
    </section>
  )
}

function SectionImages() {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref)
  const icons = [
    { cls: "icon-png", label: "PNG", color: "#38BDF8", pos: active ? { top: 0, left: 90 } : { top: 90, left: 90 } },
    { cls: "icon-jpg", label: "JPEG", color: "#8B5CF6", pos: active ? { top: 180, left: 90 } : { top: 90, left: 90 } },
    { cls: "icon-webp", label: "WebP", color: "#10B981", pos: active ? { top: 90, left: 0 } : { top: 90, left: 90 } },
    { cls: "icon-avif", label: "AVIF", color: "#F59E0B", pos: active ? { top: 90, left: 180 } : { top: 90, left: 90 } },
  ]
  return (
    <section ref={ref} className="flex min-h-[80vh] items-center justify-center px-6 py-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between gap-16 w-full flex-wrap flex-row-reverse">
        <div className="flex-1 min-w-[300px] relative flex justify-center items-center h-[400px]" style={{ perspective: 1200 }}>
          <div className="relative w-[260px] h-[260px]" style={{ transform: "rotate(45deg)" }}>
            {icons.map((icon) => (
              <div key={icon.cls} className="absolute w-[80px] h-[80px] rounded-[16px] flex items-center justify-center font-extrabold text-[1.1rem] bg-white border-2 z-[2]" style={{
                transform: `rotate(-45deg) scale(${active ? 1 : 0.5})`,
                top: icon.pos.top, left: icon.pos.left,
                opacity: active ? 1 : 0,
                borderColor: icon.color,
                boxShadow: active ? `0 10px 20px ${icon.color}33` : "0 4px 6px rgba(0,0,0,0.05)",
                transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}>
                <span style={{ color: icon.color }}>{icon.label}</span>
              </div>
            ))}
            <div className="absolute" style={{ top: 90, left: 90, width: 80, height: 80, transform: "rotate(-45deg)", opacity: active ? 1 : 0, transition: "opacity 1s 0.5s", animation: active ? "spin 8s linear infinite" : "none" }}>
              <svg viewBox="0 0 100 100">
                <path d="M50,15 A35,35 0 1,1 15,50" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round"/>
                <polygon points="15,50 5,35 25,35" fill="#CBD5E1"/>
                <path d="M50,85 A35,35 0 1,1 85,50" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round"/>
                <polygon points="85,50 95,65 75,65" fill="#CBD5E1"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[300px] flex flex-col gap-5 relative z-[1]">
          <h2 className="text-[3rem] font-extrabold leading-[1.1]">Any <span className="bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Image</span> Format</h2>
          <p className="text-[1.25rem] text-[#475569] leading-relaxed">Powered by our ImageMagick WebAssembly engine. Shuffle between modern formats like AVIF or WebP to save space, or fall back to trusty JPEG and PNG.</p>
        </div>
      </div>
    </section>
  )
}

function SectionDocsData() {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref)
  return (
    <section ref={ref} className="flex min-h-[80vh] items-center justify-center px-6 py-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between gap-16 w-full flex-wrap">
        <div className="flex-1 min-w-[300px] relative flex justify-center items-center h-[400px]" style={{ perspective: 1200 }}>
          <div className="relative w-[440px] h-[250px] flex justify-between items-center">
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 440 250">
              <path className="transition-all duration-[1500ms]" d="M 70 125 Q 220 -20 370 125" fill="none" stroke="url(#arcGrad2)" strokeWidth="4" strokeLinecap="round" style={{ strokeDasharray: 400, strokeDashoffset: active ? 0 : 400 }}/>
              <defs><linearGradient id="arcGrad2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38BDF8"/><stop offset="100%" stopColor="#EC4899"/></linearGradient></defs>
              <circle cx="130" cy="50" r="4" fill="#38BDF8" className="transition-opacity duration-500" style={{ opacity: active ? 1 : 0, animation: active ? "pulse 2s infinite alternate" : "none" }}/>
              <circle cx="220" cy="18" r="5" fill="#8B5CF6" className="transition-opacity duration-500" style={{ opacity: active ? 1 : 0, animation: active ? "pulse 2s infinite alternate 0.5s" : "none" }}/>
              <circle cx="310" cy="50" r="4" fill="#EC4899" className="transition-opacity duration-500" style={{ opacity: active ? 1 : 0, animation: active ? "pulse 2s infinite alternate 1s" : "none" }}/>
            </svg>
            <div className="w-[140px] h-[190px] bg-white rounded-xl border-2 border-[#E2E8F0] shadow-lg relative z-[1] transition-all duration-[800ms]" style={{ transform: active ? "translateY(0)" : "translateY(20px)", opacity: active ? 1 : 0 }}>
              <svg viewBox="0 0 140 190" width="100%" height="100%">
                <path d="M 25,25 L 85,25 L 115,55 L 115,165 A 5,5 0 0 1 110,170 L 30,170 A 5,5 0 0 1 25,165 Z" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="4"/>
                <path d="M 85,25 L 85,55 L 115,55 Z" fill="#F1F5F9" stroke="#38BDF8" strokeWidth="4" strokeLinejoin="round"/>
                <rect x="45" y="80" width="50" height="6" rx="3" fill="#38BDF8" opacity="0.6"/>
                <rect x="45" y="100" width="40" height="6" rx="3" fill="#38BDF8" opacity="0.6"/>
                <rect x="45" y="120" width="45" height="6" rx="3" fill="#38BDF8" opacity="0.6"/>
                <rect x="45" y="140" width="30" height="6" rx="3" fill="#38BDF8" opacity="0.6"/>
              </svg>
            </div>
            <div className="w-[140px] h-[190px] bg-white rounded-xl border-2 border-[#E2E8F0] shadow-lg relative z-[1] transition-all duration-[800ms]" style={{ transform: active ? "translateY(0)" : "translateY(20px)", opacity: active ? 1 : 0, transitionDelay: "0.2s" }}>
              <svg viewBox="0 0 140 190" width="100%" height="100%">
                <rect x="15" y="15" width="110" height="160" rx="8" fill="#FFFFFF" stroke="#EC4899" strokeWidth="4"/>
                <text x="25" y="50" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#64748B">{"{"}</text>
                <text x="35" y="75" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#38BDF8">&quot;type&quot;:</text>
                <text x="85" y="75" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#EC4899">&quot;data&quot;,</text>
                <text x="35" y="105" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#38BDF8">&quot;fmt&quot;:</text>
                <text x="75" y="105" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#EC4899">&quot;JSON&quot;</text>
                <text x="25" y="130" fontFamily="monospace" fontSize="12" fontWeight="600" fill="#64748B">{"}"}</text>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[300px] flex flex-col gap-5 relative z-[1]">
          <h2 className="text-[3rem] font-extrabold leading-[1.1]">Docs & <span className="bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Data</span></h2>
          <p className="text-[1.25rem] text-[#475569] leading-relaxed">Bridge the gap between human-readable and machine-readable. Transform DOCX to clean HTML, Markdown to LaTeX, CSV to JSON, or JSON to YAML.</p>
        </div>
      </div>
    </section>
  )
}

function SectionPDF() {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref)
  const thumbs = Array.from({ length: 6 }, (_, i) => i)
  const colors = ["#38BDF8", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#38BDF8"]
  return (
    <section ref={ref} className="flex min-h-[80vh] items-center justify-center px-6 py-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between gap-16 w-full flex-wrap flex-row-reverse">
        <div className="flex-1 min-w-[300px] relative flex justify-center items-center h-[400px]" style={{ perspective: 1200 }}>
          <div className="relative w-[300px] h-[350px]">
            <div className="absolute w-[200px] h-[280px] bg-white border-2 border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center shadow-lg z-10 transition-all duration-1000" style={{ top: 35, left: 50, transformOrigin: "left center", transform: active ? "rotateY(-80deg) scale(0.9) translateX(-100px)" : "none", opacity: active ? 0 : 1 }}>
              <svg viewBox="0 0 100 140" width="100" height="140">
                <path d="M 10,10 L 60,10 L 90,40 L 90,130 A 5,5 0 0 1 85,135 L 15,135 A 5,5 0 0 1 10,130 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="4"/>
                <text x="50" y="85" textAnchor="middle" fontWeight="900" fontSize="28" fill="#EF4444" fontFamily="sans-serif">PDF</text>
              </svg>
            </div>
            <div className="absolute inset-0 grid grid-cols-3 gap-3 transition-opacity duration-500" style={{ transform: "rotateY(15deg) rotateX(10deg)", opacity: active ? 1 : 0 }}>
              {thumbs.map((i) => (
                <div key={i} className="bg-white border-2 border-[#E2E8F0] rounded-md h-[100px] shadow-sm transition-all duration-500" style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transitionDelay: `${(i + 1) * 0.1}s` }}>
                  <svg viewBox="0 0 40 50" className="p-2.5 w-full h-full"><rect width="40" height="50" fill={colors[i]} opacity="0.2" rx="4"/></svg>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[300px] flex flex-col gap-5 relative z-[1]">
          <h2 className="text-[3rem] font-extrabold leading-[1.1]">Unpack <span className="bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">PDFs</span></h2>
          <p className="text-[1.25rem] text-[#475569] leading-relaxed">Turn lengthy, multi-page PDFs into manageable image grids. Extract all pages into a zip of high-res PNGs, or grab a single page as JPEG.</p>
        </div>
      </div>
    </section>
  )
}

function SectionCompress() {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref)
  const [value, setValue] = useState(12.4)
  const stateRef = useRef(0)
  const compressingRef = useRef(false)

  useEffect(() => { compressingRef.current = active }, [active])

  useEffect(() => {
    let lastTime = performance.now()
    let raf: number
    function tick(time: number) {
      const dt = time - lastTime
      lastTime = time
      if (compressingRef.current && stateRef.current < 1) stateRef.current += dt / 1500
      else if (!compressingRef.current && stateRef.current > 0) stateRef.current -= dt / 1500
      stateRef.current = Math.max(0, Math.min(1, stateRef.current))
      const ease = stateRef.current < 0.5 ? 2 * stateRef.current * stateRef.current : 1 - Math.pow(-2 * stateRef.current + 2, 2) / 2
      setValue(12.4 - 10.3 * ease)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section ref={ref} className="flex min-h-[80vh] items-center justify-center px-6 py-16 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between gap-16 w-full flex-wrap">
        <div className="flex-1 min-w-[300px] relative flex justify-center items-center h-[400px]">
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 280" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="140" cy="140" r="130" fill="transparent" stroke="#38BDF8" strokeWidth="8" strokeDasharray="850" strokeLinecap="round" className="transition-all duration-[1500ms]" style={{ strokeDashoffset: active ? 0 : 850 }}/>
            </svg>
            <div className="w-[140px] h-[180px] bg-white border-4 border-[#EC4899] rounded-[16px] flex items-center justify-center shadow-lg z-[1] transition-all duration-[1500ms]" style={{ transform: active ? "scale(0.6)" : "scale(1)", borderColor: active ? "#38BDF8" : "#EC4899", transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}>
              <svg viewBox="0 0 100 140" width="70%">
                <path d="M 10,10 L 60,10 L 90,40 L 90,130 A 5,5 0 0 1 85,135 L 15,135 A 5,5 0 0 1 10,130 Z" fill="#F1F5F9" stroke="#475569" strokeWidth="4"/>
                <path d="M 60,10 L 60,40 L 90,40 Z" fill="#E2E8F0" stroke="#475569" strokeWidth="4" strokeLinejoin="round"/>
                <path d="M 50,65 L 50,105 M 35,90 L 50,105 L 65,90" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-[300px] flex flex-col gap-5 relative z-[1]">
          <h2 className="text-[3rem] font-extrabold leading-[1.1]">Shrink & <span className="bg-gradient-to-r from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">Compress</span></h2>
          <p className="text-[1.25rem] text-[#475569] leading-relaxed">Adjust quality, resolution, or bitrate to compress massive files down to a fraction of their original footprint.</p>
          <div className="text-[3rem] font-black tabular-nums text-[#38BDF8] mt-2">{value.toFixed(1)} MB</div>
        </div>
      </div>
    </section>
  )
}

function SectionPrivacy() {
  const ref = useRef<HTMLElement>(null)
  const active = useInView(ref)
  const features = [
    { label: "No Uploads", icon: <><path d="M 45,35 A 15,15 0 0 0 25,20 A 15,15 0 0 0 10,35 A 10,10 0 0 0 15,50 L 45,50 A 10,10 0 0 0 45,35 Z" fill="none" stroke="#64748B" strokeWidth="4"/><path d="M 10,10 L 50,50" stroke="#EF4444" strokeWidth="4" strokeLinecap="round"/></> },
    { label: "No Servers", icon: <><rect x="15" y="10" width="30" height="40" rx="4" fill="none" stroke="#64748B" strokeWidth="4"/><line x1="15" y1="25" x2="45" y2="25" stroke="#64748B" strokeWidth="4"/><line x1="15" y1="40" x2="45" y2="40" stroke="#64748B" strokeWidth="4"/><circle cx="25" cy="18" r="2" fill="#64748B"/><path d="M 10,10 L 50,50" stroke="#EF4444" strokeWidth="4" strokeLinecap="round"/></> },
    { label: "No Tracking", icon: <><circle cx="30" cy="30" r="15" fill="none" stroke="#64748B" strokeWidth="4"/><circle cx="30" cy="30" r="5" fill="#64748B"/><path d="M 5,30 Q 30,10 55,30 Q 30,50 5,30" fill="none" stroke="#64748B" strokeWidth="4"/><path d="M 10,10 L 50,50" stroke="#EF4444" strokeWidth="4" strokeLinecap="round"/></> },
  ]
  return (
    <section ref={ref} className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-16 max-w-[1200px] mx-auto text-center">
      <div className="relative w-[150px] h-[150px] mx-auto mb-12 flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div key={i} className="absolute border-2 border-[#8B5CF6] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0, animation: active ? `signal 3s linear infinite ${(i - 1)}s` : "none" }}/>
        ))}
        <svg viewBox="0 0 100 100" width="90" height="90" className="relative z-[2] bg-[#FAFAF9] rounded-full">
          <rect x="25" y="45" width="50" height="40" rx="8" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="6"/>
          <path d="M 35,45 V 30 A 15,15 0 0 1 65,30 V 45" fill="none" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round"/>
          <circle cx="50" cy="65" r="5" fill="#38BDF8"/><path d="M 50,70 V 78" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      </div>
      <h2 className="text-[2.5rem] font-extrabold mb-4">Your files never leave your browser.</h2>
      <p className="max-w-[600px] mx-auto text-[1.25rem] text-[#475569]">Everything happens locally on your device via WebAssembly. We don&apos;t see your data, and we definitely don&apos;t store it.</p>
      <div className="flex gap-12 justify-center mt-12">
        {features.map((f, i) => (
          <div key={f.label} className="flex flex-col items-center gap-4 transition-all duration-[600ms]" style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 0.2}s` }}>
            <svg viewBox="0 0 60 60" width="60" height="60">{f.icon}</svg>
            <span className="text-[#0F172A] font-bold">{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function ShowcaseFooter() {
  return (
    <footer className="text-center py-24 px-8 border-t border-[#E2E8F0] bg-[#F8FAFC]">
      <img src="/logo.svg" alt="FileConvert" className="mx-auto h-44 w-auto mb-4" />
      <a href="https://eltrus.net" className="text-[#EC4899] no-underline font-extrabold text-[1.1rem] tracking-[2px]">by Eltrus</a>
    </footer>
  )
}

export default function Showcase() {
  return (
    <div className="bg-[#FAFAF9]">
      <style>{`
        @keyframes spin { 100% { transform: rotate(315deg); } }
        @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.3); opacity: 1; } }
        @keyframes signal { 0% { width: 80px; height: 80px; opacity: 0.5; } 100% { width: 300px; height: 300px; opacity: 0; } }
      `}</style>
      <SectionVideoAudio />
      <SectionImages />
      <SectionDocsData />
      <SectionPDF />
      <SectionCompress />
      <SectionPrivacy />
      <ShowcaseFooter />
    </div>
  )
}
