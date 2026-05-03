const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/codepath';

const roadmapSchema = new mongoose.Schema({
  roadmap: String,
  description: String,
  sections: Array
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

const seedData = {
  roadmap: "Full-Stack Web Development",
  description: "A comprehensive journey from zero to hero. Learn to build modern, scalable web applications.",
  sections: [
    {
      id: "fundamentals",
      title: "Internet & Web Fundamentals",
      order: 1,
      topics: [
        {
          id: "how-the-web-works",
          title: "How the Web Works",
          description: "Understand the basics of the internet, HTTP/HTTPS, DNS, and how browsers render web pages.",
          videos: ["https://www.youtube.com/embed/7_LPdttKXPc"],
          keyConcepts: [
            "Clients (your browser) and Servers (where websites live).",
            "IP Addresses and DNS (Domain Name System - the internet's phonebook).",
            "HTTP/HTTPS - The protocol used to transfer data over the web.",
            "Packets - How data is broken down to travel across the internet."
          ],
          tips: "Don't get bogged down in the deep networking details yet. Just understand the general flow: You type a URL, DNS finds the IP, your browser requests the page, and the server sends HTML back.",
          mistakes: "Thinking 'The Internet' and 'The Web' are the same thing. The Internet is the physical network of cables and computers; the Web is the collection of web pages accessible over that network.",
          project: null
        }
      ]
    },
    {
      id: "html",
      title: "HTML (HyperText Markup Language)",
      order: 2,
      topics: [
        {
          id: "html-basics",
          title: "HTML Basics & Semantics",
          description: "Learn the foundational structure of the web. Cover elements, attributes, headings, paragraphs, basic formatting, and semantic tags (header, nav, article, footer) for accessibility and SEO.",
          videos: ["https://www.youtube.com/embed/qz0aGYrrlhU"],
          keyConcepts: [
            "HTML Tags (e.g., <h1>, <p>, <div>).",
            "Attributes (e.g., class, id, src, href).",
            "Semantic HTML (using tags that describe their meaning, like <nav> or <footer>).",
            "Document structure (<!DOCTYPE html>, <html>, <head>, <body>)."
          ],
          tips: "Always use semantic tags where possible instead of just using <div> for everything. It helps screen readers and search engines understand your content.",
          mistakes: "Forgetting to close tags (e.g., writing <p>Hello without </p>). Also, using heading tags (<h1>, <h2>) just to make text bold rather than for structural hierarchy.",
          project: {
            title: "Semantic Personal Portfolio",
            description: "Create a basic HTML page featuring a header, paragraph, an unordered list of your favorite hobbies, semantic structure, and an image from the web."
          }
        }
      ]
    },
    {
      id: "css",
      title: "CSS (Cascading Style Sheets)",
      order: 3,
      topics: [
        {
          id: "css-basics",
          title: "CSS Basics & Box Model",
          description: "Learn how to style your HTML elements. Understand the CSS Box Model (margin, border, padding, content), selectors, colors, and typography.",
          videos: ["https://www.youtube.com/embed/1Rs2ND1ryYc"],
          keyConcepts: [
            "Selectors (element, class, ID).",
            "The Box Model (Content, Padding, Border, Margin).",
            "Display properties (block, inline, inline-block, none).",
            "Colors, Fonts, and Typography."
          ],
          tips: "When debugging layout issues, always add a temporary bright border (e.g., border: 1px solid red;) to see exactly how much space an element is taking up.",
          mistakes: "Confusing Margin (space outside the border) with Padding (space inside the border).",
          project: {
            title: "Styled Profile Card",
            description: "Build a nicely styled user profile card using colors, custom fonts, rounded borders, and shadows."
          }
        }
      ]
    },
    {
      id: "javascript",
      title: "JavaScript Fundamentals",
      order: 4,
      topics: [
        {
          id: "js-basics",
          title: "Variables, Functions & Logic",
          description: "Add logic and interactivity to your websites using variables, data types, functions, arrays, and control flow.",
          videos: ["https://www.youtube.com/embed/W6NZfCO5SIk"],
          keyConcepts: [
            "Variables (let, const).",
            "Data Types (String, Number, Boolean, Array, Object).",
            "Functions and Arrow Functions.",
            "If/Else Statements and Loops (for, while)."
          ],
          tips: "Always use 'const' by default. Only use 'let' if you know the variable's value will change later. Never use 'var'.",
          mistakes: "Confusing the assignment operator (=) with the equality operator (== or ===). Always use === for comparison to avoid unexpected type coercion.",
          project: {
            title: "Interactive Calculator",
            description: "Build a simple calculator application that handles basic arithmetic operations."
          }
        }
      ]
    },
    {
      id: "react",
      title: "React.js Frontend Framework",
      order: 5,
      topics: [
        {
          id: "react-basics",
          title: "Components, Props & State",
          description: "Learn the fundamentals of React: building reusable components, passing data via Props, and managing internal State with useState.",
          videos: ["https://www.youtube.com/embed/bMknfKXIFA8"],
          keyConcepts: [
            "JSX Syntax.",
            "Functional Components.",
            "Props (Passing data down).",
            "State (useState hook)."
          ],
          tips: "React state should be treated as immutable. Always use the setter function (e.g., setCounter) to update state, never modify it directly (counter = 5).",
          mistakes: "Mutating state directly instead of using the setter function.",
          project: {
            title: "Expense Tracker",
            description: "Build an application to track income and expenses using multiple React components and localized state."
          }
        }
      ]
    },
    {
      id: "backend",
      title: "Backend Development (Node & Express)",
      order: 6,
      topics: [
        {
          id: "node-express",
          title: "Node.js & Express REST APIs",
          description: "Learn how to build servers with Node.js and create RESTful APIs using the Express framework.",
          videos: ["https://www.youtube.com/embed/Oe421EPjeBE"],
          keyConcepts: [
            "Node.js runtime.",
            "Express.js framework.",
            "RESTful API design (GET, POST, PUT, DELETE).",
            "Middleware."
          ],
          tips: "Always test your API endpoints using a tool like Postman or Insomnia before trying to connect your frontend.",
          mistakes: "Forgetting to send a response back to the client, leaving the request hanging indefinitely.",
          project: {
            title: "Task API Server",
            description: "Build a complete REST API with GET, POST, PUT, and DELETE endpoints to manage tasks in-memory."
          }
        }
      ]
    },
    {
      id: "database",
      title: "Databases (MongoDB)",
      order: 7,
      topics: [
        {
          id: "mongodb-mongoose",
          title: "MongoDB & Mongoose ODM",
          description: "Understand NoSQL databases, connect your Express app to MongoDB using Mongoose, and define data models.",
          videos: ["https://www.youtube.com/embed/DZBGEVgL2eE"],
          keyConcepts: [
            "NoSQL vs SQL.",
            "Collections and Documents.",
            "Mongoose Schemas and Models.",
            "CRUD operations in MongoDB."
          ],
          tips: "Define strict schemas in Mongoose to ensure data consistency in your NoSQL database.",
          mistakes: "Storing passwords in plain text. Always hash passwords before saving them to the database.",
          project: {
            title: "Full-Stack Task Manager",
            description: "Connect your previous Task API Server to MongoDB to persist data permanently."
          }
        }
      ]
    }
  ]
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected. Updating data...');
    await Roadmap.deleteMany({});
    await Roadmap.create(seedData);
    console.log("Database updated successfully.");
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
