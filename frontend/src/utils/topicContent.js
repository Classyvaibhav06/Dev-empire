import { detailedTopics } from '../data/roadmaps';
import { conceptContentMap } from './conceptContentMap';

const fallbackResources = [
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'Documentation' },
  { name: 'W3Schools Examples', url: 'https://www.w3schools.com/', type: 'Beginner Tutorial' },
  { name: 'GeeksforGeeks Notes', url: 'https://www.geeksforgeeks.org/', type: 'Reference' }
];

export const normalizeTitle = (id = '') =>
  id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const normalizeResource = (resource) => {
  if (typeof resource === 'string') {
    return {
      name: resource,
      url: `https://www.google.com/search?q=${encodeURIComponent(resource)}`,
      type: 'Search'
    };
  }

  return {
    name: resource.name || resource.title || 'Learning resource',
    url: resource.url || '#',
    type: resource.type || 'Reference'
  };
};

export const createFallbackTopic = (id) => {
  const title = normalizeTitle(id);

  return {
    title,
    description: `Master ${title} with concepts, examples, practice questions, mistakes to avoid, and a small project.`,
    analogy: {
      concept: `${title} is a tool in your developer toolkit.`,
      explanation: 'Learn what problem it solves, then practice it in small examples before using it inside a complete project.'
    },
    keyConcepts: ['Core vocabulary', 'Basic syntax', 'Practical workflow', 'Common mistakes', 'Project usage'],
    videos: ['https://www.youtube.com/embed/qz0aGYrrlhU'],
    commonMistakes: [{ mistake: 'Only watching videos without building.', correction: 'Pause often and recreate examples in your own files.' }],
    practice: [
      {
        type: 'mcq',
        question: `What is the best way to learn ${title}?`,
        options: ['Memorize everything first', 'Build small examples', 'Skip documentation', 'Only watch videos'],
        answer: 1,
        explanation: 'Small examples create fast feedback and help concepts stick.'
      }
    ],
    project: {
      title: `${title} Mini Project`,
      description: `Build a small project that demonstrates the main ${title} concepts.`
    }
  };
};

export const enrichTopic = (topic) => {
  const keyConcepts = topic.keyConcepts || [];
  const generatedLessons = keyConcepts.slice(0, 4).map((item, index) => ({
    title: `Concept ${index + 1}: ${item.split('(')[0].trim()}`,
    body: 'Understand this idea well enough to explain it, recognize it in existing code, and use it in a small example.',
    code: ''
  }));

  return {
    ...topic,
    outcomes: topic.outcomes || [
      `Explain what ${topic.title} is used for`,
      'Read and write the most common syntax',
      'Recognize beginner mistakes before they become bugs',
      'Complete a hands-on project using the concept'
    ],
    lessons: topic.lessons || generatedLessons,
    syntax: topic.syntax || keyConcepts.slice(0, 5),
    resources: (topic.resources?.length ? topic.resources : fallbackResources).map(normalizeResource),
    interviewQuestions: topic.interviewQuestions || [
      { q: `What problem does ${topic.title} solve?`, a: topic.description },
      { q: `How would you practice ${topic.title} as a beginner?`, a: 'Build a tiny example, debug it, explain it, and then use it in a project.' }
    ]
  };
};

export const getTopicById = (id) => {
  const topic = detailedTopics[id] || createFallbackTopic(id);
  return enrichTopic({ ...topic, id });
};

const codeExamples = {
  html: `<!doctype html>
<html lang="en">
  <head>
    <title>Semantic Page</title>
  </head>
  <body>
    <header>Brand and navigation</header>
    <main>
      <article>
        <h1>Article title</h1>
        <p>Meaningful content belongs here.</p>
      </article>
    </main>
  </body>
</html>`,
  css: `.card {
  box-sizing: border-box;
  max-width: 420px;
  padding: 1.5rem;
  border: 1px solid #334155;
  border-radius: 0.75rem;
}`,
  js: `const button = document.querySelector('[data-save]');

button.addEventListener('click', () => {
  const message = 'Saved successfully';
  console.log(message);
});`,
  react: `function SkillCard({ title, level }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{level}</p>
    </article>
  );
}`,
  api: `app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json({ data: tasks });
});`,
  python: `def average(values):
    if not values:
        return 0
    return sum(values) / len(values)`
};

const pickExample = (topicId, title) => {
  const text = `${topicId} ${title}`.toLowerCase();
  if (text.includes('html') || text.includes('semantic')) return codeExamples.html;
  if (text.includes('css') || text.includes('box') || text.includes('selector')) return codeExamples.css;
  if (text.includes('react') || text.includes('component') || text.includes('state')) return codeExamples.react;
  if (text.includes('node') || text.includes('express') || text.includes('api') || text.includes('http')) return codeExamples.api;
  if (text.includes('python') || text.includes('pandas') || text.includes('numpy')) return codeExamples.python;
  return codeExamples.js;
};

const domainFor = (topicId, title) => {
  const text = `${topicId} ${title}`.toLowerCase();
  if (text.includes('web works') || text.includes('dns') || text.includes('http') || text.includes('browser')) return 'web';
  if (text.includes('html') || text.includes('semantic') || text.includes('document') || text.includes('tag')) return 'html';
  if (text.includes('css') || text.includes('box') || text.includes('selector') || text.includes('style')) return 'css';
  if (text.includes('react') || text.includes('component') || text.includes('state') || text.includes('props')) return 'react';
  if (text.includes('node') || text.includes('express') || text.includes('api')) return 'api';
  if (text.includes('mongo') || text.includes('mongoose') || text.includes('database')) return 'database';
  if (text.includes('python') || text.includes('pandas') || text.includes('numpy')) return 'python';
  if (text.includes('neural') || text.includes('llm') || text.includes('model')) return 'ai';
  return 'javascript';
};

const domainContent = {
  web: {
    definition: 'A web concept usually describes how a browser, network, server, and resource cooperate to deliver a page. The important part is not only knowing the terms, but understanding the exact order of events.',
    anatomy: [
      { label: 'Client', detail: 'The browser or app that asks for a resource.' },
      { label: 'DNS', detail: 'The lookup system that converts a domain name into an IP address.' },
      { label: 'Request', detail: 'The HTTP message containing method, URL, headers, and sometimes a body.' },
      { label: 'Server', detail: 'The machine or application that processes the request.' },
      { label: 'Response', detail: 'The returned status code, headers, and content such as HTML, JSON, CSS, or images.' }
    ],
    rules: [
      'A domain name must be resolved before the browser can contact the server.',
      'HTTP is stateless, so each request must carry enough information for the server to understand it.',
      'Status codes are part of the API contract, not decoration.',
      'Browsers parse HTML first, then request linked CSS, JavaScript, fonts, images, and other assets.'
    ],
    diagram: {
      type: 'network',
      title: 'Real Browser Request Lifecycle',
      lanes: ['Browser', 'DNS Resolver', 'Web Server', 'Browser Engine'],
      steps: [
        ['Browser', 'User enters URL'],
        ['DNS Resolver', 'Domain resolves to IP'],
        ['Web Server', 'HTTP request reaches route'],
        ['Web Server', 'HTML/CSS/JS response returns'],
        ['Browser Engine', 'Parse, render, run scripts']
      ]
    }
  },
  html: {
    definition: 'HTML is a semantic document language. It does not exist to make text look pretty; it exists to describe what each piece of content means and how sections relate to each other.',
    anatomy: [
      { label: 'Element', detail: 'The complete structure: opening tag, content, and closing tag.' },
      { label: 'Tag', detail: 'The marker that tells the browser what kind of element is being created.' },
      { label: 'Attribute', detail: 'Extra information such as href, src, alt, id, class, type, or name.' },
      { label: 'Text node', detail: 'Actual readable content inside the document tree.' },
      { label: 'Semantic role', detail: 'The meaning conveyed by elements such as main, nav, article, and footer.' }
    ],
    rules: [
      'Use semantic elements when the content has a clear meaning.',
      'Keep heading order logical; do not jump from h1 to h5 for visual size.',
      'Every form control should have a label or accessible name.',
      'Images that communicate information need useful alt text.',
      'Use CSS for appearance, not fake headings or tables for layout.'
    ],
    diagram: {
      type: 'tree',
      title: 'HTML Document Tree',
      root: 'html',
      children: [
        { label: 'head', children: ['title', 'meta', 'link'] },
        { label: 'body', children: ['header', 'nav', 'main', 'footer'] },
        { label: 'main', children: ['section', 'article', 'form'] }
      ]
    }
  },
  css: {
    definition: 'CSS is a rule system. Selectors target elements, declarations assign visual values, and the cascade decides which declaration wins when rules overlap.',
    anatomy: [
      { label: 'Selector', detail: 'Targets elements, classes, IDs, attributes, states, or relationships.' },
      { label: 'Declaration', detail: 'A property-value pair such as color: red.' },
      { label: 'Cascade', detail: 'The browser ordering system that resolves competing declarations.' },
      { label: 'Specificity', detail: 'A weight score based on selector strength.' },
      { label: 'Box model', detail: 'Content, padding, border, and margin used to calculate layout.' }
    ],
    rules: [
      'Prefer low-specificity selectors that are easy to override.',
      'Use box-sizing: border-box to make dimensions predictable.',
      'Use gap for spacing inside flex and grid layouts.',
      'Use rem, %, min(), max(), and clamp() where fixed pixels would break responsiveness.',
      'Never remove focus outlines unless you replace them with a visible focus style.'
    ],
    diagram: {
      type: 'box',
      title: 'CSS Box Model',
      layers: [
        { label: 'Margin', hint: 'Outside spacing' },
        { label: 'Border', hint: 'Edge around padding/content' },
        { label: 'Padding', hint: 'Inside spacing' },
        { label: 'Content', hint: 'Text, image, or child elements' }
      ]
    }
  },
  javascript: {
    definition: 'JavaScript is a programming language for state, decisions, functions, events, and asynchronous behavior. On the web, it connects user actions to changes in the DOM.',
    anatomy: [
      { label: 'Value', detail: 'Data such as strings, numbers, booleans, arrays, objects, null, and undefined.' },
      { label: 'Variable', detail: 'A named binding that points to a value.' },
      { label: 'Function', detail: 'A reusable block that receives input and can return output.' },
      { label: 'Event', detail: 'A browser signal such as click, input, submit, keydown, or load.' },
      { label: 'DOM update', detail: 'Changing text, attributes, classes, or elements in the page.' }
    ],
    rules: [
      'Use const unless reassignment is required.',
      'Use strict equality with === unless you intentionally want coercion.',
      'Keep data transformation separate from DOM manipulation when possible.',
      'Handle missing elements before calling methods on them.',
      'Remember that fetch, timers, and user events happen asynchronously.'
    ],
    diagram: {
      type: 'cycle',
      title: 'JavaScript Interaction Cycle',
      steps: ['User action', 'Event listener', 'Function runs', 'State changes', 'DOM updates']
    }
  },
  react: {
    definition: 'React is a UI rendering model based on components. Data flows down through props, events flow up through callbacks, and state changes trigger a fresh render of affected UI.',
    anatomy: [
      { label: 'Component', detail: 'A function that returns UI.' },
      { label: 'Props', detail: 'Read-only inputs from a parent component.' },
      { label: 'State', detail: 'Data owned by a component that can change over time.' },
      { label: 'Render', detail: 'React calling components to calculate what the UI should look like.' },
      { label: 'Effect', detail: 'A way to synchronize with systems outside render, such as storage or network requests.' }
    ],
    rules: [
      'Do not mutate state directly; create a new value and pass it to the setter.',
      'Keep rendering pure: the same props and state should produce the same UI.',
      'Use stable keys for list items.',
      'Lift state only when multiple components need the same source of truth.',
      'Use effects for synchronization, not for ordinary data calculation.'
    ],
    diagram: {
      type: 'react',
      title: 'React Data Flow',
      nodes: ['Parent state', 'Props down', 'Child component', 'Event callback', 'setState', 'Re-render']
    }
  },
  api: {
    definition: 'A backend API concept describes how a server receives requests, validates intent, runs business logic, talks to storage, and returns a predictable response.',
    anatomy: [
      { label: 'Route', detail: 'The method and path pair, such as GET /tasks.' },
      { label: 'Middleware', detail: 'Reusable request processing such as auth, parsing, logging, or validation.' },
      { label: 'Controller', detail: 'The function that handles one request use case.' },
      { label: 'Service', detail: 'Business logic that should not depend on Express request objects.' },
      { label: 'Response', detail: 'Status code plus JSON shape returned to the client.' }
    ],
    rules: [
      'Validate user input before using it.',
      'Return clear status codes and consistent JSON structures.',
      'Do not leak internal error details to clients.',
      'Keep route handlers small by moving business logic into services.',
      'Use async error handling so rejected promises do not crash or hang requests.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Express Request Pipeline',
      steps: ['Request', 'express.json()', 'Auth middleware', 'Route handler', 'Database call', 'JSON response']
    }
  },
  database: {
    definition: 'A database concept explains how data is shaped, stored, queried, validated, indexed, and related. Good database thinking starts with access patterns, not only fields.',
    anatomy: [
      { label: 'Document', detail: 'A JSON-like record in MongoDB.' },
      { label: 'Collection', detail: 'A group of related documents.' },
      { label: 'Schema', detail: 'A Mongoose structure that defines expected fields and validation.' },
      { label: 'Query', detail: 'An operation that reads or changes matching documents.' },
      { label: 'Index', detail: 'A data structure that makes selected queries faster.' }
    ],
    rules: [
      'Model data around the queries your application actually needs.',
      'Validate required fields before saving.',
      'Index fields that are frequently filtered or sorted.',
      'Avoid unbounded arrays inside a single document.',
      'Never store secrets or passwords in plain text.'
    ],
    diagram: {
      type: 'database',
      title: 'Document Database Flow',
      steps: ['Model schema', 'Validate input', 'Create query', 'Collection scan/index', 'Document result']
    }
  },
  python: {
    definition: 'Python emphasizes readable code, clear indentation, simple data structures, and a large ecosystem. The core skill is writing code that is easy to read and easy to test.',
    anatomy: [
      { label: 'Indentation', detail: 'Whitespace defines code blocks.' },
      { label: 'Function', detail: 'Reusable behavior declared with def.' },
      { label: 'List', detail: 'Ordered mutable data.' },
      { label: 'Dictionary', detail: 'Key-value data for named lookup.' },
      { label: 'Exception', detail: 'A structured way to handle runtime failures.' }
    ],
    rules: [
      'Use clear names over clever abbreviations.',
      'Keep indentation consistent.',
      'Prefer small functions that return values.',
      'Know when a structure is mutable or immutable.',
      'Handle file, network, and conversion failures explicitly.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Python Problem Solving Flow',
      steps: ['Input data', 'Clean/validate', 'Transform', 'Calculate', 'Return or print result']
    }
  },
  ai: {
    definition: 'AI concepts describe how data becomes representations, how models transform those representations, and how predictions are evaluated. The key is understanding the pipeline, not treating the model as magic.',
    anatomy: [
      { label: 'Input', detail: 'Raw text, image, row, or signal.' },
      { label: 'Representation', detail: 'Numeric form the model can process.' },
      { label: 'Model', detail: 'A parameterized function that transforms inputs.' },
      { label: 'Loss', detail: 'A measurement of prediction error.' },
      { label: 'Evaluation', detail: 'Testing model behavior on unseen examples.' }
    ],
    rules: [
      'Separate training data from evaluation data.',
      'Normalize or preprocess inputs consistently.',
      'Measure performance with the right metric for the task.',
      'Watch for overfitting when training accuracy is high but real-world behavior is weak.',
      'Treat generated output as something to verify, not blindly trust.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Model Learning Pipeline',
      steps: ['Data', 'Features/tokens', 'Model', 'Prediction', 'Loss', 'Update weights']
    }
  }
};

const buildConceptContent = (topicId, title) => {
  const domain = domainFor(topicId, title);
  const base = domainContent[domain];
  const slug = slugify(title);
  const customContent = conceptContentMap[slug] || {};

  return {
    domain,
    ...base,
    ...customContent,
    explanation: [
      `${title} belongs to ${domain === 'web' ? 'the browser and network layer' : `the ${domain} layer`} of ${topicId}. Learn it as a working mechanism: what input it receives, what transformation it performs, and what output or side effect it creates.`,
      customContent.definition || base.definition,
      `When you study ${title}, do not stop at the name. Ask: where does it appear, what does it depend on, what breaks when it is wrong, and how would I prove it works? That is the difference between shallow notes and usable skill.`
    ],
    walkthrough: [
      `Start by locating ${title} in a real example from the topic.`,
      'Label every moving part in the example: input, rule, output, and failure case.',
      'Run the example once exactly as written, then change one value and predict the result.',
      'Write a short note explaining why the change affected the output.',
      'Use the same idea in a tiny feature without looking at the original example.'
    ],
    checkpoints: [
      `I can define ${title} without memorized wording.`,
      'I can point to the exact code or browser behavior where it happens.',
      'I can explain one common mistake and its fix.',
      'I can build a small example from scratch.'
    ]
  };
};

export const getConceptDetail = (topicId, conceptIndex) => {
  const topic = getTopicById(topicId);
  const index = Number(conceptIndex);
  const rawConcept = topic.keyConcepts?.[index] || topic.keyConcepts?.[0] || topic.title;
  const title = rawConcept.split('(')[0].trim();
  const conceptSlug = slugify(title);
  const content = buildConceptContent(topicId, title);

  return {
    topic,
    index,
    slug: conceptSlug,
    title,
    summary: rawConcept,
    ...content,
    whyItMatters: [
      `${title} affects how you design, debug, and explain ${topic.title} code.`,
      'It gives structure to documentation examples that otherwise look like isolated snippets.',
      'It appears repeatedly in projects, interviews, bug reports, and code reviews.',
      'It helps you move from copying examples to predicting behavior.'
    ],
    example: pickExample(topicId, title),
    mistakes: [
      {
        title: 'Treating the concept as a definition',
        fix: 'Map it to a concrete input, rule, output, and failure case.'
      },
      {
        title: 'Skipping the browser/runtime behavior',
        fix: 'Use DevTools, console logs, network panels, or small experiments to see what actually happens.'
      },
      {
        title: 'Practicing only the happy path',
        fix: 'Test empty input, missing fields, wrong types, slow requests, duplicate data, and small screens.'
      }
    ],
    practiceTasks: [
      `Explain ${title} in three sentences without using notes.`,
      'Build a minimal example and intentionally break it once.',
      'Find this concept in documentation and compare it with your own words.',
      `Use ${title} inside the project for ${topic.title}.`
    ]
  };
};
