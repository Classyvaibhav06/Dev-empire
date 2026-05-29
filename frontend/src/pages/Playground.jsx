import React, { useState, useEffect, useContext, useRef } from 'react';
import { Code2, Play, Terminal, RefreshCw, Save, Download, Share2, Check, Globe, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const defaultCodes = {
  javascript: `// Dev Empire Interactive Playground
// Write your JavaScript code here and hit Run!

const coder = {
  name: "Alex",
  skills: ["React", "Node.js", "MongoDB"],
  level: 42
};

console.log("⚡ " + coder.name + " is ready for action!");
`,
  python: `# Dev Empire Interactive Playground
# Write your Python code here and hit Run!

def greet_coder(name):
    print(f"⚡ {name} is ready for action in Python!")
    
greet_coder("Alex")
`,
  cpp: `// Dev Empire Interactive Playground
// Write your C++ code here and hit Run!

#include <iostream>
using namespace std;

int main() {
    cout << "⚡ Alex is ready for action in C++!" << endl;
    return 0;
}
`,
  java: `// Dev Empire Interactive Playground
// Write your Java code here and hit Run!

public class Main {
    public static void main(String[] args) {
        System.out.println("⚡ Alex is ready for action in Java!");
    }
}
`
};

const defaultWeb = {
  html: `<div class="container">
  <h1>Hello Dev Empire</h1>
  <p>Live Web Sandbox is active!</p>
  <button id="btn">Click me</button>
</div>`,
  css: `.container {
  font-family: system-ui, sans-serif;
  text-align: center;
  margin-top: 2rem;
}
h1 { color: #7C3AED; }
button {
  background: #7C3AED;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}`,
  js: `document.getElementById('btn').addEventListener('click', () => {
  alert('Welcome to Dev Empire Web Mode! ⚡');
});`
};

export default function Playground() {
  const { token, updateUserStats } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // General State
  const [mode, setMode] = useState('terminal'); // 'terminal' | 'web'
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Terminal State
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCodes['javascript']);
  const [output, setOutput] = useState('Console ready. Write some code and hit Run!');
  const [isRunning, setIsRunning] = useState(false);
  
  // Web State
  const [htmlCode, setHtmlCode] = useState(defaultWeb.html);
  const [cssCode, setCssCode] = useState(defaultWeb.css);
  const [jsCode, setJsCode] = useState(defaultWeb.js);
  const [activeWebTab, setActiveWebTab] = useState('html');
  const [srcDoc, setSrcDoc] = useState('');

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [shareDesc, setShareDesc] = useState('');
  const [sharePublic, setSharePublic] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareCopied, setShareCopied] = useState(false);

  // Sync current code to GlobalAssistant context
  useEffect(() => {
    const event = new CustomEvent('playgroundCodeUpdate', { detail: code });
    window.dispatchEvent(event);
    return () => {
      window.dispatchEvent(new CustomEvent('playgroundCodeUpdate', { detail: null }));
    };
  }, [code]);

  // Load snippet from URL if present
  useEffect(() => {
    const snippetId = searchParams.get('snippet');
    if (snippetId) {
      loadSnippet(snippetId);
    }
  }, []);

  // Live preview for web mode (debounce)
  useEffect(() => {
    if (mode === 'web') {
      const timeout = setTimeout(() => {
        setSrcDoc(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>${cssCode}</style>
            </head>
              <body>
              ${htmlCode}
              <script>${jsCode}</script>
            </body>
          </html>
        `);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [htmlCode, cssCode, jsCode, mode]);

  const loadSnippet = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/playground/snippet/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.language === 'web') {
          setMode('web');
          setHtmlCode(data.html_code || '');
          setCssCode(data.css_code || '');
          setJsCode(data.code || '');
          setOutput(`✅ Loaded shared web snippet`);
        } else {
          setMode('terminal');
          setLanguage(data.language);
          setCode(data.code);
          setOutput(`✅ Loaded shared snippet (${data.language})`);
        }
      } else {
        setOutput('❌ Failed to load shared snippet. It may have expired or does not exist.');
      }
    } catch (err) {
      setOutput(`❌ Error loading snippet: ${err.message}`);
    }
    setIsLoading(false);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultCodes[newLang]);
    setOutput('Console ready. Write some code and hit Run!');
  };

  const handleRunCode = async () => {
    if (mode === 'web') return; // Web updates live

    setIsRunning(true);
    setOutput('⏳ Running...');

    if (language === 'javascript') {
      // Run locally in browser
      setTimeout(() => {
        let logs = [];
        const customConsole = {
          log: (...args) => {
            logs.push(args.map(arg => {
              if (typeof arg === 'object') {
                try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
              }
              return String(arg);
            }).join(' '));
          },
          error: (...args) => logs.push(`[Error]: ${args.join(' ')}`),
          warn: (...args) => logs.push(`[Warn]: ${args.join(' ')}`)
        };

        try {
          const userFn = new Function('console', code);
          userFn(customConsole);
          
          if (logs.length > 0) {
            setOutput(logs.join('\n'));
          } else {
            setOutput('Code executed successfully (no console output).');
          }
        } catch (err) {
          setOutput(`Execution Error: ${err.message}`);
          window.dispatchEvent(new CustomEvent('playgroundCodeError', {
            detail: { errorMessage: err.message, code, language: 'javascript' }
          }));
        }
        setIsRunning(false);
      }, 300);
    } else {
      // Run via Backend Piston API
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/api/playground/execute`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ code, language })
        });
        const data = await res.json();

        if (data.streak_count !== undefined && updateUserStats) {
          updateUserStats(data.newXp, data.newLevel, data.streak_count);
        }
        
        if (data.compile && data.compile.code !== 0) {
          setOutput(`Compilation Error:\n${data.compile.output}`);
          window.dispatchEvent(new CustomEvent('playgroundCodeError', {
            detail: { errorMessage: data.compile.output, code, language }
          }));
        } else if (data.run) {
          setOutput(data.run.output || 'Code executed successfully (no console output).');
          if (data.run.stderr && data.run.stderr.trim() !== '') {
            window.dispatchEvent(new CustomEvent('playgroundCodeError', {
              detail: { errorMessage: data.run.stderr, code, language }
            }));
          }
        } else {
          const errMsg = data.message || 'Unknown error';
          setOutput(`Execution Error: ${errMsg}`);
          window.dispatchEvent(new CustomEvent('playgroundCodeError', {
            detail: { errorMessage: errMsg, code, language }
          }));
        }
      } catch (err) {
        setOutput(`API Error: ${err.message}`);
        window.dispatchEvent(new CustomEvent('playgroundCodeError', {
          detail: { errorMessage: `API Error: ${err.message}`, code, language }
        }));
      }
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    if (mode === 'web') {
      setHtmlCode(defaultWeb.html);
      setCssCode(defaultWeb.css);
      setJsCode(defaultWeb.js);
    } else {
      setCode(defaultCodes[language]);
      setOutput('Console ready. Write some code and hit Run!');
    }
  };

  const handleSaveCode = async () => {
    if (!token) return alert('Please log in to save your code.');
    // In a full app, we might have separate save endpoints for web vs terminal.
    // For now, save only works properly for terminal mode in legacy setups, but we can reuse the share endpoint for "saving to profile".
    alert("Use Share to save and publish your snippets!");
  };

  const submitShare = async () => {
    setIsSharing(true);
    try {
      const payload = {
        title: shareTitle,
        description: shareDesc,
        is_public: sharePublic,
      };

      if (mode === 'web') {
        payload.language = 'web';
        payload.html_code = htmlCode;
        payload.css_code = cssCode;
        payload.code = jsCode; // Store JS in code
      } else {
        payload.language = language;
        payload.code = code;
      }

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/playground/share`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const url = `${window.location.origin}/playground?snippet=${data.id}`;
        setShareUrl(url);
        setSearchParams({ snippet: data.id });
        setOutput(`🔗 Snippet Shared! Link: ${url}`);

        if (data.streak_count !== undefined && updateUserStats) {
          updateUserStats(data.newXp, data.newLevel, data.streak_count);
        }
      } else {
        setOutput('❌ Failed to share code.');
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    }
    setIsSharing(false);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
      <div className="px-6 py-4 md:py-6 max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
        <div className="mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Code2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-textMain tracking-tight">Code Sandbox</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex bg-surface border border-surfaceBorder rounded-xl p-1">
              <button 
                onClick={() => setMode('terminal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-all ${mode === 'terminal' ? 'bg-primary text-white' : 'text-textMuted hover:text-textMain'}`}
              >
                <Terminal className="w-3.5 h-3.5" /> Terminal
              </button>
              <button 
                onClick={() => setMode('web')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-all ${mode === 'web' ? 'bg-primary text-white' : 'text-textMuted hover:text-textMain'}`}
              >
                <Globe className="w-3.5 h-3.5" /> Web
              </button>
            </div>

            <div className="w-px h-6 bg-surfaceBorder hidden sm:block mx-1" />

            {mode === 'terminal' && (
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-surface border border-surfaceBorder text-textMain rounded-xl text-xs font-bold px-3 py-2 outline-none focus:border-primary cursor-pointer uppercase tracking-widest"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            )}

            <button
              onClick={() => { setShowShareModal(true); setShareUrl(''); setShareTitle(''); setShareDesc(''); }}
              className="px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover text-textMuted hover:text-primary rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
              title="Share Snippet"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover text-textMuted hover:text-textMain rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
            
            {mode === 'terminal' && (
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-6 py-2 bg-primary hover:bg-primary-hover border border-primary-hover disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                {isRunning ? 'Running...' : 'Run'}
              </button>
            )}
          </div>
        </div>

        {/* Editor & Console / Preview Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
          {/* Editor Side */}
          <div className="flex flex-col bg-surface border border-surfaceBorder rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/5">
            <div className="px-3 py-2 bg-[#0a0a0f] border-b border-[#1e1e2e] flex flex-row items-center gap-3 overflow-x-auto">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                <div className="w-3 h-3 rounded-full bg-success/80"></div>
              </div>
              
              {mode === 'terminal' ? (
                <span className="text-[10px] font-mono text-textMuted bg-[#1e1e2e]/50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
                </span>
              ) : (
                <div className="flex gap-1">
                  {['html', 'css', 'js'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveWebTab(tab)}
                      className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest transition-all ${
                        activeWebTab === tab ? 'bg-primary/20 text-primary-light border border-primary/30' : 'text-textMuted hover:bg-[#1e1e2e]'
                      }`}
                    >
                      index.{tab}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex-1 bg-[#0a0a0f] relative group flex flex-col min-h-[300px] pt-2">
              <Editor
                height="100%"
                language={mode === 'terminal' ? (language === 'cpp' ? 'cpp' : language) : (activeWebTab === 'js' ? 'javascript' : activeWebTab)}
                theme="vs-dark"
                value={mode === 'terminal' ? code : activeWebTab === 'html' ? htmlCode : activeWebTab === 'css' ? cssCode : jsCode}
                onChange={(val) => {
                  if (mode === 'terminal') setCode(val);
                  else if (activeWebTab === 'html') setHtmlCode(val);
                  else if (activeWebTab === 'css') setCssCode(val);
                  else setJsCode(val);
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                }}
              />
            </div>
          </div>

          {/* Console / Preview Side */}
          <div className="flex flex-col bg-[#0a0a0f] border border-surfaceBorder rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/5">
            <div className="px-4 py-2 border-b border-[#1e1e2e] flex flex-row items-center gap-3">
              {mode === 'terminal' ? <Terminal className="w-4 h-4 text-textMuted" /> : <Globe className="w-4 h-4 text-textMuted" />}
              <span className="text-[11px] font-mono text-textMuted uppercase tracking-widest font-bold">
                {mode === 'terminal' ? 'Output Console' : 'Live Preview'}
              </span>
            </div>
            
            {mode === 'terminal' ? (
              <div className="flex-1 p-6 overflow-y-auto font-mono text-xs sm:text-sm leading-loose">
                {output ? (
                  <pre className={`whitespace-pre-wrap break-words ${
                    output.includes('Error') || output.includes('[Error]') 
                      ? 'text-danger/90' 
                      : output === '⏳ Running...'
                        ? 'text-warning/90 animate-pulse'
                        : 'text-[#a6accd]'
                  }`}>
                    {output}
                  </pre>
                ) : (
                  <span className="text-textDim italic">Awaiting execution...</span>
                )}
              </div>
            ) : (
              <div className="flex-1 bg-white relative">
                <iframe
                  srcDoc={srcDoc}
                  title="Web Preview"
                  sandbox="allow-scripts allow-modals"
                  className="absolute inset-0 w-full h-full border-0 bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-surfaceBorder rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-textMuted hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black mb-1">Share Snippet</h2>
            <p className="text-sm text-textMuted mb-6">Create a link to share this code, or publish it to the Explore feed!</p>
            
            {!shareUrl ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Title (Optional)</label>
                  <input 
                    type="text" 
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder="e.g. Cool CSS Animation" 
                    className="w-full bg-background-light border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description (Optional)</label>
                  <textarea 
                    value={shareDesc}
                    onChange={(e) => setShareDesc(e.target.value)}
                    placeholder="What does this code do?" 
                    className="w-full bg-background-light border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none h-20"
                  />
                </div>
                <label className="flex items-center gap-3 p-3 border border-white/5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={sharePublic}
                    onChange={(e) => setSharePublic(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/50 bg-background-light border-white/20"
                  />
                  <div>
                    <div className="text-sm font-bold text-white">Publish to Explore Feed</div>
                    <div className="text-xs text-gray-400">Allow others to see and upvote your snippet.</div>
                  </div>
                </label>
                
                <button 
                  onClick={submitShare}
                  disabled={isSharing}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm mt-2 transition-all flex justify-center items-center gap-2"
                >
                  {isSharing ? 'Generating Link...' : 'Create Share Link'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-success uppercase tracking-widest">Share URL</span>
                    {shareCopied && <span className="text-xs font-bold text-success">Copied!</span>}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareUrl} 
                      className="flex-1 bg-background-light border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none"
                    />
                    <button 
                      onClick={copyShareLink}
                      className="p-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-2 bg-surfaceBorder hover:bg-surfaceBorderHover text-white rounded-xl font-bold text-sm transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
