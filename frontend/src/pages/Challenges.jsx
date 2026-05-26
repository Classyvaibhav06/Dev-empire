import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, Code2, AlertCircle, CheckCircle, Flame, Star, Play, Award, Sparkles, RefreshCw, X } from 'lucide-react';
import { Card, Badge } from '../components/ui/Shared';
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
    fontSize: '13px',
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

const CHALLENGES_DATA = [
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'Beginner',
    xp: 100,
    category: 'Algorithms',
    description: 'Write a function reverseString(str) that takes a string input and returns that string reversed. For example, "hello" should return "olleh".',
    starterCode: `function reverseString(str) {\n  // Write your code here\n  return str;\n}`,
    testCases: [
      { input: ['"hello"'], expected: 'olleh', check: (fn) => fn('hello') === 'olleh' },
      { input: ['"dev-empire"'], expected: 'eripme-ved', check: (fn) => fn('dev-empire') === 'eripme-ved' }
    ]
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz Classic',
    difficulty: 'Beginner',
    xp: 150,
    category: 'Logic',
    description: 'Write a function fizzBuzz(n) that returns "Fizz" if n is divisible by 3, "Buzz" if n is divisible by 5, and "FizzBuzz" if n is divisible by both 3 and 5. Otherwise, return the number itself as a string.',
    starterCode: `function fizzBuzz(n) {\n  // Write your code here\n  return "";\n}`,
    testCases: [
      { input: [3], expected: 'Fizz', check: (fn) => fn(3) === 'Fizz' },
      { input: [5], expected: 'Buzz', check: (fn) => fn(5) === 'Buzz' },
      { input: [15], expected: 'FizzBuzz', check: (fn) => fn(15) === 'FizzBuzz' },
      { input: [7], expected: '7', check: (fn) => String(fn(7)) === '7' }
    ]
  },
  {
    id: 'palindrome',
    title: 'Palindrome Checker',
    difficulty: 'Intermediate',
    xp: 250,
    category: 'Algorithms',
    description: 'Write a function isPalindrome(str) that returns true if the input string is a palindrome (reads the same forward and backward, ignoring casing and non-alphanumeric characters), and false otherwise.',
    starterCode: `function isPalindrome(str) {\n  // Write your code here\n  return false;\n}`,
    testCases: [
      { input: ['"racecar"'], expected: 'true', check: (fn) => fn('racecar') === true },
      { input: ['"A man, a plan, a canal. Panama"'], expected: 'true', check: (fn) => fn('A man, a plan, a canal. Panama') === true },
      { input: ['"hello"'], expected: 'false', check: (fn) => fn('hello') === false }
    ]
  }
];

// ── CodeMirror extensions ──
const editorExtensions = [
  javascript({ jsx: true }),
  autocompletion(),
  closeBrackets(),
];

export default function Challenges() {
  const { token, updateUserStats } = useContext(AuthContext);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [outputConsole, setOutputConsole] = useState('');
  const [completedList, setCompletedList] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [xpToast, setXpToast] = useState(null);

  useEffect(() => {
    if (selectedChallenge) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedChallenge]);

  useEffect(() => {
    const savedCompleted = localStorage.getItem('completed_challenges');
    const list = savedCompleted ? JSON.parse(savedCompleted) : [];
    setCompletedList(list);
    const earnedXp = CHALLENGES_DATA.reduce((acc, curr) => {
      if (list.includes(curr.id)) return acc + curr.xp;
      return acc;
    }, 0);
    setTotalXP(earnedXp);
  }, []);

  const showXpToast = (msg) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 3500);
  };

  const openPlayground = (challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode);
    setTestResults(null);
    setOutputConsole('Code loaded. Ready to run tests.');
  };

  const handleRunTests = async () => {
    if (!selectedChallenge) return;
    setOutputConsole('⏳ Compiling and running test cases...');
    try {
      const fnMatch = selectedChallenge.starterCode.match(/function\s+([a-zA-Z0-9_]+)/);
      const fnName = fnMatch ? fnMatch[1] : null;
      if (!fnName) throw new Error('Invalid challenge configuration: no function name found.');

      const userFn = new Function(`${code}\nreturn typeof ${fnName} !== 'undefined' ? ${fnName} : null;`)();
      if (typeof userFn !== 'function') throw new Error('Your code does not define the required function.');

      let allPassed = true;
      let logs = [];
      selectedChallenge.testCases.forEach((tc, index) => {
        try {
          const pass = tc.check(userFn);
          if (pass) {
            logs.push(`✓  Test ${index + 1} PASSED  |  Input: ${tc.input.join(', ')}  →  ${tc.expected}`);
          } else {
            allPassed = false;
            logs.push(`✗  Test ${index + 1} FAILED  |  Input: ${tc.input.join(', ')}  →  Expected: ${tc.expected}`);
          }
        } catch (e) {
          allPassed = false;
          logs.push(`✗  Test ${index + 1} ERROR   |  ${e.message}`);
        }
      });

      setOutputConsole(logs.join('\n'));
      setTestResults(allPassed ? 'success' : 'fail');

      if (allPassed) {
        const alreadyDone = completedList.includes(selectedChallenge.id);
        const updated = [...new Set([...completedList, selectedChallenge.id])];
        setCompletedList(updated);
        localStorage.setItem('completed_challenges', JSON.stringify(updated));
        const earnedXp = CHALLENGES_DATA.reduce((acc, curr) => updated.includes(curr.id) ? acc + curr.xp : acc, 0);
        setTotalXP(earnedXp);

        if (token && !alreadyDone) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/user/challenge`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ challengeId: selectedChallenge.id })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.xpAdded > 0) {
                updateUserStats(data.newXp, data.newLevel);
                showXpToast(`🎉 +${data.xpAdded} XP earned! You're now Level ${data.newLevel}!`);
              } else {
                showXpToast('✅ Challenge already counted — no extra XP.');
              }
            }
          } catch (e) {
            console.error('Failed to sync challenge to DB:', e);
          }
        } else if (!token) {
          showXpToast(`🏆 Challenge complete! Sign in to sync your +${selectedChallenge.xp} XP.`);
        }
      }
    } catch (err) {
      setOutputConsole(`Compilation Error: ${err.message}`);
      setTestResults('fail');
    }
  };

  const resetChallenge = () => {
    if (selectedChallenge) {
      setCode(selectedChallenge.starterCode);
      setTestResults(null);
      setOutputConsole('↺  Reset successful. Starter code reloaded.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-fade-in relative z-10 flex-1 flex flex-col">

      {/* XP Toast */}
      {xpToast && (
        <div className="fixed bottom-8 right-8 z-[9999] bg-surface border border-primary/30 text-textMain px-6 py-4 rounded-2xl shadow-2xl shadow-primary/10 text-sm font-bold animate-slide-up flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          {xpToast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-surfaceBorder pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-textMain flex items-center gap-3">
            <Trophy className="w-10 h-10 text-primary" /> Coding Challenges
          </h1>
          <p className="text-textMuted mt-1">Solve algorithmic problems to earn XP and level up your skills.</p>
        </div>
        <div className="flex gap-4">
          <div className="surface px-5 py-3 rounded-2xl border border-surfaceBorder flex items-center gap-3 shadow-sm">
            <Flame className="w-6 h-6 text-warning fill-warning/20 animate-pulse" />
            <div>
              <div className="text-lg font-black leading-none">{totalXP} XP</div>
              <span className="text-[9px] uppercase tracking-widest text-textDim font-bold">Total Earned</span>
            </div>
          </div>
          <div className="surface px-5 py-3 rounded-2xl border border-surfaceBorder flex items-center gap-3 shadow-sm">
            <Award className="w-6 h-6 text-accent" />
            <div>
              <div className="text-lg font-black leading-none">{completedList.length} / {CHALLENGES_DATA.length}</div>
              <span className="text-[9px] uppercase tracking-widest text-textDim font-bold">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {CHALLENGES_DATA.map((challenge) => {
          const isDone = completedList.includes(challenge.id);
          return (
            <Card key={challenge.id} hover={!isDone} className={`flex flex-col justify-between min-h-[250px] relative overflow-hidden ${isDone ? 'border-success/30 bg-success/5 opacity-90' : ''}`}>
              {isDone && (
                <div className="absolute top-0 right-0 bg-success text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> Done
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={challenge.difficulty === 'Beginner' ? 'success' : 'warning'}>{challenge.difficulty}</Badge>
                  <span className="text-[10px] text-textDim font-bold uppercase tracking-wider">{challenge.category}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-textMain">{challenge.title}</h3>
                <p className="text-sm text-textMuted line-clamp-3 leading-relaxed mb-6">{challenge.description}</p>
              </div>
              <div className="border-t border-surfaceBorder pt-4 mt-auto flex justify-between items-center">
                <div className="flex items-center gap-1 text-primary font-bold text-sm">
                  <Star className="w-4 h-4 text-warning fill-warning/20" />
                  <span>+{challenge.xp} XP</span>
                </div>
                <button
                  onClick={() => openPlayground(challenge)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${isDone ? 'bg-success/15 text-success hover:bg-success/20' : 'bg-primary text-white hover:bg-primary-hover shadow-sm'}`}
                >
                  <Play className="w-3.5 h-3.5" />
                  {isDone ? 'Review' : 'Solve'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Solving Sandbox Modal */}
      {selectedChallenge && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setSelectedChallenge(null)}
          />

          <div className="relative w-full max-w-4xl h-screen bg-[#0d0d14] border-l border-white/5 shadow-2xl flex flex-col z-[110] animate-slide-in">

            {/* Modal Header — VSCode-style title bar */}
            <div className="px-5 py-3 border-b border-white/5 bg-[#0a0a10] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Decorative window dots */}
                <div className="flex items-center gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <Code2 className="w-4 h-4 text-primary/70" />
                <div>
                  <h2 className="font-black text-sm tracking-tight text-white/90">{selectedChallenge.title}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={selectedChallenge.difficulty === 'Beginner' ? 'success' : 'warning'}>
                      {selectedChallenge.difficulty}
                    </Badge>
                    <span className="text-[10px] text-white/30 font-bold uppercase">Reward: +{selectedChallenge.xp} XP</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/90 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Split Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

              {/* Left: Instructions Panel */}
              <div className="w-full lg:w-[300px] shrink-0 flex flex-col border-r border-white/5 overflow-y-auto bg-[#0a0a10]">
                {/* Description */}
                <div className="p-5 border-b border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Problem</p>
                  <p className="text-sm text-white/60 leading-relaxed">{selectedChallenge.description}</p>
                </div>

                {/* Test Cases */}
                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Test Cases</p>
                  <div className="space-y-2">
                    {selectedChallenge.testCases.map((tc, idx) => (
                      <div key={idx} className="rounded-lg border border-white/5 bg-white/3 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/25">Case {idx + 1}</span>
                          {testResults && (
                            <span className={`text-[9px] font-black uppercase tracking-wider ${testResults === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {testResults === 'success' ? '● pass' : '● fail'}
                            </span>
                          )}
                        </div>
                        <code className="text-xs text-violet-400 font-mono block">Input: {tc.input.join(', ')}</code>
                        <code className="text-xs text-emerald-400 font-mono block">Output: {tc.expected}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Editor + Console */}
              <div className="flex-1 flex flex-col overflow-hidden">

                {/* Editor Tab Bar */}
                <div className="px-4 border-b border-white/5 bg-[#0a0a10] flex items-center justify-between shrink-0">
                  {/* File tab */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-r border-white/5 border-t border-t-primary/60 bg-[#0d0d14] text-white/70 text-xs font-mono">
                      <Code2 className="w-3 h-3 text-yellow-400" />
                      solution.js
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 py-1">
                    <button
                      onClick={resetChallenge}
                      title="Reset to starter code"
                      className="p-1.5 rounded-md hover:bg-white/10 text-white/30 hover:text-white/70 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                </div>

                {/* CodeMirror Editor */}
                <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                  <CodeMirror
                    value={code}
                    onChange={setCode}
                    theme={oneDark}
                    extensions={[...editorExtensions, devEmpireTheme]}
                    height="100%"
                    style={{ height: '100%', fontSize: '13px' }}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      highlightActiveLineGutter: true,
                      highlightActiveLine: true,
                      autocompletion: true,
                      closeBrackets: true,
                      indentOnInput: true,
                      tabSize: 2,
                    }}
                  />
                </div>

                {/* Console / Output */}
                <div className="h-44 shrink-0 border-t border-white/5 flex flex-col bg-[#08080e]">
                  <div className="px-4 py-2 border-b border-white/5 bg-[#0a0a10] flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${testResults === 'success' ? 'bg-emerald-400 animate-pulse' : testResults === 'fail' ? 'bg-red-400' : 'bg-white/20'}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Output Console</span>
                    </div>
                    {testResults === 'success' && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> All Tests Passed!
                      </span>
                    )}
                    {testResults === 'fail' && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Some Tests Failed
                      </span>
                    )}
                  </div>
                  <pre className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap text-white/50 select-text">
                    {outputConsole}
                  </pre>
                </div>

              </div>
            </div>

            {/* Footer Action Bar */}
            <div className="px-5 py-3 border-t border-white/5 bg-[#0a0a10] flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Close
              </button>
              <button
                onClick={handleRunTests}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Play className="w-4 h-4 fill-white" />
                Run Tests
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
