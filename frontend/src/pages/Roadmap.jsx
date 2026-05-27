import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2,
  Globe,
  Database,
  Cpu,
  Zap,
  ChevronRight,
  Layout,
  Lock,
  X,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  FolderOpen,
  Lightbulb,
  PlayCircle,
  Send,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Card, Badge } from '../components/ui/Shared';
import { learningPaths } from '../data/roadmaps';
import TopicCard from '../components/TopicCard';
import ProgressBar from '../components/ProgressBar';
import { getTopicById } from '../utils/topicContent';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export default function Roadmap() {
  const { token } = useContext(AuthContext);
  const [selectedPath, setSelectedPath] = useState(() => {
    const saved = localStorage.getItem('selected_roadmap_path');
    if (saved) {
      const found = learningPaths.find(p => p.id === saved);
      if (found) return found;
    }
    return learningPaths[0];
  });
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem('codepath_completed');
      if (saved) setCompletedTopics(JSON.parse(saved));
    };
    loadProgress();
    window.addEventListener('userProgressSynced', loadProgress);
    return () => window.removeEventListener('userProgressSynced', loadProgress);
  }, []);

  const handleSelectTopic = (topic) => {
    console.log("Selected topic node inside Roadmap.jsx:", topic);
    const detailed = getTopicById(topic.id);
    console.log("Resolved detailed topic:", detailed);
    setActiveTopic(detailed);
  };

  const toggleTopicCompletion = async (topicId) => {
    console.log("Toggling completion for topic:", topicId);
    const saved = localStorage.getItem('codepath_completed');
    let completed = saved ? JSON.parse(saved) : [];
    const isCompletedNow = !completed.includes(topicId);

    if (completed.includes(topicId)) {
      completed = completed.filter(id => id !== topicId);
    } else {
      completed = [...completed, topicId];
    }

    localStorage.setItem('codepath_completed', JSON.stringify(completed));
    setCompletedTopics(completed);

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/user/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ topicId, completed: isCompletedNow })
        });
      } catch (e) {
        console.error('Failed to sync progress to DB:', e);
      }
    }
  };

  const calculateProgress = (path) => {
    const allTopics = path.sections.flatMap(s => s.topics);
    if (allTopics.length === 0) return 0;
    const completed = allTopics.filter(t => completedTopics.includes(t.id)).length;
    return (completed / allTopics.length) * 100;
  };

  if (loading) return (
    <div className="flex-1 flex justify-center items-center py-20">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 w-full relative z-10">
      {/* ── HEADER ── */}
      <div className="text-center mb-16 animate-fade-in">
        <Badge variant="primary" className="mb-4">Path Selection</Badge>
        <h1 className="text-5xl font-black mb-4 tracking-tighter">Your <span className="text-primary">Learning Journey</span></h1>
        <p className="text-textMuted max-w-xl mx-auto">Choose a specialized path and master the skills through our structured, interactive roadmaps.</p>
      </div>

      {/* ── PATH SELECTOR ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20 animate-slide-up">
        {learningPaths.map((path) => {
          const isActive = selectedPath.id === path.id;
          const progress = calculateProgress(path);
          
          return (
            <button
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className={`text-left transition-all relative ${isActive ? '' : 'opacity-70 hover:opacity-100'}`}
            >
              <Card className={`!p-4 ${isActive ? 'border-primary' : 'border-surfaceBorder'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'bg-surfaceHover text-textMuted'}`}>
                    {path.id === 'frontend' && <Globe className="w-4 h-4" />}
                    {path.id === 'backend' && <Database className="w-4 h-4" />}
                    {path.id === 'fullstack' && <Cpu className="w-4 h-4" />}
                    {path.id === 'ai-ml' && <Zap className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{path.title}</h3>
                    <div className="h-1 w-full bg-surfaceHover rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* ── ROADMAP DISPLAY ── */}
      <div className="animate-slide-up delay-200">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
           <div className="max-w-lg">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {selectedPath.id === 'frontend' && <Globe className="w-6 h-6" />}
                  {selectedPath.id === 'backend' && <Database className="w-6 h-6" />}
                  {selectedPath.id === 'fullstack' && <Cpu className="w-6 h-6" />}
                  {selectedPath.id === 'ai-ml' && <Zap className="w-6 h-6" />}
                </div>
                <h2 className="text-3xl font-bold">{selectedPath.title}</h2>
             </div>
             <p className="text-textMuted">{selectedPath.description}</p>
           </div>
           <div className="w-full md:w-64 surface p-4 rounded-xl border border-surfaceBorder">
              <ProgressBar progress={calculateProgress(selectedPath)} />
           </div>
        </div>

        {selectedPath.sections.length > 0 ? (
          <div className="space-y-16 relative">
            {/* Connection line */}
            <div className="absolute left-6 top-10 bottom-10 w-px bg-surfaceBorder hidden md:block" />

            {selectedPath.sections.map((section, sIdx) => (
              <div key={section.id} className="relative">
                <div className="flex items-center gap-6 mb-8">
                   <div className="w-12 h-12 rounded-xl bg-surface border border-primary z-10 flex items-center justify-center">
                      <span className="font-black text-primary">{String(sIdx + 1).padStart(2, '0')}</span>
                   </div>
                   <h3 className="text-2xl font-black tracking-tight">{section.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:pl-16">
                  {section.topics.map(topic => (
                    <TopicCard 
                      key={topic.id} 
                      topic={topic} 
                      isCompleted={completedTopics.includes(topic.id)} 
                      onSelect={handleSelectTopic}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="py-20 text-center">
             <div className="w-20 h-20 rounded-full bg-surfaceHover flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-textDim" />
             </div>
             <h3 className="text-2xl font-bold mb-2">Curriculum in Progress</h3>
             <p className="text-textMuted max-w-sm mx-auto">This path is currently being crafted by our architects. Stay tuned for the release!</p>
             <button className="mt-8 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                Notify Me
             </button>
          </Card>
        )}
      </div>

      {/* ── TOPIC DETAILS DRAWER (roadmap.sh style) ── */}
      {activeTopic && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-300 opacity-100 animate-fade-in"
            onClick={() => {
              setActiveTopic(null);
            }}
          />
          <TopicDrawerContent 
            activeTopic={activeTopic}
            setActiveTopic={setActiveTopic}
            completedTopics={completedTopics}
            toggleTopicCompletion={toggleTopicCompletion}
          />
        </>
      )}
    </div>
  );
}

function TopicDrawerContent({ activeTopic, setActiveTopic, completedTopics, toggleTopicCompletion }) {
  const [drawerTab, setDrawerTab] = useState('resources');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const isCompleted = completedTopics.includes(activeTopic.id);

  const getSystemPrompt = () => {
    return `You are the Dev Empire AI Study Mentor, an expert programming assistant specializing in "${activeTopic.title}".
Your goal is to help students master this specific topic.

Here is the context of the curriculum the student is viewing:
- Topic Title: ${activeTopic.title}
- Topic Level: ${activeTopic.level || 'General'}
- Topic Description: ${activeTopic.description}
- Key Concepts covered:
${activeTopic.keyConcepts?.map((c) => `  * ${c}`).join('\n')}

Guide the student step-by-step. Keep explanations clear, engaging, and in line with this topic context. Respond using markdown formatting.`;
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    const userMsgText = inputMessage;
    setInputMessage('');
    setIsGenerating(true);

    const newUserMsg = { role: 'user', content: userMsgText };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);

    const newAssistantMsg = { role: 'assistant', content: '' };
    setChatHistory((prev) => [...prev, newAssistantMsg]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...updatedHistory
          ],
          mode: 'fast'
        })
      });

      if (!response.ok) throw new Error('Failed to connect to AI');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              setChatHistory((prev) => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    { ...last, content: last.content + (data.content || '') }
                  ];
                }
                return prev;
              });
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, content: 'Sorry, I encountered an error. Please try again.' }
          ];
        }
        return prev;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 z-[100] w-full max-w-lg bg-surface border-l border-surfaceBorder shadow-2xl flex flex-col transition-transform duration-300 translate-x-0 animate-slide-up">
      {/* Tabbed Header */}
      <div className="p-4 border-b border-surfaceBorder flex items-center justify-between bg-surfaceLight shrink-0">
        <div className="flex bg-background border border-surfaceBorder rounded-lg p-0.5 select-none">
          <button
            onClick={() => setDrawerTab('resources')}
            className={`px-4 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              drawerTab === 'resources'
                ? 'bg-surfaceLight text-textMain border border-surfaceBorder shadow-sm'
                : 'text-textDim hover:text-textMuted'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Resources
          </button>
          <button
            onClick={() => setDrawerTab('tutor')}
            className={`px-4 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              drawerTab === 'tutor'
                ? 'bg-surfaceLight text-textMain border border-surfaceBorder shadow-sm'
                : 'text-textDim hover:text-textMuted'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            AI Tutor
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Dropdown selector */}
          <select 
            value={isCompleted ? 'done' : 'pending'}
            onChange={() => toggleTopicCompletion(activeTopic.id)}
            className="bg-background border border-surfaceBorder rounded-lg px-2.5 py-1.5 text-xs font-bold text-textMuted focus:outline-none cursor-pointer hover:border-primary/50 transition-all"
          >
            <option value="pending">● Pending</option>
            <option value="done">● Done</option>
          </select>

          <button 
            onClick={() => {
              setActiveTopic(null);
              setDrawerTab('resources');
            }}
            className="p-2 rounded-full hover:bg-surfaceHover text-textMuted hover:text-textMain transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-6 bg-background/25">
        {drawerTab === 'resources' ? (
          <>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={activeTopic.level === 'Beginner' ? 'success' : activeTopic.level === 'Advanced' ? 'danger' : 'warning'}>
                  {activeTopic.level || 'General'}
                </Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-textMain">{activeTopic.title}</h1>
              <p className="text-sm text-textMuted leading-relaxed mt-3">{activeTopic.description}</p>
            </div>

            {/* Mental Model Analogy */}
            {activeTopic.analogy && (
              <Card className="!bg-primary/5 border-primary/20 !p-5" hover={false}>
                <div className="flex gap-4">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-black uppercase tracking-wider text-primary mb-1">Analogy Model: {activeTopic.analogy.concept}</h5>
                    <p className="text-xs text-textMuted leading-relaxed">{activeTopic.analogy.explanation}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Key Concepts (Sub-Nodes) */}
            {activeTopic.keyConcepts && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Key Concepts (Sub-Nodes)</h4>
                <div className="space-y-2">
                  {activeTopic.keyConcepts.map((concept, index) => (
                    <Link 
                      key={index}
                      to={`/topic/${activeTopic.id}/concept/${index}`}
                      onClick={() => setActiveTopic(null)}
                      className="flex items-center justify-between p-3.5 bg-surface border border-surfaceBorder rounded-xl hover:border-primary/50 group transition-all"
                    >
                      <span className="text-xs font-bold text-textMain group-hover:text-primary transition-all pr-2 truncate">{concept}</span>
                      <ChevronRight className="w-4 h-4 text-textDim group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Recommended build */}
            {activeTopic.project && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Recommended practice build</h4>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h5 className="text-sm font-bold text-textMain flex items-center gap-1.5">
                      <FolderOpen className="w-4 h-4 text-accent" />
                      {activeTopic.project.title}
                    </h5>
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      Practice Project
                    </span>
                  </div>
                  <p className="text-xs text-textMuted leading-relaxed">{activeTopic.project.description}</p>
                </div>
              </section>
            )}

            {/* Free Resources list */}
            {activeTopic.resources && activeTopic.resources.length > 0 && (
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-textDim mb-3">Free Resources</h4>
                <div className="grid grid-cols-1 gap-2">
                  {activeTopic.resources.map((res, index) => (
                    <a 
                      key={index}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-surface border border-surfaceBorder rounded-xl hover:border-primary group transition-all text-xs"
                    >
                      <span className="font-semibold text-textMuted group-hover:text-primary transition-colors flex-center gap-2">
                        <BookOpen className="w-4 h-4 text-textMuted" />
                        {res.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-textDim font-bold bg-surfaceHover px-2 py-0.5 rounded border border-surfaceBorder">
                        {res.type || 'Article'}
                      </span>
                    </a>
                  ))}
                  
                  {activeTopic.videos?.map((vidUrl, index) => {
                    const isEmbed = vidUrl.includes('embed/');
                    const watchUrl = isEmbed ? vidUrl.replace('embed/', 'watch?v=') : vidUrl;
                    const labels = ['Crash Course', 'Full Tutorial', 'Deep Dive'];
                    const label = labels[index] || `Video ${index + 1}`;
                    return (
                      <a 
                        key={`vid-${index}`}
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 bg-background/50 border border-surfaceBorder rounded-xl hover:border-red-500/40 group transition-all text-xs"
                      >
                        <span className="font-semibold text-textMuted group-hover:text-red-400 transition-colors flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-red-500" />
                          YouTube: {label}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                          Video
                        </span>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        ) : (
          /* AI Tutor Chat */
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[300px]">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none opacity-80 py-16">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm mb-1 text-textMain">Topic Study Mentor</h4>
                  <p className="text-xs text-textMuted max-w-xs leading-relaxed">
                    Ask any questions about "{activeTopic.title}". I'll guide you step-by-step through the core concepts.
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <span className={`text-[9px] font-black uppercase tracking-wider text-textDim mb-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.role === 'user' ? 'Student' : 'Mentor'}
                    </span>
                    <div 
                      className={`p-3.5 border rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-primary/5 border-primary/20 text-textMain rounded-tr-sm'
                          : 'bg-surface border-surfaceBorder text-textMain rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.role === 'assistant' && !msg.content ? (
                        <div className="flex items-center gap-1 text-textDim py-1 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce"></div>
                        </div>
                      ) : (
                        msg.role === 'user' ? <p className="text-xs whitespace-pre-wrap">{msg.content}</p> : formatMessageContent(msg.content)
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSendChat} className="flex gap-2 border-t border-surfaceBorder pt-4 mt-4 shrink-0 bg-surface/40 p-2 rounded-xl">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isGenerating}
                placeholder="Ask about this topic..."
                className="flex-1 px-4 py-2.5 bg-background border border-surfaceBorder rounded-full text-xs text-textMain placeholder-textDim focus:outline-none focus:border-primary transition-all disabled:opacity-60"
              />
              <button 
                type="submit"
                disabled={!inputMessage.trim() || isGenerating}
                className="p-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-all flex items-center justify-center shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Deep dive */}
      <div className="p-4 border-t border-surfaceBorder bg-surface shrink-0 flex justify-end pr-24">
        <Link 
          to={`/topic/${activeTopic.id}`}
          onClick={() => setActiveTopic(null)}
          className="px-5 py-2.5 bg-surface border border-surfaceBorder hover:bg-surfaceHover text-textMain font-bold rounded-xl text-xs uppercase tracking-widest transition-all flex items-center gap-2"
        >
          Deep Dive Study
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function formatMessageContent(text) {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, partIndex) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : '';
      const code = match ? match[2] : part.slice(3, -3);

      return (
        <pre key={partIndex} className="bg-background border border-surfaceBorder rounded-xl p-4 font-mono text-xs my-3 overflow-x-auto text-accent animate-scale-in">
          {language && <div className="text-[9px] uppercase tracking-widest text-textDim font-bold mb-2">{language}</div>}
          <code>{code.trim()}</code>
        </pre>
      );
    }

    const lines = part.split('\n');
    const elements = [];
    let currentList = null;

    const flushList = (key) => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={`ul-${key}`} className="list-disc pl-5 my-2 text-sm text-textMuted leading-relaxed space-y-1">
              {currentList.items.map((item, idx) => (
                <li key={idx}>{renderInlineFormatting(item)}</li>
              ))}
            </ul>
          );
        } else if (currentList.type === 'ol') {
          elements.push(
            <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 text-sm text-textMuted leading-relaxed space-y-1">
              {currentList.items.map((item, idx) => (
                <li key={idx} value={item.num}>{renderInlineFormatting(item.content)}</li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        flushList(i);
        if (elements.length > 0 && i < lines.length - 1 && lines[i+1].trim()) {
          elements.push(<div key={`space-${i}`} className="h-2" />);
        }
        continue;
      }

      if (trimmed.startsWith('### ')) {
        flushList(i);
        elements.push(
          <h4 key={`h4-${i}`} className="text-sm font-black text-textMain mt-4 mb-1">
            {renderInlineFormatting(trimmed.slice(4))}
          </h4>
        );
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList(i);
        elements.push(
          <h3 key={`h3-${i}`} className="text-base font-black text-textMain mt-5 mb-1.5">
            {renderInlineFormatting(trimmed.slice(3))}
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushList(i);
        elements.push(
          <h2 key={`h2-${i}`} className="text-lg font-black text-textMain mt-6 mb-2">
            {renderInlineFormatting(trimmed.slice(2))}
          </h2>
        );
        continue;
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const itemContent = trimmed.slice(2);
        if (currentList && currentList.type === 'ul') {
          currentList.items.push(itemContent);
        } else {
          flushList(i);
          currentList = { type: 'ul', items: [itemContent] };
        }
        continue;
      }

      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        const num = parseInt(numMatch[1], 10);
        const itemContent = numMatch[2];
        if (currentList && currentList.type === 'ol') {
          currentList.items.push({ num, content: itemContent });
        } else {
          flushList(i);
          currentList = { type: 'ol', items: [{ num, content: itemContent }] };
        }
        continue;
      }

      flushList(i);
      elements.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed text-textMuted mb-2">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }

    flushList(lines.length);
    return <div key={partIndex}>{elements}</div>;
  });
}

function renderInlineFormatting(text) {
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((codePart, codeIndex) => {
    if (codePart.startsWith('`') && codePart.endsWith('`')) {
      return (
        <code key={codeIndex} className="bg-background border border-surfaceBorder px-1.5 py-0.5 rounded text-accent font-mono text-[11px] mx-0.5">
          {codePart.slice(1, -1)}
        </code>
      );
    }

    const boldParts = codePart.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((boldPart, boldIndex) => {
      if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
        return (
          <strong key={boldIndex} className="font-extrabold text-textMain">
            {boldPart.slice(2, -2)}
          </strong>
        );
      }
      return boldPart;
    });
  });
}
