import React, { useState, useEffect, useContext } from 'react';
import { Code2, Play, Terminal, RefreshCw, Save, Download, Share2, Link as LinkIcon, Check } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';
import { useSearchParams } from 'react-router-dom';

const devEmpireTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
    height: '100%',
    backgroundColor: 'transparent',
  },
  '.cm-editor': { height: '100%' },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
    lineHeight: '1.75',
  },
  '.cm-content': { padding: '16px 0', caretColor: '#7C3AED' },
  '.cm-gutters': {
    backgroundColor: '#0a0a0f',
    borderRight: '1px solid #1e1e2e',
    color: '#4a4a6a',
    minWidth: '52px',
  },
  '.cm-lineNumbers .cm-gutterElement': { paddingRight: '16px', paddingLeft: '8px' },
  '.cm-activeLine': { backgroundColor: '#7C3AED15' },
  '.cm-activeLineGutter': { backgroundColor: '#7C3AED20', color: '#9d78f5' },
  '.cm-selectionBackground': { backgroundColor: '#7C3AED35' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: '#7C3AED40' },
  '.cm-cursor': { borderLeftColor: '#7C3AED', borderLeftWidth: '2px' },
  '.cm-matchingBracket': {
    backgroundColor: '#7C3AED30',
    color: '#c4b5fd !important',
    outline: '1px solid #7C3AED60',
    borderRadius: '2px',
  },
});

const theme = oneDark;

const defaultCodes = {
  javascript: `// Dev Empire Interactive Playground
// Write your JavaScript code here and hit Run!

const coder = {
  name: "Alex",
  skills: ["React", "Node.js", "MongoDB"],
  level: 42
};

console.log(\`⚡ \${coder.name} is ready for action!\`);
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

export default function Playground() {
  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCodes['javascript']);
  const [output, setOutput] = useState('Console ready. Write some code and hit Run!');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync current code to GlobalAssistant context
  useEffect(() => {
    const event = new CustomEvent('playgroundCodeUpdate', { detail: code });
    window.dispatchEvent(event);
    return () => {
      window.dispatchEvent(new CustomEvent('playgroundCodeUpdate', { detail: null }));
    };
  }, [code]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Load snippet from URL if present
  useEffect(() => {
    const snippetId = searchParams.get('snippet');
    if (snippetId) {
      loadSnippet(snippetId);
    }
  }, []);

  const loadSnippet = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/playground/snippet/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLanguage(data.language);
        setCode(data.code);
        setOutput(`✅ Loaded shared snippet (${data.language})`);
      } else {
        setOutput('❌ Failed to load shared snippet. It may have expired or does not exist.');
      }
    } catch (err) {
      setOutput(`❌ Error loading snippet: ${err.message}`);
    }
    setIsLoading(false);
  };

  const getLanguageExtension = () => {
    switch(language) {
      case 'javascript': return javascript({ jsx: true });
      case 'python': return python();
      case 'cpp': return cpp();
      case 'java': return java();
      default: return javascript();
    }
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultCodes[newLang]);
    setOutput('Console ready. Write some code and hit Run!');
  };

  const handleRunCode = async () => {
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
            setOutput(logs.join('\\n'));
          } else {
            setOutput('Code executed successfully (no console output).');
          }
        } catch (err) {
          setOutput(`Execution Error: ${err.message}`);
        }
        setIsRunning(false);
      }, 300);
    } else {
      // Run via Backend Piston API
      try {
        const res = await fetch(`${API_BASE_URL}/api/playground/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language })
        });
        const data = await res.json();
        
        if (data.compile && data.compile.code !== 0) {
          setOutput(`Compilation Error:\n${data.compile.output}`);
        } else if (data.run) {
          setOutput(data.run.output || 'Code executed successfully (no console output).');
        } else {
          setOutput(`Execution Error: ${data.message || 'Unknown error'}`);
        }
      } catch (err) {
        setOutput(`API Error: ${err.message}`);
      }
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(defaultCodes[language]);
    setOutput('Console ready. Write some code and hit Run!');
  };

  const handleSaveCode = async () => {
    if (!token) return alert('Please log in to save your code.');
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/playground/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        setOutput('✅ Code saved successfully to your cloud storage.');
      } else {
        setOutput('❌ Failed to save code.');
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    }
    setIsSaving(false);
  };

  const handleLoadCode = async () => {
    if (!token) return alert('Please log in to load your code.');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/playground/load`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCode(data.code);
        setLanguage('javascript'); // legacy saves were JS only
        setOutput('✅ Code loaded successfully from cloud storage.');
      } else if (res.status === 404) {
        setOutput('ℹ️ No saved code found for your account.');
      } else {
        setOutput('❌ Failed to load code.');
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    }
    setIsLoading(false);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/playground/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (res.ok) {
        const data = await res.json();
        const url = `${window.location.origin}/playground?snippet=${data.id}`;
        navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 3000);
        setSearchParams({ snippet: data.id });
        setOutput(`🔗 Snippet Shared! Link copied to clipboard:\n${url}`);
      } else {
        setOutput('❌ Failed to share code.');
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    }
    setIsSharing(false);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background">
      <div className="px-6 py-8 md:py-12 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Code2 className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-textMain tracking-tight">Code Sandbox</h1>
            </div>
            <p className="text-textMuted text-sm md:text-base leading-relaxed">
              Experiment with multiple languages safely in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-surface border border-surfaceBorder text-textMain rounded-xl text-sm font-bold px-3 py-2 outline-none focus:border-primary cursor-pointer uppercase tracking-widest"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            
            <div className="w-px h-6 bg-surfaceBorder hidden sm:block mx-1" />

            <button
              onClick={handleShare}
              disabled={isSharing}
              className="px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover text-textMuted hover:text-primary rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
              title="Share Code"
            >
              {shareCopied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
              {shareCopied ? 'Copied!' : 'Share'}
            </button>

            {token && (
              <>
                <button
                  onClick={handleLoadCode}
                  disabled={isLoading || isRunning}
                  className="hidden sm:flex px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover text-textMuted hover:text-accent rounded-xl text-xs font-bold uppercase tracking-widest transition-all items-center gap-2 shadow-sm"
                  title="Load Saved Code"
                >
                  <Download className="w-4 h-4" /> Load
                </button>
                <button
                  onClick={handleSaveCode}
                  disabled={isSaving || isRunning}
                  className="hidden sm:flex px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover text-textMuted hover:text-primary rounded-xl text-xs font-bold uppercase tracking-widest transition-all items-center gap-2 shadow-sm"
                  title="Save Code to Cloud"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </>
            )}

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover text-textMuted hover:text-textMain rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-6 py-2 bg-primary hover:bg-primary-hover border border-primary-hover disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
            >
              <Play className="w-4 h-4 fill-white" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Editor & Console Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
          {/* Editor Side */}
          <div className="flex flex-col bg-surface border border-surfaceBorder rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/5">
            <div className="px-4 py-3 bg-[#0a0a0f] border-b border-[#1e1e2e] flex flex-row items-center gap-3">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                <div className="w-3 h-3 rounded-full bg-success/80"></div>
              </div>
              <span className="text-[11px] font-mono text-textMuted bg-[#1e1e2e]/50 px-3 py-1 rounded-full uppercase tracking-widest">
                main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
              </span>
            </div>
            <div className="flex-1 bg-[#0a0a0f] relative group flex flex-col min-h-[300px]">
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <CodeMirror
                value={code}
                height="100%"
                theme={theme}
                extensions={[devEmpireTheme, getLanguageExtension(), autocompletion(), closeBrackets()]}
                onChange={(val) => setCode(val)}
                className="flex-1 h-full z-10 overflow-hidden [&>.cm-editor]:h-full"
              />
            </div>
          </div>

          {/* Console Side */}
          <div className="flex flex-col bg-[#0a0a0f] border border-surfaceBorder rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/5">
            <div className="px-4 py-3 border-b border-[#1e1e2e] flex flex-row items-center gap-3">
              <Terminal className="w-4 h-4 text-textMuted" />
              <span className="text-[11px] font-mono text-textMuted uppercase tracking-widest font-bold">
                Output Console
              </span>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
