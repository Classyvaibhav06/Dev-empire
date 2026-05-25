import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Globe, Cpu, Shield, Database, Sparkles, Zap, Trophy, Users, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Badge } from '../components/ui/Shared';
import { learningPaths } from '../data/roadmaps';
import { BackgroundPaths } from '../components/ui/background-paths';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [playgroundCode, setPlaygroundCode] = useState(
    `const coder = {\n  name: "Alex",\n  skills: ["React", "Node"],\n  isReady: true\n};\n\nconsole.log(coder.name + " is live! 🚀");`
  );
  const [playgroundOutput, setPlaygroundOutput] = useState('Alex is live! 🚀');

  const runPlaygroundCode = () => {
    let logs = [];
    const customConsole = {
      log: (...args) => {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
      },
      error: (...args) => {
        logs.push(`Error: ${args.join(' ')}`);
      }
    };
    try {
      const run = new Function('console', playgroundCode);
      run(customConsole);
      setPlaygroundOutput(logs.join('\n') || 'Code ran successfully.');
    } catch (err) {
      setPlaygroundOutput(`Error: ${err.message}`);
    }
  };

  const features = [
    { 
      icon: <Zap className="text-warning w-5 h-5" />, 
      title: "Interactive Roadmaps", 
      desc: "Follow structured, visual paths from zero to senior engineer with progress tracking at every node.",
      color: "warning"
    },
    { 
      icon: <Trophy className="text-accent w-5 h-5" />, 
      title: "Gamified Learning", 
      desc: "Earn XP, unlock rare developer badges, and rise in the global leaderboards while doing daily challenges.",
      color: "accent"
    },
    { 
      icon: <Code2 className="text-primary w-5 h-5" />, 
      title: "In-Browser Playground", 
      desc: "Write, test, and run code directly in your browser with instant visual and compiler feedback.",
      color: "primary"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── HERO SECTION ── */}
      <BackgroundPaths title="Master the Digital Empire" />

      {/* ── PATHS SELECTOR ── */}
      <section id="paths" className="py-24 px-4 bg-surfaceLight border-y border-surfaceBorder relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your <span className="text-primary">Destiny</span></h2>
            <p className="text-textMuted">Specialized learning paths designed by industry experts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path) => (
              <Link 
                key={path.id} 
                to="/roadmap" 
                onClick={() => localStorage.setItem('selected_roadmap_path', path.id)}
                className="group block h-full"
              >
                <Card className="cursor-pointer flex flex-col h-full hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-md mb-6 flex items-center justify-center transition-all bg-surfaceLight border border-surfaceBorder group-hover:border-primary/50 shadow-sm" style={{ color: path.color }}>
                    {path.id === 'frontend' && <Globe className="w-6 h-6" />}
                    {path.id === 'backend' && <Database className="w-6 h-6" />}
                    {path.id === 'fullstack' && <Cpu className="w-6 h-6" />}
                    {path.id === 'ai-ml' && <Zap className="w-6 h-6" />}
                  </div>
                  <Badge variant={path.difficulty === 'Beginner' ? 'success' : path.difficulty === 'Intermediate' ? 'warning' : 'danger'} className="mb-4 w-max">
                    {path.difficulty}
                  </Badge>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{path.title}</h3>
                  <p className="text-sm text-textMuted mb-6 flex-grow">{path.description}</p>
                  <div className="flex items-center justify-between text-xs font-semibold text-textDim border-t border-surfaceBorder pt-4 mt-auto">
                    <span>{path.duration}</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> 12k+ Students
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <Badge variant="accent" className="mb-6">Core Ecosystem</Badge>
            <h2 className="text-5xl font-bold mb-8 leading-tight">Everything You Need to <br /> Level Up</h2>
            
            <div className="space-y-4">
              {features.map((f, i) => {
                const isActive = activeFeature === i;
                return (
                  <div 
                    key={i} 
                    onMouseEnter={() => setActiveFeature(i)}
                    className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-surface border-primary/40 shadow-md shadow-primary/5 translate-x-1' 
                        : 'border-transparent hover:bg-surface/50 hover:border-surfaceBorder'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`p-3 rounded-xl border shrink-0 transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary/10 border-primary/30 scale-110' 
                          : 'surface border-surfaceBorder'
                      }`}>
                        {f.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold mb-1 text-textMain">{f.title}</h4>
                        <p className="text-sm text-textMuted leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative h-[480px] flex items-center justify-center">
            {/* Background ambient glow matching the active feature's theme color */}
            <div className={`absolute -inset-10 rounded-full blur-[100px] transition-all duration-700 opacity-20 ${
              activeFeature === 0 ? 'bg-warning/80' : activeFeature === 1 ? 'bg-accent/80' : 'bg-primary/80'
            }`} />

            <div className="w-full h-full bg-surface border border-surfaceBorder rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10">
              {/* Mock Window Titlebar */}
              <div className="px-5 py-4 border-b border-surfaceBorder bg-surfaceLight flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
                <span className="text-[10px] text-textDim font-mono ml-4 uppercase tracking-widest">
                  {activeFeature === 0 ? 'roadmap_visualizer.sh' : activeFeature === 1 ? 'gamification_leaderboard.db' : 'sandbox_playground.js'}
                </span>
              </div>

              {/* Dynamic Content Switching with Framer Motion */}
              <div className="flex-1 p-8 overflow-y-auto relative select-text font-sans flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {activeFeature === 0 && (
                    <motion.div
                      key="roadmap"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-center items-center gap-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-success/15 border border-success/30 text-success text-xs font-bold flex items-center gap-1.5 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          Internet Basics
                        </div>
                        <div className="w-8 h-0.5 bg-surfaceBorder" />
                        <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm">
                          HTTP / HTTPS
                        </div>
                      </div>
                      
                      <div className="h-8 w-px bg-surfaceBorder" />

                      <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-background border border-surfaceBorder text-textMuted text-xs font-bold opacity-60">
                          DNS System
                        </div>
                        <div className="w-8 h-0.5 bg-surfaceBorder" />
                        <div className="px-4 py-2 rounded-xl bg-background border border-surfaceBorder text-textMuted text-xs font-bold opacity-60">
                          Browsers
                        </div>
                      </div>
                      
                      <p className="text-xs text-textMuted text-center max-w-xs mt-4">
                        Step-by-step learning nodes connect logically to form your master path. Track progress natively.
                      </p>
                    </motion.div>
                  )}

                  {activeFeature === 1 && (
                    <motion.div
                      key="leaderboard"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-center space-y-4"
                    >
                      <div className="text-xs font-black text-accent uppercase tracking-widest text-center mb-2">XP Boost Leaderboard</div>
                      <div className="space-y-2.5">
                        {[
                          { rank: '👑', name: 'Alex River', xp: '12,450 XP', level: 'Lvl 42' },
                          { rank: '2', name: 'Sophia Chen', xp: '10,200 XP', level: 'Lvl 38' },
                          { rank: '3', name: 'Liam Dev', xp: '9,850 XP', level: 'Lvl 35' }
                        ].map((user, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-surfaceBorder hover:border-accent/40 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="w-6 text-center text-xs font-black">{user.rank}</span>
                              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent uppercase">{user.name.split(' ').map(n=>n[0]).join('')}</div>
                              <span className="text-xs font-bold text-textMain">{user.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] bg-accent/15 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-black uppercase">{user.level}</span>
                              <span className="text-xs font-bold text-textMuted">{user.xp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeFeature === 2 && (
                    <motion.div
                      key="playground"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="h-full flex flex-col justify-between font-mono text-xs"
                    >
                      {/* Code Editor Container */}
                      <div className="bg-background border border-surfaceBorder rounded-xl p-4 text-accent overflow-hidden my-auto flex flex-col relative group/editor">
                        <div className="text-textDim text-[10px] mb-2 flex justify-between items-center select-none">
                          <span>// index.js (Editable!)</span>
                        </div>
                        <textarea
                          value={playgroundCode}
                          onChange={(e) => setPlaygroundCode(e.target.value)}
                          className="w-full h-24 bg-transparent text-textMain border-none focus:ring-0 focus:outline-none resize-none font-mono text-xs leading-relaxed"
                          spellCheck="false"
                        />
                      </div>

                      {/* Action Bar */}
                      <div className="flex justify-between items-center my-3 select-none">
                        <span className="text-[10px] text-textDim font-mono">// Edit the code above and run</span>
                        <button
                          onClick={runPlaygroundCode}
                          type="button"
                          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" /> Run Code
                        </button>
                      </div>
                      
                      {/* Console Output Panel */}
                      <div className="p-3 bg-success/15 border border-success/30 rounded-xl text-success flex items-center gap-2 font-mono select-text">
                        <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shrink-0" />
                        <span className="break-all">&gt; Output: {playgroundOutput}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Premium Floaties matching current theme */}
            <div className="absolute -top-6 -right-6 surface border border-surfaceBorder p-4 rounded-2xl shadow-lg z-20">
               <Shield className="w-6 h-6 text-success animate-bounce" />
            </div>
            <div className="absolute -bottom-6 -left-6 surface border border-surfaceBorder p-4 rounded-2xl shadow-lg z-20">
               <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
