import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import {
  MessageSquare,
  X,
  Send,
  Zap,
  Trash2,
  Lightbulb,
  Trophy,
  Activity,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { Card, Badge } from './ui/Shared';
import { getTopicById, getConceptDetail } from '../utils/topicContent';
import { AuthContext } from '../context/AuthContext';

export default function GlobalAssistant() {
  const location = useLocation();
  const path = location.pathname;

  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'report'
  const { token } = useContext(AuthContext);
  const [chatHistory, setChatHistory] = useState([]);
  // Chat session ID for persisting with the backend (null means no session yet)
  const [chatSessionId, setChatSessionId] = useState(null);
  const [showHistoryPrompt, setShowHistoryPrompt] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAiMode] = useState(() => localStorage.getItem('mentor_ai_mode') || 'fast');

  // Report States
  const [scores, setScores] = useState({});
  const [aiReport, setAiReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);
  const syncTimeoutRef = useRef(null);
  const isCreatingSessionRef = useRef(false);
  const lastSyncedChatRef = useRef('');

  // Load existing chat session from DB when drawer opens (if logged in)
  useEffect(() => {
    if (chatOpen && token) {
      // Try to fetch the latest session for the user
      fetch(`${API_BASE_URL}/api/chat-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((sessions) => {
          if (sessions && sessions.length > 0) {
            const latest = sessions[0];
            const latestMessages = latest.messages || [];
            setChatSessionId(latest.id);
            setChatHistory(latestMessages);
            lastSyncedChatRef.current = JSON.stringify(latestMessages);
          }
        })
        .catch((e) => console.error('Failed to load chat sessions', e));
    }
  }, [chatOpen, token]);

  // Persist chat silently after generation settles.
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      localStorage.setItem('previous_chat_history', JSON.stringify(chatHistory));
    }

    if (!token || !chatHistory.length || isGenerating) return;

    const serializedChat = JSON.stringify(chatHistory);
    if (serializedChat === lastSyncedChatRef.current) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      try {
        if (chatSessionId) {
          const res = await fetch(`${API_BASE_URL}/api/chat-sessions/${chatSessionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ messages: chatHistory })
          });

          if (!res.ok) throw new Error('Failed to update chat session');
          lastSyncedChatRef.current = serializedChat;
          return;
        }

        if (isCreatingSessionRef.current) return;
        isCreatingSessionRef.current = true;

        const res = await fetch(`${API_BASE_URL}/api/chat-sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ messages: chatHistory })
        });

        if (!res.ok) throw new Error('Failed to create chat session');

        const data = await res.json();
        setChatSessionId(data.id);
        lastSyncedChatRef.current = serializedChat;
      } catch (e) {
        console.error('Failed to sync chat session', e);
      } finally {
        isCreatingSessionRef.current = false;
      }
    }, 800);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [chatHistory, token, chatSessionId, isGenerating]);

  // Persist empty chat clears to backend after the local clear action.
  useEffect(() => {
    if (chatSessionId && token && chatHistory.length === 0 && lastSyncedChatRef.current) {
      fetch(`${API_BASE_URL}/api/chat-sessions/${chatSessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ messages: chatHistory })
        })
          .then((res) => {
            if (!res.ok) throw new Error('Failed to update chat session');
            lastSyncedChatRef.current = JSON.stringify(chatHistory);
          })
          .catch((e) => console.error('Failed to sync chat session', e));
    }
  }, [chatHistory, token, chatSessionId]);

  // Existing localStorage load prompt (unchanged)
  useEffect(() => {
    const savedChat = localStorage.getItem('previous_chat_history');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (parsed && parsed.length > 0) {
          setShowHistoryPrompt(true);
        }
      } catch (e) {
        console.error('Failed to parse previous chat history', e);
      }
    }
  }, []);

  // Reload scores whenever drawer opens or location changes
  useEffect(() => {
    if (chatOpen) {
      loadScores();
    }
  }, [chatOpen, location]);

  const loadScores = () => {
    try {
      const saved = localStorage.getItem('concept_scores');
      if (saved) {
        setScores(JSON.parse(saved));
      } else {
        setScores({});
      }
    } catch (e) {
      console.error('Failed to load scores', e);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleAiModeChange = (mode) => {
    setAiMode(mode);
    localStorage.setItem('mentor_ai_mode', mode);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear your current conversation?')) {
      setChatHistory([]);
      localStorage.removeItem('previous_chat_history');
      setShowHistoryPrompt(false);
    }
  };

  // Build real-time learning context prompt
  const getContextPrompt = () => {
    let contextMessage = "";
    if (path.startsWith('/topic/')) {
      const parts = path.split('/');
      const topicId = parts[2];
      if (parts.length > 4 && parts[3] === 'concept') {
        const conceptIndex = parts[4];
        try {
          const concept = getConceptDetail(topicId, conceptIndex);
          contextMessage = `The user is currently studying the concept "${concept.title}" under the topic "${concept.topic.title}". Here are details of the concept:\n- Summary: ${concept.summary}\n- Anatomy: ${JSON.stringify(concept.anatomy)}\n- Rules: ${JSON.stringify(concept.rules)}`;
        } catch (e) {}
      } else {
        try {
          const topic = getTopicById(topicId);
          contextMessage = `The user is currently studying the topic "${topic.title}". Here are details:\n- Description: ${topic.description}\n- Key Concepts: ${JSON.stringify(topic.keyConcepts)}`;
        } catch (e) {}
      }
    } else if (path === '/roadmap') {
      contextMessage = `The user is currently looking at the main Roadmap list of all learning paths (Frontend, Backend, Fullstack, AI/ML).`;
    } else {
      contextMessage = `The user is on the homepage of Dev Empire.`;
    }

    // Include overall score profile in system context
    const attemptedList = Object.keys(scores);
    const correctCount = Object.values(scores).filter(s => s.score === 1).length;
    const scoreProfile = `Student's Progress Profile:\n- Concepts Attempted: ${attemptedList.length} / 55\n- Correct Quiz Answers: ${correctCount} / ${attemptedList.length}`;

    return `You are the Dev Empire AI Study Mentor, an expert programming assistant.
Your goal is to help students master software engineering.

Here is the context of what the student is currently viewing:
${contextMessage}

${scoreProfile}

Guide the student step-by-step. Keep explanations clear, engaging, and context-aware. Provide helpful code examples if requested. When displaying code, use markdown syntax highlighting. Respond using markdown formatting.`;
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
      const systemPrompt = getContextPrompt();
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

  const handleGenerateReport = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAiReport('');

    try {
      const scoreSummaries = Object.values(scores).map(s => (
        `- Topic: "${s.topicTitle}", Concept: "${s.conceptTitle}", Status: ${s.score === 1 ? 'PASSED (1/1)' : 'FAILED (0/1)'}`
      )).join('\n');

      const prompt = `Generate a detailed, premium, professional AI audit report of my learning progress. 
Here is my current score profile:
- Total Attempted Concepts: ${Object.keys(scores).length} / 55
- Score breakdown:
${scoreSummaries || 'None attempted yet. Please take quizzes first.'}

Analyze my strong areas, identify weak topics I struggled with, and draft a tailored, step-by-step personalized recommendations list to help me master my weak points. Use beautiful formatting, alerts, and sections.`;

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            { role: 'system', content: 'You are the Dev Empire AI Study Auditor. Generate beautiful, professional markdown progress audits.' },
            { role: 'user', content: prompt }
          ],
          mode: aiMode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to audit report.');
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
              if (data.error) throw new Error(data.error);
              setAiReport(prev => prev + (data.content || ''));
            } catch (err) {
              console.error('Failed parsing report chunk', err);
            }
          }
        }
      }
    } catch (err) {
      console.error('Audit report failed', err);
      setAiReport('Could not load AI audit report. Make sure the backend server is running and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearScores = () => {
    if (window.confirm('Are you sure you want to reset all your test scores?')) {
      localStorage.removeItem('concept_scores');
      setScores({});
      setAiReport('');
    }
  };

  // Stats calculation
  const totalAttempted = Object.keys(scores).length;
  const correctCount = Object.values(scores).filter(s => s.score === 1).length;
  const incorrectCount = totalAttempted - correctCount;
  const passRate = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;

  return (
    <>
      {/* ── FLOATING CHAT BUBBLE ── */}
      <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="relative group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 hover:scale-110 cursor-pointer overflow-hidden border border-white/20"
          aria-label="Ask AI Study Mentor"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></span>
          {chatOpen ? <X className="w-7 h-7 relative z-10 transition-transform duration-300 rotate-90" /> : <BrainCircuit className="w-7 h-7 relative z-10 transition-transform duration-300 hover:rotate-12" />}
          
          <span className="absolute right-20 scale-0 group-hover:scale-100 bg-surface/90 backdrop-blur-md text-textMain border border-surfaceBorder px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-xl transition-all duration-300 origin-right">
            Ask Study Mentor
          </span>
        </button>
      </div>

      {/* ── BACKDROP OVERLAY ── */}
      <div 
        className={`fixed inset-0 z-50 bg-background/70 backdrop-blur-md transition-all duration-500 ${chatOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setChatOpen(false)}
      />

      {/* ── DRAWER CONTAINER ── */}
      <div 
        className={`fixed top-0 right-0 bottom-0 lg:top-6 lg:bottom-6 lg:right-6 z-[100] w-full max-w-xl bg-surface/95 backdrop-blur-2xl lg:rounded-3xl border-l lg:border border-surfaceBorder/50 shadow-[0_0_50px_rgba(0,0,0,0.2)] flex flex-col transition-all duration-500 ease-out ${chatOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] lg:translate-x-[150%] opacity-0'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-surfaceBorder/50 flex flex-col gap-4 bg-gradient-to-b from-surfaceLight/50 to-transparent shrink-0 lg:rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-md opacity-40 rounded-full"></div>
                <div className="relative bg-gradient-to-br from-primary to-accent p-2.5 rounded-2xl border border-white/20 text-white shadow-lg">
                  <BrainCircuit className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-textMain to-textMuted">AI Study Mentor</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Online</span>
                  </div>
                  <span className="text-[10px] text-textDim font-bold uppercase tracking-wider truncate max-w-[200px]">
                    {path === '/' ? 'Home' : path.replace('/topic/', 'Topic: ')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {chatHistory.length > 0 && (
                <button 
                  onClick={handleClearChat}
                  title="Clear Chat History"
                  className="p-2 rounded-xl hover:bg-danger/10 text-textMuted hover:text-danger transition-all cursor-pointer group"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              )}
              <button 
                onClick={() => setChatOpen(false)}
                className="p-2 rounded-xl hover:bg-surfaceBorder text-textMuted hover:text-textMain transition-all cursor-pointer group bg-surfaceLight"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Segmented Engine Toggle */}
          <div className="flex p-1 bg-surface border border-surfaceBorder/60 rounded-xl relative">
            <button
              onClick={() => handleAiModeChange('fast')}
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all duration-300 cursor-pointer relative z-10 ${
                aiMode === 'fast'
                  ? 'text-white'
                  : 'text-textDim hover:text-textMuted'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${aiMode === 'fast' ? 'text-warning' : 'text-textDim'}`} /> Fast (Llama)
            </button>
            <button
              onClick={() => handleAiModeChange('reasoning')}
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all duration-300 cursor-pointer relative z-10 ${
                aiMode === 'reasoning'
                  ? 'text-white'
                  : 'text-textDim hover:text-textMuted'
              }`}
            >
              <BrainCircuit className={`w-3.5 h-3.5 ${aiMode === 'reasoning' ? 'text-accent' : 'text-textDim'}`} /> Reasoning
            </button>
            
            {/* Sliding highlight pill */}
            <div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-lg transition-transform duration-300 ease-out shadow-sm"
              style={{ transform: aiMode === 'fast' ? 'translateX(0)' : 'translateX(100%)', left: '4px' }}
            ></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex shrink-0 px-6 pt-2 border-b border-surfaceBorder/50">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-all relative group flex items-center justify-center gap-2 ${
              activeTab === 'chat' ? 'text-primary' : 'text-textDim hover:text-textMuted'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Chat
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-300 ${activeTab === 'chat' ? 'bg-primary' : 'bg-transparent group-hover:bg-surfaceBorder'}`} />
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-all relative group flex items-center justify-center gap-2 ${
              activeTab === 'report' ? 'text-primary' : 'text-textDim hover:text-textMuted'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Report
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-300 ${activeTab === 'report' ? 'bg-primary' : 'bg-transparent group-hover:bg-surfaceBorder'}`} />
          </button>
        </div>

        {/* ── TAB CONTENT: CHAT ── */}
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 bg-transparent custom-scrollbar">
              {showHistoryPrompt ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 select-none animate-fade-in">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-xl opacity-20 rounded-full"></div>
                    <div className="w-20 h-20 rounded-full bg-surface border border-surfaceBorder flex items-center justify-center text-primary relative shadow-lg">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-2 text-textMain">Welcome Back!</h4>
                    <p className="text-sm text-textMuted max-w-xs leading-relaxed">
                      You have an active session with your mentor. Would you like to pick up where you left off?
                    </p>
                  </div>
                  <div className="flex flex-col w-full max-w-xs gap-3 mt-4">
                    <button
                      onClick={() => {
                        const savedChat = localStorage.getItem('previous_chat_history');
                        if (savedChat) setChatHistory(JSON.parse(savedChat));
                        setShowHistoryPrompt(false);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
                    >
                      Continue Learning
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('previous_chat_history');
                        setShowHistoryPrompt(false);
                      }}
                      className="w-full py-3.5 bg-surface text-textMain border border-surfaceBorder font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-surfaceHover hover:border-surfaceBorderHover transition-all cursor-pointer"
                    >
                      Start New Topic
                    </button>
                  </div>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none opacity-90 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center text-primary mb-6 animate-bounce shadow-inner">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-xl mb-3 text-textMain">Mentor Ready</h4>
                  <p className="text-sm text-textMuted max-w-sm leading-relaxed">
                    Ask me to explain concepts, review code, or generate practice exercises. I see what you're working on!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((msg, index) => (
                    <div 
                      key={index}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {msg.role === 'assistant' && (
                         <div className="flex items-center gap-2 mb-2 ml-1">
                           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md border border-white/20">
                             <BrainCircuit className="w-3.5 h-3.5 text-white" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-wider text-textDim">Mentor</span>
                         </div>
                      )}
                      {msg.role === 'user' && (
                         <div className="flex items-center gap-2 mb-2 mr-1">
                           <span className="text-[10px] font-black uppercase tracking-wider text-textDim">You</span>
                         </div>
                      )}
                      
                      <div 
                        className={`max-w-[88%] relative group animate-slide-up ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-primary-hover text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm px-5 py-3.5 shadow-lg shadow-primary/20 border border-white/10'
                            : 'bg-surface border border-surfaceBorder text-textMain rounded-t-2xl rounded-br-2xl rounded-bl-sm px-5 py-4 shadow-sm'
                        }`}
                      >
                        {msg.role === 'assistant' && <ThinkingBlock reasoning={msg.reasoning} />}
                        {msg.role === 'assistant' && !msg.content && !msg.reasoning ? (
                          <div className="flex items-center gap-2 text-primary py-2 px-1">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                          </div>
                        ) : (
                          msg.role === 'user' ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p> : <div className="text-sm leading-relaxed">{formatMessageContent(msg.content)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-background/50 backdrop-blur-sm border-t border-surfaceBorder/50 shrink-0 lg:rounded-b-3xl">
              <form 
                onSubmit={handleSendChat} 
                className="flex gap-2 p-1 bg-surface border border-surfaceBorder rounded-full shadow-lg shadow-black/5 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300"
              >
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isGenerating || showHistoryPrompt}
                  placeholder="Ask your mentor a question..."
                  className="flex-1 px-5 py-3 bg-transparent text-sm text-textMain placeholder-textDim focus:outline-none w-full"
                />
                <button 
                  type="submit"
                  disabled={!inputMessage.trim() || isGenerating || showHistoryPrompt}
                  className="w-12 h-12 bg-gradient-to-br from-primary to-accent text-white rounded-full hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:hover:shadow-none group cursor-pointer"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── TAB CONTENT: PERFORMANCE REPORT ── */}
        {activeTab === 'report' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-transparent custom-scrollbar">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface border border-surfaceBorder p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-3xl font-black text-textMain relative z-10">{totalAttempted}</div>
                <div className="text-[10px] uppercase tracking-widest text-textDim font-bold mt-2 relative z-10">Taken</div>
              </div>
              <div className="bg-surface border border-surfaceBorder p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-3xl font-black text-success relative z-10">{correctCount}</div>
                <div className="text-[10px] uppercase tracking-widest text-textDim font-bold mt-2 relative z-10">Correct</div>
              </div>
              <div className="bg-surface border border-surfaceBorder p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-3xl font-black text-textMain relative z-10">{passRate}%</div>
                <div className="text-[10px] uppercase tracking-widest text-textDim font-bold mt-2 relative z-10">Accuracy</div>
              </div>
            </div>

            {/* Progress Visualizer */}
            <div className="bg-surface border border-surfaceBorder p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-textMain flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-warning/10 text-warning">
                    <Trophy className="w-4 h-4" />
                  </div>
                  Syllabus Progress
                </h4>
                <Badge variant="primary" className="!text-xs">{totalAttempted} / 55 Concepts</Badge>
              </div>
              <div className="w-full bg-surfaceLight h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-1000 ease-out rounded-full relative"
                  style={{ width: `${Math.min(100, Math.max(2, (totalAttempted / 55) * 100))}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* AI Report Generator Section */}
            <div className="space-y-4 relative">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-black uppercase tracking-wider text-textMain flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  AI Progress Audit
                </h4>
                {totalAttempted > 0 && (
                  <button 
                    onClick={clearScores}
                    className="text-[10px] uppercase tracking-widest text-danger font-bold flex items-center gap-1.5 hover:bg-danger/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear History
                  </button>
                )}
              </div>

              {aiReport ? (
                <div className="bg-surface border border-surfaceBorder shadow-sm rounded-2xl p-6 text-sm leading-relaxed text-textMain max-w-full overflow-x-auto">
                  {formatMessageContent(aiReport)}
                  
                  <button
                    onClick={handleGenerateReport}
                    disabled={isAnalyzing}
                    className="mt-8 w-full py-4 bg-surfaceLight border border-surfaceBorder text-textMain font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-surfaceHover hover:border-surfaceBorderHover transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    {isAnalyzing ? (
                       <><Activity className="w-4 h-4 animate-pulse text-primary" /> Analyzing...</>
                    ) : (
                       <><Activity className="w-4 h-4 text-textDim group-hover:text-primary transition-colors" /> Re-Generate Audit</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-surface border border-surfaceBorder rounded-2xl p-8 text-center shadow-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Activity className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h5 className="font-black text-lg text-textMain mb-2">Request Mentor Audit</h5>
                  <p className="text-sm text-textMuted max-w-sm mx-auto leading-relaxed mb-6">
                    Our AI study mentor will deeply analyze your test results to generate a personalized syllabus review and weakness remediation plan.
                  </p>
                  <button
                    onClick={handleGenerateReport}
                    disabled={totalAttempted === 0 || isAnalyzing}
                    className="w-full sm:w-auto mx-auto px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isAnalyzing ? 'Auditing Scores...' : 'Generate Full Audit'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Score History List */}
            {totalAttempted > 0 && (
              <div className="space-y-4 pt-4 border-t border-surfaceBorder/50">
                <h4 className="text-xs font-black uppercase tracking-widest text-textDim">Detailed Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(scores).map(([key, val]) => (
                    <div key={key} className="bg-surface border border-surfaceBorder p-4 rounded-xl shadow-sm flex items-center justify-between gap-4 hover:border-surfaceBorderHover transition-colors">
                      <div>
                        <div className="font-black text-textMain text-sm mb-1">{val.conceptTitle}</div>
                        <div className="text-[10px] text-primary uppercase font-bold tracking-widest">{val.topicTitle}</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {val.score === 1 ? (
                          <span className="px-3 py-1.5 rounded-lg bg-success/10 text-success font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 border border-success/20 shadow-inner">
                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-danger/10 text-danger font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 border border-danger/20 shadow-inner">
                            <AlertCircle className="w-3.5 h-3.5" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ── HELPERS ── */
function ThinkingBlock({ reasoning }) {
  const [open, setOpen] = useState(true);
  if (!reasoning) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-xl bg-background/80 border border-surfaceBorder/80 backdrop-blur-md shadow-inner transition-all duration-300">
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left bg-surfaceLight/50 hover:bg-surfaceLight transition-colors focus:outline-none group cursor-pointer"
      >
        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-textDim group-hover:text-textMain transition-colors">
          <div className="relative flex items-center justify-center w-4 h-4">
            <span className="absolute inline-flex h-full w-full rounded-full bg-warning opacity-20 animate-ping"></span>
            <Lightbulb className="w-3 h-3 text-warning relative z-10" />
          </div>
          Reasoning Process
        </span>
        <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 text-[11px] text-textMuted font-mono leading-relaxed border-t border-surfaceBorder/50 whitespace-pre-wrap opacity-90 max-h-[300px] overflow-y-auto custom-scrollbar">
          {reasoning}
        </div>
      )}
    </div>
  );
}

function formatMessageContent(text) {
  if (!text) return null;

  // Split by code blocks: ```language ... ```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, partIndex) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : '';
      const code = match ? match[2] : part.slice(3, -3);

      return (
        <pre key={partIndex} className="bg-background border border-surfaceBorder rounded-xl p-4 font-mono text-xs my-3 overflow-x-auto text-accent animate-scale-in max-w-full">
          {language && <div className="text-[9px] uppercase tracking-widest text-textDim font-bold mb-2">{language}</div>}
          <code>{code.trim()}</code>
        </pre>
      );
    }

    // Process bold text, list markers, and standard breaks
    const lines = part.split('\n');
    return (
      <div key={partIndex} className="space-y-2">
        {lines.map((line, lineIndex) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIndex} className="h-2" />;

          // Check list formats
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <ul key={lineIndex} className="list-disc pl-5 my-1 text-sm text-textMuted space-y-1">
                <li>{renderInlineFormatting(trimmed.substring(2))}</li>
              </ul>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            const indexDot = trimmed.indexOf('.');
            return (
              <ol key={lineIndex} className="list-decimal pl-5 my-1 text-sm text-textMuted space-y-1">
                <li value={parseInt(trimmed.substring(0, indexDot))}>
                  {renderInlineFormatting(trimmed.substring(indexDot + 1).trim())}
                </li>
              </ol>
            );
          }

          // Header sizes formatting
          if (trimmed.startsWith('### ')) {
            return <h4 key={lineIndex} className="text-sm font-black mt-4 mb-2 text-textMain">{renderInlineFormatting(trimmed.substring(4))}</h4>;
          }
          if (trimmed.startsWith('## ')) {
            return <h3 key={lineIndex} className="text-base font-black mt-5 mb-2 text-textMain border-b border-surfaceBorder/30 pb-1">{renderInlineFormatting(trimmed.substring(3))}</h3>;
          }
          if (trimmed.startsWith('# ')) {
            return <h2 key={lineIndex} className="text-lg font-black mt-6 mb-3 text-textMain">{renderInlineFormatting(trimmed.substring(2))}</h2>;
          }

          // Alert formats
          if (trimmed.startsWith('> [!')) {
            const matchAlert = trimmed.match(/^>\s*\[!(\w+)\]/);
            const alertType = matchAlert ? matchAlert[1].toUpperCase() : 'NOTE';
            return (
              <div key={lineIndex} className={`p-4 my-3 rounded-xl border border-l-4 text-xs ${
                alertType === 'WARNING' || alertType === 'CAUTION'
                  ? 'bg-danger/5 border-danger/20 border-l-danger text-danger'
                  : 'bg-primary/5 border-primary/20 border-l-primary text-textMuted'
              }`}>
                <span className="font-black block uppercase tracking-wider text-[9px] mb-1">{alertType}</span>
                {renderInlineFormatting(lines.slice(lineIndex + 1).join('\n').split('\n')[0].replace(/^>\s*/, ''))}
              </div>
            );
          }
          if (trimmed.startsWith('>')) {
            return (
              <blockquote key={lineIndex} className="border-l-2 border-primary/40 pl-3 my-2 text-xs italic text-textMuted">
                {renderInlineFormatting(trimmed.substring(1).trim())}
              </blockquote>
            );
          }

          return <p key={lineIndex} className="text-sm text-textMuted leading-relaxed">{renderInlineFormatting(line)}</p>;
        })}
      </div>
    );
  });
}

function renderInlineFormatting(text) {
  // Regex to format **bold** and `code` inline elements
  const boldCodeRegex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(boldCodeRegex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-textMain">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-surfaceLight px-1.5 py-0.5 rounded text-xs font-mono text-accent">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
