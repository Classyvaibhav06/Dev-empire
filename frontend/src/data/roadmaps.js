export const learningPaths = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Master the art of building beautiful, interactive user interfaces with HTML, CSS, JavaScript, and React.",
    color: "#6366f1",
    difficulty: "Beginner",
    duration: "12 Weeks",
    sections: [
      {
        id: "fe-fundamentals",
        title: "Frontend Fundamentals",
        topics: [
          {
            id: "how-the-web-works",
            title: "How the Web Works",
            level: "Beginner",
            description: "Understand the basics of the internet, HTTP/HTTPS, DNS, and how browsers render web pages.",
            videos: [
              "https://www.youtube.com/embed/7_LPdttKXPc",
              "https://www.youtube.com/embed/zN8YNNjcaZY",
              "https://www.youtube.com/embed/oj4TVUmbQ6w"
            ]
          },
          {
            id: "html-basics",
            title: "HTML Basics & Semantics",
            level: "Beginner",
            description: "Learn the foundational structure of the web. Cover elements, attributes, headings, and semantic tags.",
            videos: [
              "https://www.youtube.com/embed/qz0aGYrrlhU",
              "https://www.youtube.com/embed/kUMe1FH4CHE",
              "https://www.youtube.com/embed/mbeT8mpmtHA"
            ]
          },
          {
            id: "css-basics",
            title: "CSS Basics & Box Model",
            level: "Beginner",
            description: "Learn how to style your HTML elements. Understand the CSS Box Model, selectors, and layout basics.",
            videos: [
              "https://www.youtube.com/embed/1Rs2ND1ryYc",
              "https://www.youtube.com/embed/yfoY53QXEnI",
              "https://www.youtube.com/embed/OXGznpKZ_sA"
            ]
          }
        ]
      },
      {
        id: "fe-advanced",
        title: "Modern Frontend Development",
        topics: [
          {
            id: "js-basics",
            title: "JavaScript Fundamentals",
            level: "Intermediate",
            description: "Add logic and interactivity to your websites using variables, functions, and control flow.",
            videos: [
              "https://www.youtube.com/embed/W6NZfCO5SIk",
              "https://www.youtube.com/embed/hdI2bqOjy3c",
              "https://www.youtube.com/embed/PkZNo7MFNFg"
            ]
          },
          {
            id: "react-basics",
            title: "React Fundamentals",
            level: "Intermediate",
            description: "Learn functional components, props, state, and rendering dynamic interfaces.",
            videos: [
              "https://www.youtube.com/embed/bMknfKXIFA8",
              "https://www.youtube.com/embed/SqcY0GlETPk",
              "https://www.youtube.com/embed/Ke90Tje7VS0"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Build robust, scalable servers, design databases, and create secure REST APIs.",
    color: "#10b981",
    difficulty: "Intermediate",
    duration: "16 Weeks",
    sections: [
      {
        id: "be-fundamentals",
        title: "Server & API Design",
        topics: [
          {
            id: "node-express",
            title: "Node.js & Express REST APIs",
            level: "Intermediate",
            description: "Learn how to build servers with Node.js and create RESTful APIs using the Express framework.",
            videos: [
              "https://www.youtube.com/embed/Oe421EPjeBE",
              "https://www.youtube.com/embed/fBNz5xF-Kx4",
              "https://www.youtube.com/embed/RLtyhwFtXQA"
            ]
          }
        ]
      },
      {
        id: "be-databases",
        title: "Databases & Persistence",
        topics: [
          {
            id: "mongodb-mongoose",
            title: "MongoDB & Mongoose ODM",
            level: "Intermediate",
            description: "Understand NoSQL databases, connect to MongoDB, and perform CRUD operations with Mongoose.",
            videos: [
              "https://www.youtube.com/embed/DZBGEVgL2eE",
              "https://www.youtube.com/embed/-56x56UppqQ",
              "https://www.youtube.com/embed/ofme2o29ngU"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "fullstack",
    title: "Full-Stack Development",
    description: "Combine frontend visual design with backend server systems to build complete web applications.",
    color: "#3b82f6",
    difficulty: "Advanced",
    duration: "24 Weeks",
    sections: [
      {
        id: "fs-frontend",
        title: "Full-Stack Frontend",
        topics: [
          {
            id: "html-basics",
            title: "HTML Basics & Semantics",
            level: "Beginner",
            description: "Learn the structural foundation of the web.",
            videos: ["https://www.youtube.com/embed/qz0aGYrrlhU"]
          },
          {
            id: "css-basics",
            title: "CSS Basics & Box Model",
            level: "Beginner",
            description: "Learn layout styles and styling attributes.",
            videos: ["https://www.youtube.com/embed/1Rs2ND1ryYc"]
          },
          {
            id: "js-basics",
            title: "JavaScript Fundamentals",
            level: "Intermediate",
            description: "Write dynamic client-side scripting and modern JS.",
            videos: ["https://www.youtube.com/embed/W6NZfCO5SIk"]
          },
          {
            id: "react-basics",
            title: "React Fundamentals",
            level: "Intermediate",
            description: "Build robust frontend web apps with component architectures.",
            videos: ["https://www.youtube.com/embed/bMknfKXIFA8"]
          }
        ]
      },
      {
        id: "fs-backend",
        title: "Full-Stack Backend",
        topics: [
          {
            id: "node-express",
            title: "Node.js & Express REST APIs",
            level: "Intermediate",
            description: "Build server runtimes and custom route APIs.",
            videos: ["https://www.youtube.com/embed/Oe421EPjeBE"]
          },
          {
            id: "mongodb-mongoose",
            title: "MongoDB & Mongoose ODM",
            level: "Intermediate",
            description: "Persist full-stack data with documents and schemas.",
            videos: ["https://www.youtube.com/embed/DZBGEVgL2eE"]
          }
        ]
      }
    ]
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description: "Dive into data science, machine learning models, neural networks, and modern LLMs.",
    color: "#f59e0b",
    difficulty: "Advanced",
    duration: "20 Weeks",
    sections: [
      {
        id: "ai-math-python",
        title: "Python & Data Science",
        topics: [
          {
            id: "python-basics",
            title: "Python Fundamentals",
            level: "Beginner",
            description: "Learn Python syntax, data structures, object-oriented concepts, and basic scripting.",
            videos: [
              "https://www.youtube.com/embed/rfscVS0vtbw",
              "https://www.youtube.com/embed/_uQrJ0TkZlc",
              "https://www.youtube.com/embed/YYXdXT2l-Gg"
            ]
          },
          {
            id: "numpy-pandas",
            title: "Data Analysis with NumPy & Pandas",
            level: "Intermediate",
            description: "Perform data structures transformations, indexing, grouping, and statistical operations.",
            videos: [
              "https://www.youtube.com/embed/r-uOLxNrNk8",
              "https://www.youtube.com/embed/vmEHCJofslg",
              "https://www.youtube.com/embed/e60ItwlZTKM"
            ]
          }
        ]
      },
      {
        id: "ai-neural-nets",
        title: "Deep Learning & AI Models",
        topics: [
          {
            id: "neural-networks",
            title: "Intro to Neural Networks",
            level: "Advanced",
            description: "Understand perceptrons, backpropagation, and activation functions inside Deep Learning.",
            videos: [
              "https://www.youtube.com/embed/aircAruvnKk",
              "https://www.youtube.com/embed/IHZwWFHWa-w",
              "https://www.youtube.com/embed/oV13qMfKGmk"
            ]
          },
          {
            id: "nlp-llms",
            title: "Large Language Models & Prompting",
            level: "Advanced",
            description: "Learn transformer architectures, fine-tuning techniques, and intelligent agent orchestrations.",
            videos: [
              "https://www.youtube.com/embed/zjkBMFhNj_g",
              "https://www.youtube.com/embed/wjZofJX0v4M",
              "https://www.youtube.com/embed/X-AWdfSFCHQ"
            ]
          }
        ]
      }
    ]
  }
];

export const detailedTopics = {
  "how-the-web-works": {
    title: "How the Web Works",
    description: "Understand the basics of the internet, HTTP/HTTPS, DNS, and how browsers render web pages.",
    analogy: {
      concept: "Ordering Food in a Restaurant",
      explanation: "You (the client) look at the menu and tell the waiter (HTTP Request) what food you want. The waiter goes to the kitchen (Server), and the chef prepares your food. The waiter then brings it back to your table (HTTP Response) for you to eat."
    },
    keyConcepts: [
      "Client-Server Architecture",
      "IP Addresses & DNS (Domain Name System)",
      "HTTP/HTTPS Protocols & Status Codes",
      "Request/Response Cycle",
      "How Browsers Parse HTML/CSS/JS"
    ],
    videos: [
      "https://www.youtube.com/embed/7_LPdttKXPc",
      "https://www.youtube.com/embed/zN8YNNjcaZY",
      "https://www.youtube.com/embed/oj4TVUmbQ6w"
    ],
    practice: [
      {
        type: "mcq",
        question: "What is the primary purpose of a DNS (Domain Name System)?",
        options: [
          "To translate domain names (like google.com) into IP addresses (like 142.250.190.46).",
          "To securely hash user passwords on login.",
          "To host website database files.",
          "To render CSS animations inside the browser."
        ],
        answer: 0
      }
    ],
    commonMistakes: [
      { mistake: "Confusing the Internet (the physical infrastructure connecting global computers) with the Web (pages and resources running on top of that network)." }
    ],
    project: {
      title: "Interactive Request-Response Diagram",
      description: "Create a simple sketch or workflow diagram outlining exactly what happens step-by-step when you type 'dev-empire.com' in a browser, from DNS resolution to DOM compilation."
    },
    resources: [
      { name: "MDN: How the Web works", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works", type: "Article" },
      { name: "W3C: Web Standards", url: "https://www.w3.org/standards/", type: "Documentation" }
    ]
  },
  "html-basics": {
    title: "HTML Basics & Semantics",
    description: "Learn the foundational structure of the web. HTML defines the content and semantics of all web pages.",
    analogy: {
      concept: "The Blueprint and Skeleton of a Building",
      explanation: "HTML is like the structural blueprint and steel beams of a house. It defines where the walls, doors, windows, and rooms go, but doesn't define the color of paint or the material of the floors (which is CSS)."
    },
    keyConcepts: [
      "HTML Document structure & tags",
      "Elements, Attributes, and Headings",
      "Lists, Tables, and Forms",
      "Semantic HTML (nav, section, article, header, footer)",
      "Accessibility (a11y) & SEO best practices"
    ],
    videos: [
      "https://www.youtube.com/embed/qz0aGYrrlhU",
      "https://www.youtube.com/embed/kUMe1FH4CHE",
      "https://www.youtube.com/embed/mbeT8mpmtHA"
    ],
    practice: [
      {
        type: "mcq",
        question: "Which of the following is a semantic HTML element?",
        options: [
          "<div>",
          "<span>",
          "<article>",
          "<b>"
        ],
        answer: 2
      }
    ],
    commonMistakes: [
      { mistake: "Using non-semantic div tags for every section, which hurts SEO and accessibility." },
      { mistake: "Skipping alt attributes on img tags, which makes images inaccessible to screen readers." }
    ],
    project: {
      title: "Semantic Personal Portfolio",
      description: "Build a single page website for your developer resume using only semantic tags like <header>, <nav>, <main>, <section>, <article>, and <footer>. No styles yet!"
    },
    resources: [
      { name: "MDN HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", type: "Documentation" },
      { name: "HTML Living Standard", url: "https://html.spec.whatwg.org/", type: "Specification" }
    ]
  },
  "css-basics": {
    title: "CSS Basics & Box Model",
    description: "Learn how to style your HTML elements. Understand the CSS Box Model, selectors, and layout basics.",
    analogy: {
      concept: "Interior Design & Decoration",
      explanation: "If HTML is the structural beams of the house, CSS is the interior decorator. It controls the wall colors, the lighting positions, spacing, fonts, alignments, and the general beauty of the building."
    },
    keyConcepts: [
      "CSS Syntax and Stylesheets linking",
      "CSS Selectors (Class, ID, Elements, Pseudo-selectors)",
      "The CSS Box Model (Content, Padding, Border, Margin)",
      "Display Properties (block, inline, inline-block, flex, grid)",
      "Colors, Typography, and Transitions"
    ],
    videos: [
      "https://www.youtube.com/embed/1Rs2ND1ryYc",
      "https://www.youtube.com/embed/yfoY53QXEnI",
      "https://www.youtube.com/embed/OXGznpKZ_sA"
    ],
    practice: [
      {
        type: "mcq",
        question: "What comprises the CSS Box Model, from the inside out?",
        options: [
          "Content, Border, Padding, Margin",
          "Content, Padding, Border, Margin",
          "Margin, Border, Padding, Content",
          "Padding, Content, Border, Margin"
        ],
        answer: 1
      }
    ],
    commonMistakes: [
      { mistake: "Confusing Margin (space outside border) and Padding (space inside border)." },
      { mistake: "Using absolute widths (like pixels) for layouts, making them non-responsive on mobile screens." }
    ],
    project: {
      title: "Styled Profile Card",
      description: "Take your portfolio info or write a new user card. Add padding, rounded borders, shadows, a beautiful background gradient, and center it perfectly using flexbox."
    },
    resources: [
      { name: "A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "Reference" },
      { name: "MDN CSS Basics", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics", type: "Article" }
    ]
  },
  "js-basics": {
    title: "JavaScript Fundamentals",
    description: "Add logic and interactivity to your websites using variables, functions, and control flow.",
    analogy: {
      concept: "The Electrical and Plumbing Systems",
      explanation: "JavaScript is the electricity and water flows. It makes the light switches functional (events), opens the pipes when requested (functions), and manages safety circuits (control statements)."
    },
    keyConcepts: [
      "Variables & Data Types (let, const, objects, arrays)",
      "Functions and Scope",
      "Control Flow (loops, conditionals)",
      "DOM Manipulation and Event Listeners",
      "ES6+ features (destructuring, array methods like map/filter)"
    ],
    videos: [
      "https://www.youtube.com/embed/W6NZfCO5SIk",
      "https://www.youtube.com/embed/hdI2bqOjy3c",
      "https://www.youtube.com/embed/PkZNo7MFNFg"
    ],
    practice: [
      {
        type: "mcq",
        question: "Which array method returns a new array with elements that pass a test?",
        options: [
          "forEach()",
          "map()",
          "filter()",
          "reduce()"
        ],
        answer: 2
      }
    ],
    commonMistakes: [
      { mistake: "Using 'var' instead of 'const' or 'let', leading to scoping issues." },
      { mistake: "Mutating arrays or objects directly instead of using pure, non-destructive updates." }
    ],
    project: {
      title: "Interactive Counter & Todo List",
      description: "Create an interactive counter in Vanilla JS with increment, decrement, and reset buttons, then extend it into a simple in-memory todo list item adder."
    },
    resources: [
      { name: "JavaScript.info", url: "https://javascript.info/", type: "Tutorial" },
      { name: "MDN JS reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: "Documentation" }
    ]
  },
  "react-basics": {
    title: "React Fundamentals",
    description: "Learn functional components, props, state, and rendering dynamic interfaces.",
    analogy: {
      concept: "Building Blocks (Lego Set)",
      explanation: "React lets you break a massive page into tiny, reusable pieces (Components) like LEGO bricks. Each brick can have its own configurations (Props) and internal dynamic state (State)."
    },
    keyConcepts: [
      "Components and JSX Syntax",
      "Props vs State",
      "The useState and useEffect Hooks",
      "Handling Events & Forms",
      "Conditional Rendering & Lists rendering"
    ],
    videos: [
      "https://www.youtube.com/embed/bMknfKXIFA8",
      "https://www.youtube.com/embed/SqcY0GlETPk",
      "https://www.youtube.com/embed/Ke90Tje7VS0"
    ],
    practice: [
      {
        type: "mcq",
        question: "In React, how should you update state variables?",
        options: [
          "State variables should be updated by mutating them directly (e.g. state = newValue).",
          "State variables should be updated only using the setter function returned by useState.",
          "State variables are updated automatically by re-rendering components.",
          "State variables cannot be updated once initialized."
        ],
        answer: 1
      }
    ],
    commonMistakes: [
      { mistake: "Mutating React state directly (e.g., state.push() instead of using a setter function)." },
      { mistake: "Forgetting to provide a unique key prop when rendering lists of elements." }
    ],
    project: {
      title: "Todo App with LocalStorage",
      description: "Build a complete Todo application in React with the ability to add, toggle completion status, delete items, and persist the list using useEffect with LocalStorage."
    },
    resources: [
      { name: "React Documentation", url: "https://react.dev/", type: "Documentation" },
      { name: "React Hooks Reference", url: "https://react.dev/reference/react/hooks", type: "Documentation" }
    ]
  },
  "node-express": {
    title: "Node.js & Express REST APIs",
    description: "Learn how to build servers with Node.js and create RESTful APIs using the Express framework.",
    analogy: {
      concept: "A Restaurant Kitchen",
      explanation: "Express is the head chef who listens to requests coming in from the dining hall (clients). He checks the orders (routes), delegates tasks to sous chefs (middleware), cooks the food, and sends a completed plate (JSON response) back."
    },
    keyConcepts: [
      "Node.js Runtime & NPM Ecosystem",
      "Express Server Setup & Routing",
      "HTTP Request Methods (GET, POST, PUT, DELETE)",
      "Middleware concept and parsing requests",
      "API design and Status Codes"
    ],
    videos: [
      "https://www.youtube.com/embed/Oe421EPjeBE",
      "https://www.youtube.com/embed/fBNz5xF-Kx4",
      "https://www.youtube.com/embed/RLtyhwFtXQA"
    ],
    practice: [
      {
        type: "mcq",
        question: "Which HTTP request method is standard for creating new resource entries?",
        options: [
          "GET",
          "PUT",
          "POST",
          "DELETE"
        ],
        answer: 2
      }
    ],
    commonMistakes: [
      { mistake: "Forgetting to send back an HTTP response (res.send/res.json), leaving the client connection hanging." },
      { mistake: "Not adding parser middleware (like express.json()) to read JSON payload data from requests." }
    ],
    project: {
      title: "Task API Server",
      description: "Build an Express API server running on port 5000 that manages an in-memory array of Tasks. Write routes for GET /tasks, POST /tasks, PUT /tasks/:id, and DELETE /tasks/:id."
    },
    resources: [
      { name: "Express.js Guide", url: "https://expressjs.com/en/guide/routing.html", type: "Documentation" },
      { name: "Node.js Documentation", url: "https://nodejs.org/docs/", type: "Documentation" }
    ]
  },
  "mongodb-mongoose": {
    title: "MongoDB & Mongoose ODM",
    description: "Understand NoSQL databases, connect to MongoDB, and perform CRUD operations with Mongoose.",
    analogy: {
      concept: "Filing Cabinets and Folders",
      explanation: "MongoDB is like a room full of filing cabinets. Each drawer holds folders (Collections), and inside each folder are sheets of paper containing data fields structured as JSON documents (Documents)."
    },
    keyConcepts: [
      "SQL vs NoSQL Databases concept",
      "Documents, Collections, and ObjectID",
      "Mongoose Connection, Schemas & Models",
      "CRUD operations (find, create, updateOne, deleteMany)",
      "Relationships and DB references"
    ],
    videos: [
      "https://www.youtube.com/embed/DZBGEVgL2eE",
      "https://www.youtube.com/embed/-56x56UppqQ",
      "https://www.youtube.com/embed/ofme2o29ngU"
    ],
    practice: [
      {
        type: "mcq",
        question: "What is Mongoose in the context of MongoDB and Node?",
        options: [
          "A library for rendering charts in browsers.",
          "An Object Document Mapper (ODM) that provides schema validation and queries on top of MongoDB.",
          "A database driver for relational SQL files.",
          "A hosting platform for cloud databases."
        ],
        answer: 1
      }
    ],
    commonMistakes: [
      { mistake: "Writing queries without async/await, causing them to execute out of sync or throw errors." },
      { mistake: "Storing plaintext passwords in the database. Always use hashing libraries like bcrypt!" }
    ],
    project: {
      title: "Task Database Manager",
      description: "Refactor your Task API Server to connect to a local or cloud MongoDB database using Mongoose. Define a TaskSchema and model, saving all tasks to the DB."
    },
    resources: [
      { name: "Mongoose Documentation", url: "https://mongoosejs.com/docs/", type: "Documentation" },
      { name: "MongoDB Manual", url: "https://www.mongodb.com/docs/manual/", type: "Documentation" }
    ]
  },
  "python-basics": {
    title: "Python Fundamentals",
    description: "Learn Python syntax, data structures, object-oriented concepts, and basic scripting.",
    analogy: {
      concept: "Writing a Recipe in Simple English",
      explanation: "Python is designed to read almost like normal English. Writing Python is like writing a clean recipe without any complicated, extra punctuation (like semi-colons or curly braces), relying instead on indentation."
    },
    keyConcepts: [
      "Variables & Indentation-based block scope",
      "Lists, Dictionaries, Tuples, and Sets",
      "Functions and Lambdas",
      "Object-Oriented Programming (Classes & Inheritance)",
      "File operations & Exception handling"
    ],
    videos: [
      "https://www.youtube.com/embed/rfscVS0vtbw",
      "https://www.youtube.com/embed/_uQrJ0TkZlc",
      "https://www.youtube.com/embed/YYXdXT2l-Gg"
    ],
    practice: [
      {
        type: "mcq",
        question: "How do you define a function in Python?",
        options: [
          "function my_func():",
          "def my_func():",
          "func my_func():",
          "void my_func():"
        ],
        answer: 1
      }
    ],
    commonMistakes: [
      { mistake: "Mixing tabs and spaces for indentation, which throws an IndentationError in Python." },
      { mistake: "Confusing mutable objects (like Lists) with immutable objects (like Tuples)." }
    ],
    project: {
      title: "CLI Gradebook System",
      description: "Write a command-line interface Gradebook app where users can add students, records of classes, calculate average grades, and print results to the console."
    },
    resources: [
      { name: "Python.org Tutorial", url: "https://docs.python.org/3/tutorial/", type: "Documentation" },
      { name: "Real Python Tutorials", url: "https://realpython.com/", type: "Tutorial" }
    ]
  },
  "numpy-pandas": {
    title: "Data Analysis with NumPy & Pandas",
    description: "Perform data structures transformations, indexing, grouping, and statistical operations.",
    analogy: {
      concept: "Spreadsheets on Steroids",
      explanation: "Pandas is like Excel, but running programmatically at lightning speed. It gives you DataFrames (tables of columns/rows) that you can search, filter, and calculate statistics on using a single line of code."
    },
    keyConcepts: [
      "NumPy Arrays and Vectorized operations",
      "Pandas Series and DataFrames",
      "Data Cleaning: Missing values, Dropping columns",
      "Data Selection, Filtering & Grouping",
      "Reading CSV/JSON files and merging datasets"
    ],
    videos: [
      "https://www.youtube.com/embed/r-uOLxNrNk8",
      "https://www.youtube.com/embed/vmEHCJofslg",
      "https://www.youtube.com/embed/e60ItwlZTKM"
    ],
    practice: [
      {
        type: "mcq",
        question: "What is the primary 2D data structure in Pandas?",
        options: [
          "Series",
          "Matrix",
          "DataFrame",
          "NDArray"
        ],
        answer: 2
      }
    ],
    commonMistakes: [
      { mistake: "Using slow Python loops (like for) to iterate over DataFrame rows instead of using fast vectorized methods." }
    ],
    project: {
      title: "Global Temperature Data Analysis",
      description: "Download a public CSV dataset containing global temperature recordings. Load it using Pandas, clean the missing values, group data by year, and compute average temperature shifts."
    },
    resources: [
      { name: "Pandas Getting Started Guide", url: "https://pandas.pydata.org/docs/getting_started/index.html", type: "Documentation" },
      { name: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html", type: "Documentation" }
    ]
  },
  "neural-networks": {
    title: "Intro to Neural Networks",
    description: "Understand perceptrons, backpropagation, and activation functions inside Deep Learning.",
    analogy: {
      concept: "A Network of Brain Neurons",
      explanation: "Just like the brain, an artificial neural network consists of layers of nodes. Input nodes receive information, pass it along connections with different 'weights' (strengths), activate target nodes, and output a decision."
    },
    keyConcepts: [
      "The Perceptron & Linear Models",
      "Activation Functions (ReLU, Sigmoid, Softmax)",
      "Feedforward & Backpropagation propagation",
      "Loss Functions and Gradient Descent optimization",
      "Layers: Input, Hidden, and Output layers"
    ],
    videos: [
      "https://www.youtube.com/embed/aircAruvnKk",
      "https://www.youtube.com/embed/IHZwWFHWa-w",
      "https://www.youtube.com/embed/oV13qMfKGmk"
    ],
    practice: [
      {
        type: "mcq",
        question: "What does the activation function ReLU stand for?",
        options: [
          "Relative Linear Unit",
          "Rectified Linear Unit",
          "Recursive Linear Utility",
          "Reverse Linear Union"
        ],
        answer: 1
      }
    ],
    commonMistakes: [
      { mistake: "Setting learning rates too high, causing gradient descent to overshoot the minimum and diverge." },
      { mistake: "Forgetting to normalize input data, causing neural networks to train slowly or fail to converge." }
    ],
    project: {
      title: "Simple Neural Network from Scratch",
      description: "Build a single-neuron perceptron in Python using only NumPy to perform binary classification (like the OR logical gate)."
    },
    resources: [
      { name: "3Blue1Brown Neural Networks", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "Video Course" },
      { name: "Deep Learning Book", url: "https://www.deeplearningbook.org/", type: "Book" }
    ]
  },
  "nlp-llms": {
    title: "Large Language Models & Prompting",
    description: "Learn transformer architectures, fine-tuning techniques, and intelligent agent orchestrations.",
    analogy: {
      concept: "An Ultra-Read Librarian",
      explanation: "An LLM is like an incredibly smart librarian who has read every book ever printed. When you ask a question, they don't look up a file; they predict the most logical, word-by-word response based on everything they've ever read."
    },
    keyConcepts: [
      "Transformer Architectures & Self-Attention mechanism",
      "Tokenization and Embedding spaces",
      "Pre-training vs Fine-tuning (RLHF)",
      "Prompt Engineering techniques (CoT, few-shot)",
      "Agent Frameworks (LangChain, MCP)"
    ],
    videos: [
      "https://www.youtube.com/embed/zjkBMFhNj_g",
      "https://www.youtube.com/embed/wjZofJX0v4M",
      "https://www.youtube.com/embed/X-AWdfSFCHQ"
    ],
    practice: [
      {
        type: "mcq",
        question: "What core mechanism makes the Transformer architecture unique?",
        options: [
          "Recurrent connections",
          "Convolutional filters",
          "Self-Attention mechanism",
          "Stochastic Gradient Descent"
        ],
        answer: 2
      }
    ],
    commonMistakes: [
      { mistake: "Assuming LLMs have real-time memory of all current news, failing to account for their training cutoff date." },
      { mistake: "Underestimating 'hallucination' risks in applications, trusting generation results blindly without verification." }
    ],
    project: {
      title: "Interactive Prompt Engineering Playground",
      description: "Write a script connecting to an LLM API (e.g. OpenAI or Gemini). Create comparative templates showcasing zero-shot, few-shot, and Chain-of-Thought prompting outcomes."
    },
    resources: [
      { name: "Hugging Face Course", url: "https://huggingface.co/learn", type: "Course" },
      { name: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/", type: "Reference" }
    ]
  }
};
