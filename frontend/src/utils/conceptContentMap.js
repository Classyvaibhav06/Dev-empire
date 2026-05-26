export const conceptContentMap = {
  // --- How the Web Works ---
  'client-server-architecture': {
    anatomy: [
      { label: 'Client Device', detail: 'Browser, mobile app, or IoT device initiating connection.' },
      { label: 'HTTP Request', detail: 'Sent from client containing verb, URL, headers, and body.' },
      { label: 'App Server', detail: 'Computes response, runs server code, interacts with database.' },
      { label: 'HTTP Response', detail: 'Payload returned with a status code (e.g., 200 OK) and data.' }
    ],
    rules: [
      'Clients start all interactions; servers listen and reply.',
      'The network acts as a bridge, introducing latency and security needs.',
      'Statelessness means each request must self-identify.'
    ],
    diagram: {
      type: 'network',
      title: 'Client-Server Loop',
      lanes: ['Client UI', 'Network', 'Server logic'],
      steps: [
        ['Client UI', 'Send HTTP request (GET /index.html)'],
        ['Network', 'Route TCP/IP packets to destination'],
        ['Server logic', 'Process route, fetch database resource'],
        ['Client UI', 'Receive HTML response and paint page']
      ]
    },
    tests: [
      {

      question: 'Which of the following is a primary characteristic of the client-server architecture?',
      options: [
        'The server is always responsible for initiating communication with the client.',
        'The client initiates requests and the server listens and returns responses.',
        'Data is stored exclusively on the client device to save server costs.',
        'Client and server must run on the exact same physical machine.'
      ],
      answer: 1,
      explanation: 'In the client-server model, the client initiates the request-response cycle, and the server responds to incoming client requests.'
    
      },
      {
        question: "What is the primary function of a client in a client-server architecture?",
        options: ["To store data","To handle user requests","To manage network connections","To process transactions"],
        answer: 1,
        explanation: "The client is responsible for handling user requests and sending them to the server for processing."
      },
      {
        question: "Which of the following is a characteristic of a server in a client-server architecture?",
        options: ["It is responsible for handling user requests","It stores data and manages network connections","It is a single point of failure","It is stateless"],
        answer: 2,
        explanation: "A server stores data and manages network connections, making it a critical component of the client-server architecture."
      },
      {
        question: "What is the benefit of using a client-server architecture?",
        options: ["Improved security","Increased scalability","Better data management","All of the above"],
        answer: 3,
        explanation: "A client-server architecture allows for better data management, improved scalability, and increased security, making it a popular choice for web development."
      },
      {
        question: "Which of the following is an example of a client-server architecture?",
        options: ["A single-page application","A web server and a database","A desktop application","A mobile app"],
        answer: 1,
        explanation: "A web server and a database are a classic example of a client-server architecture, where the web server handles user requests and the database stores and manages data."
      }
    ]
  },
  'ip-addresses-dns': {
    anatomy: [
      { label: 'Domain Name', detail: 'Human-readable address (e.g., google.com).' },
      { label: 'IP Address', detail: 'Unique numeric identifier of a server (IPv4/IPv6).' },
      { label: 'DNS Root Server', detail: 'First stop in resolving domain names.' },
      { label: 'Resolver Cache', detail: 'Local browser or ISP cache containing mapped IPs.' }
    ],
    rules: [
      'Lookups check local caches before querying root name servers.',
      'IP addresses can change while domain names remain static.',
      'TTL (Time to Live) governs how long records remain cached.'
    ],
    diagram: {
      type: 'network',
      title: 'Domain Resolution Flow',
      lanes: ['Browser', 'Local DNS Cache', 'Root/Authoritative DNS'],
      steps: [
        ['Browser', 'Query hostname lookup (e.g., domain.com)'],
        ['Local DNS Cache', 'Check local cache (miss triggers recursion)'],
        ['Root/Authoritative DNS', 'Resolve domain name to server IP'],
        ['Browser', 'Establish TCP handshake with resolved IP']
      ]
    },
    tests: [
      {

      question: 'What happens immediately if a requested domain name is found in the local browser DNS cache?',
      options: [
        'The browser queries the root nameservers.',
        'The request fails with a 404 status code.',
        'The browser immediately uses the cached IP address, bypassing external DNS queries.',
        'The local resolver clears the cache and requests a new IP.'
      ],
      answer: 2,
      explanation: 'If a domain-to-IP mapping is cached locally, the browser skips external queries to reduce latency and contacts the IP directly.'
    
      },
      {
        question: "What is the primary function of DNS in the context of IP addresses?",
        options: ["To assign IP addresses to devices on a network","To translate human-readable domain names into IP addresses","To manage network traffic and congestion","To secure network communication"],
        answer: 1,
        explanation: "DNS stands for Domain Name System, which is a critical component of the internet that translates human-readable domain names into IP addresses that computers can understand."
      },
      {
        question: "What is the difference between a static IP address and a dynamic IP address?",
        options: ["A static IP address is assigned by a DHCP server, while a dynamic IP address is assigned manually","A static IP address is assigned to a device for its entire lifetime, while a dynamic IP address is reassigned periodically","A static IP address is used for local area networks, while a dynamic IP address is used for the internet","A static IP address is used for devices that require constant connectivity, while a dynamic IP address is used for devices that require occasional connectivity"],
        answer: 1,
        explanation: "A static IP address is assigned to a device for its entire lifetime, while a dynamic IP address is reassigned periodically by a DHCP server."
      },
      {
        question: "What is the purpose of the IP address 127.0.0.1?",
        options: ["It is used to assign a device to a specific network segment","It is used to translate a domain name into an IP address","It is a reserved IP address used for loopback purposes","It is used to secure network communication"],
        answer: 2,
        explanation: "The IP address 127.0.0.1 is a reserved IP address used for loopback purposes, which allows a device to communicate with itself."
      },
      {
        question: "What is the process called when a device requests an IP address from a DHCP server?",
        options: ["IP address assignment","DHCP request","IP address leasing","IP address renewal"],
        answer: 1,
        explanation: "The process of a device requesting an IP address from a DHCP server is called IP address assignment."
      }
    ]
  },
  'http-https-protocols-status-codes': {
    anatomy: [
      { label: 'HTTP Verbs', detail: 'Operations allowed (GET, POST, PUT, DELETE).' },
      { label: 'SSL/TLS Handshake', detail: 'Cryptographic step that upgrades HTTP to HTTPS.' },
      { label: 'Headers', detail: 'Key-value metadata (Content-Type, Authorization, Cookies).' },
      { label: 'Status Code', detail: 'Three-digit server response class (2xx, 3xx, 4xx, 5xx).' }
    ],
    rules: [
      'HTTPS encrypts the request URL, headers, and body in transit.',
      'Status codes must accurately represent server-side results.',
      'Never send raw credentials over plain HTTP connections.'
    ],
    diagram: {
      type: 'network',
      title: 'Secure Handshake & Code Flow',
      lanes: ['Client', 'TLS/SSL Layer', 'Server API'],
      steps: [
        ['Client', 'Initiate connection with client hello'],
        ['TLS/SSL Layer', 'Verify server certificate & encrypt session'],
        ['Server API', 'Process secure payload & determine status'],
        ['Client', 'Receive encrypted response & read status code']
      ]
    },
    tests: [
      {

      question: 'What is the main difference between HTTP and HTTPS?',
      options: [
        'HTTPS is a completely separate protocol that does not use HTTP verbs.',
        'HTTPS encrypts data during network transit using SSL/TLS.',
        'HTTP is faster and should be preferred for sending credentials.',
        'HTTPS does not use status codes to confirm success.'
      ],
      answer: 1,
      explanation: 'HTTPS is HTTP wrapped in a secure SSL/TLS layer to encrypt communication and protect against eavesdropping or tampering.'
    
      },
      {
        question: "What is the primary difference between HTTP and HTTPS protocols?",
        options: ["HTTP is a more secure protocol","HTTPS is a more secure protocol","HTTP is used for web servers, HTTPS for web applications","HTTP is used for web applications, HTTPS for web servers"],
        answer: 1,
        explanation: "HTTPS is a more secure protocol than HTTP because it uses encryption to secure data in transit."
      },
      {
        question: "What is the status code for a successful HTTP request?",
        options: ["200","404","500","301"],
        answer: 0,
        explanation: "200 is the standard status code for a successful HTTP request."
      },
      {
        question: "What is the purpose of the HTTP status code 301?",
        options: ["The requested resource has been permanently moved","The requested resource has been temporarily moved","The requested resource has not been found","The requested resource is currently unavailable"],
        answer: 0,
        explanation: "The HTTP status code 301 is used to indicate that the requested resource has been permanently moved to a new location."
      },
      {
        question: "What is the HTTP status code for a server error?",
        options: ["200","404","500","301"],
        answer: 2,
        explanation: "The HTTP status code 500 is used to indicate that a server error has occurred."
      }
    ]
  },
  'request-response-cycle': {
    anatomy: [
      { label: 'Request Payload', detail: 'JSON or form parameters sent by client.' },
      { label: 'Network Transit', detail: 'Data packets split, sent, and reassembled.' },
      { label: 'Controller Logic', detail: 'Server code routing and handling requests.' },
      { label: 'Response Payload', detail: 'HTML page, asset, or JSON payload returned.' }
    ],
    rules: [
      'Every request must eventually receive a matching response or timeout.',
      'Keep response payloads small to preserve bandwidth.',
      'Headers dictate how the browser handles response payloads.'
    ],
    diagram: {
      type: 'network',
      title: 'Full Request-Response Cycle',
      lanes: ['Client Agent', 'Router/Gateway', 'Backend Controller'],
      steps: [
        ['Client Agent', 'Construct request & transmit packets'],
        ['Router/Gateway', 'Inspect headers & direct to correct server'],
        ['Backend Controller', 'Resolve route, query database, return response'],
        ['Client Agent', 'Decompress payload and process payload']
      ]
    },
    tests: [
      {

      question: 'In a stateless request-response cycle, how does a server identify a returning client?',
      options: [
        'The server remembers the client IP address forever.',
        'The client must include identification credentials (like cookies or tokens) in its request headers.',
        'The connection remains open indefinitely so the client is never disconnected.',
        'The server assigns a permanent CPU thread to each unique client.'
      ],
      answer: 1,
      explanation: 'Because HTTP is stateless, the server does not remember past requests; the client must present session identifiers (like tokens or cookies) in headers with each request.'
    
      },
      {
        question: "What is the primary purpose of the request-response cycle in web development?",
        options: ["To handle user authentication","To manage database connections","To exchange data between a client and a server","To optimize website performance"],
        answer: 2,
        explanation: "The request-response cycle is used to exchange data between a client (usually a web browser) and a server, allowing for communication and data transfer."
      },
      {
        question: "Which part of the request-response cycle initiates the process?",
        options: ["Client","Server","Router","Database"],
        answer: 0,
        explanation: "The client initiates the request-response cycle by sending a request to the server, which then processes the request and sends a response back to the client."
      },
      {
        question: "What happens to the request after it reaches the server?",
        options: ["It is stored in a database","It is processed by the server and then sent back to the client","It is ignored by the server","It is forwarded to a different server"],
        answer: 1,
        explanation: "After reaching the server, the request is processed by the server, which then sends a response back to the client."
      },
      {
        question: "What is the final step in the request-response cycle?",
        options: ["Server sends a request to the client","Client sends a request to the server","Server processes the request and sends a response back to the client","Client receives the response from the server"],
        answer: 3,
        explanation: "The final step in the request-response cycle is when the client receives the response from the server, completing the cycle."
      }
    ]
  },
  'how-browsers-parse-html-css-js': {
    anatomy: [
      { label: 'DOM Tree', detail: 'Structural representation of HTML nodes.' },
      { label: 'CSSOM Tree', detail: 'Style rule representation for elements.' },
      { label: 'Render Tree', detail: 'Union of DOM and CSSOM containing visible nodes.' },
      { label: 'Layout & Paint', detail: 'Calculating sizes, positions, and pixels on screen.' }
    ],
    rules: [
      'Script tags block HTML parsing unless async or defer is present.',
      'CSS is render-blocking; browsers wait for CSSOM to render.',
      'Reflows (layout recalculations) are more expensive than repaints.'
    ],
    diagram: {
      type: 'network',
      title: 'Browser Critical Rendering Path',
      lanes: ['HTML Parser', 'CSS Engine', 'JS Engine', 'Render Engine'],
      steps: [
        ['HTML Parser', 'Build Document Object Model (DOM)'],
        ['CSS Engine', 'Build CSS Object Model (CSSOM)'],
        ['JS Engine', 'Execute script blocks and manipulate trees'],
        ['Render Engine', 'Generate Render Tree, layout, and paint pixels']
      ]
    },
    tests: [
      {

      question: 'Which of the following is true about how CSS blocks browser rendering?',
      options: [
        'The browser displays raw unstyled HTML before parsing CSS.',
        'The browser stops compiling the DOM completely when it encounters a link tag.',
        'The browser constructs the DOM, but waits for the CSSOM tree to build the Render Tree and paint the page.',
        'JavaScript does not block HTML parsing, but CSS always does.'
      ],
      answer: 2,
      explanation: 'CSS is render-blocking. To avoid a "Flash of Unstyled Content" (FOUC), the browser waits for the CSSOM tree to merge with the DOM before rendering visual elements.'
    
      },
      {
        question: "What is the order in which a browser parses HTML, CSS, and JavaScript?",
        options: ["HTML, CSS, JavaScript","HTML, JavaScript, CSS","JavaScript, CSS, HTML","CSS, HTML, JavaScript"],
        answer: 0,
        explanation: "Browsers first parse the HTML to create the document structure, then apply CSS styles to the structure, and finally execute JavaScript code."
      },
      {
        question: "Which of the following is a correct sequence of events when a browser loads a web page?",
        options: ["CSS is applied before HTML is parsed","JavaScript is executed before CSS is applied","HTML is parsed before CSS is applied","None of the above"],
        answer: 2,
        explanation: "Browsers first parse the HTML, then apply CSS styles, and finally execute JavaScript code."
      },
      {
        question: "What happens when a browser encounters a script tag in the HTML document?",
        options: ["The browser stops parsing the HTML document","The browser applies CSS styles to the document","The browser executes the JavaScript code inside the script tag","The browser ignores the script tag"],
        answer: 2,
        explanation: "When a browser encounters a script tag, it pauses the parsing of the HTML document and executes the JavaScript code inside the tag."
      },
      {
        question: "Which of the following is a correct statement about how browsers handle CSS styles?",
        options: ["CSS styles are applied after the HTML document is fully parsed","CSS styles are applied before the HTML document is fully parsed","CSS styles are applied in parallel with the HTML document parsing","None of the above"],
        answer: 1,
        explanation: "Browsers apply CSS styles before the HTML document is fully parsed, as they need to know the styles to properly render the document."
      }
    ]
  },

  // --- HTML Basics & Semantics ---
  'html-document-structure-tags': {
    anatomy: [
      { label: 'Doctype Declaration', detail: 'Informs browser of standard HTML5 document type.' },
      { label: 'Root element', detail: 'The <html> node enclosing head and body.' },
      { label: 'Head metadata', detail: 'Includes title, charsets, viewports, and stylesheets.' },
      { label: 'Body element', detail: 'Contains all visual layout nodes.' }
    ],
    rules: [
      'Always start documents with <!DOCTYPE html>.',
      'Maintain exact matching closing tags for elements.',
      'Keep layout tags isolated within the body block.'
    ],
    diagram: {
      type: 'tree',
      title: 'Standard HTML Layout Tree',
      root: 'html',
      children: [
        { label: 'head (metadata)', children: ['meta tags', 'title tag', 'link stylesheet'] },
        { label: 'body (visible content)', children: ['header tag', 'main wrapper', 'footer tag'] }
      ]
    },
    tests: [
      {

      question: 'What is the primary function of the <!DOCTYPE html> declaration?',
      options: [
        'It styles the page background and base fonts.',
        'It tells the browser to parse the document as modern HTML5 standard compliant.',
        'It imports jQuery and other scripts automatically.',
        'It sets up routing rules for server requests.'
      ],
      answer: 1,
      explanation: 'The doctype declaration tells the browser to render the page in standards mode rather than quirks mode.'
    
      },
      {
        question: "What is the purpose of the <html> tag in HTML document structure?",
        options: ["To define a paragraph of text","To define the root element of an HTML document","To define a heading","To define a link"],
        answer: 1,
        explanation: "The <html> tag is the root element of an HTML document and defines the document structure."
      },
      {
        question: "Which of the following tags is used to define a section of a document?",
        options: ["<p>","<div>","<section>","<article>"],
        answer: 2,
        explanation: "The <div> tag is used to define a section of a document, although it can also be used for other purposes."
      },
      {
        question: "What is the purpose of the <head> tag in HTML document structure?",
        options: ["To define a paragraph of text","To define the metadata of an HTML document","To define a heading","To define a link"],
        answer: 1,
        explanation: "The <head> tag is used to define the metadata of an HTML document, such as the title, character encoding, and links to external stylesheets or scripts."
      },
      {
        question: "Which of the following tags is used to define a heading in HTML document structure?",
        options: ["<h1>","<h2>","<h3>","<p>"],
        answer: 0,
        explanation: "The <h1> tag is used to define a heading in HTML document structure, although other heading tags like <h2> and <h3> can also be used for different levels of headings."
      }
    ]
  },
  'elements-attributes-and-headings': {
    anatomy: [
      { label: 'Opening Tag', detail: 'Identifies element type and lists properties.' },
      { label: 'Attributes', detail: 'Name-value parameters like class, id, or src.' },
      { label: 'Heading Levels', detail: 'Structural tags from h1 (highest) to h6 (lowest).' },
      { label: 'Text content', detail: 'The inner content parsed between tags.' }
    ],
    rules: [
      'Heading levels denote structural hierarchies, not target visual sizes.',
      'Attribute values must be enclosed in quotes.',
      'Use a single h1 tag per page representing the page title.'
    ],
    diagram: {
      type: 'tree',
      title: 'Heading Hierarchy structure',
      root: 'h1 (Page Title)',
      children: [
        { label: 'h2 (Major Topic)', children: ['h3 (Sub-topic A)', 'h3 (Sub-topic B)'] },
        { label: 'h2 (Another Topic)', children: ['h3 (Sub-topic C)'] }
      ]
    },
    tests: [
      {

      question: 'Why should you avoid skipping heading levels (like jumping from <h1> to <h4>)?',
      options: [
        'It throws a syntax compilation error in the browser.',
        'It breaks the visual layout and prevents CSS from loading.',
        'It disrupts the logical document outline, negatively impacting accessibility and SEO.',
        'It causes image attributes to be ignored.'
      ],
      answer: 2,
      explanation: 'Headings establish document structure. Screen readers and search engine crawlers rely on a logical, sequential hierarchy (h1, then h2, then h3) to understand section relations.'
    
      },
      {
        question: "What is the purpose of the 'id' attribute in HTML?",
        options: ["To specify the color of the text","To specify the size of the text","To uniquely identify an element","To specify the font style"],
        answer: 2,
        explanation: "The 'id' attribute is used to uniquely identify an element in an HTML document, making it easier to target with CSS or JavaScript."
      },
      {
        question: "Which of the following is a heading element in HTML?",
        options: ["p","div","h1","span"],
        answer: 2,
        explanation: "The 'h1' element is a heading element in HTML, used to define a main heading for a section of content."
      },
      {
        question: "What is the difference between the 'class' and 'id' attributes in HTML?",
        options: ["The 'class' attribute is used to specify the size of the text, while the 'id' attribute is used to specify the color of the text","The 'class' attribute is used to uniquely identify an element, while the 'id' attribute is used to specify the font style","The 'class' attribute is used to specify a group of elements, while the 'id' attribute is used to uniquely identify an element","The 'class' attribute is used to specify the color of the text, while the 'id' attribute is used to specify the size of the text"],
        answer: 2,
        explanation: "The 'class' attribute is used to specify a group of elements, while the 'id' attribute is used to uniquely identify an element."
      },
      {
        question: "Which of the following is a semantic heading element in HTML?",
        options: ["h1","h2","h3","p"],
        answer: 0,
        explanation: "The 'h1' element is a semantic heading element in HTML, used to define a main heading for a section of content."
      }
    ]
  },
  'lists-tables-and-forms': {
    anatomy: [
      { label: 'Input Controls', detail: 'Fields capturing user values (text, password, checkboxes).' },
      { label: 'Form submission', detail: 'Triggers action attribute using standard methods (POST/GET).' },
      { label: 'Lists (ul/ol)', detail: 'Groupings of list items (li) representing collections.' },
      { label: 'Table elements', detail: 'Structured grid data with rows, headers, and cells.' }
    ],
    rules: [
      'Every form control must have a label element linked via htmlFor/for.',
      'Never use tables for page grids or layout structures.',
      'Include clear action and method properties on form containers.'
    ],
    diagram: {
      type: 'tree',
      title: 'Form Submission Tree',
      root: 'form container',
      children: [
        { label: 'inputs & labels', children: ['input type="text"', 'label for="name"'] },
        { label: 'submit trigger', children: ['button type="submit"'] }
      ]
    },
    tests: [
      {

      question: 'Which element represents the correct accessibility pattern to bind text to a form input?',
      options: [
        'Using a <span> next to the input with matching colors.',
        'A <label> element with a "for" attribute matching the input\'s "id" attribute.',
        'Placing placeholder text inside the input instead of a label.',
        'Wrapping the input inside a table cell.'
      ],
      answer: 1,
      explanation: 'A <label for="username"> matches an <input id="username">. This links them semantically, enabling screen readers to announce the label when focused, and allowing clicking the label to focus the input.'
    
      },
      {
        question: "What is the primary purpose of using a table in web development?",
        options: ["To display a list of items","To create a responsive layout","To organize data in a structured format","To add interactivity to a webpage"],
        answer: 2,
        explanation: "Tables are used to organize data in a structured format, making it easier to read and understand."
      },
      {
        question: "Which of the following is an example of a form in web development?",
        options: ["A list of items","A table with data","A collection of input fields and buttons","A responsive image"],
        answer: 2,
        explanation: "A form is a collection of input fields and buttons that allow users to submit data to the server."
      },
      {
        question: "What is the difference between a list and a table in web development?",
        options: ["A list is used for navigation, while a table is used for data display","A list is used for data display, while a table is used for navigation","A list is used for general-purpose data display, while a table is used for structured data","A list is used for structured data, while a table is used for general-purpose data display"],
        answer: 2,
        explanation: "A list is used for general-purpose data display, while a table is used for structured data."
      },
      {
        question: "Which of the following is a common use case for a table in web development?",
        options: ["Displaying a list of items","Creating a responsive layout","Organizing data in a structured format","Adding interactivity to a webpage"],
        answer: 2,
        explanation: "Tables are commonly used to organize data in a structured format, making it easier to read and understand."
      }
    ]
  },
  'semantic-html': {
    anatomy: [
      { label: 'Header & Nav', detail: 'Sections containing search, brand, and menu links.' },
      { label: 'Main Wrapper', detail: 'Container enclosing unique page content.' },
      { label: 'Article & Section', detail: 'Self-contained concepts and related topics.' },
      { label: 'Aside & Footer', detail: 'Sidebar information and bottom metadata links.' }
    ],
    rules: [
      'Only use semantic tags when they match the purpose of the block.',
      'Avoid placing structural elements outside the main viewport.',
      'Maintain clear structures for assistive tools like screen readers.'
    ],
    diagram: {
      type: 'tree',
      title: 'Semantic Document Structure',
      root: 'body element',
      children: [
        { label: 'header element', children: ['nav navigation link list'] },
        { label: 'main element', children: ['article main content block', 'aside sidebar'] },
        { label: 'footer element', children: ['copyright info'] }
      ]
    },
    tests: [
      {

      question: 'What is the main benefit of using <main> over a generic <div> tag?',
      options: [
        'It styles the main section with margins automatically.',
        'It tells browsers and assistive systems exactly where the core, non-repeating content of the page resides.',
        'It speeds up JavaScript evaluation by 50%.',
        'It prevents the page from being scraped by crawlers.'
      ],
      answer: 1,
      explanation: 'The <main> element is a landmark tag. Assistive technologies use it to allow users to skip header/navigation lists and jump directly to the primary page contents.'
    
      },
      {
        question: "What is the main purpose of using semantic HTML?",
        options: ["To improve the visual appearance of a webpage","To make a webpage load faster","To provide a better understanding of the structure and content of a webpage to search engines and screen readers","To reduce the size of a webpage's code"],
        answer: 2,
        explanation: "Semantic HTML is used to provide a better understanding of the structure and content of a webpage to search engines and screen readers, making it more accessible and easier to understand."
      },
      {
        question: "Which of the following is an example of a semantic HTML element?",
        options: ["<div>"],
        answer: 0,
        explanation: "The <div> element is a generic container element that does not provide any specific meaning to the content it contains. In contrast, semantic HTML elements such as <header>, <nav>, <main>, <section>, <article>, <aside>, <footer> provide a clear indication of their purpose."
      },
      {
        question: "What is the difference between the <span> and <strong> elements in HTML?",
        options: ["<span> is used for inline elements while <strong> is used for block-level elements","Both <span> and <strong> are used for inline elements","Both <span> and <strong> are used for block-level elements","There is no difference between <span> and <strong>"],
        answer: 1,
        explanation: "The <span> element is used for inline elements, while the <strong> element is used to indicate strong importance, seriousness, or urgency for its contents."
      },
      {
        question: "Which of the following is a benefit of using semantic HTML?",
        options: ["Improved search engine rankings","Faster page loading times","Easier maintenance and updates","All of the above"],
        answer: 3,
        explanation: "Using semantic HTML can improve search engine rankings, reduce page loading times, and make it easier to maintain and update a website."
      }
    ]
  },
  'accessibility': {
    anatomy: [
      { label: 'ARIA Attributes', detail: 'Provides custom labels and states to screen readers.' },
      { label: 'Keyboard Navigation', detail: 'Ensures forms, buttons, and links are focusable (Tab).' },
      { label: 'Contrast Ratio', detail: 'Color differences between background and text.' },
      { label: 'Alt Text description', detail: 'Text describing visual image assets.' }
    ],
    rules: [
      'Verify that all interactive controls are reachable via keyboard tab key.',
      'Always add alt text to images unless purely decorative.',
      'Do not rely solely on color to convey critical states.'
    ],
    diagram: {
      type: 'tree',
      title: 'Accessibility Layer Tree',
      root: 'Accessibility Tree',
      children: [
        { label: 'Interactive Nodes', children: ['Focus outlines', 'Tabindex ordering', 'ARIA Roles'] },
        { label: 'Visual Nodes', children: ['Contrast ratio rules', 'Alternative descriptions'] }
      ]
    },
    tests: [
      {

      question: 'Which of the following satisfies basic image accessibility criteria?',
      options: [
        'Adding title="..." to every image.',
        'Providing a descriptive alt="..." attribute for informative images, or an empty alt="" for decorative images.',
        'Avoiding image tags altogether and using CSS background images.',
        'Adding tabindex="0" to every image so screen readers focus them.'
      ],
      answer: 1,
      explanation: 'Alt text should describe the information conveyed by images. If an image is purely decorative, using a null/empty alt="" attribute tells screen readers to safely ignore it.'
    
      },
      {
        question: "What is the main purpose of using ARIA attributes in web development?",
        options: ["To improve the visual appearance of a website","To enhance the accessibility of a website for screen readers","To increase the loading speed of a website","To reduce the amount of code in a website"],
        answer: 1,
        explanation: "ARIA attributes are used to provide a way to make dynamic content and interactive elements accessible to people with disabilities, particularly those who use screen readers."
      },
      {
        question: "Which of the following HTML elements is considered an accessible way to create a button?",
        options: ["<button>Click me</button>","<a href='#' class='button'>Click me</a>","<span class='button'>Click me</span>","<input type='submit' value='Click me'>"],
        answer: 3,
        explanation: "Using a native HTML button element or a semantic input element with a type attribute set to 'submit' is considered an accessible way to create a button."
      },
      {
        question: "What is the recommended way to provide alternative text for an image in HTML?",
        options: ["Using the 'alt' attribute with a descriptive text","Using the 'title' attribute with a descriptive text","Using the 'src' attribute with a descriptive text","Using the 'style' attribute with a descriptive text"],
        answer: 0,
        explanation: "Using the 'alt' attribute with a descriptive text is the recommended way to provide alternative text for an image in HTML, making it accessible to screen readers and search engines."
      },
      {
        question: "Which of the following color combinations is considered accessible for people with color vision deficiency?",
        options: ["Red and green","Blue and yellow","Black and white","Purple and orange"],
        answer: 2,
        explanation: "Using a color combination of black and white is considered accessible for people with color vision deficiency, as it provides sufficient contrast and is easily distinguishable."
      }
    ]
  },

  // --- CSS Basics & Box Model ---
  'css-syntax-and-stylesheets-linking': {
    anatomy: [
      { label: 'Link tag', detail: 'Connects external stylesheets inside the HTML head.' },
      { label: 'CSS rule block', detail: 'Contains selector and declarations.' },
      { label: 'Property name', detail: 'Styling property targeted (e.g., font-size).' },
      { label: 'Declaration value', detail: 'Specific setting given (e.g., 1.5rem).' }
    ],
    rules: [
      'External stylesheets load in parallel and block browser rendering.',
      'Use inline styles only for dynamic scripting changes.',
      'Write legible selectors with clean class chains.'
    ],
    diagram: {
      type: 'box',
      title: 'CSS Rule Layout',
      layers: [
        { label: 'Selector (.class-name)', hint: 'Target selector element' },
        { label: 'Property (color)', hint: 'Key rule name' },
        { label: 'Value (#ffffff)', hint: 'Style payload applied' }
      ]
    },
    tests: [
      {

      question: 'Where should external stylesheets ideally be linked in an HTML document?',
      options: [
        'At the very end of the <body> element.',
        'Inside the <head> element to ensure styling starts loading before content renders.',
        'Directly inside the <footer> element.',
        'Inline on the first <div> tag.'
      ],
      answer: 1,
      explanation: 'Linking stylesheets inside the <head> ensures that styles are parsed and available when the browser paints the HTML, preventing a brief flash of unstyled content.'
    
      },
      {
        question: "What is the purpose of the <link> tag in HTML when linking to an external stylesheet?",
        options: ["To import a CSS file","To link a JavaScript file","To link an external stylesheet","To link an image file"],
        answer: 2,
        explanation: "The <link> tag is used to link an external stylesheet to an HTML document, allowing the document to be styled using CSS rules defined in the stylesheet."
      },
      {
        question: "What is the difference between @import and <link> when linking to an external stylesheet?",
        options: ["@import is used for internal stylesheets, <link> is used for external stylesheets","@import is used for external stylesheets, <link> is used for internal stylesheets","@import is used to import a CSS file, <link> is used to link a CSS file","@import is used to link a CSS file, <link> is used to import a CSS file"],
        answer: 1,
        explanation: "@import is used to import a CSS file from within a stylesheet, while <link> is used to link an external stylesheet to an HTML document."
      },
      {
        question: "What is the correct syntax for linking to an external stylesheet using the <link> tag?",
        options: ["<link rel='stylesheet' href='styles.css'>","<link rel='stylesheet' type='text/css' href='styles.css'>","<link rel='stylesheet' type='text/css' href='styles.css' media='screen'>","<link rel='stylesheet' type='text/css' href='styles.css' media='screen' charset='UTF-8'>"],
        answer: 2,
        explanation: "The correct syntax for linking to an external stylesheet using the <link> tag includes the rel attribute set to 'stylesheet', the type attribute set to 'text/css', and the href attribute set to the path of the stylesheet."
      },
      {
        question: "What is the purpose of the media attribute in the <link> tag when linking to an external stylesheet?",
        options: ["To specify the type of stylesheet","To specify the language of the stylesheet","To specify the media type for which the stylesheet applies","To specify the path of the stylesheet"],
        answer: 2,
        explanation: "The media attribute in the <link> tag is used to specify the media type for which the stylesheet applies, such as screen, print, or handheld."
      }
    ]
  },
  'css-selectors': {
    anatomy: [
      { label: 'Class Selector', detail: 'Target selector prefixed by dot (.) for reusable classes.' },
      { label: 'ID Selector', detail: 'High-specificity selector prefixed by hash (#).' },
      { label: 'Pseudo-classes', detail: 'Interactive state selectors like :hover or :focus.' },
      { label: 'Combinators', detail: 'Relationships like child (>), descendant (space), sibling (+).' }
    ],
    rules: [
      'Keep selectors flat to prevent specificity wars.',
      'IDs have high specificity and override class selectors.',
      'Use pseudo-states to provide interactive visual cues.'
    ],
    diagram: {
      type: 'box',
      title: 'Selector Hierarchy Specificity',
      layers: [
        { label: 'ID Selector (#id)', hint: 'High Specificity Weight (0,1,0,0)' },
        { label: 'Class & Attributes (.class, [attr])', hint: 'Medium Specificity Weight (0,0,1,0)' },
        { label: 'Element Selector (div, p)', hint: 'Low Specificity Weight (0,0,0,1)' }
      ]
    },
    tests: [
      {

      question: 'Which selector has the highest specificity weight?',
      options: [
        'A class selector (e.g., .button-primary)',
        'An element selector (e.g., button)',
        'An ID selector (e.g., #submit-btn)',
        'A combinator selector (e.g., div button)'
      ],
      answer: 2,
      explanation: 'ID selectors possess a significantly higher specificity than class or element selectors, making them harder to override in stylesheets.'
    
      },
      {
        question: "What is the CSS selector for selecting all elements with the class 'header'?",
        options: ["header",".header","#header","header "],
        answer: 1,
        explanation: "The dot (.) is used to select elements with a specific class."
      },
      {
        question: "Which CSS selector is used to select all elements with the id 'main'?",
        options: ["main",".main","#main","main "],
        answer: 2,
        explanation: "The hash (#) is used to select elements with a specific id."
      },
      {
        question: "What is the CSS selector for selecting all elements that are direct children of the element with the id 'nav'?",
        options: ["#nav > *","#nav *","#nav > .child","#nav .child"],
        answer: 0,
        explanation: "The greater-than symbol (>) is used to select direct children."
      },
      {
        question: "Which CSS selector is used to select all elements that have the class 'active' and the id 'button'?",
        options: [".active #button","#button.active",".active#button",".active #button "],
        answer: 0,
        explanation: "The hash (#) and dot (.) can be combined to select elements with multiple attributes."
      }
    ]
  },
  'the-css-box-model': {
    anatomy: [
      { label: 'Margin layer', detail: 'Invisible spacing surrounding the outside of elements.' },
      { label: 'Border layer', detail: 'Visual stroke outlining the padding boundary.' },
      { label: 'Padding layer', detail: 'Inner spacing around core content.' },
      { label: 'Content block', detail: 'Actual dimensions of the content itself.' }
    ],
    rules: [
      'Set box-sizing: border-box on all elements to include padding/border in width calculations.',
      'Margins collapse vertically on adjacent block elements.',
      'Padding increases the click target of elements.'
    ],
    diagram: {
      type: 'box',
      title: 'Detailed CSS Box Model',
      layers: [
        { label: 'Margin (Spacing Outside)', hint: 'Separates element from peers' },
        { label: 'Border (Edge Outline)', hint: 'Visual boundary stroke' },
        { label: 'Padding (Spacing Inside)', hint: 'Pushes content inward from border' },
        { label: 'Content (Core Box)', hint: 'Width & Height of target content' }
      ]
    },
    tests: [
      {

      question: 'By default (content-box), if an element has a width of 100px, padding of 10px, and border of 2px, what is its total rendered width?',
      options: [
        '100px',
        '112px',
        '124px',
        '120px'
      ],
      answer: 2,
      explanation: 'Under `content-box`, total width = width + left/right padding + left/right border = 100 + 20 + 4 = 124px. Using `border-box` locks the total rendered width to the specified 100px.'
    
      },
      {
        question: "What is the CSS box model?",
        options: ["A layout model used in CSS to describe the structure of elements","A method of styling elements in CSS","A way to add interactivity to web pages","A type of CSS selector"],
        answer: 0,
        explanation: "The CSS box model is a layout model used in CSS to describe the structure of elements, including their width, height, padding, border, and margin."
      },
      {
        question: "What are the four main components of the CSS box model?",
        options: ["Content, Padding, Border, Margin","Content, Border, Margin, Padding","Padding, Border, Margin, Content","Margin, Padding, Border, Content"],
        answer: 0,
        explanation: "The four main components of the CSS box model are Content, Padding, Border, and Margin."
      },
      {
        question: "What happens when you set the width of an element in CSS?",
        options: ["Only the content area of the element is affected","Only the padding area of the element is affected","Both the content and padding areas of the element are affected","Both the content, padding, and border areas of the element are affected"],
        answer: 2,
        explanation: "When you set the width of an element in CSS, both the content and padding areas of the element are affected."
      },
      {
        question: "How can you change the box model behavior in CSS?",
        options: ["Using the box-sizing property","Using the border-box property","Using the padding-box property","Using the content-box property"],
        answer: 0,
        explanation: "You can change the box model behavior in CSS by using the box-sizing property, which allows you to specify whether the width and height properties set the content area, padding area, or border area of an element."
      }
    ]
  },
  'display-properties': {
    anatomy: [
      { label: 'Block Display', detail: 'Element spans full width, starts on a new line.' },
      { label: 'Inline Display', detail: 'Sits side-by-side with text, width matches content.' },
      { label: 'Flex Layout', detail: 'One-dimensional layouts with rows and columns.' },
      { label: 'Grid Layout', detail: 'Two-dimensional templates with columns and rows.' }
    ],
    rules: [
      'Inline elements ignore top and bottom margin and height values.',
      'Use Flexbox for alignment along a single main axis.',
      'Use Grid for strict columns and rows layouts.'
    ],
    diagram: {
      type: 'box',
      title: 'Grid vs Flex Layouts',
      layers: [
        { label: 'Flexbox Layout', hint: '1D Axis: justify-content, align-items' },
        { label: 'Grid Layout', hint: '2D Tracks: grid-template-columns, grid-template-rows' },
        { label: 'Block Flow Layout', hint: 'Vertical stacking default flow' }
      ]
    },
    tests: [
      {

      question: 'What happens to margin-top and margin-bottom on an inline element (like <span>)?',
      options: [
        'They push elements away vertically normally.',
        'They are completely ignored by the layout engine.',
        'They cause the element to wrap to a new line.',
        'They automatically turn the element into block flow.'
      ],
      answer: 1,
      explanation: 'Inline elements do not respect top/bottom margins or height properties. To apply these styles, change the element\'s display to inline-block, flex, or block.'
    
      },
      {
        question: "What is the purpose of the 'display' property in CSS?",
        options: ["To set the font style of an element","To set the visibility of an element","To specify the layout of an element","To set the background color of an element"],
        answer: 2,
        explanation: "The 'display' property is used to specify the layout of an element, such as block, inline, or inline-block."
      },
      {
        question: "What is the effect of setting 'display' to 'flex' on a container element?",
        options: ["It sets the font size to 16px","It makes the element visible","It allows the container to adapt to its content","It sets the background color to red"],
        answer: 2,
        explanation: "Setting 'display' to 'flex' on a container element allows it to adapt to its content and arrange its child elements in a flexible way."
      },
      {
        question: "What is the difference between 'display: block' and 'display: inline-block'?",
        options: ["Block elements take up more space than inline elements","Block elements cannot be nested inside inline elements","Inline elements can be nested inside block elements","Block elements do not start on a new line"],
        answer: 0,
        explanation: "Block elements take up more space than inline elements and start on a new line, while inline elements do not start on a new line and take up only the space needed for their content."
      },
      {
        question: "What is the effect of setting 'display' to 'none' on an element?",
        options: ["It makes the element invisible","It removes the element from the document flow","It sets the element's width and height to 0","It sets the element's background color to black"],
        answer: 1,
        explanation: "Setting 'display' to 'none' on an element removes it from the document flow, effectively hiding it from the user and other elements."
      }
    ]
  },
  'colors-typography-and-transitions': {
    anatomy: [
      { label: 'Font family', detail: 'Primary typeface matching fallback listings.' },
      { label: 'Color definition', detail: 'Uses Hex, RGB, or HSL color spaces.' },
      { label: 'Transition property', detail: 'CSS attributes to animate (e.g., color).' },
      { label: 'Timing function', detail: 'Curves determining progress speeds (ease-in-out).' }
    ],
    rules: [
      'Always include fallback font stacks (e.g., sans-serif).',
      'Use HSL or CSS variables to control color variants.',
      'Limit transitions to cheap properties like opacity and transform.'
    ],
    diagram: {
      type: 'box',
      title: 'CSS Animation Transitions',
      layers: [
        { label: 'Initial State', hint: 'Normal styles (e.g., opacity: 0.8)' },
        { label: 'Transition Rule', hint: 'duration: 0.3s, curve: ease-in-out' },
        { label: 'Active State', hint: 'Target styles triggered (e.g., opacity: 1.0)' }
      ]
    },
    tests: [
      {

      question: 'Which CSS properties are most performant to animate or transition in browsers?',
      options: [
        'width and height',
        'margin and padding',
        'transform and opacity',
        'top and left positioning'
      ],
      answer: 2,
      explanation: 'Transitions on transform and opacity do not trigger layout (reflow) or paint operations; the browser offloads them directly to the GPU for smooth 60fps renders.'
    
      },
      {
        question: "What is the primary function of typography in web development?",
        options: ["To create visually appealing color schemes","To organize and structure content","To enhance user experience through font styles","To improve website accessibility"],
        answer: 1,
        explanation: "Typography is used to organize and structure content on a website, making it easier for users to read and understand."
      },
      {
        question: "Which of the following color schemes is commonly used for readability?",
        options: ["Monochromatic","Complementary","Analogous","High Contrast"],
        answer: 3,
        explanation: "High contrast color schemes are often used for readability as they provide a clear visual distinction between text and background."
      },
      {
        question: "What is the purpose of using transitions in web development?",
        options: ["To improve website performance","To enhance user experience through visual effects","To create visually appealing animations","To improve website security"],
        answer: 1,
        explanation: "Transitions are used to enhance user experience through visual effects, such as animations and hover effects, which can make a website more engaging and interactive."
      },
      {
        question: "Which of the following is an example of a good typography practice?",
        options: ["Using a single font throughout the website","Using a font size of 12px for body text","Using a line height of 1.5 for paragraphs","Using a font size of 24px for headings"],
        answer: 2,
        explanation: "Using a line height of 1.5 for paragraphs is a good typography practice as it improves readability and makes the content easier to read."
      }
    ]
  },

  // --- JavaScript Fundamentals ---
  'variables-data-types': {
    anatomy: [
      { label: 'Let / Const', detail: 'Block-scoped variables. Const prevents re-assignment.' },
      { label: 'Primitives', detail: 'Simple data values (string, number, boolean, null, undefined).' },
      { label: 'Complex Types', detail: 'Reference types (objects, arrays, functions).' },
      { label: 'Scope limits', detail: 'Determines where variables can be accessed.' }
    ],
    rules: [
      'Prefer const; use let only when reassigning values.',
      'Primitive types are passed by value; object types are passed by reference.',
      'Check undefined variables before calling methods on them.'
    ],
    diagram: {
      type: 'cycle',
      title: 'Memory Allocation Lifecycle',
      steps: ['Declare variable', 'Assign value', 'Stack memory (Primitives)', 'Heap memory (Objects)', 'Garbage collection']
    },
    tests: [
      {

      question: 'Which assignment behavior correctly distinguishes const from let?',
      options: [
        'const is block-scoped, let is globally-scoped.',
        'const variables cannot have their reference reassigned; let variables can be reassigned.',
        'const variables are stored in heap memory, let is stored in stack memory.',
        'const is hoisted, let is never hoisted.'
      ],
      answer: 1,
      explanation: 'Reassigning a const variable throws a TypeError. Const locks the binding, though object values and array elements inside a const variable can still be modified.'
    
      },
      {
        question: "What is the data type of a variable that stores a string in JavaScript?",
        options: ["Number","String","Boolean","Undefined"],
        answer: 1,
        explanation: "In JavaScript, a variable that stores a string is of type String."
      },
      {
        question: "What is the data type of a variable that stores a boolean value in JavaScript?",
        options: ["Number","String","Boolean","Undefined"],
        answer: 2,
        explanation: "In JavaScript, a variable that stores a boolean value is of type Boolean."
      },
      {
        question: "What is the data type of a variable that stores a number in JavaScript?",
        options: ["Number","String","Boolean","Undefined"],
        answer: 0,
        explanation: "In JavaScript, a variable that stores a number is of type Number."
      },
      {
        question: "What is the data type of a variable that has not been initialized in JavaScript?",
        options: ["Number","String","Boolean","Undefined"],
        answer: 3,
        explanation: "In JavaScript, a variable that has not been initialized is of type Undefined."
      }
    ]
  },
  'functions-and-scope': {
    anatomy: [
      { label: 'Function signature', detail: 'Arguments list and return statement.' },
      { label: 'Arrow Functions', detail: 'Shorthand syntax, lexical bindings of this.' },
      { label: 'Lexical Scope', detail: 'Functions search upward to locate outer variables.' },
      { label: 'Closure', detail: 'Function remembering its outer scope even after execution.' }
    ],
    rules: [
      'Functions should do one task and return a clean value.',
      'Variables inside a function are isolated from the global namespace.',
      'Closures capture active variables, not simple static values.'
    ],
    diagram: {
      type: 'cycle',
      title: 'Execution Scope Chain',
      steps: ['Call function', 'Push Execution Frame', 'Search Local variables', 'Search Outer/Parent Lexical scope', 'Pop Execution Frame']
    },
    tests: [
      {

      question: 'What is a closure in JavaScript?',
      options: [
        'A function that runs immediately and destroys all local variables.',
        'A combination of a function bundled together with references to its surrounding lexical scope.',
        'A method used to close files and databases connections.',
        'An arrow function that has no access to parent scope.'
      ],
      answer: 1,
      explanation: 'A closure gives a function access to its outer scope variables even after the outer function has finished executing.'
    
      },
      {
        question: "What is the scope of a function in JavaScript?",
        options: ["Global scope","Local scope","Function scope","Block scope"],
        answer: 2,
        explanation: "In JavaScript, a function has its own scope, which is known as function scope. This means that variables declared inside a function are not accessible from outside the function."
      },
      {
        question: "What happens to a variable declared with 'let' inside a function when the function is called multiple times?",
        options: ["It is reinitialized each time the function is called","It is shared across all function calls","It is not accessible from outside the function","It is not reinitialized each time the function is called"],
        answer: 3,
        explanation: "Variables declared with 'let' inside a function have function scope, meaning they are not accessible from outside the function. When the function is called multiple times, a new variable is created each time, so it is not shared across all function calls."
      },
      {
        question: "Can a function access variables declared in its outer scope?",
        options: ["Yes, but only if they are declared with 'var'","Yes, regardless of how they are declared","No, variables in the outer scope are not accessible","No, but only if they are declared with 'let' or 'const'"],
        answer: 1,
        explanation: "In JavaScript, a function can access variables declared in its outer scope, regardless of how they are declared. This is because the outer scope is part of the function's scope chain."
      },
      {
        question: "What is the difference between 'var' and 'let' when declaring variables inside a function?",
        options: ["'var' is faster, while 'let' is slower","'var' has function scope, while 'let' has block scope","'var' is block-scoped, while 'let' is function-scoped","'var' is function-scoped, while 'let' is block-scoped"],
        answer: 3,
        explanation: "The main difference between 'var' and 'let' is that 'var' is function-scoped, while 'let' is block-scoped. This means that variables declared with 'var' are accessible from the entire function, while variables declared with 'let' are only accessible within the block they are declared in."
      }
    ]
  },
  'control-flow': {
    anatomy: [
      { label: 'Conditionals', detail: 'Decides block routes (if, else if, switch).' },
      { label: 'Comparison Operators', detail: 'Equality checks (strict === and weak ==).' },
      { label: 'Logical Operators', detail: 'Short-circuiting checks (&&, ||, ??).' },
      { label: 'Looping Blocks', detail: 'Repeats loops over collections (for, while, for...of).' }
    ],
    rules: [
      'Always use strict equality === to avoid silent coercion errors.',
      'Ensure loops have reachable end states to avoid infinite loops.',
      'Use logical short-circuiting to check safety defaults.'
    ],
    diagram: {
      type: 'cycle',
      title: 'Control Flow Decision Loop',
      steps: ['Evaluate expression', 'Condition true? Execute block A', 'Condition false? Execute block B', 'Loop repeat check', 'Break out of loop']
    },
    tests: [
      {

      question: 'What is the outcome of the comparison: "" == false vs "" === false?',
      options: [
        'Both evaluate to true.',
        'Both evaluate to false.',
        '"" == false evaluates to true (due to coercion), but "" === false evaluates to false.',
        '"" == false evaluates to false, but "" === false evaluates to true.'
      ],
      answer: 2,
      explanation: 'Double equals (==) performs type coercion, casting empty string and false to equivalent values. Triple equals (===) compares both type and value, yielding false.'
    
      },
      {
        question: "What is the purpose of the 'if' statement in control-flow?",
        options: ["To repeat a block of code","To execute a block of code only if a condition is met","To skip a block of code","To end a loop"],
        answer: 1,
        explanation: "The 'if' statement is used to execute a block of code only if a certain condition is met."
      },
      {
        question: "Which control-flow statement is used to execute a block of code repeatedly?",
        options: ["For loop","While loop","If statement","Switch statement"],
        answer: 1,
        explanation: "The 'For loop' and 'While loop' are used to execute a block of code repeatedly."
      },
      {
        question: "What is the purpose of the 'switch' statement in control-flow?",
        options: ["To execute a block of code only if a condition is met","To repeat a block of code","To execute a block of code based on the value of a variable","To skip a block of code"],
        answer: 2,
        explanation: "The 'switch' statement is used to execute a block of code based on the value of a variable."
      },
      {
        question: "Which control-flow statement is used to execute a block of code repeatedly until a certain condition is met?",
        options: ["For loop","While loop","If statement","Switch statement"],
        answer: 1,
        explanation: "The 'While loop' is used to execute a block of code repeatedly until a certain condition is met."
      }
    ]
  },
  'dom-manipulation-and-event-listeners': {
    anatomy: [
      { label: 'Query Selector', detail: 'Locates matching elements in the DOM tree.' },
      { label: 'Event Handler', detail: 'Callback function triggered by user signals.' },
      { label: 'Event Bubbling', detail: 'Events rise from target nodes up through document trees.' },
      { label: 'ClassList manipulation', detail: 'Dynamically adding, removing, or toggling styles.' }
    ],
    rules: [
      'Clean up event listeners on removed nodes to prevent memory leaks.',
      'Use event delegation on parent containers to handle dynamic children.',
      'Prevent default behaviors explicitly on form submits (event.preventDefault).'
    ],
    diagram: {
      type: 'cycle',
      title: 'DOM Event Lifecycle',
      steps: ['User clicks button', 'Event captures down to node', 'Target event listener fires', 'Event bubbles up DOM tree', 'Default actions execute']
    },
    tests: [
      {

      question: 'What is the utility of event.preventDefault() inside a form submit event listener?',
      options: [
        'It deletes all values typed inside input fields.',
        'It stops the event from bubbling up to parent nodes.',
        'It prevents the browser from reloading the page during submit.',
        'It closes the browser window automatically.'
      ],
      answer: 2,
      explanation: 'Form submissions naturally reload the browser page. Inside SPA applications, developers call event.preventDefault() to handle state updates using JavaScript instead.'
    
      },
      {
        question: "What is the primary purpose of using the `addEventListener` method in JavaScript?",
        options: ["To remove an event listener","To attach a function to an event","To detach a function from an event","To check if an event listener exists"],
        answer: 1,
        explanation: "The `addEventListener` method is used to attach a function to an event, allowing the function to be executed when the event occurs."
      },
      {
        question: "What is the difference between `innerHTML` and `textContent` when setting the content of an HTML element?",
        options: ["`innerHTML` sets the content of the element and its children, while `textContent` only sets the content of the element itself","`innerHTML` sets the content of the element itself, while `textContent` sets the content of the element and its children","Both `innerHTML` and `textContent` set the content of the element and its children","Both `innerHTML` and `textContent` set the content of the element itself"],
        answer: 0,
        explanation: "`innerHTML` sets the content of the element and its children, while `textContent` only sets the content of the element itself."
      },
      {
        question: "How can you select all elements with a specific class using the `document.querySelectorAll` method?",
        options: ["`document.querySelectorAll('.class')`","`document.querySelectorAll(class)`","`document.querySelectorAll('class')`","`document.querySelectorAll(class='class')`"],
        answer: 0,
        explanation: "To select all elements with a specific class, you can use the `document.querySelectorAll` method with the class name enclosed in dot notation, like `document.querySelectorAll('.class')`."
      },
      {
        question: "What is the purpose of the `event.target` property in an event listener function?",
        options: ["To get the element that triggered the event","To get the element that prevented the event","To get the element that cancelled the event","To get the element that attached the event listener"],
        answer: 0,
        explanation: "The `event.target` property is used to get the element that triggered the event, allowing you to access the element that initiated the event."
      }
    ]
  },
  'es6-features': {
    anatomy: [
      { label: 'Destructuring', detail: 'Unpacking properties or arrays into variables.' },
      { label: 'Spread / Rest', detail: 'Expanding arrays/objects, or gathering arguments.' },
      { label: 'Array methods', detail: 'Immutable transformers like map, filter, and reduce.' },
      { label: 'Template Literals', detail: 'Backticks enclosing dynamic expression insertions.' }
    ],
    rules: [
      'Array map must always return a matching value inside its callback.',
      'Use spread to copy objects rather than mutating them directly.',
      'Destructuring reduces boilerplate when extracting nested values.'
    ],
    diagram: {
      type: 'cycle',
      title: 'Immutable Transformation Cycle',
      steps: ['Input original array', 'Map/Filter transformation callback', 'Return new array instance', 'Store result in variable', 'Original array remains unchanged']
    },
    tests: [
      {

      question: 'Which of the following array methods returns a newly constructed array without mutating the original?',
      options: [
        'push()',
        'splice()',
        'map()',
        'reverse()'
      ],
      answer: 2,
      explanation: 'Methods like map(), filter(), and slice() create new arrays, whereas push(), splice(), and reverse() mutate the original array in place.'
    
      },
      {
        question: "What is the purpose of the 'let' keyword in ES6?",
        options: ["To declare a global variable","To declare a block-scoped variable","To declare a function","To declare a class"],
        answer: 1,
        explanation: "The 'let' keyword is used to declare a block-scoped variable in ES6, which means it is only accessible within the block it is declared in."
      },
      {
        question: "What is the difference between 'let' and 'const' in ES6?",
        options: ["const is block-scoped, while let is function-scoped","const is function-scoped, while let is block-scoped","const is used for variables, while let is used for constants","const is used for constants, while let is used for variables"],
        answer: 3,
        explanation: "The 'const' keyword is used to declare a constant variable in ES6, which cannot be reassigned. The 'let' keyword is used to declare a variable that can be reassigned."
      },
      {
        question: "What is the purpose of the 'arrow function' in ES6?",
        options: ["To declare a function with a specific name","To declare a function with a specific scope","To declare a function without a 'this' keyword","To declare a function with a specific return type"],
        answer: 2,
        explanation: "The 'arrow function' in ES6 is used to declare a function without a 'this' keyword, which can make the code more concise and easier to read."
      },
      {
        question: "What is the purpose of the 'template literals' in ES6?",
        options: ["To concatenate strings","To format strings","To create a new string with a specific length","To create a new string with a specific type"],
        answer: 1,
        explanation: "The 'template literals' in ES6 are used to concatenate strings in a more readable and concise way, using the backtick character (`)."
      }
    ]
  },

  // --- React Fundamentals ---
  'components-and-jsx-syntax': {
    anatomy: [
      { label: 'JSX Element', detail: 'HTML-like syntax compiled into JS calls.' },
      { label: 'Component Function', detail: 'Receives props and outputs JSX structures.' },
      { label: 'React.createElement', detail: 'Compiles JSX tags into virtual nodes.' },
      { label: 'Fragment', detail: 'Wraps children without adding an extra DOM tag (<>).' }
    ],
    rules: [
      'Component names must start with a capital letter.',
      'JSX must return a single root element.',
      'Inject expressions into JSX using curly braces.'
    ],
    diagram: {
      type: 'react',
      title: 'Compilation pipeline',
      nodes: ['JSX Code', 'Babel Compiler', 'React.createElement()', 'Virtual DOM Node', 'DOM Paint']
    },
    tests: [
      {

      question: 'Why must React components start with a capital letter (e.g., MyComponent vs mycomponent)?',
      options: [
        'It is a pure aesthetic style choice that has no effect.',
        'React compiler parses lowercase names as standard HTML tags, and capitalized names as custom components.',
        'Capitalized components execute faster in React rendering.',
        'Lowercase names cannot receive parameters (props).'
      ],
      answer: 1,
      explanation: 'JSX compiles down. React treats lowercased elements as string arguments (e.g., "div") and capitalized elements as function references (e.g., MyComponent).'
    
      },
      {
        question: "What is JSX in React?",
        options: ["A JavaScript library for building user interfaces","A syntax extension for JavaScript that allows HTML-like code in JavaScript files","A CSS framework for styling React components","A type checker for React components"],
        answer: 1,
        explanation: "JSX is a syntax extension for JavaScript that allows HTML-like code in JavaScript files, making it easier to write React components."
      },
      {
        question: "What is the purpose of a React component?",
        options: ["To handle server-side logic","To render a user interface","To manage state and props","To handle API requests"],
        answer: 1,
        explanation: "The primary purpose of a React component is to render a user interface, which can be a single element or a collection of elements."
      },
      {
        question: "What is the difference between a functional component and a class component in React?",
        options: ["A functional component uses a class, while a class component uses a function","A functional component uses a function, while a class component uses a class","A functional component has a render method, while a class component has a constructor","A functional component has a constructor, while a class component has a render method"],
        answer: 1,
        explanation: "A functional component uses a function, while a class component uses a class. Functional components are simpler and more efficient, while class components provide more features and flexibility."
      },
      {
        question: "What is the purpose of props in React?",
        options: ["To manage state in a component","To pass data from a parent component to a child component","To handle events in a component","To render a user interface"],
        answer: 1,
        explanation: "Props (short for properties) are used to pass data from a parent component to a child component, allowing components to be reusable and modular."
      }
    ]
  },
  'props-vs-state': {
    anatomy: [
      { label: 'Props', detail: 'Immutable inputs received from parent components.' },
      { label: 'State Hook', detail: 'Local component values that trigger re-renders when updated.' },
      { label: 'State Setter', detail: 'Function returned by useState to update state.' },
      { label: 'One-way Data Flow', detail: 'Data flows down; state updates flow up.' }
    ],
    rules: [
      'Never mutate props inside child components.',
      'Update state exclusively via the setter function to trigger re-renders.',
      'Lift state up when sibling components must share a single state.'
    ],
    diagram: {
      type: 'react',
      title: 'Props & State Updates',
      nodes: ['Parent state change', 'Props passed down', 'Child renders props', 'User triggers callback', 'Parent state updates', 'Component tree updates']
    },
    tests: [
      {

      question: 'Which statement accurately describes the core difference between props and state?',
      options: [
        'State is immutable, whereas props can be modified at any time by child components.',
        'Props are read-only configuration parameters passed down from parents; state is internal, dynamic data managed by the component.',
        'Props trigger component mounts, whereas state triggers component compiling.',
        'State is shared globally, whereas props are local to a single file.'
      ],
      answer: 1,
      explanation: 'Props are external inputs that a component receives and cannot edit. State is local, mutable memory that the component owns and updates.'
    
      },
      {
        question: "What is the main difference between props and state in React?",
        options: ["Props are used for parent-child communication, while state is used for component's internal state.","State is used for parent-child communication, while props is used for component's internal state.","Props are used for component's internal state, while state is used for parent-child communication.","Props and state are used interchangeably in React."],
        answer: 0,
        explanation: "Props are used for parent-child communication, while state is used for component's internal state."
      },
      {
        question: "When should you use props in a React component?",
        options: ["When the component's internal state needs to be changed.","When the component needs to communicate with its parent.","When the component needs to communicate with its sibling.","When the component's props are being passed from its parent."],
        answer: 1,
        explanation: "When the component needs to communicate with its parent."
      },
      {
        question: "What happens when you update a prop in a React component?",
        options: ["The prop is automatically updated in the component.","The prop is not updated in the component.","The prop is updated in the component, but it's not re-rendered.","The prop is updated in the component and it's re-rendered."],
        answer: 3,
        explanation: "The prop is updated in the component and it's re-rendered."
      },
      {
        question: "Why should you avoid using state in a React component when props are available?",
        options: ["Because it's more efficient to use state.","Because it's more efficient to use props.","Because state can cause unexpected behavior in the component.","Because state can cause the component to re-render unnecessarily."],
        answer: 3,
        explanation: "Because state can cause the component to re-render unnecessarily."
      }
    ]
  },
  'the-useState-and-useEffect-hooks': {
    anatomy: [
      { label: 'useState setter', detail: 'Updates state and queues component renders.' },
      { label: 'useEffect callback', detail: 'Asynchronous side effect running after paint.' },
      { label: 'Dependency Array', detail: 'Triggers effect runs only when listed variables change.' },
      { label: 'Cleanup Function', detail: 'Runs before subsequent effect runs and unmounts.' }
    ],
    rules: [
      'Hooks must only be called at the top level of React functions.',
      'Every variable read in useEffect must be in the dependency list.',
      'Always clear intervals, timers, and subscriptions in effect cleanups.'
    ],
    diagram: {
      type: 'react',
      title: 'Hook Life Cycle',
      nodes: ['Initial Mount', 'Run effects', 'State Change trigger', 'Cleanup old effects', 'Run updated effects', 'Component Unmount']
    },
    test: {
      question: 'What happens if you leave the dependency array of useEffect empty: useEffect(() => {}, [])?',
      options: [
        'The effect triggers on every single render.',
        'The effect runs exactly once after the component mounts, and never again.',
        'The effect is ignored completely and never executes.',
        'React throws a compilation error immediately.'
      ],
      answer: 1,
      explanation: 'An empty dependency array [] indicates the effect has no dependencies, forcing React to run it only once when the component initially mounts.'
    }
  },
  'handling-events-forms': {
    anatomy: [
      { label: 'Synthetic Event', detail: 'React wrapper standardizing events across browsers.' },
      { label: 'Controlled Inputs', detail: 'Form inputs whose values are bound to React state.' },
      { label: 'OnSubmit Handler', detail: 'Handles submissions on form element tags.' },
      { label: 'Value & OnChange', detail: 'Keeps state synchronized with typing inputs.' }
    ],
    rules: [
      'Always call event.preventDefault() on submit events.',
      'Synchronize every input keystroke with state via onChange.',
      'Create single change handlers to handle multiple form fields.'
    ],
    diagram: {
      type: 'react',
      title: 'Controlled Form Loop',
      nodes: ['Keystroke typed', 'onChange callback fires', 'setState updates value', 'Re-render component', 'Input value mirrors state']
    },
    tests: [
      {

      question: 'In React, what characterizes a "controlled" form input?',
      options: [
        'Its styling is managed by class selectors.',
        'Its value is bound to a React state variable, and modified via an onChange listener.',
        'It is validated directly by HTML5 attributes only.',
        'It can only be modified by clicking a submit button.'
      ],
      answer: 1,
      explanation: 'An input is controlled when React state serves as the "single source of truth" for the input\'s current value, updating it instantly as the user types.'
    
      },
      {
        question: "What is the primary purpose of the 'onsubmit' event in HTML forms?",
        options: ["To prevent default form submission","To validate form data before submission","To handle form data after submission","To reset form fields"],
        answer: 1,
        explanation: "The 'onsubmit' event is used to validate form data before it is submitted to the server. It allows developers to check for errors and prevent the form from being submitted if necessary."
      },
      {
        question: "Which of the following JavaScript methods is used to prevent the default action of a form submission?",
        options: ["preventDefault()","stopPropagation()","addEventListener()","removeEventListener()"],
        answer: 0,
        explanation: "The 'preventDefault()' method is used to prevent the default action of a form submission, such as navigating to a new page or sending a request to the server."
      },
      {
        question: "How can you access the value of a form input element using JavaScript?",
        options: ["element.value","element.getAttribute('value')","element.innerHTML","element.textContent"],
        answer: 0,
        explanation: "The 'value' property of a form input element can be accessed using the 'element.value' syntax, allowing developers to retrieve the current value of the input field."
      },
      {
        question: "What is the difference between the 'submit' and 'reset' events in HTML forms?",
        options: ["Submit triggers form validation, while reset does not","Submit resets form fields, while reset submits the form","Submit handles form data after submission, while reset prevents default submission","Submit prevents default submission, while reset triggers form validation"],
        answer: 1,
        explanation: "The 'submit' event triggers the form to be submitted to the server, while the 'reset' event resets the form fields to their default values."
      }
    ]
  },
  'conditional-rendering-lists-rendering': {
    anatomy: [
      { label: 'Ternary Operator', detail: 'Standard ? : expressions inside JSX.' },
      { label: 'Logical AND (&&)', detail: 'Conditionally outputs elements if left expression is true.' },
      { label: 'Map function', detail: 'Converts arrays into loops of JSX elements.' },
      { label: 'Key prop', detail: 'Unique, stable identifier used by React diff algorithms.' }
    ],
    rules: [
      'Never use index as a key for lists that can be reordered.',
      'Avoid logic operations on the left side of && that yield 0 or NaN.',
      'Keep mapping functions pure without state-changing actions inside.'
    ],
    diagram: {
      type: 'react',
      title: 'List Diffing Process',
      nodes: ['Data array changes', 'Map returns element collection', 'React checks keys', 'Updates changed nodes', 'Maintains unchanged items']
    },
    tests: [
      {

      question: 'Why does React require a unique "key" prop when rendering arrays of components?',
      options: [
        'To style them with unique border parameters.',
        'To help React identify which items changed, were added, or were removed, optimizing DOM update performance.',
        'To bind event listeners to each element automatically.',
        'To compile the list into CSS columns.'
      ],
      answer: 1,
      explanation: 'Keys provide stable identities. They allow React\'s diff algorithm to match elements across renders and prevent UI state bugs in lists.'
    
      },
      {
        question: "What is the primary purpose of conditional rendering in a web application?",
        options: ["To improve the user experience","To optimize server-side rendering","To conditionally render lists of data","To handle user input"],
        answer: 2,
        explanation: "Conditional rendering is used to conditionally render lists of data, which is essential in web development when dealing with dynamic data."
      },
      {
        question: "What is list rendering in a web application?",
        options: ["A technique to optimize server-side rendering","A method to handle user input","A way to conditionally render lists of data","A feature to improve the user experience"],
        answer: 3,
        explanation: "List rendering is a technique used to conditionally render lists of data, which is a common requirement in web development."
      },
      {
        question: "What is the main difference between conditional rendering and list rendering?",
        options: ["Conditional rendering is used for server-side rendering, while list rendering is used for client-side rendering","Conditional rendering is used for lists of data, while list rendering is used for individual data","Conditional rendering is used for individual data, while list rendering is used for lists of data","Conditional rendering is used for user input, while list rendering is used for server-side rendering"],
        answer: 3,
        explanation: "The main difference between conditional rendering and list rendering is that conditional rendering is used for individual data, while list rendering is used for lists of data."
      },
      {
        question: "What is the benefit of using conditional rendering and list rendering together in a web application?",
        options: ["Improved user experience","Optimized server-side rendering","Conditionally rendered lists of data","Enhanced user interaction"],
        answer: 2,
        explanation: "Using conditional rendering and list rendering together allows for the conditionally rendering of lists of data, which is a powerful feature in web development."
      }
    ]
  },

  // --- Node.js & Express REST APIs ---
  'node-js-runtime-npm-ecosystem': {
    anatomy: [
      { label: 'V8 Engine', detail: 'Google engine compiling JS into machine instructions.' },
      { label: 'Event Loop', detail: 'Handles asynchronous tasks off the main thread.' },
      { label: 'NPM registry', detail: 'Global repository of packages and utilities.' },
      { label: 'Package.json', detail: 'Project file listing dependencies and settings.' }
    ],
    rules: [
      'Never block the single-threaded event loop with long CPU tasks.',
      'Always lock dependency versions using lockfiles (package-lock.json).',
      'Use built-in modules like fs/path before adding dependencies.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Node Asynchronous Loop',
      steps: ['Call stack runs sync tasks', 'Async API offloads task', 'Task completes, goes to queue', 'Event loop checks stack empty', 'Queue callback pushed to stack']
    },
    tests: [
      {

      question: 'What is a major consequence of Node.js having a single-threaded event loop?',
      options: [
        'It cannot handle asynchronous I/O tasks.',
        'Blocking the main thread with heavy synchronous calculations blocks all other concurrent requests.',
        'It forces developers to write multithreaded compilers.',
        'It prevents connection pools to databases.'
      ],
      answer: 1,
      explanation: 'Because Node.js executes JavaScript on a single thread, a slow CPU-bound loop will prevent the event loop from picking up other client network callbacks.'
    
      },
      {
        question: "What is the primary purpose of npm (Node Package Manager) in the Node.js ecosystem?",
        options: ["To manage dependencies for a project","To create a new Node.js project","To run a Node.js application","To install a specific version of Node.js"],
        answer: 0,
        explanation: "npm is primarily used to manage dependencies for a project, making it easy to install and update packages."
      },
      {
        question: "What is the difference between npm install and npm install --save?",
        options: ["npm install installs packages globally, while npm install --save installs packages locally","npm install installs packages locally, while npm install --save installs packages globally","npm install installs packages locally, while npm install --save installs packages locally and saves them to package.json","npm install installs packages globally, while npm install --save installs packages locally and saves them to package.json"],
        answer: 2,
        explanation: "npm install installs packages locally, while npm install --save installs packages locally and saves them to package.json."
      },
      {
        question: "What is the purpose of the package.json file in a Node.js project?",
        options: ["To store project settings","To manage dependencies for a project","To store project metadata, such as name, version, and dependencies","To run a Node.js application"],
        answer: 2,
        explanation: "The package.json file stores project metadata, such as name, version, and dependencies, making it easy to manage and share projects."
      },
      {
        question: "What is the difference between npm run start and node server.js?",
        options: ["npm run start runs the server.js file, while node server.js runs the start script","npm run start runs the start script, while node server.js runs the server.js file","npm run start runs the server.js file, while node server.js runs the start script","npm run start and node server.js are equivalent and can be used interchangeably"],
        answer: 1,
        explanation: "npm run start runs the start script, while node server.js runs the server.js file."
      }
    ]
  },
  'express-server-setup-routing': {
    anatomy: [
      { label: 'Application instance', detail: 'Express object managing settings and routes.' },
      { label: 'Route Path', detail: 'Target URLs handled (e.g., /api/users).' },
      { label: 'Handler functions', detail: 'Callbacks receiving request and response parameters.' },
      { label: 'Route Parameters', detail: 'Dynamic URL segments parsed (e.g., :id).' }
    ],
    rules: [
      'Define routes in order of specificity (specific routes before dynamic parameters).',
      'Modularize routes using Express Routers.',
      'Configure cross-origin resource sharing (CORS) rules early.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Express Router matching',
      steps: ['Request enters server', 'Check URL path and verb', 'Select matching router group', 'Traverse route handlers list', 'Execute controller callbacks']
    },
    tests: [
      {

      question: 'How do you define a dynamic route parameter in Express routing?',
      options: [
        'app.get("/users/{id}")',
        'app.get("/users/:id")',
        'app.get("/users?id=val")',
        'app.get("/users/id")'
      ],
      answer: 1,
      explanation: 'Colons prefix route parameters in Express (e.g., `/users/:id`). The matched values are accessible inside handlers at `req.params.id`.'
    
      },
      {
        question: "What is the primary function of Express.js in a web development project?",
        options: ["Handling HTTP requests","Rendering HTML templates","Setting up routing","Managing database connections"],
        answer: 0,
        explanation: "Express.js is a Node.js web framework that enables developers to build web applications by handling HTTP requests and responses."
      },
      {
        question: "What is the purpose of the 'app.use()' method in Express.js?",
        options: ["To define routes","To set up middleware functions","To render HTML templates","To handle database connections"],
        answer: 1,
        explanation: "The 'app.use()' method is used to set up middleware functions in Express.js, which can perform tasks such as authentication, logging, and request body parsing."
      },
      {
        question: "How do you define a route in Express.js for a specific URL?",
        options: ["Using the 'app.get()' method","Using the 'app.post()' method","Using the 'app.use()' method","Using the 'app.all()' method"],
        answer: 0,
        explanation: "You can define a route in Express.js using the 'app.get()' method, which is used for GET requests, or other methods such as 'app.post()' for POST requests."
      },
      {
        question: "What is the purpose of the 'app.all()' method in Express.js?",
        options: ["To handle GET requests only","To handle POST requests only","To handle all HTTP requests","To handle only PUT and DELETE requests"],
        answer: 2,
        explanation: "The 'app.all()' method in Express.js is used to handle all HTTP requests, including GET, POST, PUT, and DELETE requests, for a specific route."
      }
    ]
  },
  'http-request-methods': {
    anatomy: [
      { label: 'GET Method', detail: 'Retrieves representation of database data.' },
      { label: 'POST Method', detail: 'Creates new records inside databases.' },
      { label: 'PUT / PATCH', detail: 'Replaces or modifies existing data blocks.' },
      { label: 'DELETE Method', detail: 'Removes records from collections.' }
    ],
    rules: [
      'GET requests must be safe and idempotent, changing no state.',
      'Use POST when creating resources, sending payload in request body.',
      'Ensure PATCH updates are minimal, payload holds partial edits.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'REST Verb Routing Pipeline',
      steps: ['Inspect request method', 'GET -> Query DB', 'POST -> Validate & Insert', 'PUT/PATCH -> Find & Update', 'DELETE -> Find & Destroy']
    },
    tests: [
      {

      question: 'What does it mean for an HTTP method (like GET) to be "idempotent"?',
      options: [
        'It changes server state differently every time it is called.',
        'Making multiple identical requests yields the same side effects and server state as making a single request.',
        'It requires auth tokens to execute.',
        'It deletes database tables automatically.'
      ],
      answer: 1,
      explanation: 'GET, PUT, and DELETE are idempotent. Calling GET once or ten times should leave the server in the exact same state (no records created/deleted by fetching).'
    
      },
      {
        question: "What is the primary purpose of the POST request method in HTTP?",
        options: ["To retrieve data from the server","To send data to the server to create a new resource","To update an existing resource on the server","To delete a resource on the server"],
        answer: 1,
        explanation: "The POST request method is used to send data to the server to create a new resource. It is commonly used for creating new user accounts, submitting forms, and uploading files."
      },
      {
        question: "Which HTTP request method is used to retrieve a resource from the server without modifying it?",
        options: ["GET","POST","PUT","DELETE"],
        answer: 0,
        explanation: "The GET request method is used to retrieve a resource from the server without modifying it. It is commonly used for fetching data from the server, such as retrieving a user's profile information."
      },
      {
        question: "What is the primary purpose of the PUT request method in HTTP?",
        options: ["To create a new resource on the server","To update an existing resource on the server","To delete a resource on the server","To retrieve data from the server"],
        answer: 1,
        explanation: "The PUT request method is used to update an existing resource on the server. It is commonly used for updating user profiles, changing settings, and modifying existing data."
      },
      {
        question: "Which HTTP request method is used to delete a resource on the server?",
        options: ["GET","POST","PUT","DELETE"],
        answer: 3,
        explanation: "The DELETE request method is used to delete a resource on the server. It is commonly used for removing user accounts, deleting files, and removing data from the server."
      }
    ]
  },
  'middleware-concept-and-parsing-requests': {
    anatomy: [
      { label: 'Request / Response Objects', detail: 'Passed along routes representing payloads.' },
      { label: 'Next function', detail: 'Triggers the next middleware block in the stack.' },
      { label: 'JSON Parser', detail: 'Built-in handler parsing body parameters.' },
      { label: 'Error Middleware', detail: 'Catch-all handlers capturing active exceptions.' }
    ],
    rules: [
      'Every middleware must call next() or send back a response.',
      'Place body parser middleware before route definitions.',
      'Use error middleware to prevent leakage of server stack details.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Express Middleware Stack',
      steps: ['Incoming Request', 'Body Parser Middleware', 'Auth Validator Middleware', 'Core controller handler', 'Error Handler Middleware']
    },
    tests: [
      {

      question: 'What is the primary role of the next() function inside an Express middleware callback?',
      options: [
        'It kills the active server process.',
        'It triggers the next middleware or route handler in the execution chain.',
        'It compiles the response layout as JSON.',
        'It queries the MongoDB collections.'
      ],
      answer: 1,
      explanation: 'Middleware functions run in sequence. Calling next() hands off control to the subsequent handler in the pipeline.'
    
      },
      {
        question: "What is the primary function of middleware in a web application?",
        options: ["To handle database operations","To parse and process incoming HTTP requests","To serve static files","To handle user authentication"],
        answer: 1,
        explanation: "Middleware is a software component that acts as an intermediary between the client and server, allowing for the processing and modification of incoming HTTP requests."
      },
      {
        question: "What is the purpose of parsing requests in a web application?",
        options: ["To validate user input","To decode JSON data","To parse and validate incoming HTTP requests","To encrypt sensitive data"],
        answer: 2,
        explanation: "Parsing requests involves breaking down the incoming HTTP request into its constituent parts, allowing the application to extract and process the relevant data."
      },
      {
        question: "Which of the following is an example of middleware in a Node.js application?",
        options: ["Express.js","React.js","Angular.js","body-parser"],
        answer: 3,
        explanation: "body-parser is a popular middleware library for Node.js that allows for the parsing of incoming HTTP requests and extraction of data from the request body."
      },
      {
        question: "Why is request parsing important in a web application?",
        options: ["To improve server performance","To enhance user experience","To validate and process incoming data","To reduce security risks"],
        answer: 2,
        explanation: "Request parsing is essential for validating and processing incoming data, ensuring that the application receives and handles the data correctly and securely."
      }
    ]
  },
  'api-design-and-status-codes': {
    anatomy: [
      { label: 'URI Design', detail: 'Consistent noun-based resource paths.' },
      { label: 'HTTP Statuses', detail: 'Numeric status signals (200, 201, 400, 401, 404, 500).' },
      { label: 'Response JSON format', detail: 'Predictable success/error schemas.' },
      { label: 'Rate Limiting headers', detail: 'Limits client requests over window intervals.' }
    ],
    rules: [
      'Use plurals for resources (e.g., /api/items, not /api/item).',
      'Return 201 Created on successful inserts; return 200 on safe GETs.',
      'Return 400 Bad Request if fields fail validator parsing.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'API Response Resolution',
      steps: ['Execute Controller code', 'Check validation issues (400)', 'Check Auth status (401/403)', 'Write status header', 'Send final JSON payload']
    },
    tests: [
      {

      question: 'Which status code class indicates a client-side syntax or validation error?',
      options: [
        '2xx (e.g., 200 OK)',
        '3xx (e.g., 301 Moved)',
        '4xx (e.g., 400 Bad Request)',
        '5xx (e.g., 500 Internal Error)'
      ],
      answer: 2,
      explanation: '4xx status codes signal client-side issues (invalid fields, bad auth, missing URL paths). 5xx codes signal server-side crashes.'
    
      },
      {
        question: "What is the primary purpose of using HTTP status codes in API design?",
        options: ["To indicate the type of data being sent","To indicate the result of a request","To indicate the type of request being sent","To indicate the authentication method"],
        answer: 1,
        explanation: "HTTP status codes are used to indicate the result of a request, such as success, error, or redirect."
      },
      {
        question: "Which HTTP status code is used to indicate a successful request?",
        options: ["200","404","500","502"],
        answer: 0,
        explanation: "The HTTP status code 200 is used to indicate a successful request."
      },
      {
        question: "What is the purpose of using a 404 status code in API design?",
        options: ["To indicate a successful request","To indicate a server error","To indicate a resource not found","To indicate a method not allowed"],
        answer: 2,
        explanation: "The 404 status code is used to indicate that a requested resource could not be found."
      },
      {
        question: "Which HTTP status code is used to indicate a server error?",
        options: ["400","401","500","503"],
        answer: 2,
        explanation: "The HTTP status code 500 is used to indicate a server error."
      }
    ]
  },

  // --- MongoDB & Mongoose ODM ---
  'sql-vs-nosql-databases-concept': {
    anatomy: [
      { label: 'Relational SQL DB', detail: 'Structured tabular data linked with primary/foreign keys.' },
      { label: 'Document NoSQL DB', detail: 'Schemaless collections storing JSON documents.' },
      { label: 'Denormalization', detail: 'Embedding child documents to reduce slow joins.' },
      { label: 'Scale-out layout', detail: 'Distributing data across clusters of nodes.' }
    ],
    rules: [
      'Choose SQL for strict schema relationships and ACID transactions.',
      'Choose NoSQL document databases for scaling out and unstructured data structures.',
      'Design collections around actual data querying flows.'
    ],
    diagram: {
      type: 'database',
      title: 'SQL Tables vs MongoDB Documents',
      steps: ['SQL: Users Table join Posts Table', 'NoSQL: Single User Document containing Embedded Posts array', 'Read query fetches entire document', 'No joins required', 'Fast lookups']
    },
    tests: [
      {

      question: 'What is a core benefit of the document NoSQL database model (like MongoDB) over SQL tabular layouts?',
      options: [
        'It enforces relationship structures strictly on hard drives.',
        'It stores data in flexible, nested BSON documents, allowing schemas to evolve without complex table migrations.',
        'It requires no network cards to communicate.',
        'It does not support index searches.'
      ],
      answer: 1,
      explanation: 'NoSQL document databases support hierarchical, flexible nesting of schemas without requiring predefined structures or schema alteration updates across millions of rows.'
    
      },
      {
        question: "What is the primary difference between SQL and NoSQL databases?",
        options: ["They use different programming languages","They store data in different formats","They use different query languages","They are used for different purposes"],
        answer: 2,
        explanation: "SQL databases use SQL (Structured Query Language) to manage and manipulate data, while NoSQL databases use different query languages or are schema-less."
      },
      {
        question: "Which type of database is best suited for handling large amounts of unstructured data?",
        options: ["Relational database","Object-oriented database","Document-oriented database","Graph database"],
        answer: 2,
        explanation: "NoSQL databases, specifically document-oriented databases, are designed to handle large amounts of unstructured data and are often used in big data applications."
      },
      {
        question: "What is the main advantage of using a NoSQL database over a SQL database?",
        options: ["Scalability","High performance","Easy data modeling","Flexibility in data schema"],
        answer: 3,
        explanation: "NoSQL databases offer flexibility in data schema, which allows for easier adaptation to changing data structures and requirements."
      },
      {
        question: "Which type of database is best suited for applications that require complex transactions and ACID compliance?",
        options: ["Document-oriented database","Key-value store","Column-family database","Relational database"],
        answer: 3,
        explanation: "Column-family databases are designed to handle complex transactions and provide ACID compliance, making them suitable for applications that require strong consistency and reliability."
      }
    ]
  },
  'documents-collections-and-objectid': {
    anatomy: [
      { label: 'BSON format', detail: 'Binary JSON structure storing document keys.' },
      { label: 'Collection folder', detail: 'Grouping of related BSON documents.' },
      { label: 'ObjectID', detail: '12-byte unique identifier containing timestamps.' },
      { label: 'Virtuals', detail: 'Mongoose computed properties not stored in database.' }
    ],
    rules: [
      'Document sizes cannot exceed 16MB in MongoDB.',
      'Keep ObjectIDs unique; let database generate them.',
      'Store only fields needed to preserve schema sizes.'
    ],
    diagram: {
      type: 'database',
      title: 'MongoDB Document Anatomy',
      steps: ['BSON Envelope', '_id: ObjectID (Unique)', 'Key-value fields', 'Nested embedded structures', 'Save record']
    },
    tests: [
      {

      question: 'What is encoded inside the first 4 bytes of a MongoDB ObjectID?',
      options: [
        'The host machine ID.',
        'A timestamp representing the document\'s creation time.',
        'The name of the database collection.',
        'An encrypted password hash.'
      ],
      answer: 1,
      explanation: 'The first 4 bytes of a 12-byte ObjectID contain a Unix timestamp representing when the document was generated, which allows extracting creation dates directly from documents.'
    
      },
      {
        question: "What is the primary purpose of using ObjectID in MongoDB?",
        options: ["To uniquely identify a document","To store user information","To handle user authentication","To manage database connections"],
        answer: 0,
        explanation: "ObjectID is used to uniquely identify a document in MongoDB, making it easier to retrieve and update specific documents."
      },
      {
        question: "What is the difference between a document and a collection in MongoDB?",
        options: ["A document is a collection of data, while a collection is a single piece of data","A document is a single piece of data, while a collection is a collection of data","A document is a collection of data, while a collection is a group of related documents","A document is a single piece of data, while a collection is a group of unrelated documents"],
        answer: 2,
        explanation: "In MongoDB, a document is a single piece of data, while a collection is a group of related documents."
      },
      {
        question: "How do you retrieve a specific document from a collection in MongoDB?",
        options: ["Using the ObjectID of the document","Using the name of the collection","Using the name of the document","Using the database name"],
        answer: 0,
        explanation: "You can retrieve a specific document from a collection in MongoDB by using the ObjectID of the document."
      },
      {
        question: "What is the benefit of using a collection in MongoDB?",
        options: ["Improved data security","Enhanced data scalability","Simplified data management","Increased data redundancy"],
        answer: 1,
        explanation: "Using a collection in MongoDB can enhance data scalability, making it easier to store and manage large amounts of data."
      }
    ]
  },
  'mongoose-connection-schemas-models': {
    anatomy: [
      { label: 'Mongoose Connection', detail: 'Initializes database socket pools.' },
      { label: 'Mongoose Schema', detail: 'Declares types, limits, validators.' },
      { label: 'Mongoose Model', detail: 'Active wrapper compiling queries on collections.' },
      { label: 'Validators', detail: 'Checks built into fields (required, minLength).' }
    ],
    rules: [
      'Connect only once to the database; pool sockets efficiently.',
      'Enforce validation rules in Schemas to prevent corrupted database fields.',
      'Always catch connection failure promises.'
    ],
    diagram: {
      type: 'database',
      title: 'ODM Modeling Flow',
      steps: ['Define Schema structure', 'Compile Schema into Model', 'Call Model methods (e.g. Model.create)', 'Validate properties against constraints', 'Write data to MongoDB collection']
    },
    tests: [
      {

      question: 'In Mongoose, what is the difference between a Schema and a Model?',
      options: [
        'Schemas query the DB, models establish networks.',
        'A Schema defines the structure and constraints of the documents; a Model compiles that schema into a queryable class interface linked to MongoDB.',
        'A Model is stored in JavaScript files, a Schema is stored in MongoDB.',
        'There is no difference; they are exact aliases.'
      ],
      answer: 1,
      explanation: 'A Schema outlines the design (fields, validators). A Model compiles that outline into a wrapper supporting database CRUD queries.'
    
      },
      {
        question: "What is the primary purpose of a schema in Mongoose?",
        options: ["To define the structure of a MongoDB collection","To connect to a MongoDB database","To create a model in Mongoose","To perform CRUD operations"],
        answer: 0,
        explanation: "A schema in Mongoose defines the structure of a MongoDB collection, including the fields and their data types."
      },
      {
        question: "What is the difference between a model and a schema in Mongoose?",
        options: ["A model is used to connect to a MongoDB database, while a schema is used to define the structure of a collection","A model is used to perform CRUD operations, while a schema is used to define the structure of a collection","A model is used to define the structure of a collection, while a schema is used to perform CRUD operations","A model and a schema are interchangeable terms in Mongoose"],
        answer: 1,
        explanation: "A model in Mongoose is an instance of a schema, and is used to interact with a MongoDB collection. A schema defines the structure of a collection, while a model is used to perform CRUD operations on that collection."
      },
      {
        question: "How do you connect to a MongoDB database using Mongoose?",
        options: ["By creating a schema and passing it to the connect method","By creating a model and passing it to the connect method","By calling the connect method and passing the database URL as an argument","By calling the createConnection method and passing the database URL as an argument"],
        answer: 3,
        explanation: "To connect to a MongoDB database using Mongoose, you call the createConnection method and pass the database URL as an argument."
      },
      {
        question: "What is the purpose of a model in Mongoose?",
        options: ["To define the structure of a MongoDB collection","To connect to a MongoDB database","To perform CRUD operations on a MongoDB collection","To validate data before it is saved to the database"],
        answer: 2,
        explanation: "A model in Mongoose is used to perform CRUD operations on a MongoDB collection, including creating, reading, updating, and deleting documents."
      }
    ]
  },
  'crud-operations': {
    anatomy: [
      { label: 'Query filters', detail: 'Matching conditions (e.g., { status: "active" }).' },
      { label: 'Update operators', detail: '$set, $push, $inc selectors modifying fields.' },
      { label: 'Options arguments', detail: '{ new: true } properties altering return records.' },
      { label: 'Pagination limits', detail: 'Limit & skip parameters paging query results.' }
    ],
    rules: [
      'Always await query operations to prevent premature callback returns.',
      'Use target update operators ($set) rather than replacing entire document items.',
      'Ensure index fields match common filters to keep queries fast.'
    ],
    diagram: {
      type: 'database',
      title: 'CRUD Query Pipeline',
      steps: ['Client submits request', 'Express maps route to model query', 'Mongoose converts query to BSON', 'MongoDB scans index/collection', 'Result documents returned']
    },
    tests: [
      {

      question: 'Which Mongoose option returns the newly updated document instead of the old pre-update document during a findByIdAndUpdate operation?',
      options: [
        '{ overwrite: true }',
        '{ new: true }',
        '{ updated: true }',
        '{ returnNewDocument: true }'
      ],
      answer: 1,
      explanation: 'By default, Mongoose returns the original document before modifications were made. Setting `{ new: true }` instructs it to return the updated record.'
    
      },
      {
        question: "What does CRUD stand for in web development?",
        options: ["Create, Read, Update, Delete","Create, Read, Insert, Delete","Update, Read, Delete, Create","Insert, Read, Update, Delete"],
        answer: 0,
        explanation: "CRUD stands for Create, Read, Update, Delete, which are the basic operations performed on data in a database."
      },
      {
        question: "Which HTTP method is used for updating existing data?",
        options: ["GET","POST","PUT","DELETE"],
        answer: 2,
        explanation: "The PUT method is used for updating existing data, while the POST method is used for creating new data."
      },
      {
        question: "What is the purpose of the DELETE operation in CRUD?",
        options: ["To create new data","To read existing data","To update existing data","To delete existing data"],
        answer: 3,
        explanation: "The DELETE operation is used to permanently remove data from a database."
      },
      {
        question: "Which operation is used to retrieve existing data?",
        options: ["CREATE","READ","UPDATE","DELETE"],
        answer: 1,
        explanation: "The READ operation is used to retrieve existing data from a database."
      }
    ]
  },
  'relationships-and-db-references': {
    anatomy: [
      { label: 'Referenced relationship', detail: 'Linking documents using ObjectIDs (ref property).' },
      { label: 'Embedded documents', detail: 'Nesting child documents inside parent schemas.' },
      { label: 'Populate method', detail: 'Mongoose utility fetching referenced items.' },
      { label: 'Cascade deletes', detail: 'Clearing orphans when parent records delete.' }
    ],
    rules: [
      'Embed lists when children belong exclusively to a single parent and list size is bounded.',
      'Reference lists when child items scale out indefinitely.',
      'Remember that populate performs extra database queries behind the scenes.'
    ],
    diagram: {
      type: 'database',
      title: 'Reference Resolution Flow',
      steps: ['Fetch parent document', 'Read array of child ObjectIDs', 'Call populate method', 'MongoDB queries child collection', 'Return merged document to application']
    },
    tests: [
      {

      question: 'When modeling relationships in MongoDB, under what condition is "Embedding" (nesting documents) preferred over "Referencing" (linking IDs)?',
      options: [
        'When the nested items are queried independently from the parent.',
        'When the child items are bounded in size and accessed exclusively with their parent document.',
        'When the child documents are shared across many different collections.',
        'When database storage needs to be reduced.'
      ],
      answer: 1,
      explanation: 'Embedding minimizes read roundtrips by fetching related records inside a single query, which works well if the nested array scale is low and bounded.'
    
      },
      {
        question: "What is the primary purpose of using database references in web development?",
        options: ["To improve website performance","To establish relationships between data","To enhance user experience","To reduce database complexity"],
        answer: 1,
        explanation: "Database references are used to establish relationships between data in a database, allowing for more efficient data retrieval and manipulation."
      },
      {
        question: "Which of the following is an example of a one-to-many relationship in a database?",
        options: ["A user has one order, an order has one user","A user has many orders, an order has one user","A user has one address, an address has one user","A user has many addresses, an address has one user"],
        answer: 1,
        explanation: "A one-to-many relationship occurs when one record in a table can have multiple related records in another table."
      },
      {
        question: "What is the benefit of using foreign keys in database relationships?",
        options: ["To improve data security","To reduce data redundancy","To enhance data consistency","To increase data complexity"],
        answer: 1,
        explanation: "Foreign keys help to reduce data redundancy by establishing a link between related data in different tables, ensuring data consistency and accuracy."
      },
      {
        question: "Which of the following is an example of a many-to-many relationship in a database?",
        options: ["A user has one order, an order has one user","A user has many orders, an order has one user","A user has many orders, an order can have many users","A user has one address, an address has one user"],
        answer: 2,
        explanation: "A many-to-many relationship occurs when multiple records in one table can be related to multiple records in another table."
      }
    ]
  },

  // --- Python Fundamentals ---
  'variables-indentation-based-block-scope': {
    anatomy: [
      { label: 'Indentation spacing', detail: 'Exactly four spaces define nested blocks.' },
      { label: 'Dynamic Typing', detail: 'Variable types determined automatically at runtime.' },
      { label: 'Global keyword', detail: 'Imports global scoped values inside functions.' },
      { label: 'Local block namespaces', detail: 'Variable resolution within active definitions.' }
    ],
    rules: [
      'Never mix tabs and spaces (IndentationError).',
      'Variable assignments require no initial keyword declaration.',
      'Understand scope lookup rules (LEGB: Local, Enclosing, Global, Built-in).'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Indentation Scoping Flow',
      steps: ['Execute line', 'Check indentation depth', 'Is new block? Create namespace scope', 'Run block lines', 'Pop block namespace']
    },
    tests: [
      {

      question: 'Which of the following is true regarding block scoping in Python?',
      options: [
        'If statements and loops create new local variable scopes.',
        'Python relies exclusively on indentation blocks to define scope, allowing variables declared inside an "if" block to remain accessible outside it within the same function.',
        'Curly braces override indentations in Python.',
        'All variables are globally scoped by default.'
      ],
      answer: 1,
      explanation: 'Unlike some other languages, variables declared inside conditional or loop blocks (like "if" or "for") remain scoped to the surrounding function namespace.'
    
      },
      {
        question: "What is the purpose of indentation in variables-indentation-based-block-scope?",
        options: ["To define the scope of a variable","To separate logical blocks of code","To increase the readability of code","To reduce the number of lines of code"],
        answer: 2,
        explanation: "Indentation is used to make the code more readable by visually grouping related lines of code together."
      },
      {
        question: "What happens to a variable declared inside a block in variables-indentation-based-block-scope when the block is exited?",
        options: ["The variable is deleted","The variable is hidden from the outer scope","The variable is still accessible from the outer scope","The variable is reinitialized"],
        answer: 2,
        explanation: "Variables declared inside a block in variables-indentation-based-block-scope are scoped to that block and are not accessible from the outer scope when the block is exited."
      },
      {
        question: "Which of the following is an example of block scope in variables-indentation-based-block-scope?",
        options: ["let x = 10; console.log(x);","if (true) { let x = 10; console.log(x); }","for (let i = 0; i < 10; i++) { console.log(i); }"],
        answer: 1,
        explanation: "The if statement creates a block scope, which is an example of block scope in variables-indentation-based-block-scope."
      },
      {
        question: "What is the difference between a variable declared with var and a variable declared with let in variables-indentation-based-block-scope?",
        options: ["Variables declared with var are block-scoped, while variables declared with let are function-scoped","Variables declared with var are function-scoped, while variables declared with let are block-scoped","Variables declared with var are hoisted, while variables declared with let are not hoisted","Variables declared with var are not redeclared, while variables declared with let are redeclared"],
        answer: 1,
        explanation: "Variables declared with var are function-scoped, while variables declared with let are block-scoped in variables-indentation-based-block-scope."
      }
    ]
  },
  'lists-dictionaries-tuples-and-sets': {
    anatomy: [
      { label: 'List (ordered, mutable)', detail: 'Declared with square brackets [].' },
      { label: 'Dictionary (key-value)', detail: 'Declared with curly braces {}. Fast hash lookups.' },
      { label: 'Tuple (ordered, immutable)', detail: 'Declared with parentheses (). Good database row replicas.' },
      { label: 'Set (unordered, unique)', detail: 'Filters duplicate values.' }
    ],
    rules: [
      'Use lists for ordered sequences; use dictionaries for key-value pairings.',
      'Tuples cannot be altered after definition.',
      'Sets support mathematical set operations (union, intersection).'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Collection Types Usage',
      steps: ['Are items mutable? -> List/Dict', 'Are items immutable? -> Tuple', 'Are items unique? -> Set', 'Select collection structure', 'Perform CRUD operations']
    },
    tests: [
      {

      question: 'Which of the following collections represents an immutable, ordered sequence in Python?',
      options: [
        'List',
        'Set',
        'Tuple',
        'Dictionary'
      ],
      answer: 2,
      explanation: 'Tuples are ordered and immutable. Once created, their items cannot be modified, appended, or deleted, making them ideal read-only data structures.'
    
      },
      {
        question: "What is the primary difference between a list and a tuple in Python?",
        options: ["Lists are mutable, while tuples are immutable","Lists are immutable, while tuples are mutable","Lists are used for strings, while tuples are used for integers","Lists are used for integers, while tuples are used for strings"],
        answer: 0,
        explanation: "In Python, lists are mutable, meaning their contents can be changed after creation, whereas tuples are immutable, meaning their contents cannot be changed after creation."
      },
      {
        question: "What is the purpose of a set in Python?",
        options: ["To store a collection of unique items","To store a collection of duplicate items","To store a collection of ordered items","To store a collection of unordered items"],
        answer: 0,
        explanation: "In Python, a set is an unordered collection of unique items. It is used to store a collection of items without duplicates and is often used for fast membership testing and removing duplicates."
      },
      {
        question: "How do you access the first element of a tuple in Python?",
        options: ["tuple[0]","tuple(0)","tuple.get(0)","tuple.first()"],
        answer: 0,
        explanation: "In Python, you can access the first element of a tuple using the indexing syntax, i.e., tuple[0]."
      },
      {
        question: "What is the primary use case for a dictionary in Python?",
        options: ["To store a collection of unique items","To store a collection of ordered items","To store a collection of key-value pairs","To store a collection of unordered items"],
        answer: 2,
        explanation: "In Python, a dictionary is a data structure that stores a collection of key-value pairs. It is used to map keys to values and is often used for storing configuration data, caching, and more."
      }
    ]
  },
  'functions-and-lambdas': {
    anatomy: [
      { label: 'Def keyword', detail: 'Starts a standard function definition block.' },
      { label: 'Keyword Arguments', detail: 'Explicit parameter assignments (name="val").' },
      { label: 'Lambdas (anonymous)', detail: 'Single expression inline functions.' },
      { label: 'Return values', detail: 'Returns objects; returns None if omitted.' }
    ],
    rules: [
      'Never use mutable default arguments (like empty lists).',
      'Lambdas should hold only single expressions, not statements.',
      'Return multiple values as tuples for easy unpacking.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Argument Unpacking Flow',
      steps: ['Call function with args', 'Map positional parameters', 'Unpack keyword args (kwargs)', 'Execute function body', 'Return tuple/object']
    },
    tests: [
      {

      question: 'Why should you avoid using a mutable object (like an empty list `[]`) as a default parameter value in a Python function?',
      options: [
        'It throws a syntax error immediately.',
        'The default value is instantiated only once when the function is defined, making the default list state persistent and shared across separate calls.',
        'Mutable defaults prevent the function from returning a value.',
        'It locks variables in stack memory.'
      ],
      answer: 1,
      explanation: 'Default arguments are evaluated once at definition. If you modify a default list (e.g., appending values), those modifications persist and affect subsequent function calls.'
    
      },
      {
        question: "What is the main difference between a function and a lambda function in JavaScript?",
        options: ["A function can be defined with a name, while a lambda function cannot.","A lambda function can be defined with a name, while a function cannot.","A function can be defined without a name, while a lambda function cannot.","A lambda function can be defined without a name, while a function can."],
        answer: 0,
        explanation: "Functions can be defined with a name, which can be reused, while lambda functions are anonymous and can only be used once."
      },
      {
        question: "Which of the following is an example of a lambda function in JavaScript?",
        options: ["function add(x, y) { return x + y; }","let add = (x, y) => x + y;","function add(x, y) { console.log(x + y); }","let add = function(x, y) { return x + y; }"],
        answer: 1,
        explanation: "The second option is an example of a lambda function, which is defined using the arrow function syntax."
      },
      {
        question: "What is the purpose of the 'this' keyword in a lambda function?",
        options: ["It refers to the global object.","It refers to the function that contains the lambda function.","It refers to the lambda function itself.","It is not applicable in lambda functions."],
        answer: 2,
        explanation: "The 'this' keyword in a lambda function refers to the lambda function itself, which is the default behavior."
      },
      {
        question: "Can a lambda function be used as a constructor in JavaScript?",
        options: ["Yes, it can be used as a constructor.","No, it cannot be used as a constructor.","It depends on the context.","It is not applicable in JavaScript."],
        answer: 1,
        explanation: "No, lambda functions cannot be used as constructors in JavaScript."
      }
    ]
  },
  'object-oriented-programming': {
    anatomy: [
      { label: 'Class definition', detail: 'Factory blueprint generating objects.' },
      { label: 'Self keyword', detail: 'Refers to current active instance object.' },
      { label: '__init__ constructor', detail: 'Initializes instance variables on creation.' },
      { label: 'Inheritance tree', detail: 'Extending parent classes with child behaviors.' }
    ],
    rules: [
      'Always pass self as the first parameter of instance methods.',
      'Keep properties private using double underscores if isolation is needed.',
      'Call super().__init__() inside child class constructors.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Instantiation Pipeline',
      steps: ['Call ClassName() constructor', 'Allocate heap instance', 'Invoke __init__(self, ...)', 'Initialize class variables', 'Return instance reference']
    },
    tests: [
      {

      question: 'What is the purpose of the "self" parameter inside Python instance methods?',
      options: [
        'It declares the method as static.',
        'It references the active instance object calling the method, allowing access to instance attributes.',
        'It imports the system memory variables.',
        'It acts as the class constructor wrapper.'
      ],
      answer: 1,
      explanation: '"self" is a naming convention representing the active class instance. It provides methods access to instance fields and other methods.'
    
      },
      {
        question: "What is the primary benefit of using encapsulation in object-oriented programming?",
        options: ["Improved code readability","Reduced code duplication","Hiding data and behavior from the outside world","Increased code complexity"],
        answer: 2,
        explanation: "Encapsulation is a fundamental concept in object-oriented programming that helps to hide an object's internal state and behavior from the outside world, making it easier to modify and extend the code without affecting other parts of the program."
      },
      {
        question: "Which of the following is an example of inheritance in object-oriented programming?",
        options: ["A class that extends another class","A class that implements an interface","A class that contains another class","A class that overrides a method"],
        answer: 0,
        explanation: "Inheritance is a mechanism in object-oriented programming that allows one class to inherit properties and behavior from another class. This is typically achieved through the use of a 'extends' keyword or a similar construct."
      },
      {
        question: "What is the purpose of a constructor in object-oriented programming?",
        options: ["To initialize an object's properties","To create a new instance of a class","To override a method in a subclass","To implement an interface"],
        answer: 0,
        explanation: "A constructor is a special method in object-oriented programming that is used to initialize an object's properties when it is created. It is typically called when an object is instantiated and is used to set the initial state of the object."
      },
      {
        question: "Which of the following is an example of polymorphism in object-oriented programming?",
        options: ["A class that has multiple methods with the same name","A class that has a single method with multiple implementations","A class that has a method that returns a different type of object","A class that has a method that takes a different type of parameter"],
        answer: 1,
        explanation: "Polymorphism is a fundamental concept in object-oriented programming that allows objects of different classes to be treated as objects of a common superclass. This is typically achieved through method overriding or method overloading."
      }
    ]
  },
  'file-operations-exception-handling': {
    anatomy: [
      { label: 'Try / Except', detail: 'Captures and handles runtime exceptions.' },
      { label: 'With statement', detail: 'Context manager closing file resources automatically.' },
      { label: 'Finally block', detail: 'Guarantees execution regardless of error status.' },
      { label: 'File Streams', detail: 'Reads or writes lines from files.' }
    ],
    rules: [
      'Always use context managers (with) when writing or reading files.',
      'Catch specific exceptions (e.g. FileNotFoundError), not generic Exception.',
      'Log exception details; do not pass silently unless intended.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Exception Handling Flow',
      steps: ['Enter try block', 'Execute line (fails)', 'Interrupt flow, raise Exception', 'Scan matching except blocks', 'Run match block, run finally block']
    },
    tests: [
      {

      question: 'What is the primary benefit of opening a file using the "with" statement (context manager) in Python?',
      options: [
        'It speeds up read operations from hard drives.',
        'It encrypts file content automatically.',
        'It guarantees the file is closed correctly after the block finishes, even if exceptions occur.',
        'It opens the file in multiple write threads simultaneously.'
      ],
      answer: 2,
      explanation: 'The `with` statement utilizes context protocols. It automatically calls `close()` on the file stream resource when exiting the block, avoiding resource leaks.'
    
      },
      {
        question: "What is the primary purpose of exception handling in file operations?",
        options: ["To improve the performance of file operations","To handle errors and exceptions that occur during file operations","To reduce the size of the code","To increase the security of file operations"],
        answer: 1,
        explanation: "Exception handling is used to handle errors and exceptions that occur during file operations, ensuring that the program does not crash and provides a meaningful error message to the user."
      },
      {
        question: "Which of the following is an example of a file operation exception?",
        options: ["FileNotFoundError","SyntaxError","TypeError","All of the above"],
        answer: 0,
        explanation: "FileNotFoundError is an example of a file operation exception, which occurs when a file is not found or cannot be accessed."
      },
      {
        question: "How can you handle a FileNotFoundError exception in a try-except block?",
        options: ["Using a try-except block with a specific exception type","Using a try-except block with a general exception type","Using a finally block to close the file","Using a raise statement to re-raise the exception"],
        answer: 0,
        explanation: "You can handle a FileNotFoundError exception in a try-except block by using a try-except block with a specific exception type, such as try-except FileNotFoundError."
      },
      {
        question: "What is the best practice when handling exceptions in file operations?",
        options: ["To ignore all exceptions and continue with the program","To catch all exceptions and provide a generic error message","To catch specific exceptions and provide meaningful error messages","To re-raise all exceptions and let the program crash"],
        answer: 2,
        explanation: "The best practice when handling exceptions in file operations is to catch specific exceptions and provide meaningful error messages, which helps to identify and resolve the issue."
      }
    ]
  },

  // --- Data Analysis with NumPy & Pandas ---
  'numpy-arrays-and-vectorized-operations': {
    anatomy: [
      { label: 'NDArray structure', detail: 'Homogeneous multidimensional array block.' },
      { label: 'Vectorization', detail: 'C-loop executions replacing slow Python loops.' },
      { label: 'Broadcasting rules', detail: 'Adapts dimensions on arrays with different shapes.' },
      { label: 'Dtype constraint', detail: 'Restricts arrays to a single data type.' }
    ],
    rules: [
      'Ensure array elements share the exact same data type (dtype).',
      'Prefer vectorized mathematical operators over item-by-item loops.',
      'Avoid copying arrays; modify views to save memory.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Vectorized Processing',
      steps: ['Input NumPy Array', 'Apply operation (e.g., array * 2)', 'Execute vector instructions in C', 'Broadcasting dimensions matches', 'Output modified array']
    },
    tests: [
      {

      question: 'Why are vectorized operations in NumPy faster than traditional Python loops?',
      options: [
        'NumPy uses multithreading for every addition.',
        'Vectorized calculations compile logic directly in highly optimized C loops on contiguous arrays, bypassing Python interpreter overhead.',
        'NumPy arrays use stack memory instead of heap.',
        'They automatically delete empty array rows.'
      ],
      answer: 1,
      explanation: 'Vectorization offloads loops to optimized C binaries, avoiding Python loop pointer resolution overhead and leveraging CPU cache-friendly contiguous data layouts.'
    
      },
      {
        question: "What is the primary purpose of using NumPy arrays in web development?",
        options: ["To store and manipulate large datasets","To create interactive web pages","To handle user input","To implement authentication"],
        answer: 0,
        explanation: "NumPy arrays are designed to efficiently store and manipulate large datasets, making them ideal for scientific computing and data analysis tasks."
      },
      {
        question: "Which of the following is an example of a vectorized operation in NumPy?",
        options: ["Using a for loop to iterate over an array","Applying a mathematical function to each element of an array","Creating a new array by concatenating two existing arrays","Sorting an array in ascending order"],
        answer: 1,
        explanation: "Vectorized operations in NumPy allow you to apply mathematical functions to entire arrays at once, without the need for explicit loops."
      },
      {
        question: "What is the benefit of using vectorized operations in NumPy?",
        options: ["Improved code readability","Increased memory usage","Faster execution times","Reduced code complexity"],
        answer: 2,
        explanation: "Vectorized operations in NumPy can significantly improve the performance of your code by reducing the need for explicit loops and minimizing memory allocation."
      },
      {
        question: "Which of the following is a common use case for NumPy arrays in web development?",
        options: ["Rendering dynamic graphics","Handling user authentication","Processing and analyzing large datasets","Creating a simple calculator"],
        answer: 2,
        explanation: "NumPy arrays are particularly useful for processing and analyzing large datasets, making them a common choice for tasks such as data science and scientific computing."
      }
    ]
  },
  'pandas-series-and-dataframes': {
    anatomy: [
      { label: 'Pandas Series', detail: 'One-dimensional indexed array structure.' },
      { label: 'DataFrame grid', detail: 'Two-dimensional tabular matrix with labels.' },
      { label: 'Index Labels', detail: 'Unique keys identifying rows.' },
      { label: 'Loc / Iloc selectors', detail: 'Label-based and integer-based indexing.' }
    ],
    rules: [
      'DataFrames are collections of Series columns sharing an index.',
      'Use loc for label-based selection; use iloc for positional integers.',
      'Set indexes carefully to make join operations fast.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'DataFrame Indexing',
      steps: ['Query index value', 'Select Series columns', 'Locate intersection cell', 'Fetch values row/column block', 'Return slice']
    },
    tests: [
      {

      question: 'Which Pandas index selector selects columns/rows using position-based integer indexes instead of labels?',
      options: [
        'df.loc',
        'df.iloc',
        'df.ix',
        'df.index'
      ],
      answer: 1,
      explanation: '`iloc` is strictly integer-position based (from 0 to length-1 of the axis), whereas `loc` targets index labels.'
    
      },
      {
        question: "What is the primary difference between a pandas Series and a pandas DataFrame?",
        options: ["A Series is a one-dimensional array, while a DataFrame is a two-dimensional array.","A Series is a two-dimensional array, while a DataFrame is a one-dimensional array.","A Series is a collection of data, while a DataFrame is a collection of Series.","A Series is a single column of data, while a DataFrame is a single row of data."],
        answer: 0,
        explanation: "A pandas Series is a one-dimensional array-like object containing a sequence of values, while a pandas DataFrame is a two-dimensional table of values."
      },
      {
        question: "How do you create a pandas Series from a list of values?",
        options: ["series = pd.Series([1, 2, 3, 4])","series = pd.DataFrame([1, 2, 3, 4])","series = pd.Series({'a': 1, 'b': 2, 'c': 3, 'd': 4})","series = pd.DataFrame({'a': [1, 2, 3, 4], 'b': [5, 6, 7, 8]})"],
        answer: 0,
        explanation: "You can create a pandas Series from a list of values using the pd.Series() function."
      },
      {
        question: "What is the index of a pandas Series?",
        options: ["The index is the column name of the Series.","The index is the row name of the Series.","The index is a unique identifier for each value in the Series.","The index is a list of values that are used to label the Series."],
        answer: 2,
        explanation: "The index of a pandas Series is a unique identifier for each value in the Series."
      },
      {
        question: "How do you access a specific column in a pandas DataFrame?",
        options: ["df['column_name']","df.column_name","df.column_name.value","df.column_name.index"],
        answer: 0,
        explanation: "You can access a specific column in a pandas DataFrame using the df['column_name'] syntax."
      }
    ]
  },
  'data-cleaning-missing-values-dropping-columns': {
    anatomy: [
      { label: 'NaN values', detail: 'Standard missing float representation in Pandas.' },
      { label: 'Dropna helper', detail: 'Removes rows or columns with missing items.' },
      { label: 'Fillna utility', detail: 'Replaces missing items with default averages.' },
      { label: 'Drop function', detail: 'Removes unused columns to free memory.' }
    ],
    rules: [
      'Check count of missing rows before dropping columns.',
      'Use fillna with caution; imputation changes statistics.',
      'Set inplace=True or assign result to overwrite DataFrames.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Data Cleaning Pipeline',
      steps: ['Load dirty CSV file', 'Scan for nulls/NaNs', 'Drop unhelpful columns', 'Impute missing values', 'Output clean DataFrame']
    },
    tests: [
      {

      question: 'What is a major risk when replacing missing numerical data using simple mean imputation (e.g., fillna(df.mean()))?',
      options: [
        'It changes the data structure to a Series.',
        'It artificially reduces data variance and distorts relationships between features.',
        'It raises a SyntaxError during execution.',
        'It encrypts the remaining data columns.'
      ],
      answer: 1,
      explanation: 'Imputing missing values with averages concentrates values at the mean, artificially deflating overall standard deviation and altering core feature correlations.'
    
      },
      {
        question: "What is the primary reason for handling missing values in a dataset?",
        options: ["To improve data visualization","To increase data storage capacity","To enhance data accuracy and reliability","To reduce data processing time"],
        answer: 2,
        explanation: "Missing values can lead to incorrect conclusions and biased results if not handled properly. Handling missing values is essential to ensure the accuracy and reliability of the data."
      },
      {
        question: "Which of the following is a common method for handling missing values?",
        options: ["Dropping the column","Replacing with mean/median/mode","Using imputation techniques","All of the above"],
        answer: 3,
        explanation: "There are several methods for handling missing values, including imputation techniques, replacing with mean/median/mode, and dropping the column. The choice of method depends on the nature of the data and the research question."
      },
      {
        question: "What is the purpose of dropping columns in data cleaning?",
        options: ["To reduce data storage capacity","To increase data processing time","To remove irrelevant or redundant columns","To improve data visualization"],
        answer: 2,
        explanation: "Dropping columns is a common technique in data cleaning to remove irrelevant or redundant columns that do not contribute to the analysis or research question. This helps to improve data quality and reduce the risk of errors."
      },
      {
        question: "Which of the following is a best practice when dropping columns?",
        options: ["Dropping columns without checking for correlations","Dropping columns without understanding the data","Dropping columns only if they contain missing values","Dropping columns only if they are not relevant to the analysis"],
        answer: 3,
        explanation: "Dropping columns should be done thoughtfully and with consideration for the analysis or research question. It is essential to understand the data and the relationships between variables before dropping columns."
      }
    ]
  },
  'data-selection-filtering-grouping': {
    anatomy: [
      { label: 'Boolean Mask', detail: 'Array of booleans filtering matching DataFrame rows.' },
      { label: 'Groupby operator', detail: 'Splits, applies aggregations, combines results.' },
      { label: 'Aggregate functions', detail: 'Computes sum, mean, or count on groups.' },
      { label: 'Query function', detail: 'Evaluates logical filter strings.' }
    ],
    rules: [
      'Boolean masks must match the index length of target DataFrames.',
      'Groupby splits data lazily; always chain an aggregation method.',
      'Reset indexes after grouping to keep structures tabular.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Split-Apply-Combine Flow',
      steps: ['Group DataFrame by key column', 'Split data into grouped segments', 'Apply aggregates (e.g. mean)', 'Combine results back', 'Output summary table']
    },
    tests: [
      {

      question: 'What is the correct paradigm for filtering a DataFrame using a boolean condition?',
      options: [
        'df.filter(condition = True)',
        'df[condition_expression] (e.g., df[df["age"] > 21])',
        'df.split(condition)',
        'df.groupby(condition)'
      ],
      answer: 1,
      explanation: 'Pandas uses boolean indexing: passing a Series of boolean values (e.g., `df["age"] > 21`) inside square brackets filters rows matching the True evaluations.'
    
      },
      {
        question: "What is the primary purpose of data filtering in web development?",
        options: ["To group related data together","To remove irrelevant data","To sort data in ascending order","To display data in a table format"],
        answer: 1,
        explanation: "Data filtering is used to remove irrelevant data and focus on the relevant information, making it easier to analyze and understand."
      },
      {
        question: "Which of the following is an example of data grouping?",
        options: ["Calculating the sum of all orders","Displaying a list of all customers","Grouping orders by customer","Sorting orders by date"],
        answer: 2,
        explanation: "Data grouping involves organizing data into categories or groups, making it easier to analyze and understand."
      },
      {
        question: "What is the purpose of data selection in web development?",
        options: ["To display all available data","To remove irrelevant data","To select specific data for analysis","To group related data together"],
        answer: 2,
        explanation: "Data selection involves choosing specific data for analysis, making it easier to focus on the relevant information."
      },
      {
        question: "Which of the following is an example of data filtering?",
        options: ["Displaying a list of all orders","Grouping orders by customer","Calculating the sum of all orders","Showing only orders with a value greater than $100"],
        answer: 3,
        explanation: "Data filtering involves removing irrelevant data and focusing on specific information, such as orders with a value greater than $100."
      }
    ]
  },
  'reading-csv-json-files-and-merging-datasets': {
    anatomy: [
      { label: 'Read_csv parser', detail: 'Reads external files into DataFrames.' },
      { label: 'Merge operator', detail: 'Combines tables using keys (inner, left, right).' },
      { label: 'Concat function', detail: 'Appends data blocks vertically or horizontally.' },
      { label: 'Join utility', detail: 'Combines tables on index properties.' }
    ],
    rules: [
      'Specify types inside read_csv to optimize parser speeds.',
      'Ensure join keys have matching data types in both datasets.',
      'Check for rows multiplier issues after performing left joins.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Dataset Integration',
      steps: ['Load dataset A and B', 'Align merge keys', 'Perform Join operation', 'Inspect matching results', 'Output merged table']
    },
    tests: [
      {

      question: 'Which merge type returns only the rows that have matching keys in both left and right DataFrames?',
      options: [
        'Left Join',
        'Outer Join',
        'Inner Join',
        'Right Join'
      ],
      answer: 2,
      explanation: 'An Inner Join returns rows where keys intersect across both DataFrames. Outer Joins preserve all keys, filling unmatched values with NaNs.'
    
      },
      {
        question: "What is the primary function of the `pandas` library when reading CSV files?",
        options: ["Data manipulation and analysis","File system operations","Data visualization","Data storage"],
        answer: 0,
        explanation: "The `pandas` library is primarily used for data manipulation and analysis, including reading and writing CSV files."
      },
      {
        question: "Which of the following methods is used to merge two datasets in JSON format?",
        options: ["`concat()`","`merge()`","`join()`","`reduce()`"],
        answer: 2,
        explanation: "The `join()` method is used to merge two datasets in JSON format by joining them on a common key."
      },
      {
        question: "What is the purpose of using the `json` module in Python when working with JSON files?",
        options: ["Data manipulation and analysis","File system operations","Data storage","Parsing and generating JSON data"],
        answer: 3,
        explanation: "The `json` module is used to parse and generate JSON data, making it easier to work with JSON files in Python."
      },
      {
        question: "How can you efficiently read a large CSV file in Python?",
        options: ["Using the `read()` method","Using the `readlines()` method","Using the `pandas` library with `read_csv()` method","Using a loop to read the file line by line"],
        answer: 2,
        explanation: "The `pandas` library with `read_csv()` method is the most efficient way to read a large CSV file in Python, as it can handle large files and provides efficient data manipulation and analysis capabilities."
      }
    ]
  },

  // --- Intro to Neural Networks ---
  'the-perceptron-linear-models': {
    anatomy: [
      { label: 'Input Features', detail: 'Raw dimensional variables multiplied by weights.' },
      { label: 'Weights & Bias', detail: 'Parameters adjusted to fit target functions.' },
      { label: 'Summation Node', detail: 'Computes dot product sum of inputs & weights.' },
      { label: 'Step Function', detail: 'Outputs binary decisions based on thresholds.' }
    ],
    rules: [
      'Linear models fail to resolve non-linear datasets (e.g. XOR gate).',
      'Initialize weights to small non-zero values to break symmetry.',
      'Ensure input features match the dimensions of weight arrays.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Perceptron Calculation',
      steps: ['Receive inputs [x1, x2]', 'Multiply by weights [w1, w2]', 'Add bias parameter', 'Compute dot product sum', 'Apply step function']
    },
    tests: [
      {

      question: 'Why is a single-layer perceptron unable to solve the XOR logic classification task?',
      options: [
        'XOR requires fractional weights.',
        'XOR has non-linearly separable classes that cannot be segregated by a single straight decision boundary line.',
        'It has an odd count of output nodes.',
        'Step functions do not support negation.'
      ],
      answer: 1,
      explanation: 'A single perceptron forms a linear decision hyperplane. Since XOR states cannot be divided by a single straight boundary, multi-layer networks with non-linear activations are required.'
    
      },
      {
        question: "What is the primary function of a perceptron in machine learning?",
        options: ["It is a type of neural network used for image recognition","It is a linear model used for binary classification","It is a type of clustering algorithm","It is a type of regression model"],
        answer: 1,
        explanation: "A perceptron is a type of linear model used for binary classification, where it learns to separate the classes by finding a hyperplane in the feature space."
      },
      {
        question: "What is the main limitation of a single perceptron?",
        options: ["It can handle multiple classes","It can learn non-linear decision boundaries","It can only learn linear decision boundaries","It is not affected by the curse of dimensionality"],
        answer: 2,
        explanation: "A single perceptron can only learn linear decision boundaries, which limits its ability to model complex relationships between features."
      },
      {
        question: "What is the purpose of the activation function in a perceptron?",
        options: ["To add non-linearity to the model","To normalize the input features","To reduce the dimensionality of the feature space","To increase the number of parameters in the model"],
        answer: 0,
        explanation: "The activation function is used to add non-linearity to the model, allowing it to learn more complex relationships between features."
      },
      {
        question: "What is the typical output of a perceptron?",
        options: ["A probability distribution over all classes","A single class label","A confidence score for each class","A binary output (0 or 1)"],
        answer: 3,
        explanation: "A perceptron typically outputs a binary value (0 or 1), indicating the predicted class label."
      }
    ]
  },
  'activation-functions': {
    anatomy: [
      { label: 'Sigmoid / Tanh', detail: 'Compresses outputs into probability intervals (0 to 1).' },
      { label: 'ReLU Function', detail: 'Returns 0 for negative values; returns x for positive values.' },
      { label: 'Softmax classifier', detail: 'Converts multi-class vectors to probability sums.' },
      { label: 'Leaky ReLU', detail: 'Allows small slopes for negative inputs to prevent dead neurons.' }
    ],
    rules: [
      'Use ReLU inside hidden layers to mitigate vanishing gradients.',
      'Use Softmax inside output layers for multi-class classification.',
      'Leaky ReLU helps when too many activations die.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Layer Activation Flow',
      steps: ['Receive weighted input sum', 'Apply ReLU function (clip negatives)', 'Compute activation score', 'Pass activations to next layer', 'Calculate loss']
    },
    tests: [
      {

      question: 'Which of the following describes the ReLU activation function?',
      options: [
        'It maps all inputs to values between -1 and 1.',
        'It returns 0 for any input less than or equal to zero; otherwise it returns the input value directly.',
        'It normalizes a list of values to a probability distribution summing to 1.',
        'It returns the derivative of the input weight.'
      ],
      answer: 1,
      explanation: 'Rectified Linear Unit (ReLU) computes `f(x) = max(0, x)`. It introduces non-linearity and is highly computationally efficient.'
    
      },
      {
        question: "What is the primary purpose of activation functions in a neural network?",
        options: ["To add more layers to the network","To introduce non-linearity in the model","To increase the number of neurons in a layer","To reduce the dimensionality of the input data"],
        answer: 1,
        explanation: "Activation functions introduce non-linearity in the model, allowing the network to learn complex relationships between inputs and outputs."
      },
      {
        question: "Which of the following activation functions is commonly used for binary classification problems?",
        options: ["Sigmoid","ReLU","Tanh","Softmax"],
        answer: 0,
        explanation: "The Sigmoid activation function is commonly used for binary classification problems, as it outputs a value between 0 and 1."
      },
      {
        question: "What is the name of the activation function that is known for its simplicity and efficiency?",
        options: ["Sigmoid","ReLU","Tanh","Leaky ReLU"],
        answer: 1,
        explanation: "The ReLU (Rectified Linear Unit) activation function is known for its simplicity and efficiency, as it only outputs 0 for negative inputs and the input value for non-negative inputs."
      },
      {
        question: "Which of the following activation functions is commonly used for multi-class classification problems?",
        options: ["Sigmoid","ReLU","Tanh","Softmax"],
        answer: 3,
        explanation: "The Softmax activation function is commonly used for multi-class classification problems, as it outputs a probability distribution over multiple classes."
      }
    ]
  },
  'feedforward-backpropagation-propagation': {
    anatomy: [
      { label: 'Forward Pass', detail: 'Calculates layer predictions through networks.' },
      { label: 'Loss derivative', detail: 'Slope of error relative to predictions.' },
      { label: 'Chain Rule', detail: 'Multiplies partial derivatives down network graphs.' },
      { label: 'Weight Updates', detail: 'Subtracts gradients multiplied by learning rates.' }
    ],
    rules: [
      'Forward pass calculates predictions; backward pass distributes error.',
      'Gradients scale inversely with layer depths (vanishing gradient risk).',
      'Reset gradients before beginning backpropagation steps.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Training Optimization Loop',
      steps: ['Input data forward pass', 'Evaluate loss prediction error', 'Compute partial gradients', 'Distribute error backward', 'Update weights']
    },
    tests: [
      {

      question: 'What mathematical rule is the primary engine of the backpropagation algorithm?',
      options: [
        'The Quotient Rule of division.',
        'The Chain Rule of calculus (calculating nested derivatives).',
        'Bayes Theorem of conditional probability.',
        'The Pythagorean Theorem.'
      ],
      answer: 1,
      explanation: 'Backpropagation uses the calculus Chain Rule to calculate derivatives of loss with respect to weights layer-by-layer backwards through the network.'
    
      },
      {
        question: "What is the primary function of the feedforward phase in a neural network?",
        options: ["To update the weights and biases of the network","To calculate the output of the network","To calculate the error of the network","To propagate the error backwards"],
        answer: 1,
        explanation: "The feedforward phase is responsible for calculating the output of the network by passing the input through each layer."
      },
      {
        question: "What is the purpose of backpropagation in a neural network?",
        options: ["To calculate the output of the network","To update the weights and biases of the network","To calculate the error of the network","To propagate the error backwards"],
        answer: 3,
        explanation: "Backpropagation is used to calculate the error of the network and propagate it backwards to update the weights and biases."
      },
      {
        question: "What is the term for the process of updating the weights and biases of a neural network based on the error?",
        options: ["Propagation","Backpropagation","Feedforward","Error update"],
        answer: 1,
        explanation: "Backpropagation is the term for the process of updating the weights and biases of a neural network based on the error."
      },
      {
        question: "In what order do the feedforward and backpropagation phases occur in a neural network?",
        options: ["Backpropagation then feedforward","Feedforward then backpropagation","Alternating between feedforward and backpropagation","Feedforward and backpropagation occur simultaneously"],
        answer: 1,
        explanation: "The feedforward phase occurs first, followed by the backpropagation phase, to update the weights and biases of the network."
      }
    ]
  },
  'loss-functions-and-gradient-descent-optimization': {
    anatomy: [
      { label: 'Mean Squared Error', detail: 'Standard loss for regression tasks.' },
      { label: 'Cross-Entropy Loss', detail: 'Standard loss for classification tasks.' },
      { label: 'Learning Rate (alpha)', detail: 'Step size multiplier during parameter updates.' },
      { label: 'Optimizer parameters', detail: 'Momentum, decay values (Adam, SGD).' }
    ],
    rules: [
      'A learning rate set too high causes optimization to diverge.',
      'Ensure the loss function matches the task (MSE vs Cross-Entropy).',
      'Normalize target variables to stabilize loss calculation.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Gradient Descent Optimization',
      steps: ['Evaluate current loss', 'Compute gradients gradient vector', 'Multiply gradients by learning rate', 'Subtract update from parameters', 'Verify loss drop']
    },
    tests: [
      {

      question: 'What occurs if the learning rate during gradient descent is configured too high?',
      options: [
        'The model stops learning entirely because gradients vanish.',
        'The optimization path steps right over the minimum error point, potentially diverging and increasing loss.',
        'It changes the model to a linear classifier.',
        'It forces weight vectors to become zero.'
      ],
      answer: 1,
      explanation: 'An excessive learning rate causes optimization to overshoot local minima, producing oscillations that can lead to diverging loss.'
    
      },
      {
        question: "What is the primary goal of using a loss function in machine learning?",
        options: ["To evaluate the accuracy of a model","To optimize the model's parameters","To classify data points","To generate new data points"],
        answer: 1,
        explanation: "A loss function is used to measure the difference between the model's predictions and the actual output, allowing the model to be optimized through gradient descent."
      },
      {
        question: "What type of optimization algorithm is commonly used to minimize the loss function?",
        options: ["Gradient Ascent","Gradient Descent","Stochastic Gradient Descent","Batch Gradient Descent"],
        answer: 2,
        explanation: "Gradient Descent is an optimization algorithm that iteratively adjusts the model's parameters to minimize the loss function."
      },
      {
        question: "What is the role of the learning rate in Gradient Descent optimization?",
        options: ["To increase the step size of each iteration","To decrease the step size of each iteration","To adjust the model's parameters","To evaluate the loss function"],
        answer: 1,
        explanation: "The learning rate determines the step size of each iteration in Gradient Descent, controlling how quickly the model's parameters are adjusted."
      },
      {
        question: "What is the benefit of using a regularization term in the loss function?",
        options: ["To increase the model's complexity","To decrease the model's complexity","To improve the model's accuracy","To prevent overfitting"],
        answer: 3,
        explanation: "Regularization terms are added to the loss function to prevent overfitting by penalizing large model weights and encouraging simpler models."
      }
    ]
  },
  'layers-input-hidden-and-output-layers': {
    anatomy: [
      { label: 'Input Layer', detail: 'Receives and normalizes raw dataset features.' },
      { label: 'Hidden Layers', detail: 'Extracts non-linear representations from features.' },
      { label: 'Output Layer', detail: 'Yields final predictions (scores, probabilities).' },
      { label: 'Layer weights matrix', detail: 'Dimensional variables mapping layers.' }
    ],
    rules: [
      'Hidden layers extract high-level feature hierarchies.',
      'Output layer shapes must match target dataset dims.',
      'Add dropout layers between hidden layers to combat overfitting.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Multi-layer Network Flow',
      steps: ['Input Layer nodes', 'Hidden Layer 1 activations', 'Hidden Layer 2 activations', 'Output Layer values', 'Evaluate loss']
    },
    tests: [
      {

      question: 'What is the role of hidden layers inside deep neural networks?',
      options: [
        'They directly interface with external CSV files.',
        'They learn feature hierarchies and represent complex, non-linear relationships in data.',
        'They save parameter variables to hard drives.',
        'They calculate evaluation metrics for test sets.'
      ],
      answer: 1,
      explanation: 'Hidden layers act as intermediate representational feature extractors, mapping inputs to non-linear spaces where the target output can be accurately separated.'
    
      },
      {
        question: "What is the primary function of the input layer in a neural network?",
        options: ["To process and store data","To make predictions based on data","To receive and preprocess input data","To output the final result"],
        answer: 2,
        explanation: "The input layer is responsible for receiving and preprocessing input data before it is passed to the hidden layers for processing."
      },
      {
        question: "Which layer in a neural network is responsible for storing the weights and biases of the connections between neurons?",
        options: ["Input layer","Hidden layer","Output layer","None of the above"],
        answer: 1,
        explanation: "The hidden layer stores the weights and biases of the connections between neurons, which are used to make predictions and learn from data."
      },
      {
        question: "What is the primary function of the output layer in a neural network?",
        options: ["To make predictions based on data","To receive and preprocess input data","To output the final result","To store weights and biases"],
        answer: 2,
        explanation: "The output layer is responsible for producing the final result or output of the neural network, based on the input data and the weights and biases of the connections between neurons."
      },
      {
        question: "Which layer in a neural network is not directly connected to the input layer?",
        options: ["Input layer","Hidden layer","Output layer","Both hidden and output layers"],
        answer: 1,
        explanation: "The hidden layer is not directly connected to the input layer, but rather receives input from the input layer and produces output that is passed to the output layer."
      }
    ]
  },

  // --- Large Language Models & Prompting ---
  'transformer-architectures-self-attention-mechanism': {
    anatomy: [
      { label: 'Self-Attention', detail: 'Calculates word weights relative to contexts.' },
      { label: 'Multi-Head Attention', detail: 'Processes different focus streams in parallel.' },
      { label: 'Positional Encoding', detail: 'Injects sequence order into word embeddings.' },
      { label: 'Feed-forward networks', detail: 'Transforms token features after attention calculations.' }
    ],
    rules: [
      'Self-attention scales quadratically with sequence length.',
      'Positional encoding replaces recurrent connections to enable parallel training.',
      'Masked attention blocks future tokens inside decoder networks.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Attention Processing Block',
      steps: ['Embed input tokens', 'Add positional values', 'Calculate Query, Key, Value matrices', 'Perform Dot-Product Attention', 'Project output features']
    },
    tests: [
      {

      question: 'Why did the Transformer architecture replace LSTM and recurrent neural networks (RNNs) as the standard for LLMs?',
      options: [
        'LSTMs require more parameters than Transformers.',
        'Transformers process tokens in parallel, enabling rapid training on massive GPU clusters compared to sequential RNN structures.',
        'Transformers do not require text tokenization.',
        'Attention mechanisms require no weight parameter updates.'
      ],
      answer: 1,
      explanation: 'By removing sequential dependency, Transformers allow entire sequences to be processed in parallel during training, facilitating scaling to web-sized training corpora.'
    
      },
      {
        question: "What is the primary function of the self-attention mechanism in transformer architectures?",
        options: ["To process sequential data in parallel","To handle out-of-vocabulary words","To perform named entity recognition","To implement word embeddings"],
        answer: 0,
        explanation: "The self-attention mechanism allows the model to weigh the importance of different input elements relative to each other, enabling parallel processing of sequential data."
      },
      {
        question: "What is the key innovation of transformer architectures compared to traditional recurrent neural networks?",
        options: ["The use of convolutional layers","The application of pre-trained word embeddings","The introduction of self-attention mechanisms","The use of long short-term memory units"],
        answer: 2,
        explanation: "The transformer architecture replaces traditional recurrent neural networks with self-attention mechanisms, enabling faster and more parallelizable processing of sequential data."
      },
      {
        question: "What is the purpose of the query, key, and value matrices in the self-attention mechanism?",
        options: ["To compute the attention weights","To normalize the input embeddings","To perform matrix multiplication","To apply a non-linear activation function"],
        answer: 0,
        explanation: "The query, key, and value matrices are used to compute the attention weights, which determine the importance of different input elements relative to each other."
      },
      {
        question: "What is the benefit of using the self-attention mechanism in transformer architectures?",
        options: ["Improved performance on out-of-vocabulary words","Faster training times","Better handling of long-range dependencies","Increased model complexity"],
        answer: 2,
        explanation: "The self-attention mechanism enables better handling of long-range dependencies in sequential data, leading to improved performance on a variety of tasks."
      }
    ]
  },
  'tokenization-and-embedding-spaces': {
    anatomy: [
      { label: 'Tokenizer parser', detail: 'Splits strings into sub-word token IDs.' },
      { label: 'Vocabulary lookup', detail: 'Translates text tokens into indices.' },
      { label: 'Embedding layer', detail: 'Maps tokens into high-dimensional vectors.' },
      { label: 'Cosine Similarity', detail: 'Measures vector angles representing meaning proximity.' }
    ],
    rules: [
      'Out-of-vocabulary words get split into smaller sub-word character fragments.',
      'Embeddings capture semantic similarities, not exact spelling matches.',
      'Normalize vectors before measuring similarity scores.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Vector Embedding Pipeline',
      steps: ['Input string characters', 'Convert to subword tokens', 'Look up index integer values', 'Map to high-dim float vectors', 'Project into embedding space']
    },
    tests: [
      {

      question: 'What does a high cosine similarity between two token vectors in an embedding space indicate?',
      options: [
        'The tokens have the exact same count of characters.',
        'The tokens are synonyms or frequently share similar semantic contexts in the training data.',
        'The tokens are located in the same file position.',
        'The tokenizer uses the same character ID.'
      ],
      answer: 1,
      explanation: 'High cosine similarity indicates that the vectors point in nearly identical directions in the high-dimensional space, reflecting a shared semantic context.'
    
      },
      {
        question: "What is the primary purpose of tokenization in the context of natural language processing in web development?",
        options: ["To convert text into a numerical representation","To remove special characters from text","To split text into individual words","To convert text into a binary format"],
        answer: 0,
        explanation: "Tokenization is the process of breaking down text into individual words or tokens, which can then be used for further processing such as embedding into a numerical space."
      },
      {
        question: "What is the main advantage of using embedding spaces in web development?",
        options: ["Improved security","Faster data processing","Better text classification","Reduced memory usage"],
        answer: 2,
        explanation: "Embedding spaces allow for the conversion of text into a numerical representation that can be used for tasks such as text classification, clustering, and recommendation systems."
      },
      {
        question: "Which of the following is a common technique used to create embedding spaces?",
        options: ["Word2Vec","TF-IDF","TextRank","Sentiment Analysis"],
        answer: 0,
        explanation: "Word2Vec is a popular technique used to create embedding spaces by learning vector representations of words from large amounts of text data."
      },
      {
        question: "What is the primary benefit of using pre-trained embedding spaces in web development?",
        options: ["Reduced training time","Improved model accuracy","Increased memory usage","Faster deployment"],
        answer: 0,
        explanation: "Pre-trained embedding spaces can be used as a starting point for further training or fine-tuning, reducing the time and computational resources required to train a model from scratch."
      }
    ]
  },
  'pre-training-vs-fine-tuning': {
    anatomy: [
      { label: 'Unsupervised Pre-training', detail: 'Predicting next tokens over huge text corpses.' },
      { label: 'Instruction Tuning', detail: 'Adapting models to format and answer queries.' },
      { label: 'LoRA adapters', detail: 'Injects low-rank parameter weights to save memory.' },
      { label: 'RLHF pipeline', detail: 'Aligns answers using human feedback rewards.' }
    ],
    rules: [
      'Pre-training builds general knowledge; fine-tuning configures style/task constraints.',
      'Over-tuning causes models to forget core pre-trained reasoning abilities.',
      'Use LoRA to tune parameters on small consumer GPUs.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'LLM Development Lifecycle',
      steps: ['Train raw model next-token prediction', 'Instruction tune chat dataset templates', 'Apply LoRA parameter weights', 'Evaluate output quality', 'Deploy model']
    },
    tests: [
      {

      question: 'What is the goal of reinforcement learning from human feedback (RLHF)?',
      options: [
        'To pre-train the transformer weights using Wikipedia.',
        'To align generated model responses with human preferences, safety standards, and instruction accuracy.',
        'To compile token indices into BSON format.',
        'To double the tokenizer vocabulary size.'
      ],
      answer: 1,
      explanation: 'RLHF uses human evaluation feedback to train a reward model, which optimizes model generation behavior towards safe and helpful responses.'
    
      },
      {
        question: "What is the primary difference between pre-training and fine-tuning in the context of deep learning models?",
        options: ["Pre-training involves training a model from scratch on a large dataset, while fine-tuning involves adjusting a pre-trained model to a new task.","Fine-tuning involves training a model from scratch on a small dataset, while pre-training involves adjusting a pre-trained model to a new task.","Pre-training and fine-tuning are interchangeable terms.","Pre-training is only used for image classification tasks, while fine-tuning is used for other tasks."],
        answer: 0,
        explanation: "Pre-training involves training a model from scratch on a large dataset, while fine-tuning involves adjusting a pre-trained model to a new task."
      },
      {
        question: "Which of the following is a benefit of fine-tuning a pre-trained model?",
        options: ["It reduces the risk of overfitting.","It increases the risk of overfitting.","It requires less computational resources.","It requires more computational resources."],
        answer: 0,
        explanation: "It reduces the risk of overfitting."
      },
      {
        question: "What is the typical approach when fine-tuning a pre-trained model?",
        options: ["Freeze the weights of the pre-trained model and train only the new layers.","Unfreeze the weights of the pre-trained model and train all the layers.","Train the pre-trained model from scratch on the new task.","Use the pre-trained model as is, without any adjustments."],
        answer: 1,
        explanation: "Unfreeze the weights of the pre-trained model and train all the layers."
      },
      {
        question: "Why is pre-training often used as a starting point for fine-tuning?",
        options: ["It allows for faster training times.","It enables the model to learn more general features.","It reduces the risk of overfitting.","It increases the risk of underfitting."],
        answer: 1,
        explanation: "It enables the model to learn more general features."
      }
    ]
  },
  'prompt-engineering-techniques': {
    anatomy: [
      { label: 'Zero-shot prompt', detail: 'Asking models to complete tasks without templates.' },
      { label: 'Few-shot prompt', detail: 'Providing target input-output pairs inside contexts.' },
      { label: 'Chain-of-Thought', detail: 'Injecting "let\'s think step by step" lines.' },
      { label: 'System instruction', detail: 'Persistent rules defining model behaviors.' }
    ],
    rules: [
      'Provide clear, unambiguous constraints rather than vague goals.',
      'Chain-of-thought increases accuracy on logic tasks but uses more output tokens.',
      'Structure few-shot examples consistently using identical delimiters.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Prompt Execution Flow',
      steps: ['Structure system rules', 'Insert few-shot examples', 'Add user prompt instructions', 'Inject Chain-of-Thought triggers', 'Submit prompt to model API']
    },
    tests: [
      {

      question: 'How does Chain-of-Thought prompting improve a model\'s performance on logical and mathematical reasoning tasks?',
      options: [
        'It speeds up API response times by bypassing hidden layers.',
        'It instructs the model to generate intermediate reasoning steps before arriving at a final answer, improving search accuracy.',
        'It reduces the token usage significantly.',
        'It disables the self-attention layer to prevent hallucinations.'
      ],
      answer: 1,
      explanation: 'Generating step-by-step reasoning sequences aligns the decoder context with the intermediate logic path, helping the model avoid logical leaps and reach correct final answers.'
    
      },
      {
        question: "What is the primary goal of prompt engineering in web development?",
        options: ["To improve the user experience","To increase the load time of a website","To generate more accurate and relevant responses","To reduce the complexity of a project"],
        answer: 2,
        explanation: "The primary goal of prompt engineering is to craft input prompts that elicit the most accurate and relevant responses from AI models or other systems, which can improve the overall quality of the output."
      },
      {
        question: "Which of the following is an example of a prompt engineering technique?",
        options: ["Using a specific programming language","Crafting a clear and concise input prompt","Using a specific database","Implementing a new feature"],
        answer: 1,
        explanation: "Crafting a clear and concise input prompt is an example of a prompt engineering technique, as it helps to elicit the most accurate and relevant responses from AI models or other systems."
      },
      {
        question: "What is the benefit of using prompt engineering in web development?",
        options: ["It reduces the complexity of a project","It increases the load time of a website","It improves the accuracy and relevance of responses","It reduces the cost of development"],
        answer: 2,
        explanation: "The benefit of using prompt engineering is that it can improve the accuracy and relevance of responses, which can lead to better user experiences and more effective web applications."
      },
      {
        question: "Which of the following is a common challenge in prompt engineering?",
        options: ["Crafting clear and concise input prompts","Using a specific programming language","Implementing a new feature","Eliciting accurate and relevant responses from AI models"],
        answer: 3,
        explanation: "Eliciting accurate and relevant responses from AI models is a common challenge in prompt engineering, as it requires a deep understanding of the AI model's capabilities and limitations."
      }
    ]
  },
  'agent-frameworks': {
    anatomy: [
      { label: 'Agent loop', detail: 'Reasoning cycles deciding target tools to run.' },
      { label: 'Tool Schema definition', detail: 'JSON formats explaining tool parameter APIs.' },
      { label: 'MCP server', detail: 'Standardizes host connections to services.' },
      { label: 'System context', detail: 'Tracks memory across conversation turns.' }
    ],
    rules: [
      'Format tool schemas clearly so models understand usage rules.',
      'Limit loop execution counts to prevent infinite execution bills.',
      'Parse tool outputs carefully before feeding results back to agent histories.'
    ],
    diagram: {
      type: 'pipeline',
      title: 'Agent Tool Execution Loop',
      steps: ['Receive prompt request', 'Model selects tool & arguments', 'Execute tool logic locally', 'Feed tool output to context history', 'Model outputs final response']
    },
    tests: [
      {

      question: 'In AI agent architectures, what is the purpose of providing a "Tool Schema"?',
      options: [
        'To display buttons on the frontend website.',
        'To define tool capabilities and parameters in JSON Schema so the model knows how to formulate tool calls.',
        'To compile python code into binary.',
        'To cache API responses on proxy servers.'
      ],
      answer: 1,
      explanation: 'Tool schemas describe arguments, types, and functionality to the model in standard formats, enabling it to determine when and how to call external tools.'
    
      },
      {
        question: "What is the primary purpose of an agent framework in web development?",
        options: ["To manage server-side logic","To handle client-side interactions","To facilitate communication between agents","To optimize database queries"],
        answer: 0,
        explanation: "An agent framework is primarily used to manage server-side logic, enabling developers to create and manage multiple agents that interact with the server and other agents."
      },
      {
        question: "Which of the following is a key benefit of using an agent framework?",
        options: ["Improved performance","Simplified code maintenance","Enhanced security","Better scalability"],
        answer: 1,
        explanation: "Using an agent framework can simplify code maintenance by breaking down complex logic into smaller, more manageable agents."
      },
      {
        question: "What is an example of an agent framework used in web development?",
        options: ["React","Angular","Django","Node.js"],
        answer: 3,
        explanation: "Node.js is an example of an agent framework used in web development, allowing developers to create and manage multiple agents that interact with the server and other agents."
      },
      {
        question: "Why are agent frameworks useful in distributed systems?",
        options: ["To handle network latency","To manage concurrent requests","To facilitate communication between agents","To optimize data storage"],
        answer: 2,
        explanation: "Agent frameworks are useful in distributed systems because they facilitate communication between agents, enabling them to interact and coordinate with each other in a decentralized environment."
      }
    ]
  }
};
