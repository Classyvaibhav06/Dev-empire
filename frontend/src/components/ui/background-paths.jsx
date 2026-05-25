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
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-slate-400 dark:text-slate-500 opacity-60"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width * 1.5}
                        strokeOpacity={0.15 + path.id * 0.02}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.8, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

const LightningStrike = ({ className, delay }) => (
  <motion.svg
    className={className}
    viewBox="0 0 20 40"
    fill="currentColor"
    initial={{ opacity: 0, scaleY: 0.5, y: -10 }}
    animate={{ 
      opacity: [0, 1, 0.2, 1, 0, 0.9, 0],
      scaleY: [0.5, 1.1, 0.9, 1.05, 0.8, 1, 0.5],
      y: 0
    }}
    transition={{ duration: 0.65, delay, ease: "linear" }}
  >
    <path d="M11 0 L1 18 H9 L2 38 L18 16 H10 L14 0 Z" />
  </motion.svg>
);

const FluffyCloudSvg = ({ className }) => (
  <svg viewBox="0 0 200 120" className={className}>
    {/* Base shape with fill and main border */}
    <path 
      d="M 30,75 C 20,70 15,55 25,45 C 20,35 30,20 45,25 C 55,10 75,10 85,25 C 95,15 115,15 125,28 C 135,20 150,25 155,35 C 165,35 175,45 170,55 C 180,65 175,80 160,80 C 165,90 155,100 140,95 C 130,105 110,105 95,95 C 80,105 60,105 50,95 C 35,100 25,90 30,75 Z" 
      className="fill-surface dark:fill-background transition-colors duration-350"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Second sketchy stroke layer offset slightly for the hand-drawn look */}
    <path 
      d="M 30,75 C 20,70 15,55 25,45 C 20,35 30,20 45,25 C 55,10 75,10 85,25 C 95,15 115,15 125,28 C 135,20 150,25 155,35 C 165,35 175,45 170,55 C 180,65 175,80 160,80 C 165,90 155,100 140,95 C 130,105 110,105 95,95 C 80,105 60,105 50,95 C 35,100 25,90 30,75 Z" 
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.75"
      transform="translate(1.5, 1) scale(0.99)"
      transform-origin="100 60"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Cluster of 3 Fluffy Clouds with Independent Animations
function StormCloud() {
  const [stage, setStage] = useState('idle'); // 'idle' | 'thunder' | 'rain'

  useEffect(() => {
    let active = true;
    const cycle = async () => {
      while (active) {
        if (!active) break;
        // 1. Idle stage
        setStage('idle');
        await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));

        if (!active) break;
        // 2. Thunder stage
        setStage('thunder');
        await new Promise(r => setTimeout(r, 800 + Math.random() * 500));

        if (!active) break;
        // 3. Rain stage
        setStage('rain');
        await new Promise(r => setTimeout(r, 4000 + Math.random() * 2000));
      }
    };
    cycle();
    return () => { active = false; };
  }, []);

  const isThunder = stage === 'thunder';
  const isRain = stage === 'rain';

  const cloudBaseStyle = isThunder 
    ? 'text-yellow-400 dark:text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]' 
    : 'text-slate-300 dark:text-slate-700 drop-shadow-md';

  return (
    <div className="absolute right-[2%] md:right-[5%] top-[3%] md:top-[6%] w-72 md:w-[380px] h-32 md:h-40 pointer-events-none select-none z-20">
      
      {/* Thunder ambient glow */}
      <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-100 z-0 ${
        isThunder ? 'bg-warning/40 scale-125' : 'bg-transparent'
      }`} />

      {/* Cloud Cluster */}
      <div className="relative w-full h-full z-10">
        
        {/* Left Small Cloud */}
        <motion.div 
          animate={{ y: [0, -6, 0], x: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute left-0 top-[20%] w-[38%] transition-all duration-300 ${cloudBaseStyle}`}
        >
          <FluffyCloudSvg className="w-full h-auto" />
        </motion.div>

        {/* Center Main Cloud */}
        <motion.div 
          animate={{ y: [0, -5, 0], x: [0, 4, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className={`absolute left-[24%] top-[5%] w-[54%] transition-all duration-300 z-10 ${cloudBaseStyle}`}
        >
          <FluffyCloudSvg className="w-full h-auto" />
        </motion.div>

        {/* Right Small Cloud */}
        <motion.div 
          animate={{ y: [0, -8, 0], x: [0, -5, 0] }}
          transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className={`absolute right-[-4%] top-[15%] w-[34%] transition-all duration-300 ${cloudBaseStyle}`}
        >
          <FluffyCloudSvg className="w-full h-auto" />
        </motion.div>

      </div>

      {/* Improved Lightning Animations */}
      {isThunder && (
        <>
          <LightningStrike className="absolute left-[42%] top-[65%] w-8 h-16 md:w-9 md:h-18 text-warning drop-shadow-[0_0_15px_rgba(234,179,8,1)] z-0" delay={0} />
          <LightningStrike className="absolute left-[62%] top-[58%] w-6 h-12 md:w-7 md:h-14 text-yellow-200 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] z-0 transform -scale-x-100 rotate-12" delay={0.15} />
          <LightningStrike className="absolute left-[26%] top-[60%] w-5 h-10 md:w-6 md:h-12 text-yellow-100 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] z-0 rotate-[20deg]" delay={0.3} />
        </>
      )}

      {/* Raining Drops Animation */}
      {isRain && (
        <div className="absolute inset-x-8 top-[68%] h-36 overflow-hidden flex justify-around z-0 px-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[1.5px] h-5 bg-gradient-to-b from-accent/0 via-accent/80 to-accent rounded-full"
              initial={{ y: -20, opacity: 0, rotate: 12 }}
              animate={{ 
                y: [0, 150], 
                opacity: [0, 1, 0] 
              }}
              transition={{
                duration: 0.35 + Math.random() * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 0.1 + Math.random() * 0.2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const RoadmapIllustration = () => {
  return (
    <div className="absolute right-[2%] lg:right-[8%] bottom-[5%] md:bottom-[10%] w-56 md:w-80 h-56 md:h-80 pointer-events-none select-none z-10 hidden md:block">
      
      {/* Ambient background glow to make it pop */}
      <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-[70px] -z-10" />

      <svg viewBox="0 0 200 200" className="w-full h-full text-textMain dark:text-white drop-shadow-lg">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        {/* Background Faint Dashed Path */}
        <path 
          d="M 40,160 L 140,160 A 30,30 0 0,0 170,130 A 30,30 0 0,0 140,100 L 60,100 A 30,30 0 0,1 30,70 A 30,30 0 0,1 60,40 L 135,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20 dark:opacity-30"
        />

        {/* Animated Gradient Path */}
        <motion.path 
          d="M 40,160 L 140,160 A 30,30 0 0,0 170,130 A 30,30 0 0,0 140,100 L 60,100 A 30,30 0 0,1 30,70 A 30,30 0 0,1 60,40 L 135,40"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Map Pin (Start) - with floating animation */}
        <motion.g
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
        >
          {/* Shadow of the pin */}
          <motion.ellipse 
            cx="40" cy="165" rx="10" ry="3" 
            fill="black"
            className="opacity-15 dark:opacity-40" 
            animate={{ scale: [1, 0.7, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M 40,160 C 40,160 25,140 25,125 C 25,115 32,110 40,110 C 48,110 55,115 55,125 C 55,140 40,160 40,160 Z" className="fill-surface dark:fill-background" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="40" cy="125" r="5" fill="#3b82f6" />
          </motion.g>
        </motion.g>

        {/* Nodes - Glowing and pulsing */}
        {[
          { cx: 90, cy: 160 },
          { cx: 100, cy: 100 },
          { cx: 97.5, cy: 40 }
        ].map((node, i) => (
          <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.5, type: 'spring' }}>
            {/* Outer pulse ring */}
            <motion.circle 
              cx={node.cx} 
              cy={node.cy} 
              r="12" 
              fill="#3b82f6"
              className="opacity-20"
              animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
            />
            {/* Solid node */}
            <circle 
              cx={node.cx} 
              cy={node.cy} 
              r="7" 
              className="fill-surface dark:fill-background"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx={node.cx} cy={node.cy} r="3" fill="#0ea5e9" />
          </motion.g>
        ))}

        {/* Flag (End) - with floating animation */}
        <motion.g
          initial={{ scale: 0, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 2.5, type: "spring", bounce: 0.5 }}
        >
          {/* Shadow of the flag */}
          <motion.ellipse 
            cx="160" cy="55" rx="8" ry="2.5" 
            fill="black"
            className="opacity-15 dark:opacity-40" 
            animate={{ scale: [1, 0.7, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          />
          <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}>
            {/* Arrow */}
            <path d="M 122,30 L 132,40 L 122,50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Flag Pole */}
            <line x1="160" y1="52" x2="160" y2="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            
            {/* Flag Banner */}
            <path d="M 160,12 L 185,15 L 175,22 L 185,29 L 160,32 Z" fill="#3b82f6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
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
            {/* Background Paths */}
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* Interactive Storm Cloud on the Right */}
            <StormCloud />

            {/* Interactive Roadmap Illustration on the Right */}
            <RoadmapIllustration />

            {/* Content Overlay */}
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
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
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
                        <div
                            className="inline-block group relative bg-gradient-to-b from-primary/20 to-surfaceBorder/50 
                            dark:from-primary/30 dark:to-surfaceBorder p-px rounded-2xl backdrop-blur-lg 
                            overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <Link
                                to="/roadmap"
                                className="rounded-[1.15rem] px-8 py-5 text-lg font-semibold backdrop-blur-md 
                                bg-surface/95 hover:bg-surface dark:bg-background/95 dark:hover:bg-background 
                                text-textMain transition-all duration-300 
                                group-hover:-translate-y-0.5 border border-surfaceBorder/40
                                hover:shadow-md flex items-center justify-center cursor-pointer"
                            >
                                <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                    Start Learning Path
                                </span>
                                <span
                                    className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                    transition-all duration-300"
                                >
                                    →
                                </span>
                            </Link>
                        </div>

                        <a
                            href="#paths"
                            className="px-8 py-5 bg-surface text-textMain rounded-2xl font-semibold hover:border-surfaceBorderHover hover:bg-surfaceHover transition-all border border-surfaceBorder shadow-sm flex items-center justify-center"
                        >
                            Explore Roadmaps
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
