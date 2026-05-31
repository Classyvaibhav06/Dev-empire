import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import mermaid from 'mermaid';
import { Maximize2, Minimize2, Download, AlertCircle, X, ZoomIn, ZoomOut, RefreshCw, Move } from 'lucide-react';

let mermaidInitialized = false;
let uniqueIdCounter = 0;

function initMermaidOnce() {
  if (mermaidInitialized) return;
  mermaidInitialized = true;

  const isDark = document.documentElement.classList.contains('dark');
  
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: "'Inter', system-ui, sans-serif",
    themeVariables: {
      primaryColor: isDark ? '#1e293b' : '#ffffff',
      primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
      primaryBorderColor: isDark ? '#475569' : '#cbd5e1',
      lineColor: isDark ? '#94a3b8' : '#64748b',
      secondaryColor: isDark ? '#334155' : '#f1f5f9',
      tertiaryColor: isDark ? '#0f172a' : '#e2e8f0',
      background: 'transparent',
      nodeBorder: isDark ? '#475569' : '#cbd5e1',
      clusterBkg: isDark ? '#0f172a' : '#f8fafc',
      clusterBorder: isDark ? '#334155' : '#e2e8f0',
      titleColor: isDark ? '#f8fafc' : '#0f172a',
      edgeLabelBackground: isDark ? '#1e293b' : '#ffffff',
      nodeTextColor: isDark ? '#f8fafc' : '#0f172a',
      noteBkgColor: isDark ? '#334155' : '#fffeb3',
      noteTextColor: isDark ? '#f8fafc' : '#0f172a',
      noteBorderColor: isDark ? '#475569' : '#cbd5e1',
      actorBkg: isDark ? '#1e293b' : '#ffffff',
      actorBorder: isDark ? '#475569' : '#cbd5e1',
      actorTextColor: isDark ? '#f8fafc' : '#0f172a',
      fontFamily: "'Inter', sans-serif"
    },
    flowchart: {
      htmlLabels: true,
      curve: 'basis'
    },
    sequence: {
      wrap: true,
      messageMargin: 40
    }
  });
}

export default function MermaidRenderer({ chartCode }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!chartCode) return;
    initMermaidOnce();
    const id = `mermaid-${Date.now()}-${uniqueIdCounter++}`;

    const renderChart = async () => {
      try {
        setError(false);
        // Fix common AI syntax hallucinations (e.g. -->|text|>)
        const safeChartCode = chartCode
          .trim()
          .replace(/(-->|-.->|==>)\s*\|(.*?)\|\s*>/g, '$1|$2|');
        const { svg } = await mermaid.render(id, safeChartCode);
        setSvgContent(svg);
      } catch (err) {
        console.error('Mermaid render failed:', err);
        setError(true);
        const orphan = document.getElementById(id);
        if (orphan) orphan.remove();
      }
    };
    renderChart();
  }, [chartCode]);

  useEffect(() => {
    if (!expanded) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  useEffect(() => {
    if (expanded) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="my-3 p-4 border border-danger/20 bg-danger/5 rounded-xl text-xs text-danger animate-fade-in">
        <div className="flex items-center gap-2 mb-2 font-bold">
          <AlertCircle className="w-4 h-4" />
          Diagram render failed
        </div>
        <pre className="mt-1 p-2 bg-background/50 rounded-lg overflow-x-auto text-[10px] font-mono leading-relaxed whitespace-pre-wrap">
          {chartCode}
        </pre>
      </div>
    );
  }

  if (!svgContent) {
    return (
      <div className="my-3 p-6 flex items-center justify-center gap-3 bg-surfaceLight border border-surfaceBorder rounded-xl animate-pulse">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
        <span className="text-xs text-textDim font-medium ml-1">Rendering diagram…</span>
      </div>
    );
  }

  return (
    <>
      <div className="mermaid-diagram-wrapper my-4 animate-scale-in group">
        <div className="flex items-center justify-between px-4 py-2.5 bg-surfaceLight border border-surfaceBorder border-b-0 rounded-t-xl">
          <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-textDim">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM17.5 14l3.5 3.5-3.5 3.5M14 17.5h7" />
            </svg>
            Diagram
          </span>
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button onClick={handleDownloadSVG} className="p-1.5 rounded-md hover:bg-surfaceHover text-textDim hover:text-primary transition-colors cursor-pointer" title="Download SVG">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setExpanded(true)} className="p-1.5 rounded-md hover:bg-surfaceHover text-textDim hover:text-primary transition-colors cursor-pointer" title="Expand Diagram">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="p-6 bg-background border border-surfaceBorder rounded-b-xl flex justify-center overflow-x-auto select-none cursor-pointer hover:bg-surfaceLight/50 transition-colors"
          onClick={() => setExpanded(true)}
          title="Click to expand"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>

      {expanded && createPortal(
        <DiagramModal 
          svgContent={svgContent} 
          onClose={() => setExpanded(false)} 
          onDownload={handleDownloadSVG}
        />,
        document.body
      )}
    </>
  );
}

function DiagramModal({ svgContent, onClose, onDownload }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(Math.max(0.2, s - e.deltaY * 0.002), 5));
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}>
      <div className={`relative bg-surface border border-surfaceBorder flex flex-col overflow-hidden animate-scale-in transition-all duration-300 ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full md:w-[65vw] h-full md:h-[80vh] max-h-[900px] rounded-2xl shadow-2xl'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surfaceBorder bg-surfaceLight z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM17.5 14l3.5 3.5-3.5 3.5M14 17.5h7" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-textMain leading-tight">Architecture Diagram</h3>
              <p className="text-[11px] text-textDim font-medium mt-0.5">Interactive Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-background border border-surfaceBorder rounded-lg p-1 mr-2">
              <button onClick={() => setScale(s => Math.max(0.2, s - 0.2))} className="p-1.5 hover:bg-surface rounded text-textDim hover:text-textMain transition-colors cursor-pointer" title="Zoom Out">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button onClick={() => { setScale(1); setPos({x:0, y:0}); }} className="p-1.5 hover:bg-surface rounded text-textDim hover:text-textMain transition-colors cursor-pointer" title="Reset View">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setScale(s => Math.min(5, s + 0.2))} className="p-1.5 hover:bg-surface rounded text-textDim hover:text-textMain transition-colors cursor-pointer" title="Zoom In">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2.5 rounded-xl border border-surfaceBorder bg-background hover:bg-surfaceHover text-textMain transition-colors shadow-sm hidden sm:block cursor-pointer" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onDownload} className="p-2.5 rounded-xl border border-surfaceBorder bg-background hover:bg-surfaceHover text-textMain transition-colors shadow-sm hidden sm:block cursor-pointer" title="Download SVG">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2.5 rounded-xl border border-surfaceBorder bg-background hover:bg-danger/10 hover:text-danger hover:border-danger/30 text-textMuted transition-colors shadow-sm cursor-pointer" title="Close (ESC)">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagram Canvas */}
        <div 
          className="flex-1 bg-background relative overflow-hidden cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Subtle grid background for the canvas */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(var(--color-surfaceBorder) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.5
          }} />

          {/* Scalable and panable SVG container */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out origin-center [&_svg]:max-w-none [&_svg]:max-h-none"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>

        {/* Footer Hints */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-surface/90 backdrop-blur border border-surfaceBorder rounded-full shadow-lg text-[11px] font-bold text-textDim pointer-events-none flex items-center gap-3">
          <span className="flex items-center gap-1.5"><ZoomIn className="w-3.5 h-3.5" /> Scroll to zoom</span>
          <span className="w-1 h-1 rounded-full bg-surfaceBorder"></span>
          <span className="flex items-center gap-1.5"><Move className="w-3.5 h-3.5" /> Drag to pan</span>
          <span className="w-1 h-1 rounded-full bg-surfaceBorder"></span>
          <span>ESC to close</span>
        </div>

      </div>
    </div>
  );
}
