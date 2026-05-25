import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, Code2, AlertCircle, CheckCircle, Flame, Star, Play, Award, Sparkles, RefreshCw, X, Lock } from 'lucide-react';
import { Card, Badge } from '../components/ui/Shared';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

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

export default function Challenges() {
  const { token, user, updateUserStats, setAuthModalOpen } = useContext(AuthContext);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null); // 'idle' | 'success' | 'fail'
  const [outputConsole, setOutputConsole] = useState('');
  const [completedList, setCompletedList] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [xpToast, setXpToast] = useState(null);

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (selectedChallenge) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedChallenge]);

  useEffect(() => {
    const savedCompleted = localStorage.getItem('completed_challenges');
    const list = savedCompleted ? JSON.parse(savedCompleted) : [];
    setCompletedList(list);

    // Sum XP from local list
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
    setOutputConsole('Compiling and running test cases...');
    
    try {
      // Extract function name from starter code to evaluate properly
      const fnMatch = selectedChallenge.starterCode.match(/function\s+([a-zA-Z0-9_]+)/);
      const fnName = fnMatch ? fnMatch[1] : null;

      if (!fnName) {
        throw new Error('Invalid challenge configuration: no function name found in starter code.');
      }

      const userFn = new Function(`
        ${code}
        return typeof ${fnName} !== 'undefined' ? ${fnName} : null;
      `)();

      if (typeof userFn !== 'function') {
        throw new Error('Your code does not resolve to a function.');
      }

      let allPassed = true;
      let logs = [];

      selectedChallenge.testCases.forEach((tc, index) => {
        try {
          const pass = tc.check(userFn);
          if (pass) {
            logs.push(`✓ Test Case ${index + 1}: Passed (Input: ${tc.input.join(', ')} | Expected: ${tc.expected})`);
          } else {
            allPassed = false;
            logs.push(`❌ Test Case ${index + 1}: Failed (Input: ${tc.input.join(', ')} | Expected: ${tc.expected})`);
          }
        } catch (e) {
          allPassed = false;
          logs.push(`❌ Test Case ${index + 1}: Error (${e.message})`);
        }
      });

      setOutputConsole(logs.join('\n'));
      setTestResults(allPassed ? 'success' : 'fail');

      if (allPassed) {
        const alreadyDone = completedList.includes(selectedChallenge.id);

        // Update local state
        const updated = [...new Set([...completedList, selectedChallenge.id])];
        setCompletedList(updated);
        localStorage.setItem('completed_challenges', JSON.stringify(updated));

        // Re-calculate local XP display
        const earnedXp = CHALLENGES_DATA.reduce((acc, curr) => {
          if (updated.includes(curr.id)) return acc + curr.xp;
          return acc;
        }, 0);
        setTotalXP(earnedXp);

        // Sync to DB if logged in
        if (token && !alreadyDone) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/user/challenge`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
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
          showXpToast(`🏆 Challenge complete! Sign in to sync your +${selectedChallenge.xp} XP to your profile.`);
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
      setOutputConsole('Reset successful. Code reloaded.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-fade-in relative z-10 flex-1 flex flex-col">
      {/* Header Profile Stats */}
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
              <div className="text-lg font-black leading-none">
                {completedList.length} / {CHALLENGES_DATA.length}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-textDim font-bold">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {CHALLENGES_DATA.map((challenge) => {
          const isDone = completedList.includes(challenge.id);
          return (
            <Card key={challenge.id} hover={!isDone} className={`flex flex-col justify-between min-h-[250px] relative overflow-hidden ${
              isDone ? 'border-success/30 bg-success/5 opacity-90' : ''
            }`}>
              {isDone && (
                <div className="absolute top-0 right-0 bg-success text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> Done
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant={challenge.difficulty === 'Beginner' ? 'success' : 'warning'}>
                    {challenge.difficulty}
                  </Badge>
                  <span className="text-[10px] text-textDim font-bold uppercase tracking-wider">{challenge.category}</span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-textMain">{challenge.title}</h3>
                <p className="text-sm text-textMuted line-clamp-3 leading-relaxed mb-6">
                  {challenge.description}
                </p>
              </div>

              <div className="border-t border-surfaceBorder pt-4 mt-auto flex justify-between items-center">
                <div className="flex items-center gap-1 text-primary font-bold text-sm">
                  <Star className="w-4 h-4 text-warning fill-warning/20" />
                  <span>+{challenge.xp} XP</span>
                </div>

                <button
                  onClick={() => openPlayground(challenge)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 ${
                    isDone 
                      ? 'bg-success/15 text-success hover:bg-success/20' 
                      : 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  {isDone ? 'Review' : 'Solve'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Solving Sandbox Modal / Overlay Panel */}
      {selectedChallenge && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <div 
            className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedChallenge(null)}
          />

          <div className="relative w-full max-w-4xl h-screen bg-surface border-l border-surfaceBorder shadow-2xl flex flex-col z-[110] animate-slide-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-surfaceBorder bg-surfaceLight flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code2 className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="font-black text-lg tracking-tight text-textMain">{selectedChallenge.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selectedChallenge.difficulty === 'Beginner' ? 'success' : 'warning'}>
                      {selectedChallenge.difficulty}
                    </Badge>
                    <span className="text-[10px] text-textDim font-bold uppercase">Reward: +{selectedChallenge.xp} XP</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedChallenge(null)}
                className="p-2 rounded-full hover:bg-surfaceHover text-textMuted hover:text-textMain transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Workspace */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left Side: Challenge Instructions */}
              <div className="w-full lg:w-1/3 p-6 border-r border-surfaceBorder overflow-y-auto space-y-6 bg-surfaceLight/50">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-textDim mb-2">Instructions</h4>
                  <p className="text-sm text-textMuted leading-relaxed bg-background border border-surfaceBorder p-4 rounded-xl shadow-inner">
                    {selectedChallenge.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-textDim mb-2">Expected Behavior</h4>
                  <div className="space-y-2">
                    {selectedChallenge.testCases.map((tc, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-surfaceBorder bg-background text-xs text-textMuted">
                        <span>Case {idx + 1} Input: <code className="text-accent font-mono">{tc.input.join(', ')}</code></span>
                        <span className="font-mono text-success">➔ {tc.expected}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: IDE and Output Console */}
              <div className="flex-1 flex flex-col overflow-hidden bg-background">
                {/* Editor Tab Header */}
                <div className="px-5 py-3 border-b border-surfaceBorder bg-surfaceLight flex items-center justify-between text-xs">
                  <span className="font-mono text-textMuted">// sandbox_workspace.js</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={resetChallenge}
                      title="Reset starter code"
                      className="p-1.5 rounded hover:bg-surfaceHover hover:text-textMain text-textDim transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Textarea Code Editor */}
                <div className="flex-1 relative font-mono text-xs">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-5 bg-background text-textMain border-none focus:ring-0 focus:outline-none resize-none font-mono leading-relaxed"
                    spellCheck="false"
                  />
                </div>

                {/* Console Output Log */}
                <div className="h-44 border-t border-surfaceBorder bg-surfaceLight/90 flex flex-col">
                  <div className="px-5 py-2 border-b border-surfaceBorder bg-surfaceLight flex justify-between items-center text-[10px] font-black text-textDim uppercase tracking-wider">
                    <span>Terminal / Test Outputs</span>
                    {testResults === 'success' && (
                      <span className="text-success font-black uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> All Tests Passed!
                      </span>
                    )}
                  </div>
                  <pre className="flex-1 p-4 overflow-y-auto font-mono text-xs text-textMuted leading-relaxed whitespace-pre-wrap select-text selection:bg-primary/20">
                    {outputConsole}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-surfaceBorder bg-surfaceLight flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedChallenge(null)}
                className="px-5 py-3 bg-surface hover:bg-surfaceHover text-textMain border border-surfaceBorder rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Close
              </button>
              <button 
                onClick={handleRunTests}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md shadow-primary/10"
              >
                <Play className="w-4 h-4 fill-white" />
                Run Code Tests
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
