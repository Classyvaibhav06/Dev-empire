export const initialRoadmap = {
  roadmap: "Web Development",
  sections: [
    {
      id: "html",
      title: "HTML",
      order: 1,
      topics: [
        {
          id: "html-basics",
          title: "HTML Basics",
          description: "Learn the foundational structure of the web. HTML is the building block for all webpages. In this topic, we cover elements, attributes, headings, paragraphs, and basic formatting.",
          videos: [
            "https://www.youtube.com/embed/qz0aGYrrlhU",
            "https://www.youtube.com/embed/kUMe1FH4CGY"
          ],
          project: {
            title: "Build a Simple Webpage",
            description: "Create a basic HTML page featuring a header, paragraph, an unordered list of your favorite hobbies, and an image from the web."
          }
        },
        {
          id: "html-forms",
          title: "HTML Forms & Tables",
          description: "Learn how to collect user input using forms and display structured data using tables.",
          videos: [
            "https://www.youtube.com/embed/fNcJuPIZ2EQ"
          ],
          project: {
            title: "Contact Form",
            description: "Build a functional looking contact form with inputs for name, email, password, and a message textarea, complete with a submit button."
          }
        }
      ]
    },
    {
      id: "css",
      title: "CSS",
      order: 2,
      topics: [
        {
          id: "css-basics",
          title: "CSS Basics",
          description: "Learn how to style your HTML elements and make your website look beautiful using selectors, colors, fonts, and the box model.",
          videos: [
            "https://www.youtube.com/embed/1Rs2ND1ryYc"
          ],
          project: {
            title: "Styled Profile Card",
            description: "Build a nicely styled user profile card using colors, custom fonts, rounded borders, and shadows."
          }
        },
        {
          id: "css-flexbox",
          title: "CSS Flexbox",
          description: "Master layouts in CSS with the Flexible Box Module. Learn how to easily align and distribute space among items in a container.",
          videos: [
            "https://www.youtube.com/embed/fYq5JZgSks0"
          ],
          project: {
            title: "Responsive Navbar",
            description: "Create a responsive navigation bar using Flexbox that aligns a logo to the left and navigation links to the right."
          }
        }
      ]
    },
    {
      id: "javascript",
      title: "JavaScript",
      order: 3,
      topics: [
        {
          id: "js-basics",
          title: "JavaScript Basics",
          description: "Add logic and interactivity to your websites using variables, data types, functions, and basic DOM manipulation events.",
          videos: [
            "https://www.youtube.com/embed/W6NZfCO5SIk"
          ],
          project: {
            title: "Interactive Counter",
            description: "Build a simple counter application with increment, decrement, and reset buttons."
          }
        }
      ]
    },
    {
      id: "react",
      title: "React Fundamentals",
      order: 4,
      topics: [
        {
          id: "react-basics",
          title: "React Fundamentals",
          description: "Learn components, state, and props in React to build dynamic and reusable user interfaces.",
          videos: [
            "https://www.youtube.com/embed/bMknfKXIFA8"
          ],
          project: {
            title: "Todo App",
            description: "Build a classic Todo List application to practice state management with useState."
          }
        }
      ]
    }
  ]
};
