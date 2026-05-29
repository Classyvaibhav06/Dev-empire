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
  BrainCircuit,
  Code2
} from 'lucide-react';
import { Card, Badge } from './ui/Shared';
import { getTopicById, getConceptDetail } from '../utils/topicContent';
import { AuthContext } from '../context/AuthContext';

export default function GlobalAssistant() {
  const location = useLocation();
  const path = location.pathname;

  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'report'
  const { token, updateUserStats } = useContext(AuthContext);
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
  const scrollContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const syncTimeoutRef = useRef(null);
  const isCreatingSessionRef = useRef(false);
  const lastSyncedChatRef = useRef('');
  const skipNextSessionLoadRef = useRef(false);

  // Playground Context State
  const [playgroundContext, setPlaygroundContext] = useState(null);

  // Listen for playground code updates
  useEffect(() => {
    const handleContextUpdate = (e) => setPlaygroundContext(e.detail);
    window.addEventListener('playgroundCodeUpdate', handleContextUpdate);
    return () => window.removeEventListener('playgroundCodeUpdate', handleContextUpdate);
  }, []);

  const [showErrorHelp, setShowErrorHelp] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const errorTimeoutRef = useRef(null);

  // Listen for playground code errors
  useEffect(() => {
    const handleErrorEvent = (e) => {
      setErrorDetails(e.detail);
      setShowErrorHelp(true);

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => {
        setShowErrorHelp(false);
      }, 12000);
    };

    window.addEventListener('playgroundCodeError', handleErrorEvent);
    return () => {
      window.removeEventListener('playgroundCodeError', handleErrorEvent);
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Load existing chat session from DB when drawer opens (if logged in)
  useEffect(() => {
    if (chatOpen && token) {
      if (skipNextSessionLoadRef.current) {
        skipNextSessionLoadRef.current = false;
        return;
      }
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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50);
    }
  };

  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [chatHistory, isAtBottom]);

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

  const getSuggestedQuestions = () => {
    if (path.startsWith('/topic/')) {
      const parts = path.split('/');
      const topicId = parts[2];
      if (parts.length > 4 && parts[3] === 'concept') {
        const conceptIndex = parts[4];
        try {
          const concept = getConceptDetail(topicId, conceptIndex);
          return [
            `Explain "${concept.title}" simply`,
            `What are the most common mistakes with this?`,
            `Give me a practice exercise for this`,
            `How does this relate to other topics?`
          ];
        } catch (e) { }
      } else {
        try {
          const topic = getTopicById(topicId);
          return [
            `What is ${topic.title} used for?`,
            `What should I learn first in ${topic.title}?`,
            `Give me a real-world example`,
            `Quiz me on ${topic.title}`
          ];
        } catch (e) { }
      }
    } else if (path === '/roadmap') {
      return [
        `Which learning path is right for a beginner?`,
        `What is the difference between Frontend and Backend?`,
        `How long does it take to become a Fullstack developer?`,
        `Suggest a study schedule for me`
      ];
    } else if (path === '/playground') {
      return [
        `Can you review my code for best practices?`,
        `How do I optimize this code?`,
        `Help me find a bug in my code`,
        `Explain what my code does step-by-step`
      ];
    }

    // Default fallback
    return [
      `How do I start learning programming?`,
      `What is the best language to learn first?`,
      `How do I stay motivated to code?`,
      `What are some good project ideas?`
    ];
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
        } catch (e) { }
      } else {
        try {
          const topic = getTopicById(topicId);
          contextMessage = `The user is currently studying the topic "${topic.title}". Here are details:\n- Description: ${topic.description}\n- Key Concepts: ${JSON.stringify(topic.keyConcepts)}`;
        } catch (e) { }
      }
    } else if (path === '/roadmap') {
      contextMessage = `The user is currently looking at the main Roadmap list of all learning paths (Frontend, Backend, Fullstack, AI/ML).`;
    } else if (path === '/playground') {
      contextMessage = `The user is in the interactive Code Sandbox (Playground).`;
      if (playgroundContext) {
        contextMessage += `\n\n[PLAYGROUND CODE CONTEXT]\nHere is the exact code the user currently has written in their editor:\n\`\`\`javascript\n${playgroundContext}\n\`\`\`\nWhen answering, use this code context to provide highly specific debugging or suggestions.`;
      }
    } else {
      contextMessage = `The user is on the homepage or an unknown page of Dev Empire.`;
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

  const handleSendChat = async (e, customMessage = null, isNewChat = false) => {
    if (e) e.preventDefault();
    const userMsgText = customMessage || inputMessage;
    if (!userMsgText.trim() || isGenerating) return;

    if (showHistoryPrompt || isNewChat) {
      localStorage.removeItem('previous_chat_history');
      setShowHistoryPrompt(false);
    }

    if (!customMessage) setInputMessage('');
    setIsGenerating(true);
    setIsAtBottom(true);

    const newUserMsg = { role: 'user', content: userMsgText };
    const baseHistory = isNewChat ? [] : chatHistory;
    const updatedHistory = [...baseHistory, newUserMsg];
    setChatHistory(updatedHistory);

    const newAssistantMsg = { role: 'assistant', content: '', reasoning: '' };
    setChatHistory(() => [...updatedHistory, newAssistantMsg]);

    try {
      const systemPrompt = getContextPrompt();
      const payloadMessages = [
        { role: 'system', content: systemPrompt },
        ...updatedHistory
      ];

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers,
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

      let accumulatedContent = '';
      let accumulatedReasoning = '';
      let lastFlushTime = Date.now();
      let flushTimeout = null;

      const flushState = () => {
        if (!accumulatedContent && !accumulatedReasoning) return;
        const contentToAppend = accumulatedContent;
        const reasoningToAppend = accumulatedReasoning;
        accumulatedContent = '';
        accumulatedReasoning = '';

        setChatHistory((prev) => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          if (last && last.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              {
                ...last,
                content: last.content + contentToAppend,
                reasoning: last.reasoning + reasoningToAppend
              }
            ];
          }
          return prev;
        });
      };

      try {
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

                if (data.userStats && updateUserStats) {
                  updateUserStats(data.userStats.newXp, data.userStats.newLevel, data.userStats.streak_count);
                }

                const newContent = data.content || '';
                const newReasoning = data.reasoning || '';
                accumulatedContent += newContent;
                accumulatedReasoning += newReasoning;

                const now = Date.now();
                if (now - lastFlushTime >= 50) {
                  if (flushTimeout) {
                    clearTimeout(flushTimeout);
                    flushTimeout = null;
                  }
                  flushState();
                  lastFlushTime = now;
                } else {
                  if (!flushTimeout) {
                    flushTimeout = setTimeout(() => {
                      flushState();
                      lastFlushTime = Date.now();
                      flushTimeout = null;
                    }, 50 - (now - lastFlushTime));
                  }
                }
              } catch (err) {
                console.error('Failed to parse line:', line, err);
              }
            }
          }
        }
      } finally {
        if (flushTimeout) {
          clearTimeout(flushTimeout);
          flushTimeout = null;
        }
        flushState();
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

  const handleFixWithErrorAI = () => {
    if (!errorDetails) return;

    // Bypass asynchronous loading of past sessions when opening the drawer
    skipNextSessionLoadRef.current = true;

    setChatOpen(true);
    setActiveTab('chat');
    setShowErrorHelp(false);

    // Clear the active session and history to ensure a new chat session is started
    setChatSessionId(null);
    localStorage.removeItem('previous_chat_history');
    setShowHistoryPrompt(false);

    const debugMessage = `I just encountered a code execution error in the Playground using ${errorDetails.language}.
Here is the error output:
\`\`\`
${errorDetails.errorMessage}
\`\`\`

Here is my current code:
\`\`\`${errorDetails.language}
${errorDetails.code}
\`\`\`

Can you help me understand what is wrong and how to fix it?`;

    handleSendChat(null, debugMessage, true);
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
      <div className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-40 transition-transform duration-500 ease-in-out drawer-shift-element ${chatOpen ? 'opacity-0 pointer-events-none' : ''}`}>

        {/* Error Help Notification Popup */}
        {showErrorHelp && errorDetails && (
          <div className="absolute right-16 bottom-2 mb-2 mr-2 w-80 bg-surface/80 backdrop-blur-2xl border border-surfaceBorder rounded-2xl p-4 shadow-2xl animate-fade-in flex flex-col gap-3.5 z-50 transform transition-all duration-300 ease-out">
            {/* Close Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowErrorHelp(false); }}
              className="absolute top-3 right-3 text-textMuted hover:text-textMain hover:bg-surfaceHover rounded-full p-1.5 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-danger/10 text-danger shrink-0 shadow-inner">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="pr-5 flex-1">
                <h5 className="text-sm font-bold text-textMain tracking-tight">
                  Error Detected
                </h5>
                <p className="text-xs text-textMuted mt-1 leading-relaxed line-clamp-2 font-mono bg-surfaceLight/50 px-2 py-1 rounded-md border border-surfaceBorder/50">
                  {errorDetails.errorMessage}
                </p>
              </div>
            </div>

            <button
              onClick={handleFixWithErrorAI}
              className="w-full py-2.5 bg-surface text-textMain border border-surfaceBorder hover:border-primary/50 hover:bg-primary/5 hover:text-primary font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              Analyze & Fix Issue
            </button>
          </div>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 cursor-pointer border border-primary/20"
          aria-label="Ask AI Study Mentor"
        >
          {chatOpen ? <X className="w-6 h-6 relative z-10 transition-transform duration-300 rotate-90" /> : <img src="https://cdn-icons-png.flaticon.com/512/8049/8049563.png" alt="Bot Icon" className="w-6 h-6 relative z-10 transition-transform duration-300 hover:rotate-12" />}
        </button>
      </div>

      {/* ── BACKDROP OVERLAY ── */}
      <div
        className={`fixed inset-0 z-50 bg-background/70 backdrop-blur-md transition-all duration-500 ${chatOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setChatOpen(false)}
      />

      {/* ── DRAWER CONTAINER ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 lg:top-4 lg:bottom-4 lg:right-4 z-[100] w-full max-w-lg bg-surface lg:rounded-2xl border-l lg:border border-surfaceBorder shadow-2xl flex flex-col transition-all duration-500 ease-out ${chatOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] lg:translate-x-[150%] opacity-0'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-surfaceBorder flex flex-col gap-4 bg-surface shrink-0 lg:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-surfaceBorder bg-surfaceLight flex items-center justify-center shrink-0">
                <img src="https://cdn-icons-png.flaticon.com/512/8049/8049563.png" alt="Bot Icon" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-textMain tracking-tight">AI Study Mentor</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surfaceLight text-textMuted border border-surfaceBorder">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Online</span>
                  </div>
                  <span className="text-[10px] text-textDim font-medium uppercase tracking-wider truncate max-w-[200px]">
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
                  className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-surfaceHover text-textDim hover:text-textMain transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setChatOpen(false)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-surfaceHover text-textDim hover:text-textMain transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Segmented Engine Toggle */}
          <div className="flex p-1 bg-surfaceLight border border-surfaceBorder rounded-md relative">
            <button
              onClick={() => handleAiModeChange('fast')}
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 cursor-pointer relative z-10 ${aiMode === 'fast'
                  ? 'text-textMain shadow-sm'
                  : 'text-textDim hover:text-textMain'
                }`}
            >
              <Zap className="w-3.5 h-3.5" /> Fast
            </button>
            <button
              onClick={() => handleAiModeChange('reasoning')}
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 cursor-pointer relative z-10 ${aiMode === 'reasoning'
                  ? 'text-textMain shadow-sm'
                  : 'text-textDim hover:text-textMain'
                }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Reasoning
            </button>

            {/* Sliding highlight pill */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-surface rounded-sm transition-transform duration-300 ease-out shadow-sm border border-surfaceBorder"
              style={{ transform: aiMode === 'fast' ? 'translateX(0)' : 'translateX(100%)', left: '4px' }}
            ></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex shrink-0 px-4 pt-2 border-b border-surfaceBorder">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 pb-3 text-sm font-medium transition-all relative group flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'text-textMain' : 'text-textDim hover:text-textMain'
              }`}
          >
            <MessageSquare className="w-4 h-4" /> Chat
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-300 ${activeTab === 'chat' ? 'bg-primary' : 'bg-transparent'}`} />
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 pb-3 text-sm font-medium transition-all relative group flex items-center justify-center gap-2 ${activeTab === 'report' ? 'text-textMain' : 'text-textDim hover:text-textMain'
              }`}
          >
            <TrendingUp className="w-4 h-4" /> Report
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-300 ${activeTab === 'report' ? 'bg-primary' : 'bg-transparent'}`} />
          </button>
        </div>

        {/* ── TAB CONTENT: CHAT ── */}
        {activeTab === 'chat' && (
          <>
            <div
              className="flex-1 overflow-y-auto p-6 bg-transparent custom-scrollbar"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              {showHistoryPrompt ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 select-none animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-surfaceLight border border-surfaceBorder flex items-center justify-center text-primary shadow-sm mb-2">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl tracking-tight mb-2 text-textMain">Welcome Back!</h4>
                    <p className="text-sm text-textMuted max-w-sm leading-relaxed">
                      You have an active session with your mentor. Would you like to pick up where you left off?
                    </p>
                  </div>
                  <div className="flex flex-col w-full max-w-sm gap-2 mt-4">
                    <button
                      onClick={() => {
                        const savedChat = localStorage.getItem('previous_chat_history');
                        if (savedChat) setChatHistory(JSON.parse(savedChat));
                        setShowHistoryPrompt(false);
                      }}
                      className="w-full h-10 px-4 py-2 bg-primary text-white font-medium rounded-md text-sm hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
                    >
                      Continue Learning
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('previous_chat_history');
                        setShowHistoryPrompt(false);
                      }}
                      className="w-full h-10 px-4 py-2 bg-transparent text-textMain border border-surfaceBorder font-medium rounded-md text-sm hover:bg-surfaceLight transition-colors cursor-pointer shadow-sm"
                    >
                      Start New Topic
                    </button>
                  </div>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-surfaceLight border border-surfaceBorder flex items-center justify-center text-primary mb-4 shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2 text-textMain tracking-tight">Mentor Ready</h4>
                  <p className="text-sm text-textMuted max-w-sm leading-relaxed mb-6">
                    Ask me to explain concepts, review code, or generate practice exercises. I see what you're working on!
                  </p>
                  <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {getSuggestedQuestions().map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendChat(null, q)}
                        className="text-left text-xs font-medium bg-transparent border border-surfaceBorder hover:bg-surfaceLight text-textMain p-3 rounded-md transition-all shadow-sm group cursor-pointer"
                      >
                        <span className="flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-textDim group-hover:text-textMain mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{q}</span>
                        </span>
                      </button>
                    ))}
                  </div>
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
                            <img src="https://cdn-icons-png.flaticon.com/512/8049/8049563.png" alt="Bot Icon" className="w-4 h-4 drop-shadow-sm" />
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
                        className={`max-w-[85%] relative group animate-slide-up ${msg.role === 'user'
                            ? 'bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm'
                            : 'bg-surfaceLight border border-surfaceBorder text-textMain rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm'
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

            {/* Playground Context Indicator */}
            {path === '/playground' && playgroundContext && (
              <div className="mx-4 mt-2 mb-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2 text-[10px] font-bold text-primary shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <Code2 className="w-3 h-3" />
                <span>AI is seeing your Playground code context</span>
              </div>
            )}

            {/* Input Form */}
            <div className="p-4 bg-surface border-t border-surfaceBorder shrink-0 lg:rounded-b-2xl">
              <form
                onSubmit={handleSendChat}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isGenerating}
                  placeholder="Ask your mentor a question..."
                  className="flex-1 px-3 py-2 bg-transparent text-sm text-textMain placeholder:text-textDim border border-surfaceBorder rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isGenerating}
                  className="h-9 w-9 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send className="w-4 h-4" />
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
              <div className="bg-surface border border-surfaceBorder p-4 rounded-xl text-center shadow-sm flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-textMain">{totalAttempted}</div>
                <div className="text-xs text-textDim font-medium mt-1">Taken</div>
              </div>
              <div className="bg-surface border border-surfaceBorder p-4 rounded-xl text-center shadow-sm flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-success">{correctCount}</div>
                <div className="text-xs text-textDim font-medium mt-1">Correct</div>
              </div>
              <div className="bg-surface border border-surfaceBorder p-4 rounded-xl text-center shadow-sm flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-textMain">{passRate}%</div>
                <div className="text-xs text-textDim font-medium mt-1">Accuracy</div>
              </div>
            </div>

            {/* Progress Visualizer */}
            <div className="bg-surface border border-surfaceBorder p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-textMain flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-warning" />
                  Syllabus Progress
                </h4>
                <Badge variant="muted" className="text-xs">{totalAttempted} / 55</Badge>
              </div>
              <div className="w-full bg-surfaceLight h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.min(100, Math.max(2, (totalAttempted / 55) * 100))}%` }}
                >
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

    // Convert Setext headings (==== and ----) to ATX headings (# and ##)
    let processedPart = part.replace(/^([^\n]+)\n={3,}\s*$/gm, '# $1');
    processedPart = processedPart.replace(/^([^\n]+)\n-{3,}\s*$/gm, '## $1');

    // Process bold text, list markers, and standard breaks
    const lines = processedPart.split('\n');
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
              <div key={lineIndex} className={`p-4 my-3 rounded-xl border border-l-4 text-xs ${alertType === 'WARNING' || alertType === 'CAUTION'
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
