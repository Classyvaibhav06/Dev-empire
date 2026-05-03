import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, CircleDashed, Layout, Map, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex-1 flex items-center justify-center min-h-[90vh] px-4 overflow-hidden">

      {/* ── UPPER LEFT: Yellow sticky note ── */}
      <div className="hidden lg:block absolute top-10 left-10 bg-[#fef08a] w-52 p-5 rounded-lg shadow-lg -rotate-6 border border-yellow-200 z-10">
        <div className="w-4 h-4 rounded-full bg-red-400 absolute -top-2 left-1/2 -translate-x-1/2 shadow"></div>
        <div className="flex items-center gap-1.5 mb-2">
          <Map className="w-4 h-4 text-amber-800 shrink-0" />
          <span className="font-bold text-amber-900 text-base" style={{ fontFamily: "'Caveat', cursive" }}>
            Structured Roadmap
          </span>
        </div>
        <p className="text-amber-900 text-sm leading-snug" style={{ fontFamily: "'Caveat', cursive" }}>
          Follow a step-by-step path from beginner to advanced with no confusion.
        </p>
      </div>

      {/* ── MID LEFT: small code icon badge ── */}
      <div className="hidden lg:block absolute top-1/2 left-[6%] -translate-y-1/2 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 z-10">
        <div className="bg-primary text-white p-1.5 rounded-lg">
          <Code2 className="w-5 h-5" />
        </div>
      </div>

      {/* ── UPPER RIGHT: Track Progress card ── */}
      <div className="hidden lg:block absolute top-10 right-10 bg-white w-60 p-5 rounded-2xl shadow-lg border border-gray-100 rotate-2 z-10">
        <h4 className="font-bold text-textMain mb-3 text-sm">Track Progress</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-sm border border-gray-100">
            <span className="font-semibold text-textMain">HTML Basics</span>
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          </div>
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-sm border border-gray-100">
            <span className="font-semibold text-textMain">CSS Basics</span>
            <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
          </div>
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-sm border border-gray-100 opacity-50">
            <span className="font-medium text-textMuted">JavaScript</span>
            <CircleDashed className="w-4 h-4 text-gray-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* ── LOWER LEFT: Today's Learning card ── */}
      <div className="hidden lg:block absolute bottom-10 left-10 bg-white w-64 p-5 rounded-2xl shadow-lg border border-gray-100 z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-purple-50 p-1.5 rounded-lg">
            <Layout className="w-4 h-4 text-purple-500" />
          </div>
          <h4 className="font-bold text-textMain text-sm">Today's Learning</h4>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-textMain">Complete HTML Basics</p>
              <p className="text-[10px] text-textMuted mt-0.5">Watch 2 videos</p>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
            <div>
              <p className="text-xs font-semibold text-textMain">Build your first webpage</p>
              <p className="text-[10px] text-textMuted mt-0.5">Practice project</p>
            </div>
          </li>
        </ul>
      </div>

      {/* ── LOWER RIGHT: Roadmap path preview ── */}
      <div className="hidden lg:block absolute bottom-10 right-10 bg-white w-60 p-5 rounded-2xl shadow-lg border border-gray-100 z-10">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Learning Path</p>
        <div className="flex flex-col gap-2">
          {[
            { name: 'HTML', done: true },
            { name: 'CSS', done: false },
            { name: 'JavaScript', done: false },
            { name: 'React', done: false },
          ].map((step, i) => (
            <div key={step.name} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${step.done ? 'bg-primary text-white' : 'bg-gray-100 text-textMuted'}`}>
                {i + 1}
              </div>
              <span className={`text-xs font-semibold ${step.done ? 'text-textMain' : 'text-textMuted'}`}>{step.name}</span>
              {step.done && <CheckCircle2 className="w-3 h-3 text-success ml-auto" />}
            </div>
          ))}
        </div>
      </div>

      {/* ══ HERO — perfectly centered, clear of all cards ══ */}
      <div className="relative z-20 text-center max-w-2xl mx-auto space-y-6">
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#111111',
          }}
        >
          Learn Coding with a{' '}
          <br />
          <span
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Clear Roadmap
          </span>
        </h1>

        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
            fontSize: '1.05rem',
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: '30rem',
            margin: '0 auto',
          }}
        >
          Step-by-step learning paths, curated videos, and real-world projects — all in one place.
        </p>

        <Link
          to="/roadmap"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-base"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
        >
          Start Learning
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>


    </div>
  );
}
