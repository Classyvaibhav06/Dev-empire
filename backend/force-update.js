const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/codepath';

const roadmapSchema = new mongoose.Schema({
  id: String,
  roadmap: String,
  description: String,
  sections: Array
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

const detailedTopics = {
  "how-the-web-works": {
    id: "how-the-web-works",
    title: "How the Web Works",
    description: "Understand the basics of the internet, HTTP/HTTPS, DNS, and how browsers render web pages.",
    videos: ["https://www.youtube.com/embed/7_LPdttKXPc"],
    keyConcepts: [
      "Client-Server Architecture",
      "IP Addresses & DNS (Domain Name System)",
      "HTTP/HTTPS Protocols & Status Codes",
      "Request/Response Cycle",
      "How Browsers Parse HTML/CSS/JS"
    ],
    tips: "Understand the general flow: You type a URL, DNS finds the IP, your browser requests the page, and the server sends HTML back.",
    mistakes: "Thinking 'The Internet' and 'The Web' are the same. The Internet is the physical infrastructure; the Web is the collection of pages running on it.",
    project: {
      title: "Interactive Request-Response Diagram",
      description: "Create a simple sketch or workflow diagram outlining exactly what happens step-by-step when you type 'dev-empire.com' in a browser, from DNS resolution to DOM compilation."
    }
  },
  "html-basics": {
    id: "html-basics",
    title: "HTML Basics & Semantics",
    description: "Learn the foundational structure of the web. HTML defines the content and semantics of all web pages.",
    videos: ["https://www.youtube.com/embed/qz0aGYrrlhU"],
    keyConcepts: [
      "HTML Document structure & tags",
      "Elements, Attributes, and Headings",
      "Lists, Tables, and Forms",
      "Semantic HTML (nav, section, article, header, footer)",
      "Accessibility (a11y) & SEO best practices"
    ],
    tips: "Always use semantic tags where possible instead of just using <div> for everything. It helps screen readers and search engines.",
    mistakes: "Using non-semantic div tags for every section, which hurts SEO and accessibility.",
    project: {
      title: "Semantic Personal Portfolio",
      description: "Build a single page website for your developer resume using only semantic tags. No styles yet!"
    }
  },
  "css-basics": {
    id: "css-basics",
    title: "CSS Basics & Box Model",
    description: "Learn how to style your HTML elements. Understand the CSS Box Model, selectors, and layout basics.",
    videos: ["https://www.youtube.com/embed/1Rs2ND1ryYc"],
    keyConcepts: [
      "CSS Syntax and Stylesheets linking",
      "CSS Selectors (Class, ID, Elements, Pseudo-selectors)",
      "The CSS Box Model (Content, Padding, Border, Margin)",
      "Display Properties (block, inline, inline-block, flex, grid)",
      "Colors, Typography, and Transitions"
    ],
    tips: "When debugging layout issues, add a temporary border to see exactly how much space an element occupies.",
    mistakes: "Confusing Margin (space outside the border) with Padding (space inside the border).",
    project: {
      title: "Styled Profile Card",
      description: "Take your portfolio info or write a new user card. Add padding, rounded borders, shadows, a beautiful background gradient, and center it perfectly using flexbox."
    }
  },
  "js-basics": {
    id: "js-basics",
    title: "JavaScript Fundamentals",
    description: "Add logic and interactivity to your websites using variables, functions, and control flow.",
    videos: ["https://www.youtube.com/embed/W6NZfCO5SIk"],
    keyConcepts: [
      "Variables & Data Types (let, const, objects, arrays)",
      "Functions and Scope",
      "Control Flow (loops, conditionals)",
      "DOM Manipulation and Event Listeners",
      "ES6+ features (destructuring, array methods like map/filter)"
    ],
    tips: "Always use 'const' by default. Only use 'let' if you know the variable's value will change. Never use 'var'.",
    mistakes: "Using 'var' instead of 'const' or 'let', leading to scoping issues.",
    project: {
      title: "Interactive Counter & Todo List",
      description: "Create an interactive counter in Vanilla JS with increment, decrement, and reset buttons, then extend it into a simple in-memory todo list item adder."
    }
  },
  "react-basics": {
    id: "react-basics",
    title: "React Fundamentals",
    description: "Learn functional components, props, state, and rendering dynamic interfaces.",
    videos: ["https://www.youtube.com/embed/bMknfKXIFA8"],
    keyConcepts: [
      "Components and JSX Syntax",
      "Props vs State",
      "The useState and useEffect Hooks",
      "Handling Events & Forms",
      "Conditional Rendering & Lists rendering"
    ],
    tips: "React state should be treated as immutable. Always use the setter function (e.g., setCounter) to update state, never modify it directly.",
    mistakes: "Mutating React state directly (e.g., state.push() instead of using a setter function).",
    project: {
      title: "Todo App with LocalStorage",
      description: "Build a complete Todo application in React with the ability to add, toggle completion status, delete items, and persist the list using useEffect with LocalStorage."
    }
  },
  "node-express": {
    id: "node-express",
    title: "Node.js & Express REST APIs",
    description: "Learn how to build servers with Node.js and create RESTful APIs using the Express framework.",
    videos: ["https://www.youtube.com/embed/Oe421EPjeBE"],
    keyConcepts: [
      "Node.js Runtime & NPM Ecosystem",
      "Express Server Setup & Routing",
      "HTTP Request Methods (GET, POST, PUT, DELETE)",
      "Middleware concept and parsing requests",
      "API design and Status Codes"
    ],
    tips: "Always test your API endpoints using a tool like Postman or Insomnia before trying to connect your frontend.",
    mistakes: "Forgetting to send back an HTTP response (res.send/res.json), leaving the client connection hanging.",
    project: {
      title: "Task API Server",
      description: "Build Express API server running on port 5000 that manages an in-memory array of Tasks. Write routes for GET /tasks, POST /tasks, PUT /tasks/:id, and DELETE /tasks/:id."
    }
  },
  "mongodb-mongoose": {
    id: "mongodb-mongoose",
    title: "MongoDB & Mongoose ODM",
    description: "Understand NoSQL databases, connect to MongoDB, and perform CRUD operations with Mongoose.",
    videos: ["https://www.youtube.com/embed/DZBGEVgL2eE"],
    keyConcepts: [
      "SQL vs NoSQL Databases concept",
      "Documents, Collections, and ObjectID",
      "Mongoose Connection, Schemas & Models",
      "CRUD operations (find, create, updateOne, deleteMany)",
      "Relationships and DB references"
    ],
    tips: "Define strict schemas in Mongoose to ensure data consistency in your NoSQL database.",
    mistakes: "Storing plaintext passwords in the database. Always use hashing libraries like bcrypt!",
    project: {
      title: "Task Database Manager",
      description: "Refactor your Task API Server to connect to a local or cloud MongoDB database using Mongoose. Define a TaskSchema and model, saving all tasks to the DB."
    }
  },
  "python-basics": {
    id: "python-basics",
    title: "Python Fundamentals",
    description: "Learn Python syntax, data structures, object-oriented concepts, and basic scripting.",
    videos: ["https://www.youtube.com/embed/rfscVS0vtbw"],
    keyConcepts: [
      "Variables & Indentation-based block scope",
      "Lists, Dictionaries, Tuples, and Sets",
      "Functions and Lambdas",
      "Object-Oriented Programming (Classes & Inheritance)",
      "File operations & Exception handling"
    ],
    tips: "Python uses indentation to define code blocks. Keep spacing consistent (4 spaces).",
    mistakes: "Mixing tabs and spaces for indentation, which throws an IndentationError.",
    project: {
      title: "CLI Gradebook System",
      description: "Write a command-line interface Gradebook app where users can add students, records of classes, calculate average grades, and print results to the console."
    }
  },
  "numpy-pandas": {
    id: "numpy-pandas",
    title: "Data Analysis with NumPy & Pandas",
    description: "Perform data structures transformations, indexing, grouping, and statistical operations.",
    videos: ["https://www.youtube.com/embed/r-uOLxNrNk8"],
    keyConcepts: [
      "NumPy Arrays and Vectorized operations",
      "Pandas Series and DataFrames",
      "Data Cleaning: Missing values, Dropping columns",
      "Data Selection, Filtering & Grouping",
      "Reading CSV/JSON files and merging datasets"
    ],
    tips: "Prefer vectorized calculations over iterating with Python loops to preserve speed.",
    mistakes: "Using slow Python loops (like for) to iterate over DataFrame rows instead of using fast vectorized methods.",
    project: {
      title: "Global Temperature Data Analysis",
      description: "Download a public CSV dataset containing global temperature recordings. Load it using Pandas, clean the missing values, group data by year, and compute average temperature shifts."
    }
  },
  "neural-networks": {
    id: "neural-networks",
    title: "Intro to Neural Networks",
    description: "Understand perceptrons, backpropagation, and activation functions inside Deep Learning.",
    videos: ["https://www.youtube.com/embed/aircAruvnKk"],
    keyConcepts: [
      "The Perceptron & Linear Models",
      "Activation Functions (ReLU, Sigmoid, Softmax)",
      "Feedforward & Backpropagation propagation",
      "Loss Functions and Gradient Descent optimization",
      "Layers: Input, Hidden, and Output layers"
    ],
    tips: "Break symmetry by initializing weights to small non-zero random values.",
    mistakes: "Setting learning rates too high, causing gradient descent to overshoot the minimum and diverge.",
    project: {
      title: "Simple Neural Network from Scratch",
      description: "Build a single-neuron perceptron in Python using only NumPy to perform binary classification (like the OR logical gate)."
    }
  },
  "nlp-llms": {
    id: "nlp-llms",
    title: "Large Language Models & Prompting",
    description: "Learn transformer architectures, fine-tuning techniques, and intelligent agent orchestrations.",
    videos: ["https://www.youtube.com/embed/zjkBMFhNj_g"],
    keyConcepts: [
      "Transformer Architectures & Self-Attention mechanism",
      "Tokenization and Embedding spaces",
      "Pre-training vs Fine-tuning (RLHF)",
      "Prompt Engineering techniques (CoT, few-shot)",
      "Agent Frameworks (LangChain, MCP)"
    ],
    tips: "Provide clear examples and structure parameters clearly in your prompt templates.",
    mistakes: "Assuming LLMs have real-time memory of all current news, failing to account for their training cutoff date.",
    project: {
      title: "Interactive Prompt Engineering Playground",
      description: "Write a script connecting to an LLM API (e.g. OpenAI or Gemini). Create comparative templates showcasing zero-shot, few-shot, and Chain-of-Thought prompting outcomes."
    }
  }
};

const seedData = [
  {
    id: "frontend",
    roadmap: "Frontend Development",
    description: "Master the art of building beautiful, interactive user interfaces with HTML, CSS, JavaScript, and React.",
    sections: [
      {
        id: "fe-fundamentals",
        title: "Frontend Fundamentals",
        topics: [
          detailedTopics["how-the-web-works"],
          detailedTopics["html-basics"],
          detailedTopics["css-basics"]
        ]
      },
      {
        id: "fe-advanced",
        title: "Modern Frontend Development",
        topics: [
          detailedTopics["js-basics"],
          detailedTopics["react-basics"]
        ]
      }
    ]
  },
  {
    id: "backend",
    roadmap: "Backend Development",
    description: "Build robust, scalable servers, design databases, and create secure REST APIs.",
    sections: [
      {
        id: "be-fundamentals",
        title: "Server & API Design",
        topics: [
          detailedTopics["node-express"]
        ]
      },
      {
        id: "be-databases",
        title: "Databases & Persistence",
        topics: [
          detailedTopics["mongodb-mongoose"]
        ]
      }
    ]
  },
  {
    id: "fullstack",
    roadmap: "Full-Stack Web Development",
    description: "Combine frontend visual design with backend server systems to build complete web applications.",
    sections: [
      {
        id: "fs-frontend",
        title: "Full-Stack Frontend",
        topics: [
          detailedTopics["html-basics"],
          detailedTopics["css-basics"],
          detailedTopics["js-basics"],
          detailedTopics["react-basics"]
        ]
      },
      {
        id: "fs-backend",
        title: "Full-Stack Backend",
        topics: [
          detailedTopics["node-express"],
          detailedTopics["mongodb-mongoose"]
        ]
      }
    ]
  },
  {
    id: "ai-ml",
    roadmap: "AI & Machine Learning",
    description: "Dive into data science, machine learning models, neural networks, and modern LLMs.",
    sections: [
      {
        id: "ai-math-python",
        title: "Python & Data Science",
        topics: [
          detailedTopics["python-basics"],
          detailedTopics["numpy-pandas"]
        ]
      },
      {
        id: "ai-neural-nets",
        title: "Deep Learning & AI Models",
        topics: [
          detailedTopics["neural-networks"],
          detailedTopics["nlp-llms"]
        ]
      }
    ]
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected. Updating data...');
    await Roadmap.deleteMany({});
    await Roadmap.insertMany(seedData);
    console.log("Database updated successfully.");
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
