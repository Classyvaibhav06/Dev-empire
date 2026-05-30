import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, Code2, AlertCircle, CheckCircle, Flame, Star, Play, Award, Sparkles, RefreshCw, X } from 'lucide-react';
import { Card, Badge } from '../components/ui/Shared';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import Editor from '@monaco-editor/react';

const CHALLENGES_DATA = [
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    difficulty: 'Beginner',
    xp: 100,
    category: 'Algorithms',
    description: 'Write a function reverseString(str) that takes a string input and returns that string reversed. For example, "hello" should return "olleh".',
    starterCode: {
      javascript: `function reverseString(str) {\n  // Write your code here\n  return str;\n}`,
      python: `def reverseString(str):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
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
    starterCode: {
      javascript: `function fizzBuzz(n) {\n  // Write your code here\n  return "";\n}`,
      python: `def fizzBuzz(n):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
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
    starterCode: {
      javascript: `function isPalindrome(str) {\n  // Write your code here\n  return false;\n}`,
      python: `def isPalindrome(str):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['"racecar"'], expected: 'true', check: (fn) => fn('racecar') === true },
      { input: ['"A man, a plan, a canal. Panama"'], expected: 'true', check: (fn) => fn('A man, a plan, a canal. Panama') === true },
      { input: ['"hello"'], expected: 'false', check: (fn) => fn('hello') === false }
    ]
  },
  {
    id: 'find-maximum',
    title: 'Find Maximum in Array',
    difficulty: 'Beginner',
    xp: 100,
    category: 'Arrays',
    description: 'Write a function findMax(arr) that takes an array of numbers and returns the largest number in the array. If the array is empty, return null.',
    starterCode: {
      javascript: `function findMax(arr) {\n  // Write your code here\n  return null;\n}`,
      python: `def findMax(arr):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['[1, 5, 3, 9, 2]'], expected: '9', check: (fn) => fn([1, 5, 3, 9, 2]) === 9 },
      { input: ['[-10, -5, -20]'], expected: '-5', check: (fn) => fn([-10, -5, -20]) === -5 },
      { input: ['[]'], expected: 'null', check: (fn) => fn([]) === null }
    ]
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels',
    difficulty: 'Beginner',
    xp: 100,
    category: 'Strings',
    description: 'Write a function countVowels(str) that returns the number of vowels (a, e, i, o, u) in a given string. The function should be case-insensitive.',
    starterCode: {
      javascript: `function countVowels(str) {\n  // Write your code here\n  return 0;\n}`,
      python: `def countVowels(str):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['"hello"'], expected: '2', check: (fn) => fn('hello') === 2 },
      { input: ['"OpenAI"'], expected: '4', check: (fn) => fn('OpenAI') === 4 },
      { input: ['"rhythm"'], expected: '0', check: (fn) => fn('rhythm') === 0 }
    ]
  },
  {
    id: 'is-even',
    title: 'Check if Even',
    difficulty: 'Beginner',
    xp: 100,
    category: 'Math',
    description: 'Write a function isEven(num) that returns true if a number is even, and false otherwise.',
    starterCode: {
      javascript: `function isEven(num) {\n  // Write your code here\n  return false;\n}`,
      python: `def isEven(num):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: [4], expected: 'true', check: (fn) => fn(4) === true },
      { input: [7], expected: 'false', check: (fn) => fn(7) === false },
      { input: [0], expected: 'true', check: (fn) => fn(0) === true }
    ]
  },
  {
    id: 'sum-array',
    title: 'Sum of Array',
    difficulty: 'Beginner',
    xp: 100,
    category: 'Arrays',
    description: 'Write a function sumArray(arr) that calculates and returns the sum of all numbers in an array. If the array is empty, return 0.',
    starterCode: {
      javascript: `function sumArray(arr) {\n  // Write your code here\n  return 0;\n}`,
      python: `def sumArray(arr):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['[1, 2, 3, 4]'], expected: '10', check: (fn) => fn([1, 2, 3, 4]) === 10 },
      { input: ['[-1, 1, -5, 5]'], expected: '0', check: (fn) => fn([-1, 1, -5, 5]) === 0 },
      { input: ['[]'], expected: '0', check: (fn) => fn([]) === 0 }
    ]
  },
  {
    id: 'factorial',
    title: 'Calculate Factorial',
    difficulty: 'Beginner',
    xp: 100,
    category: 'Math',
    description: 'Write a function factorial(n) that returns the factorial of a given non-negative integer n. The factorial of 0 is 1.',
    starterCode: {
      javascript: `function factorial(n) {\n  // Write your code here\n  return 1;\n}`,
      python: `def factorial(n):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: [5], expected: '120', check: (fn) => fn(5) === 120 },
      { input: [0], expected: '1', check: (fn) => fn(0) === 1 },
      { input: [3], expected: '6', check: (fn) => fn(3) === 6 }
    ]
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Intermediate',
    xp: 250,
    category: 'Algorithms',
    description: 'Write a function twoSum(nums, target) that returns the indices of the two numbers in the array that add up to the target. Assume there is exactly one solution, and you may not use the same element twice. Return the indices as an array.',
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}`,
      python: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['[2, 7, 11, 15]', 9], expected: '[0, 1]', check: (fn) => { const res = fn([2, 7, 11, 15], 9); return Array.isArray(res) && res.includes(0) && res.includes(1) && res.length === 2; } },
      { input: ['[3, 2, 4]', 6], expected: '[1, 2]', check: (fn) => { const res = fn([3, 2, 4], 6); return Array.isArray(res) && res.includes(1) && res.includes(2) && res.length === 2; } },
      { input: ['[3, 3]', 6], expected: '[0, 1]', check: (fn) => { const res = fn([3, 3], 6); return Array.isArray(res) && res.includes(0) && res.includes(1) && res.length === 2; } }
    ]
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Sequence',
    difficulty: 'Intermediate',
    xp: 250,
    category: 'Recursion',
    description: 'Write a function fibonacci(n) that returns the nth number in the Fibonacci sequence. Assume fibonacci(0) = 0 and fibonacci(1) = 1.',
    starterCode: {
      javascript: `function fibonacci(n) {\n  // Write your code here\n  return 0;\n}`,
      python: `def fibonacci(n):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: [5], expected: '5', check: (fn) => fn(5) === 5 },
      { input: [10], expected: '55', check: (fn) => fn(10) === 55 },
      { input: [0], expected: '0', check: (fn) => fn(0) === 0 }
    ]
  },
  {
    id: 'anagram-checker',
    title: 'Anagram Checker',
    difficulty: 'Intermediate',
    xp: 250,
    category: 'Strings',
    description: 'Write a function isAnagram(str1, str2) that returns true if the two strings are anagrams of each other (contain the same characters in any order, ignoring spaces and casing), and false otherwise.',
    starterCode: {
      javascript: `function isAnagram(str1, str2) {\n  // Write your code here\n  return false;\n}`,
      python: `def isAnagram(str1, str2):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['"listen"', '"silent"'], expected: 'true', check: (fn) => fn('listen', 'silent') === true },
      { input: ['"Debit card"', '"Bad credit"'], expected: 'true', check: (fn) => { const s1 = 'Debit card'; const s2 = 'Bad credit'; return fn(s1, s2) === true; } },
      { input: ['"hello"', '"world"'], expected: 'false', check: (fn) => fn('hello', 'world') === false }
    ]
  },
  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates',
    difficulty: 'Intermediate',
    xp: 250,
    category: 'Arrays',
    description: 'Write a function removeDuplicates(arr) that takes an array and returns a new array with all duplicate elements removed, keeping the original order.',
    starterCode: {
      javascript: `function removeDuplicates(arr) {\n  // Write your code here\n  return [];\n}`,
      python: `def removeDuplicates(arr):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['[1, 2, 2, 3, 4, 4, 5]'], expected: '[1, 2, 3, 4, 5]', check: (fn) => { const res = fn([1, 2, 2, 3, 4, 4, 5]); return JSON.stringify(res) === JSON.stringify([1, 2, 3, 4, 5]); } },
      { input: ['["a", "b", "a", "c"]'], expected: '["a", "b", "c"]', check: (fn) => { const res = fn(["a", "b", "a", "c"]); return JSON.stringify(res) === JSON.stringify(["a", "b", "c"]); } },
      { input: ['[]'], expected: '[]', check: (fn) => { const res = fn([]); return JSON.stringify(res) === JSON.stringify([]); } }
    ]
  },
  {
    id: 'title-case',
    title: 'Title Case a Sentence',
    difficulty: 'Intermediate',
    xp: 250,
    category: 'Strings',
    description: 'Write a function titleCase(str) that returns the provided string with the first letter of each word capitalized. Make sure the rest of the word is in lower case.',
    starterCode: {
      javascript: `function titleCase(str) {\n  // Write your code here\n  return str;\n}`,
      python: `def titleCase(str):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['"I am a little tea pot"'], expected: '"I Am A Little Tea Pot"', check: (fn) => fn("I am a little tea pot") === "I Am A Little Tea Pot" },
      { input: ['"sHoRt AnD sToUt"'], expected: '"Short And Stout"', check: (fn) => fn("sHoRt AnD sToUt") === "Short And Stout" },
      { input: ['"HERE IS MY HANDLE"'], expected: '"Here Is My Handle"', check: (fn) => fn("HERE IS MY HANDLE") === "Here Is My Handle" }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Hard',
    xp: 500,
    category: 'Data Structures',
    description: 'Write a function isValidParentheses(s) that takes a string containing just the characters "(", ")", "{", "}", "[" and "]", and determines if the input string is valid. Valid means open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
    starterCode: {
      javascript: `function isValidParentheses(s) {\n  // Write your code here\n  return false;\n}`,
      python: `def isValidParentheses(s):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['"()"'], expected: 'true', check: (fn) => fn("()") === true },
      { input: ['"()[]{}"'], expected: 'true', check: (fn) => fn("()[]{}") === true },
      { input: ['"(]"'], expected: 'false', check: (fn) => fn("(]") === false },
      { input: ['"([)]"'], expected: 'false', check: (fn) => fn("([)]") === false },
      { input: ['"{[]}"'], expected: 'true', check: (fn) => fn("{[]}") === true }
    ]
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Sorted Arrays',
    difficulty: 'Hard',
    xp: 500,
    category: 'Algorithms',
    description: 'Write a function mergeSortedArrays(arr1, arr2) that merges two sorted arrays into a single new sorted array.',
    starterCode: {
      javascript: `function mergeSortedArrays(arr1, arr2) {\n  // Write your code here\n  return [];\n}`,
      python: `def mergeSortedArrays(arr1, arr2):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['[1, 3, 5]', '[2, 4, 6]'], expected: '[1, 2, 3, 4, 5, 6]', check: (fn) => JSON.stringify(fn([1, 3, 5], [2, 4, 6])) === JSON.stringify([1, 2, 3, 4, 5, 6]) },
      { input: ['[1, 2, 3]', '[4, 5, 6]'], expected: '[1, 2, 3, 4, 5, 6]', check: (fn) => JSON.stringify(fn([1, 2, 3], [4, 5, 6])) === JSON.stringify([1, 2, 3, 4, 5, 6]) },
      { input: ['[]', '[1]'], expected: '[1]', check: (fn) => JSON.stringify(fn([], [1])) === JSON.stringify([1]) }
    ]
  },
  {
    id: 'longest-word',
    title: 'Longest Word',
    difficulty: 'Hard',
    xp: 500,
    category: 'Strings',
    description: 'Write a function longestWord(str) that takes a sentence string and returns the longest word in it. If there are multiple words of the same maximum length, return the first one. Ignore punctuation.',
    starterCode: {
      javascript: `function longestWord(str) {\n  // Write your code here\n  return "";\n}`,
      python: `def longestWord(str):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['"The quick brown fox jumped over the lazy dog"'], expected: '"jumped"', check: (fn) => fn("The quick brown fox jumped over the lazy dog") === "jumped" },
      { input: ['"May the force be with you"'], expected: '"force"', check: (fn) => fn("May the force be with you") === "force" },
      { input: ['"Hello, world!"'], expected: '"Hello"', check: (fn) => fn("Hello, world!") === "Hello" }
    ]
  },
  {
    id: 'chunk-array',
    title: 'Chunk Array',
    difficulty: 'Hard',
    xp: 500,
    category: 'Arrays',
    description: 'Write a function chunkArray(arr, size) that splits an array into groups the length of size and returns them as a two-dimensional array.',
    starterCode: {
      javascript: `function chunkArray(arr, size) {\n  // Write your code here\n  return [];\n}`,
      python: `def chunkArray(arr, size):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['["a", "b", "c", "d"]', 2], expected: '[["a", "b"], ["c", "d"]]', check: (fn) => JSON.stringify(fn(["a", "b", "c", "d"], 2)) === JSON.stringify([["a", "b"], ["c", "d"]]) },
      { input: ['[0, 1, 2, 3, 4, 5]', 3], expected: '[[0, 1, 2], [3, 4, 5]]', check: (fn) => JSON.stringify(fn([0, 1, 2, 3, 4, 5], 3)) === JSON.stringify([[0, 1, 2], [3, 4, 5]]) },
      { input: ['[0, 1, 2, 3, 4, 5]', 4], expected: '[[0, 1, 2, 3], [4, 5]]', check: (fn) => JSON.stringify(fn([0, 1, 2, 3, 4, 5], 4)) === JSON.stringify([[0, 1, 2, 3], [4, 5]]) }
    ]
  },
  {
    id: 'caesar-cipher',
    title: 'Caesar Cipher',
    difficulty: 'Hard',
    xp: 500,
    category: 'Cryptography',
    description: 'Write a function caesarCipher(str, shift) that takes a string and a shift number, and returns the encrypted string where each letter is shifted by the specified amount. It should wrap around the alphabet (e.g., shifting "z" by 1 gives "a"). Assume lowercase letters for simplicity and preserve spaces.',
    starterCode: {
      javascript: `function caesarCipher(str, shift) {\n  // Write your code here\n  return str;\n}`,
      python: `def caesarCipher(str, shift):\n    # Write your code here\n    pass`,
      cpp: `// Write your C++ code here\n// Ensure you include necessary headers\n`,
      java: `// Write your Java code here\nclass Main {\n    // Add your method here\n}`
    },
    testCases: [
      { input: ['"abc"', 1], expected: '"bcd"', check: (fn) => fn("abc", 1) === "bcd" },
      { input: ['"xyz"', 3], expected: '"abc"', check: (fn) => fn("xyz", 3) === "abc" },
      { input: ['"hello world"', 5], expected: '"mjqqt btwqi"', check: (fn) => fn("hello world", 5) === "mjqqt btwqi" }
    ]
  }
];



export default function Challenges() {
  const { token, updateUserStats, setAuthModalOpen } = useContext(AuthContext);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
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
    const loadCompletedList = () => {
      const savedCompleted = localStorage.getItem('completed_challenges');
      const list = savedCompleted ? JSON.parse(savedCompleted) : [];
      setCompletedList(list);
      const earnedXp = CHALLENGES_DATA.reduce((acc, curr) => {
        if (list.includes(curr.id)) return acc + curr.xp;
        return acc;
      }, 0);
      setTotalXP(earnedXp);
    };
    loadCompletedList();
    window.addEventListener('userProgressSynced', loadCompletedList);
    return () => window.removeEventListener('userProgressSynced', loadCompletedList);
  }, []);

  const showXpToast = (msg) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 3500);
  };

  const openPlayground = (challenge) => {
    if (!token) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedChallenge(challenge);
    setLanguage('javascript');
    setCode(challenge.starterCode['javascript']);
    setTestResults(null);
    setOutputConsole('Code loaded. Ready to run tests.');
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(selectedChallenge.starterCode[newLang]);
    setTestResults(null);
    setOutputConsole(`Switched to ${newLang}. Code loaded. Ready to run.`);
  };

  const handleRunTests = async () => {
    if (!selectedChallenge) return;
    setOutputConsole('⏳ Compiling and running test cases...');
    try {
      if (language === 'javascript') {
        const fnMatch = selectedChallenge.starterCode.javascript.match(/function\s+([a-zA-Z0-9_]+)/);
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
          handleSuccess();
        }
      } else if (language === 'python') {
        const fnMatch = selectedChallenge.starterCode.python.match(/def\s+([a-zA-Z0-9_]+)/);
        const fnName = fnMatch ? fnMatch[1] : null;
        if (!fnName) throw new Error('Invalid challenge configuration: no function name found.');

        let testRunner = `\n\nimport json\nimport sys\n\ntry:\n`;
        selectedChallenge.testCases.forEach((tc, idx) => {
            let pyInput = tc.input.map(i => i === '[]' ? '[]' : i).join(', ');
            let pyExpected = tc.expected;
            if (pyExpected === 'null') pyExpected = 'None';
            if (pyExpected === 'true') pyExpected = 'True';
            if (pyExpected === 'false') pyExpected = 'False';

            testRunner += `    res${idx} = ${fnName}(${pyInput})\n`;
            testRunner += `    if str(res${idx}).lower() == str(${pyExpected}).lower() or res${idx} == ${pyExpected}:\n`;
            testRunner += `        print("✓  Test ${idx + 1} PASSED  |  Input: ${tc.input.join(', ').replace(/"/g, '\\"')}  →  ${tc.expected.replace(/"/g, '\\"')}")\n`;
            testRunner += `    else:\n`;
            testRunner += `        print("✗  Test ${idx + 1} FAILED  |  Input: ${tc.input.join(', ').replace(/"/g, '\\"')}  →  Expected: ${tc.expected.replace(/"/g, '\\"')} (Got " + str(res${idx}) + ")")\n`;
        });
        testRunner += `except Exception as e:\n    print("Execution Error:", str(e))\n`;

        const fullCode = code + testRunner;
        const res = await fetch(`${API_BASE_URL}/api/playground/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token && {'Authorization': `Bearer ${token}`}) },
          body: JSON.stringify({ code: fullCode, language: 'python' })
        });
        
        const data = await res.json();
        if (data.compile && data.compile.code !== 0) {
           setOutputConsole(`Compilation Error:\n${data.compile.output}`);
           setTestResults('fail');
        } else if (data.run) {
           setOutputConsole(data.run.output || 'No output.');
           if (data.run.output && !data.run.output.includes('✗') && data.run.output.includes('✓')) {
               setTestResults('success');
               handleSuccess();
           } else {
               setTestResults('fail');
           }
        } else {
           setOutputConsole(data.error || 'Execution failed.');
           setTestResults('fail');
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/playground/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token && {'Authorization': `Bearer ${token}`}) },
          body: JSON.stringify({ code: code, language })
        });
        
        const data = await res.json();
        if (data.compile && data.compile.code !== 0) {
           setOutputConsole(`Compilation Error:\n${data.compile.output}`);
        } else if (data.run) {
           setOutputConsole(data.run.output || 'Code executed. Note: Automated testing is not available for C++/Java yet. Verify your output manually.');
        } else {
           setOutputConsole(data.error || 'Execution failed.');
        }
        setTestResults(null);
      }
    } catch (err) {
      setOutputConsole(`Execution Error: ${err.message}`);
      setTestResults('fail');
    }
  };

  const handleSuccess = async () => {
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
  };

  const resetChallenge = () => {
    if (selectedChallenge) {
      setCode(selectedChallenge.starterCode[language]);
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
                  {/* File tab & Language Selector */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-r border-white/5 border-t border-t-primary/60 bg-[#0d0d14] text-white/70 text-xs font-mono">
                      <Code2 className="w-3 h-3 text-yellow-400" />
                      main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-[#0a0a0f] border border-white/10 text-white/80 rounded-md text-[10px] font-bold px-2 py-1 outline-none focus:border-primary cursor-pointer uppercase tracking-widest"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                      </select>
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

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden pt-2 bg-[#0a0a0f]" style={{ minHeight: 0 }}>
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : language}
                    theme="vs-dark"
                    value={code}
                    onChange={setCode}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
                      padding: { top: 12 },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
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
