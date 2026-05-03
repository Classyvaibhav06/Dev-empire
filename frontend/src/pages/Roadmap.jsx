import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, PlayCircle, FolderOpen, Loader2, ChevronRight } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

const SECTION_COLORS = [
  { bg: 'bg-orange-100',  border: 'border-orange-300',  text: 'text-orange-700',  dot: 'bg-orange-400',  line: '#fb923c' },
  { bg: 'bg-blue-100',    border: 'border-blue-300',    text: 'text-blue-700',    dot: 'bg-blue-400',    line: '#60a5fa' },
  { bg: 'bg-violet-100',  border: 'border-violet-300',  text: 'text-violet-700',  dot: 'bg-violet-400',  line: '#a78bfa' },
  { bg: 'bg-yellow-100',  border: 'border-yellow-300',  text: 'text-yellow-700',  dot: 'bg-yellow-400',  line: '#facc15' },
  { bg: 'bg-green-100',   border: 'border-green-300',   text: 'text-green-700',   dot: 'bg-green-400',   line: '#4ade80' },
  { bg: 'bg-pink-100',    border: 'border-pink-300',    text: 'text-pink-700',    dot: 'bg-pink-400',    line: '#f472b6' },
  { bg: 'bg-cyan-100',    border: 'border-cyan-300',    text: 'text-cyan-700',    dot: 'bg-cyan-400',    line: '#22d3ee' },
];

function TopicNode({ topic, isCompleted, colorIdx }) {
  const c = SECTION_COLORS[colorIdx % SECTION_COLORS.length];
  return (
    <Link
      to={`/topic/${topic.id}`}
      className={`group flex items-start gap-3 bg-white border-2 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 w-full ${
        isCompleted ? 'border-green-300' : `border-gray-200 hover:${c.border}`
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isCompleted
          ? <CheckCircle2 className="w-5 h-5 text-success" />
          : <Circle className={`w-5 h-5 text-gray-300 group-hover:${c.text} transition-colors`} />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm text-textMain group-hover:${c.text} transition-colors leading-tight`}>
          {topic.title}
        </p>
        <p className="text-xs text-textMuted mt-1 line-clamp-1">{topic.description}</p>
        <div className="flex items-center gap-3 mt-2">
          {topic.videos?.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-textMuted">
              <PlayCircle className="w-3 h-3" /> {topic.videos.length} videos
            </span>
          )}
          {topic.project && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-textMuted">
              <FolderOpen className="w-3 h-3" /> 1 project
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
    </Link>
  );
}

function RoadmapNode({ section, completedTopics, colorIdx, isLast }) {
  const c = SECTION_COLORS[colorIdx % SECTION_COLORS.length];
  const completedCount = section.topics.filter(t => completedTopics.includes(t.id)).length;
  const total = section.topics.length;

  return (
    <div className="flex flex-col items-center w-full">

      {/* ── Section milestone pill ── */}
      <div className="relative flex flex-col items-center z-10 mb-6">
        {/* Glow ring */}
        <div className={`w-5 h-5 rounded-full ${c.dot} ring-4 ring-white shadow-md mb-3`} />
        <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 ${c.bg} ${c.border} shadow-sm`}>
          <span className={`text-sm font-extrabold tracking-tight ${c.text}`}>
            {section.order}. {section.title}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 ${c.text}`}>
            {completedCount}/{total}
          </span>
        </div>
      </div>

      {/* ── Topic cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl mb-6 px-4">
        {section.topics.map(topic => (
          <TopicNode
            key={topic.id || topic.title}
            topic={topic}
            isCompleted={completedTopics.includes(topic.id)}
            colorIdx={colorIdx}
          />
        ))}
      </div>

      {/* ── Connector arrow to next section ── */}
      {!isLast && (
        <div className="flex flex-col items-center mb-2">
          <div className="w-0.5 h-8 bg-gray-300" />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M6 8L0 0h12L6 8z" fill="#d1d5db" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function Roadmap() {
  const [roadmapData, setRoadmapData] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/roadmap')
      .then(res => res.json())
      .then(data => { setRoadmapData(data); setLoading(false); })
      .catch(() => setLoading(false));

    const saved = localStorage.getItem('codepath_completed');
    if (saved) setCompletedTopics(JSON.parse(saved));
  }, []);

  if (loading) return (
    <div className="flex-1 flex justify-center items-center py-20">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  if (!roadmapData?.sections) return (
    <div className="flex-1 flex justify-center items-center py-20 text-textMuted">
      Failed to load roadmap data.
    </div>
  );

  const totalTopics = roadmapData.sections.reduce((acc, s) => acc + s.topics.length, 0);
  const progress = totalTopics === 0 ? 0 : (completedTopics.length / totalTopics) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full">

      {/* ── Header ── */}
      <div className="text-center mb-14">
        <span className="inline-block bg-white border border-gray-200 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-primary mb-4 uppercase tracking-widest">
          Developer Roadmap
        </span>
        <h1
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, letterSpacing: '-0.03em' }}
          className="text-4xl md:text-5xl text-textMain mb-3"
        >
          {roadmapData.roadmap}
        </h1>
        <p className="text-textMuted text-base max-w-xl mx-auto mb-8 leading-relaxed">
          {roadmapData.description}
        </p>
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm max-w-md mx-auto">
          <ProgressBar progress={progress} />
          <p className="text-xs text-textMuted mt-3 text-center">
            {completedTopics.length} of {totalTopics} topics completed
          </p>
        </div>
      </div>

      {/* ── START node ── */}
      <div className="flex flex-col items-center mb-4">
        <div className="bg-textMain text-white text-xs font-extrabold tracking-widest uppercase px-5 py-2 rounded-full shadow-md">
          START
        </div>
        <div className="w-0.5 h-8 bg-gray-300 mt-2" />
      </div>

      {/* ── Roadmap flow ── */}
      <div className="flex flex-col items-center w-full">
        {roadmapData.sections.map((section, idx) => (
          <RoadmapNode
            key={section.id || section.title}
            section={section}
            completedTopics={completedTopics}
            colorIdx={idx}
            isLast={idx === roadmapData.sections.length - 1}
          />
        ))}
      </div>

      {/* ── END node ── */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-0.5 h-8 bg-gray-300" />
        <div className="bg-success text-white text-xs font-extrabold tracking-widest uppercase px-5 py-2 rounded-full shadow-md">
          🎉 DONE
        </div>
      </div>

    </div>
  );
}
