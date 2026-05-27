import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function FloatingPaths({ position }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full text-slate-700 dark:text-slate-500 opacity-80 dark:opacity-60" viewBox="0 0 696 316" fill="none">
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width * 1.5}
                        strokeOpacity={0.15 + path.id * 0.02}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{ pathLength: 1, opacity: [0.3, 0.8, 0.3], pathOffset: [0, 1, 0] }}
                        transition={{ duration: 15 + Math.random() * 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                ))}
            </svg>
        </div>
    );
}

const LightningStrike = ({ className, delay }) => (
    <motion.svg className={className} viewBox="0 0 20 40" fill="currentColor"
        initial={{ opacity: 0, scaleY: 0.5, y: -10 }}
        animate={{ opacity: [0, 1, 0.2, 1, 0, 0.9, 0], scaleY: [0.5, 1.1, 0.9, 1.05, 0.8, 1, 0.5], y: 0 }}
        transition={{ duration: 0.65, delay, ease: "linear" }}
    >
        <path d="M11 0 L1 18 H9 L2 38 L18 16 H10 L14 0 Z" />
    </motion.svg>
);

const FluffyCloudSvg = ({ className }) => (
    <svg viewBox="0 0 200 120" className={className}>
        <path d="M 30,75 C 20,70 15,55 25,45 C 20,35 30,20 45,25 C 55,10 75,10 85,25 C 95,15 115,15 125,28 C 135,20 150,25 155,35 C 165,35 175,45 170,55 C 180,65 175,80 160,80 C 165,90 155,100 140,95 C 130,105 110,105 95,95 C 80,105 60,105 50,95 C 35,100 25,90 30,75 Z"
            className="fill-surface dark:fill-background transition-colors duration-350"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 30,75 C 20,70 15,55 25,45 C 20,35 30,20 45,25 C 55,10 75,10 85,25 C 95,15 115,15 125,28 C 135,20 150,25 155,35 C 165,35 175,45 170,55 C 180,65 175,80 160,80 C 165,90 155,100 140,95 C 130,105 110,105 95,95 C 80,105 60,105 50,95 C 35,100 25,90 30,75 Z"
            fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.75"
            transform="translate(1.5, 1) scale(0.99)" transform-origin="100 60"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function StormCloud() {
    const [stage, setStage] = useState('idle');

    useEffect(() => {
        let active = true;
        const cycle = async () => {
            while (active) {
                setStage('idle');
                await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
                if (!active) break;
                setStage('thunder');
                await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
                if (!active) break;
                setStage('rain');
                await new Promise(r => setTimeout(r, 4000 + Math.random() * 2000));
            }
        };
        cycle();
        return () => { active = false; };
    }, []);

    const isThunder = stage === 'thunder';
    const isRain = stage === 'rain';
    const cloudStyle = isThunder
        ? 'text-yellow-400 dark:text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]'
        : 'text-slate-300 dark:text-slate-700 drop-shadow-md';

    return (
        <div className="absolute right-[2%] md:right-[5%] top-[3%] md:top-[6%] w-72 md:w-[380px] h-32 md:h-40 pointer-events-none select-none z-20">
            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-100 z-0 ${isThunder ? 'bg-warning/40 scale-125' : 'bg-transparent'}`} />
            <div className="relative w-full h-full z-10">
                <motion.div animate={{ y: [0, -6, 0], x: [0, -3, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute left-0 top-[20%] w-[38%] transition-all duration-300 ${cloudStyle}`}>
                    <FluffyCloudSvg className="w-full h-auto" />
                </motion.div>
                <motion.div animate={{ y: [0, -5, 0], x: [0, 4, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className={`absolute left-[24%] top-[5%] w-[54%] transition-all duration-300 z-10 ${cloudStyle}`}>
                    <FluffyCloudSvg className="w-full h-auto" />
                </motion.div>
                <motion.div animate={{ y: [0, -8, 0], x: [0, -5, 0] }} transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className={`absolute right-[-4%] top-[15%] w-[34%] transition-all duration-300 ${cloudStyle}`}>
                    <FluffyCloudSvg className="w-full h-auto" />
                </motion.div>
            </div>
            {isThunder && (
                <>
                    <LightningStrike className="absolute left-[42%] top-[65%] w-8 h-16 text-warning drop-shadow-[0_0_15px_rgba(234,179,8,1)] z-0" delay={0} />
                    <LightningStrike className="absolute left-[62%] top-[58%] w-6 h-12 text-yellow-200 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] z-0 -scale-x-100 rotate-12" delay={0.15} />
                    <LightningStrike className="absolute left-[26%] top-[60%] w-5 h-10 text-yellow-100 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] z-0 rotate-[20deg]" delay={0.3} />
                </>
            )}
            {isRain && (
                <div className="absolute inset-x-8 top-[68%] h-36 overflow-hidden flex justify-around z-0 px-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div key={i}
                            className="w-[1.5px] h-5 bg-gradient-to-b from-accent/0 via-accent/80 to-accent rounded-full"
                            initial={{ y: -20, opacity: 0, rotate: 12 }}
                            animate={{ y: [0, 150], opacity: [0, 1, 0] }}
                            transition={{ duration: 0.35 + Math.random() * 0.2, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: i * 0.1 + Math.random() * 0.2 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   ROADMAP VEGETATION (BULRUSH / CATTAILS)
───────────────────────────────────────────────────────────── */
const BulrushClump = ({ x, y, scale = 1, count = 4, className }) => {
    const reeds = [
        { dx: -6, dy: 0, tx: -10, ty: -35, rx: 1.2, ry: 4, rot: -10 },
        { dx: -2, dy: 0, tx: -3,  ty: -45, rx: 1.4, ry: 5, rot: -5 },
        { dx: 3,  dy: 0, tx: 7,   ty: -38, rx: 1.1, ry: 4, rot: 8 },
        { dx: 8,  dy: 0, tx: 15,  ty: -28, rx: 1.0, ry: 3.5, rot: 15 },
        { dx: -10, dy: 0, tx: -16, ty: -25, rx: 0.9, ry: 3, rot: -18 },
    ];
    return (
        <g className={className} transform={`translate(${x}, ${y}) scale(${scale})`}>
            {reeds.slice(0, count).map((r, i) => (
                <g key={i}>
                    {/* Stem */}
                    <path d={`M ${r.dx},${r.dy} Q ${(r.dx + r.tx)/2 - 2},${r.ty/2} ${r.tx},${r.ty}`} 
                          stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" />
                    {/* Cattail Head */}
                    <ellipse cx={r.tx} cy={r.ty} rx={r.rx} ry={r.ry} 
                             transform={`rotate(${r.rot}, ${r.tx}, ${r.ty})`} fill="currentColor" />
                </g>
            ))}
        </g>
    );
};

/* ─────────────────────────────────────────────────────────────
   ROADMAP ILLUSTRATION
   ViewBox: 0 0 260 300  (everything lives within these bounds)
   Road centerline winds:  (40,275) ──S──▶ (210,32)
───────────────────────────────────────────────────────────── */
const RoadmapIllustration = () => {
    // 100% mathematically smooth S-curve road with C1 continuity at every anchor point
    const road = "M 40,275 C 60,265 90,245 115,235 C 140,225 170,205 185,175 C 200,145 130,125 95,115 C 60,105 120,75 155,60 C 190,45 200,35 210,33";

    // Intermediate checkpoints placed EXACTLY on the road's bezier anchor points
    const nodes = [
        { cx: 115, cy: 235, scale: 1.40 },
        { cx: 185, cy: 175, scale: 1.05 },
        { cx: 95,  cy: 115, scale: 0.75 },
        { cx: 155, cy: 60,  scale: 0.50 },
    ];

    // 5 original bezier curves for center dashed lines
    const bezierSegments = [
        { d: "M 40,275 C 60,265 90,245 115,235", centerWidth: 3.0, dash: "12 16" },
        { d: "M 115,235 C 140,225 170,205 185,175", centerWidth: 2.4, dash: "10 14" },
        { d: "M 185,175 C 200,145 130,125 95,115", centerWidth: 1.8, dash: "8 12" },
        { d: "M 95,115 C 60,105 120,75 155,60", centerWidth: 1.2, dash: "5 9" },
        { d: "M 155,60 C 190,45 200,35 210,33", centerWidth: 0.8, dash: "3 6" },
    ];

    const getBezierPointAndTangent = (t, p0, p1, p2, p3) => {
        const mt = 1 - t;
        const x = mt*mt*mt*p0.x + 3*mt*mt*t*p1.x + 3*mt*t*t*p2.x + t*t*t*p3.x;
        const y = mt*mt*mt*p0.y + 3*mt*mt*t*p1.y + 3*mt*t*t*p2.y + t*t*t*p3.y;
        
        const tx = 3*mt*mt*(p1.x - p0.x) + 6*mt*t*(p2.x - p1.x) + 3*t*t*(p3.x - p2.x);
        const ty = 3*mt*mt*(p1.y - p0.y) + 6*mt*t*(p2.y - p1.y) + 3*t*t*(p3.y - p2.y);
        return { x, y, tx, ty };
    };

    const curves = [
        [{x:40, y:275}, {x:60, y:265}, {x:90, y:245}, {x:115, y:235}],
        [{x:115, y:235}, {x:140, y:225}, {x:170, y:205}, {x:185, y:175}],
        [{x:185, y:175}, {x:200, y:145}, {x:130, y:125}, {x:95, y:115}],
        [{x:95, y:115}, {x:60, y:105}, {x:120, y:75}, {x:155, y:60}],
        [{x:155, y:60}, {x:190, y:45}, {x:200, y:35}, {x:210, y:33}],
    ];

    // Half-widths of the road along the path to simulate extreme vanishing perspective
    const widths = [
        { halfWidth: 22.0 }, // P0 (foreground)
        { halfWidth: 15.5 }, // P1
        { halfWidth: 10.0 }, // P2
        { halfWidth: 5.5 },  // P3
        { halfWidth: 3.0 },  // P4
        { halfWidth: 1.2 },  // P5 (background)
    ];

    const leftPoints = [];
    const rightPoints = [];
    const STEPS = 20;

    curves.forEach((curve, i) => {
        const isLastCurve = i === curves.length - 1;
        const limit = isLastCurve ? STEPS : STEPS - 1;
        for (let j = 0; j <= limit; j++) {
            const t = j / STEPS;
            const pt = getBezierPointAndTangent(t, curve[0], curve[1], curve[2], curve[3]);
            
            // Global progress along 5 curve segments [0..5]
            const g = i + t;
            
            // Interpolate width
            const wIdx = Math.floor(g);
            const wT = g - wIdx;
            const wStart = widths[Math.min(wIdx, widths.length - 1)].halfWidth;
            const wEnd = widths[Math.min(wIdx + 1, widths.length - 1)].halfWidth;
            const w = wStart * (1 - wT) + wEnd * wT;

            // Unit normal vector (perpendicular to tangent tx, ty)
            const len = Math.sqrt(pt.tx * pt.tx + pt.ty * pt.ty);
            const nx = len > 0 ? -pt.ty / len : 0;
            const ny = len > 0 ? pt.tx / len : 0;

            leftPoints.push({ x: pt.x - w * nx, y: pt.y - w * ny });
            rightPoints.push({ x: pt.x + w * nx, y: pt.y + w * ny });
        }
    });

    const dLeft = "M " + leftPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ");
    const dRight = "M " + rightPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ");
    const dFill = dLeft + " L " + rightPoints.slice().reverse().map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ") + " Z";

    return (
        <div className="absolute right-[2%] lg:right-[6%] bottom-[4%] md:bottom-[8%] w-52 md:w-72 h-64 md:h-[340px] pointer-events-none select-none z-10 hidden md:block">
            <svg viewBox="0 0 260 300" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id="rg" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <filter id="rGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3" result="b" />
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="dGlow" x="-60%" y="-60%" width="220%" height="220%">
                        <feGaussianBlur stdDeviation="2" result="b" />
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>

                {/* ── 1. Soft glowing/transparent road body fill ── */}
                <path d={dFill} fill="url(#rg)" className="opacity-[0.03] dark:opacity-[0.05]" />

                {/* ── 2. Open road borders (100% mathematically continuous, no joints) ── */}
                <g opacity="0.45" className="dark:opacity-75">
                    <path d={dLeft} stroke="#475569" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" 
                          className="dark:stroke-[#38bdf8]" style={{ filter: "drop-shadow(0px 0px 3px rgba(56, 189, 248, 0.4))" }} />
                    <path d={dRight} stroke="#475569" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" 
                          className="dark:stroke-[#38bdf8]" style={{ filter: "drop-shadow(0px 0px 3px rgba(56, 189, 248, 0.4))" }} />
                </g>

                {/* ── 3. Center lane dashes ── */}
                <g opacity="0.55" className="dark:opacity-85">
                    {bezierSegments.map((seg, i) => (
                        <path key={`dash-${i}`} d={seg.d} stroke="#818cf8" strokeWidth={seg.centerWidth} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={seg.dash}
                              className="dark:stroke-[#38bdf8]" />
                    ))}
                </g>

                {/* ── 4. Animated progress glow ── */}
                <motion.path d={road} stroke="url(#rg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    filter="url(#rGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.80 }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
                />

                {/* ── 5. Organic bulrushes/grass clumps framing the path (scaled to perspective) ── */}
                <g className="text-slate-400 dark:text-slate-700 opacity-60 dark:opacity-40 transition-colors duration-300">
                    {/* Clump 1 (Bottom Left - foreground) */}
                    <BulrushClump x={18} y={285} scale={0.7} count={5} />
                    <BulrushClump x={26} y={290} scale={0.6} count={4} />

                    {/* Clump 2 (Middle Right - midground) */}
                    <BulrushClump x={212} y={185} scale={0.45} count={4} />
                    
                    {/* Clump 3 (Middle Left - background) */}
                    <BulrushClump x={66} y={122} scale={0.3} count={3} />

                    {/* Clump 4 (Top Right - far background) */}
                    <BulrushClump x={224} y={48} scale={0.2} count={3} />
                </g>

                {/* ── Checkpoint nodes ── */}
                {nodes.map((n, i) => (
                    <motion.g key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: n.scale, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.4, type: "spring", stiffness: 260, damping: 20 }}
                        style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
                    >
                        {/* Pulse halo */}
                        <motion.circle cx={n.cx} cy={n.cy} r="5" fill="#6366f1"
                            animate={{ r: [5, 14, 5], opacity: [0.22, 0, 0.22] }}
                            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                            className="dark:fill-[#38bdf8]"
                        />
                        {/* Disc */}
                        <circle cx={n.cx} cy={n.cy} r="5.5" fill="#1e293b" stroke="#6366f1" strokeWidth="2"
                            className="dark:fill-[#020617] dark:stroke-[#38bdf8]"
                        />
                        {/* Core */}
                        <circle cx={n.cx} cy={n.cy} r="2.5" fill="url(#rg)" filter="url(#dGlow)"
                            className="dark:fill-[#38bdf8]"
                        />
                    </motion.g>
                ))}

                {/* ── Futuristic Teleport Launchpad Start Marker at P0 (40, 275) ── */}
                <motion.g 
                    initial={{ opacity: 0, scale: 0 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.1, type: "spring", stiffness: 180 }}
                    style={{ transformOrigin: "40px 275px" }}
                >
                    {/* Base Hologram rings */}
                    <ellipse cx="40" cy="275" rx="14" ry="5.5" fill="#1e293b" stroke="#6366f1" strokeWidth="1.5"
                        className="dark:fill-[#090d16] dark:stroke-[#38bdf8] opacity-70" />
                    <ellipse cx="40" cy="275" rx="19" ry="7.5" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2"
                        className="dark:stroke-[#6366f1] opacity-50" />
                    
                    {/* Pulsing ring halo */}
                    <motion.ellipse cx="40" cy="275" rx="14" ry="5.5" fill="none" stroke="#6366f1" strokeWidth="1.5"
                        animate={{ rx: [14, 24, 14], ry: [5.5, 9.5, 5.5], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="dark:stroke-[#38bdf8]"
                    />

                    {/* Floating Neon Sparkle Star (4-point star) */}
                    <motion.g 
                        animate={{ y: [0, -6, 0] }} 
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* Sparkle Star Shape */}
                        <path d="M40,245 Q40,256 29,256 Q40,256 40,267 Q40,256 51,256 Q40,256 40,245 Z" 
                            fill="url(#rg)" filter="url(#dGlow)" 
                            className="dark:fill-[#38bdf8]" 
                        />
                        {/* White glowing core */}
                        <circle cx="40" cy="256" r="2" fill="#ffffff" className="dark:fill-[#e0f2fe]" />
                    </motion.g>
                </motion.g>

                {/* ── Finish flag at P5 (210, 33) ── */}
                <motion.g 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 0.45, opacity: 1 }} 
                    transition={{ delay: 2.2, type: "spring", bounce: 0.4 }}
                    style={{ transformOrigin: "210px 33px" }}
                >
                    <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
                        <line x1="210" y1="33" x2="210" y2="8" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" className="dark:stroke-[#94a3b8]" />
                        <circle cx="210" cy="8" r="2" fill="#475569" className="dark:fill-[#e2e8f0]" />
                        <path d="M211,10 Q218,6 228,11 L222,17 L228,23 Q218,18 211,23 Z" fill="#3b82f6" filter="url(#dGlow)" className="dark:fill-[#38bdf8]" />
                        <path d="M212,12 Q217,9 223,12 L219,17 L223,21 Q217,18 212,21 Z" fill="#60a5fa" className="dark:fill-[#7dd3fc]" opacity="0.6" />
                    </motion.g>
                </motion.g>
            </svg>
        </div>
    );
};

export function BackgroundPaths({
    title = "Master the Digital Empire",
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-background border-b border-surfaceBorder pt-20">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <StormCloud />
            <RoadmapIllustration />

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md surface mb-8 border border-primary/20 bg-primary/5">
                        <span className="text-xs font-semibold tracking-wide text-primary uppercase">The Future of Coding Education</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1]">
                        {words.map((word, wordIndex) => (
                            <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: wordIndex * 0.1 + letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-textMain via-textMain to-primary/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <p className="text-lg sm:text-xl text-textMuted max-w-2xl mx-auto mb-12 leading-relaxed">
                        A complete ecosystem for mastering programming. Highly structured, visually engaging, and powered by AI.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="inline-block group relative bg-gradient-to-b from-primary/20 to-surfaceBorder/50 dark:from-primary/30 dark:to-surfaceBorder p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Link
                                to="/roadmap"
                                className="rounded-[1.15rem] px-8 py-5 text-lg font-semibold backdrop-blur-md bg-surface/95 hover:bg-surface dark:bg-background/95 dark:hover:bg-background text-textMain transition-all duration-300 group-hover:-translate-y-0.5 border border-surfaceBorder/40 hover:shadow-md flex items-center justify-center cursor-pointer"
                            >
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">Start Learning Path</span>
                                <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">→</span>
                            </Link>
                        </div>
                        <a href="#paths" className="px-8 py-5 bg-surface text-textMain rounded-2xl font-semibold hover:border-surfaceBorderHover hover:bg-surfaceHover transition-all border border-surfaceBorder shadow-sm flex items-center justify-center">
                            Explore Roadmaps
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
