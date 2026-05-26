import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Code2,
  FolderOpen,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
  PlayCircle,
  Share2,
  Target,
  Terminal,
  Zap,
  X,
  Send,
  Trash2,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Card, Badge } from '../components/ui/Shared';
import { getTopicById } from '../utils/topicContent';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export default function TopicDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [topic, setTopic] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('learn');
  const [quizAnswers, setQuizAnswers] = useState({});

  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAiMode] = useState(() => localStorage.getItem('mentor_ai_mode') || 'fast');

  const handleAiModeChange = (mode) => {
    setAiMode(mode);
    localStorage.setItem('mentor_ai_mode', mode);
  };

  useEffect(() => {
    setLoading(true);
    const foundTopic = getTopicById(id);
    setTopic(foundTopic);
    setQuizAnswers({});

    const saved = localStorage.getItem('codepath_completed');
    const completedTopics = saved ? JSON.parse(saved) : [];
    setIsCompleted(completedTopics.includes(id));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (chatOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('drawer-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('drawer-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('drawer-open');
    };
  }, [chatOpen]);

  const progressItems = useMemo(() => {
    if (!topic) return [];
    return [
      { label: 'Concepts', value: topic.keyConcepts?.length || 0 },
      { label: 'Examples', value: topic.lessons?.length || 0 },
      { label: 'Quiz', value: topic.practice?.length || 0 },
      { label: 'Resources', value: topic.resources?.length || 0 }
    ];
  }, [topic]);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleComplete = async () => {
    const saved = localStorage.getItem('codepath_completed');
    let completedTopics = saved ? JSON.parse(saved) : [];
    const isCompletedNow = !isCompleted;

    if (isCompleted) {
      completedTopics = completedTopics.filter((topicId) => topicId !== id);
      showToast("Topic marked as incomplete.");
    } else {
      completedTopics = [...new Set([...completedTopics, id])];
      showToast("🎉 Topic marked as completed!");
    }

    localStorage.setItem('codepath_completed', JSON.stringify(completedTopics));
    setIsCompleted(isCompletedNow);

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/api/user/progress`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ topicId: id, completed: isCompletedNow })
        });
      } catch (e) {
        console.error('Failed to sync progress to DB:', e);
      }
    }
  };

  const getSystemPrompt = () => {
    if (!topic) return '';
    return `You are the Dev Empire AI Study Mentor, an expert programming assistant specializing in "${topic.title}".
Your goal is to help students master this specific topic.

Here is the context of the curriculum the student is viewing:
- Topic Title: ${topic.title}
- Topic Level: ${topic.level || 'General'}
- Topic Description: ${topic.description}
- Key Concepts covered:
${topic.keyConcepts?.map((c, i) => `  * ${c}`).join('\n')}
- Intended outcomes:
${topic.outcomes?.map((o, i) => `  * ${o}`).join('\n')}
- Lessons and code examples:
${topic.lessons?.map((l, i) => `Lesson ${i+1}: ${l.title}\n${l.body}\nCode:\n${l.code || 'None'}`).join('\n\n')}
- Quick Syntax Reference:
${topic.syntax?.map((s) => `  * ${s}`).join('\n')}
- Common Mistakes & corrections:
${topic.commonMistakes?.map((m) => `  * Mistake: ${m.mistake}\n    Fix: ${m.correction}`).join('\n')}

Guide the student step-by-step. Keep explanations clear, engaging, and in line with this topic context. Provide helpful code examples if requested. When displaying code, use markdown syntax highlighting. Always stay inside the context of the curriculum. Respond using markdown formatting.`;
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

    const newAssistantMsg = { role: 'assistant', content: '', reasoning: '' };
    setChatHistory((prev) => [...prev, newAssistantMsg]);

    try {
      const systemPrompt = getSystemPrompt();
      const payloadMessages = [
        { role: 'system', content: systemPrompt },
        ...updatedHistory
      ];

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: payloadMessages,
          mode: aiMode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI mentor.');
      }

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
          if (!trimmed) continue;
          if (trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              
              if (data.error) {
                throw new Error(data.error);
              }

              setChatHistory((prev) => {
                if (prev.length === 0) return prev;
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...last,
                      content: last.content + (data.content || ''),
                      reasoning: last.reasoning + (data.reasoning || '')
                    }
                  ];
                }
                return prev;
              });
            } catch (err) {
              console.error('Failed to parse line:', line, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, content: 'Sorry, I encountered an error while retrieving the response. Please try again.' }
          ];
        }
        return prev;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startAiTutorSession = async (conceptName) => {
    setChatOpen(true);
    setIsGenerating(true);

    const cleanConceptName = conceptName.split('(')[0].trim();
    const userMsgText = `I want to focus on learning about "${cleanConceptName}" under the topic "${topic.title}". Please guide me step-by-step with clear explanations and code examples!`;
    const newUserMsg = { role: 'user', content: userMsgText };
    const updatedHistory = [...chatHistory, newUserMsg];
    setChatHistory(updatedHistory);

    const newAssistantMsg = { role: 'assistant', content: '', reasoning: '' };
    setChatHistory((prev) => [...prev, newAssistantMsg]);

    try {
      const systemPrompt = `You are the Dev Empire AI Study Mentor, an expert programming assistant specializing in "${topic.title}".
The student wants to focus specifically on the sub-topic "${cleanConceptName}".
Provide a targeted, high-quality, step-by-step interactive explanation of "${cleanConceptName}" with clear examples, and test their understanding at the end. Use markdown formatting.`;

      const payloadMessages = [
        { role: 'system', content: systemPrompt },
        ...updatedHistory
      ];

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: payloadMessages,
          mode: aiMode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI mentor.');
      }

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
          if (!trimmed) continue;
          if (trimmed === 'data: [DONE]') continue;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.error) {
                throw new Error(data.error);
              }
              setChatHistory((prev) => {
                if (prev.length === 0) return prev;
                const last = prev[prev.length - 1];
                if (last && last.role === 'assistant') {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...last,
                      content: last.content + (data.content || ''),
                      reasoning: last.reasoning + (data.reasoning || '')
                    }
                  ];
                }
                return prev;
              });
            } catch (err) {
              console.error('Failed to parse line:', line, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, content: 'Sorry, I encountered an error while retrieving the response. Please try again.' }
          ];
        }
        return prev;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading || !topic) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-fade-in relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="h-4 w-32 bg-surfaceBorder rounded animate-pulse"></div>
          <div className="flex gap-3">
             <div className="w-10 h-10 bg-surfaceBorder rounded-lg animate-pulse"></div>
             <div className="w-10 h-10 bg-surfaceBorder rounded-lg animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-6">
            <div className="h-6 w-24 bg-surfaceBorder rounded animate-pulse"></div>
            <div className="h-16 w-3/4 bg-surfaceBorder rounded animate-pulse"></div>
            <div className="h-24 w-full bg-surfaceBorder rounded animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surfaceBorder rounded-xl animate-pulse"></div>)}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-64 w-full bg-surfaceBorder rounded-md animate-pulse"></div>
            <div className="h-40 w-full bg-surfaceBorder rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-fade-in relative z-10">
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm py-4 flex items-center justify-between mb-8 border-b border-surfaceBorder -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-textMuted">
          <Link to="/roadmap" className="hover:text-primary transition-colors inline-flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Roadmaps
          </Link>
          <span className="text-surfaceBorder">/</span>
          <span className="text-textMain">{topic.title}</span>
        </div>
        <div className="flex gap-2">
          <button aria-label="Share topic" className="p-2 surface border border-surfaceBorder rounded-md text-textMuted hover:text-primary transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setChatOpen(true)}
            aria-label="Open mentor chat" 
            className="p-2 surface border border-surfaceBorder rounded-md text-textMuted hover:text-primary transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="accent">Module {id.split('-')[0].toUpperCase()}</Badge>
              {topic.level && <Badge variant={topic.level === 'Beginner' ? 'success' : topic.level === 'Advanced' ? 'danger' : 'warning'}>{topic.level}</Badge>}
              <div className="h-px flex-1 bg-surfaceBorder opacity-30" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tighter text-textMain">{topic.title}</h1>
            <p className="text-lg text-textMuted leading-relaxed max-w-3xl mb-8">{topic.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {progressItems.map((item) => (
                <div key={item.label} className="surface rounded-xl p-4 border border-surfaceBorder">
                  <div className="text-2xl font-black text-textMain">{item.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-textDim font-bold">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-6 overflow-x-auto border-b border-surfaceBorder mb-10">
              {['learn', 'practice', 'resources', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-textDim hover:text-textMuted'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                </button>
              ))}
            </div>

            {activeTab === 'learn' && (
              <div className="space-y-12 animate-slide-up">
                <Card className="!bg-primary/5 border-primary/20" hover={false}>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold mb-2">Simple Mental Model</h2>
                      <p className="text-sm font-bold text-primary mb-2">{topic.analogy?.concept}</p>
                      <p className="text-textMuted text-sm leading-relaxed">{topic.analogy?.explanation}</p>
                    </div>
                  </div>
                </Card>

                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" /> What You Will Learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topic.outcomes.map((outcome, index) => (
                      <div key={index} className="surface border border-surfaceBorder p-4 rounded-xl flex items-center gap-4">
                        <CheckCircle className="w-5 h-5 text-success shrink-0" />
                        <span className="text-sm font-semibold">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" /> Key Concepts
                  </h2>
                  <div className="rounded-xl border border-surfaceBorder bg-surface p-5 overflow-x-auto">
                    <div className="min-w-[680px]">
                      <div className="flex justify-center">
                        <div className="rounded-md border border-primary bg-primary px-5 py-3 text-sm font-black text-white">
                          {topic.title}
                        </div>
                      </div>
                      <div className="mx-auto h-8 w-px bg-surfaceBorder" />
                      <div className="grid grid-cols-1 gap-0 max-w-2xl mx-auto">
                    {topic.keyConcepts?.map((concept, index) => (
                      <React.Fragment key={index}>
                      <Link
                        to={`/topic/${id}/concept/${index}`}
                        className={`rounded-md border px-4 py-3 text-sm font-bold transition-all group ${
                          index === 0
                            ? 'border-success/50 bg-success/10 text-success'
                            : 'border-surfaceBorder bg-surface text-textMain hover:border-primary/60 hover:bg-primary/10'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-4">
                          <span>{concept}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary shrink-0">
                            Open <ChevronRight className="w-3 h-3" />
                          </span>
                        </span>
                      </Link>
                      {index < topic.keyConcepts.length - 1 && <div className="mx-auto h-6 w-px bg-surfaceBorder" />}
                      </React.Fragment>
                    ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-accent" /> Tutorial Notes and Examples
                  </h2>
                  <div className="space-y-5">
                    {topic.lessons.map((lesson, index) => (
                      <Card key={index} hover={false} className="!p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-sm font-black shrink-0">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold mb-2">{lesson.title}</h3>
                            <p className="text-sm text-textMuted leading-relaxed">{lesson.body}</p>
                            {lesson.code && (
                              <pre className="mt-5 overflow-x-auto rounded-lg bg-surface border border-surfaceBorder p-5 text-xs text-accent font-mono leading-relaxed">
                                <code>{lesson.code}</code>
                              </pre>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" /> Syntax and Quick Reference
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topic.syntax.map((item, index) => (
                      <div key={index} className="rounded-xl bg-surface border border-surfaceBorder p-4 font-mono text-xs text-textMuted">
                        {item}
                      </div>
                    ))}
                  </div>
                </section>

                {topic.videos?.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-primary" /> Master Class
                    </h2>
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-surfaceBorder">
                      <iframe
                        width="100%"
                        height="100%"
                        src={topic.videos[0]}
                        title={topic.title}
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'practice' && (
              <div className="space-y-10 animate-slide-up">
                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" /> Interactive Quiz
                  </h2>
                  <div className="space-y-5">
                    {topic.practice?.map((question, questionIndex) => {
                      const selected = quizAnswers[questionIndex];

                      return (
                        <Card key={questionIndex} hover={false}>
                          <h3 className="text-lg font-bold mb-6">{question.question}</h3>
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => {
                              const isSelected = selected === optionIndex;
                              const isCorrect = optionIndex === question.answer;

                              return (
                                <button
                                  key={optionIndex}
                                  onClick={() => setQuizAnswers((answers) => ({ ...answers, [questionIndex]: optionIndex }))}
                                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                                    isSelected
                                      ? isCorrect
                                        ? 'bg-success/10 border-success text-success'
                                        : 'bg-danger/10 border-danger text-danger'
                                      : 'surface border-surfaceBorder hover:border-primary/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="font-semibold text-sm">{option}</span>
                                    {isSelected && (isCorrect ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />)}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {selected !== undefined && (
                            <div className="mt-6 p-4 rounded-xl bg-surface border border-surfaceBorder text-sm text-textMuted leading-relaxed">
                              <span className="font-bold text-textMain">{selected === question.answer ? 'Correct.' : 'Review it.'}</span>{' '}
                              {question.explanation || 'Compare the answer with the key concepts and try the example again.'}
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-accent" /> Interview Questions
                  </h2>
                  <div className="space-y-4">
                    {topic.interviewQuestions.map((item, index) => (
                      <Card key={index} hover={false} className="!p-5">
                        <h3 className="font-bold text-sm mb-2">{item.q}</h3>
                        <p className="text-sm text-textMuted leading-relaxed">{item.a}</p>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-slide-up">
                {/* Free Resources Card */}
                <div className="bg-surface border border-surfaceBorder rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-6">
                    <Heart className="w-5 h-5 text-success animate-pulse" fill="currentColor" />
                    <h3 className="font-black text-base text-textMain">Free Resources</h3>
                  </div>
                  <div className="space-y-4.5">
                    {/* Dedicated Roadmap Link */}
                    <Link
                      to="/roadmap"
                      className="flex items-center gap-3.5 p-4 rounded-2xl bg-background/50 border border-surfaceBorder hover:border-primary group transition-all"
                    >
                      <Badge variant="primary" className="!bg-black !text-white dark:!bg-white dark:!text-black !text-[8px] uppercase tracking-widest shrink-0 font-black px-2 py-0.5">Roadmap</Badge>
                      <span className="text-xs font-bold text-textMuted group-hover:text-primary transition-colors flex-1">
                        Visit the Dedicated {topic.title} Roadmap
                      </span>
                      <ChevronRight className="w-4 h-4 text-textDim group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Dynamic Courses / Docs from topic.resources */}
                    {topic.resources?.map((res, index) => (
                      <a
                        key={index}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3.5 p-4 rounded-2xl bg-background/50 border border-surfaceBorder hover:border-primary group transition-all"
                      >
                        <Badge variant="success" className="!text-[8px] uppercase tracking-widest shrink-0 font-black px-2 py-0.5">
                          {res.type === 'Documentation' || res.type === 'Specification' ? 'Course' : res.type || 'Doc'}
                        </Badge>
                        <span className="text-xs font-bold text-textMuted group-hover:text-primary transition-colors flex-1 truncate">
                          {res.name}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-textDim group-hover:text-primary transition-colors" />
                      </a>
                    ))}

                    {/* YouTube Tutorials */}
                    {topic.videos?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-textDim px-1 mb-1">
                          📺 YouTube Tutorials ({topic.videos.length})
                        </p>
                        {topic.videos.map((vidUrl, index) => {
                          const isEmbed = vidUrl.includes('embed/');
                          const videoId = isEmbed ? vidUrl.split('embed/')[1].split('?')[0] : '';
                          const watchUrl = isEmbed ? `https://www.youtube.com/watch?v=${videoId}` : vidUrl;
                          const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                          const labels = ['Beginner Crash Course', 'Full In-Depth Tutorial', 'Advanced Deep Dive'];
                          const label = labels[index] || `Tutorial Part ${index + 1}`;

                          return (
                            <details key={index} className="group/vid rounded-2xl bg-background/50 border border-surfaceBorder hover:border-red-500/40 transition-all overflow-hidden open:border-red-500/40">
                              <summary className="flex items-center gap-3 p-3.5 cursor-pointer list-none select-none">
                                {/* Thumbnail */}
                                {thumbnailUrl ? (
                                  <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-surfaceBorder">
                                    <img src={thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-14 h-10 rounded-lg bg-red-500/10 shrink-0 flex items-center justify-center">
                                    <PlayCircle className="w-5 h-5 text-red-500" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <Badge variant="warning" className="!bg-red-500/10 !text-red-500 !border-red-500/20 !text-[8px] uppercase tracking-widest shrink-0 font-black px-1.5 py-0">YT</Badge>
                                    <span className="text-[9px] text-textDim font-bold">#{index + 1}</span>
                                  </div>
                                  <span className="text-xs font-bold text-textMuted group-hover/vid:text-textMain transition-colors truncate block">{label}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <a
                                    href={watchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-[9px] uppercase font-black text-textDim hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
                                  >
                                    Open <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <span className="text-textDim text-[10px] group-open/vid:rotate-180 transition-transform duration-200">▾</span>
                                </div>
                              </summary>
                              {/* Embedded player (only rendered when open) */}
                              <div className="px-3.5 pb-3.5">
                                <div className="aspect-video w-full rounded-xl overflow-hidden border border-surfaceBorder">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={vidUrl}
                                    title={`${topic.title} — ${label}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    )}

                    {/* Explorer/Feed Link */}
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(topic.title + ' top articles learning resources')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 p-4 rounded-2xl bg-background/50 border border-surfaceBorder hover:border-primary group transition-all"
                    >
                      <Badge variant="accent" className="!bg-pink-600/10 !text-pink-500 !border-pink-500/20 !text-[8px] uppercase tracking-widest shrink-0 font-black px-2 py-0.5">Feed</Badge>
                      <span className="text-xs font-bold text-textMuted group-hover:text-primary transition-colors flex-1">
                        Explore top posts about {topic.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-textDim group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* AI Tutor Card */}
                <div className="bg-surface border border-surfaceBorder rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2.5 mb-6">
                    <Zap className="w-5 h-5 text-primary" fill="currentColor" />
                    <h3 className="font-black text-base text-textMain">AI Tutor</h3>
                  </div>
                  <div className="space-y-4.5">
                    {topic.keyConcepts?.map((concept, index) => (
                      <button
                        key={index}
                        onClick={() => startAiTutorSession(concept)}
                        className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-background/50 border border-surfaceBorder hover:border-primary group transition-all text-left cursor-pointer"
                      >
                        <Badge variant="success" className="!text-[8px] uppercase tracking-widest shrink-0 font-black px-2 py-0.5">Course</Badge>
                        <span className="text-xs font-bold text-textMuted group-hover:text-primary transition-colors flex-1 truncate">
                          {concept.split('(')[0].trim()}
                        </span>
                        <ChevronRight className="w-4 h-4 text-textDim group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8 animate-slide-up">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" /> Hands-On Project
                </h2>
                <Card hover={false} className="!p-8">
                  <h3 className="text-2xl font-black mb-4">{topic.project?.title || `${topic.title} Practice Build`}</h3>
                  <p className="text-textMuted text-sm leading-relaxed mb-6">
                    {topic.project?.description || `Build a small feature that proves you understand ${topic.title}.`}
                  </p>
                  {topic.project?.steps?.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {topic.project.steps.map((step, index) => (
                        <div key={index} className="flex gap-3 text-sm text-textMuted">
                          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-xs text-textMuted font-medium">Build the project, test the main behavior, then mark this topic as completed.</span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>

        <aside className="space-y-8">
          <Card className="!p-6" hover={false}>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-textDim mb-6">Status</h2>
            <button
              onClick={toggleComplete}
              className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-all ${
                isCompleted
                  ? 'bg-success/10 text-success border border-success/30'
                  : 'bg-primary text-white hover:bg-primary-hover shadow-md'
              }`}
            >
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
              {isCompleted ? 'Completed' : 'Mark as Done'}
            </button>
          </Card>

          <Card className="!p-6 !bg-accent/5 border-accent/20" hover={false}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Study Guide</h2>
            </div>
            <p className="text-xs text-textMuted leading-relaxed mb-6">
              Read the concept, recreate one example, answer the quiz, then build the project without copying line by line.
            </p>
            <button 
              onClick={() => setChatOpen(true)}
              className="w-full py-3 surface rounded-lg border border-surfaceBorder text-xs font-bold uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all"
            >
              Ask Mentor
            </button>
          </Card>

          <div className="p-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-textDim mb-6">Common Mistakes</h2>
            <div className="space-y-5">
              {topic.commonMistakes?.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <AlertCircle className="w-5 h-5 text-danger shrink-0" />
                  <p className="text-xs text-textMuted leading-relaxed">
                    <span className="text-danger font-bold">Mistake:</span> {item.mistake}
                    {item.correction && (
                      <>
                        <br />
                        <span className="text-success font-bold">Fix:</span> {item.correction}
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── MENTOR CHAT DRAWER (RAG AI Assistant) ── */}
      <div 
        className={`fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${chatOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setChatOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 bottom-0 z-[100] w-full max-w-lg bg-surface border-l border-surfaceBorder shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-surfaceBorder flex items-center justify-between bg-surfaceLight">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-black text-sm tracking-tight">AI Study Mentor</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary" className="!text-[9px] !px-1.5 !py-0">
                  {aiMode === 'fast' ? 'Llama 3.1 8B' : 'DeepSeek R1'}
                </Badge>
                <span className="text-[9px] text-textDim font-bold uppercase">Topic: {topic.title}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {chatHistory.length > 0 && (
              <button 
                onClick={() => setChatHistory([])}
                title="Clear conversation"
                className="p-2 rounded-full hover:bg-danger/10 hover:text-danger text-textDim transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => setChatOpen(false)}
              className="p-2 rounded-full hover:bg-surfaceHover text-textMuted hover:text-textMain transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Selector Sub-header */}
        <div className="px-6 py-3 border-b border-surfaceBorder bg-surfaceLight/80 flex items-center justify-between text-xs shrink-0 select-none">
          <span className="font-bold text-textMuted flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-warning" /> Mentor Engine:
          </span>
          <div className="flex bg-background border border-surfaceBorder rounded-full p-0.5 relative">
            <button
              onClick={() => handleAiModeChange('fast')}
              type="button"
              className={`px-3 py-1 rounded-full font-bold transition-all duration-200 cursor-pointer ${
                aiMode === 'fast'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textDim hover:text-textMuted'
              }`}
            >
              Fast (Llama 8B)
            </button>
            <button
              onClick={() => handleAiModeChange('reasoning')}
              type="button"
              className={`px-3 py-1 rounded-full font-bold transition-all duration-200 cursor-pointer ${
                aiMode === 'reasoning'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textDim hover:text-textMuted'
              }`}
            >
              Reasoning (DeepSeek)
            </button>
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/30">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none opacity-80">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm mb-1 text-textMain">Ask your Study Mentor</h4>
              <p className="text-xs text-textMuted max-w-xs leading-relaxed">
                Start a conversation about "{topic.title}". The assistant has full context of the lessons, examples, and practice outcomes.
              </p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div 
                key={index}
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
              >
                {/* Role label */}
                <span className={`text-[9px] font-black uppercase tracking-wider text-textDim mb-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.role === 'user' ? 'Student' : 'Mentor'}
                </span>

                {/* Bubble */}
                <div 
                  className={`p-4 border rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary/5 border-primary/20 text-textMain rounded-tr-sm'
                      : 'bg-surface border-surfaceBorder text-textMain rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' && <ThinkingBlock reasoning={msg.reasoning} />}
                  {msg.role === 'assistant' && !msg.content && !msg.reasoning ? (
                    <div className="flex items-center gap-1 text-textDim py-1 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-textDim animate-bounce"></div>
                    </div>
                  ) : (
                    msg.role === 'user' ? <p className="text-sm whitespace-pre-wrap">{msg.content}</p> : formatMessageContent(msg.content)
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form Footer */}
        <form 
          onSubmit={handleSendChat} 
          className="p-4 border-t border-surfaceBorder bg-surfaceLight flex gap-2"
        >
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isGenerating}
            placeholder={`Ask about ${topic.title}...`}
            className="flex-1 px-4 py-3 bg-surface border border-surfaceBorder rounded-full text-sm text-textMain placeholder-textDim focus:outline-none focus:border-primary transition-all disabled:opacity-60"
          />
          <button 
            type="submit"
            disabled={!inputMessage.trim() || isGenerating}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-all flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-surface border border-surfaceBorder shadow-xl rounded-md px-6 py-4 flex items-center gap-3 animate-slide-up">
          <span className="text-sm font-bold text-textMain">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

/* ── HELPERS & SUBCOMPONENTS ── */

function ThinkingBlock({ reasoning }) {
  const [open, setOpen] = useState(true);
  if (!reasoning) return null;
  return (
    <div className="border border-surfaceBorder rounded-xl bg-background/50 p-3 mb-3">
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left text-[10px] font-black text-textDim uppercase tracking-wider focus:outline-none"
      >
        <span className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-warning animate-pulse" />
          Thinking Process
        </span>
        <span className="text-[9px] text-primary">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div className="mt-2 text-[10px] text-textMuted font-mono leading-relaxed border-l border-primary/30 pl-2.5 whitespace-pre-wrap select-none opacity-80">
          {reasoning}
        </div>
      )}
    </div>
  );
}

function formatMessageContent(text) {
  if (!text) return null;

  // First, split by code blocks: ```language ... ```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, partIndex) => {
    // 1. If it's a code block
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : '';
      const code = match ? match[2] : part.slice(3, -3);
      return <RunnableCodeBlock key={partIndex} code={code} language={language} />;
    }

    // 2. Process regular text line-by-line, grouping consecutive list items
    const lines = part.split('\n');
    const elements = [];
    let currentList = null; // { type: 'ul' | 'ol', items: [] }

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

      // Headings
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

      // Bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const itemContent = trimmed.slice(2);
        if (currentList && currentList.type === 'ul') {
          currentList.items.push(itemContent);
        } else {
          flushList(i);
          currentList = { type: 'ul', items: [itemContent] };
        }
        continue;
      }

      // Numbered lists
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

      // Default paragraph
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
  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((codePart, codeIndex) => {
    if (codePart.startsWith('`') && codePart.endsWith('`')) {
      return (
        <code key={codeIndex} className="bg-background border border-surfaceBorder px-1.5 py-0.5 rounded text-accent font-mono text-[11px] mx-0.5">
          {codePart.slice(1, -1)}
        </code>
      );
    }

    // Split by bold: **bold**
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

function RunnableCodeBlock({ code, language }) {
  const [output, setOutput] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const cleanCode = code.trim();
  const isRunnable = language === 'javascript' || language === 'js';

  const handleRun = () => {
    let logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')),
      error: (...args) => logs.push('Error: ' + args.join(' ')),
      warn: (...args) => logs.push('Warn: ' + args.join(' '))
    };
    try {
      const run = new Function('console', cleanCode);
      run(customConsole);
      setOutput(logs.join('\n') || 'Executed successfully with no console output.');
    } catch (err) {
      setOutput('Runtime Error: ' + err.message);
    }
    setHasRun(true);
  };

  return (
    <div className="bg-background border border-surfaceBorder rounded-xl p-4 my-3 flex flex-col group/code overflow-hidden animate-scale-in">
      <div className="flex justify-between items-center mb-2">
        {language && <div className="text-[9px] uppercase tracking-widest text-textDim font-bold">{language}</div>}
        {isRunnable && (
          <button 
            onClick={handleRun}
            className="flex items-center gap-1 text-[10px] uppercase font-bold text-primary hover:text-primary-hover transition-colors"
            title="Run Code in Browser"
          >
            <PlayCircle className="w-3.5 h-3.5" /> Run
          </button>
        )}
      </div>
      <pre className="font-mono text-xs overflow-x-auto text-accent">
        <code>{cleanCode}</code>
      </pre>
      
      {hasRun && (
        <div className="mt-3 pt-3 border-t border-surfaceBorder">
          <div className="text-[9px] uppercase tracking-widest text-textDim font-bold mb-1">Output Terminal</div>
          <pre className="font-mono text-[11px] text-textMuted whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
