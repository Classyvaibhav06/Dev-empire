import React, { useState, useContext } from 'react';
import { Code2, Play, Terminal, RefreshCw, Save, Download } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';

// ── Custom theme to blend with Dev Empire's design ──
const devEmpireTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
    height: '100%',
    backgroundColor: 'transparent',
  },
  '.cm-editor': {
    height: '100%',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
    lineHeight: '1.75',
  },
  '.cm-content': {
    padding: '16px 0',
    caretColor: '#7C3AED',
  },
  '.cm-gutters': {
    backgroundColor: '#0a0a0f',
    borderRight: '1px solid #1e1e2e',
    color: '#4a4a6a',
    minWidth: '52px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    paddingRight: '16px',
    paddingLeft: '8px',
  },
  '.cm-activeLine': {
    backgroundColor: '#7C3AED15',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#7C3AED20',
    color: '#9d78f5',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#7C3AED35',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#7C3AED40',
  },
  '.cm-cursor': {
    borderLeftColor: '#7C3AED',
    borderLeftWidth: '2px',
  },
  '.cm-matchingBracket': {
    backgroundColor: '#7C3AED30',
    color: '#c4b5fd !important',
    outline: '1px solid #7C3AED60',
    borderRadius: '2px',
  },
  '.cm-tooltip': {
    backgroundColor: '#13131f',
    border: '1px solid #1e1e2e',
    borderRadius: '8px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul': {
    fontFamily: '"Fira Code", monospace',
    fontSize: '12px',
    maxHeight: '200px',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li': {
    padding: '4px 12px',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
    backgroundColor: '#7C3AED40',
    color: '#c4b5fd',
  },
});

const theme = oneDark;
const extensions = [
  devEmpireTheme,
  javascript({ jsx: true }),
  autocompletion(),
  closeBrackets()
];

const DEFAULT_CODE = `// Dev Empire Interactive Playground
// Write your JavaScript code here and hit Run!

const coder = {
  name: "Alex",
  skills: ["React", "Node.js", "MongoDB"],
  level: 42,
  isReady: true
};

function levelUp(user) {
  if (user.isReady) {
    console.log(\`⚡ \${user.name} is leveling up...\`);
    user.level += 1;
    console.log(\`🎉 Level up successful! New level: \${user.level}\`);
  }
}

levelUp(coder);

// Try mapping through the skills array!
console.log("\\nSkills:");
coder.skills.forEach(skill => {
  console.log(\` - \${skill}\`);
});
`;

export default function Playground() {
  const { token } = useContext(AuthContext);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('Console ready. Write some code and hit Run!');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Expose context for AI Assistant
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('playgroundCodeUpdate', { detail: code }));
  }, [code]);

  // Cleanup only on unmount
  React.useEffect(() => {
    return () => window.dispatchEvent(new CustomEvent('playgroundCodeUpdate', { detail: null }));
  }, []);


  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('⏳ Running...');

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
        error: (...args) => {
          logs.push(`[Error]: ${args.join(' ')}`);
        },
        warn: (...args) => {
          logs.push(`[Warn]: ${args.join(' ')}`);
        }
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
    }, 300); // slight simulated delay for effect
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
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
              Experiment with JavaScript safely in your browser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <>
                <button
                  onClick={handleLoadCode}
                  disabled={isLoading || isRunning}
                  className="px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover hover:border-textDim text-textMuted hover:text-accent rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                  title="Load Saved Code"
                >
                  <Download className="w-4 h-4" /> Load
                </button>
                <button
                  onClick={handleSaveCode}
                  disabled={isSaving || isRunning}
                  className="px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover hover:border-textDim text-textMuted hover:text-primary rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                  title="Save Code to Cloud"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
                <div className="w-px h-6 bg-surfaceBorder hidden sm:block mx-1" />
              </>
            )}

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-surface border border-surfaceBorder hover:bg-surfaceHover hover:border-textDim text-textMuted hover:text-textMain rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-6 py-2 bg-primary hover:bg-primary-hover border border-primary-hover disabled:opacity-50 disabled:hover:bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]"
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
                playground.js
              </span>
            </div>
            <div className="flex-1 bg-[#0a0a0f] relative group flex flex-col min-h-[300px]">
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
              <CodeMirror
                value={code}
                height="100%"
                theme={theme}
                extensions={extensions}
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
                  output.includes('Execution Error') || output.includes('[Error]') 
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
