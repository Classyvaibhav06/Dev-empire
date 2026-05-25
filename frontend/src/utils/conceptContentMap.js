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
    test: {
      question: 'Which of the following is a primary characteristic of the client-server architecture?',
      options: [
        'The server is always responsible for initiating communication with the client.',
        'The client initiates requests and the server listens and returns responses.',
        'Data is stored exclusively on the client device to save server costs.',
        'Client and server must run on the exact same physical machine.'
      ],
      answer: 1,
      explanation: 'In the client-server model, the client initiates the request-response cycle, and the server responds to incoming client requests.'
    }
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
    test: {
      question: 'What happens immediately if a requested domain name is found in the local browser DNS cache?',
      options: [
        'The browser queries the root nameservers.',
        'The request fails with a 404 status code.',
        'The browser immediately uses the cached IP address, bypassing external DNS queries.',
        'The local resolver clears the cache and requests a new IP.'
      ],
      answer: 2,
      explanation: 'If a domain-to-IP mapping is cached locally, the browser skips external queries to reduce latency and contacts the IP directly.'
    }
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
    test: {
      question: 'What is the main difference between HTTP and HTTPS?',
      options: [
        'HTTPS is a completely separate protocol that does not use HTTP verbs.',
        'HTTPS encrypts data during network transit using SSL/TLS.',
        'HTTP is faster and should be preferred for sending credentials.',
        'HTTPS does not use status codes to confirm success.'
      ],
      answer: 1,
      explanation: 'HTTPS is HTTP wrapped in a secure SSL/TLS layer to encrypt communication and protect against eavesdropping or tampering.'
    }
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
    test: {
      question: 'In a stateless request-response cycle, how does a server identify a returning client?',
      options: [
        'The server remembers the client IP address forever.',
        'The client must include identification credentials (like cookies or tokens) in its request headers.',
        'The connection remains open indefinitely so the client is never disconnected.',
        'The server assigns a permanent CPU thread to each unique client.'
      ],
      answer: 1,
      explanation: 'Because HTTP is stateless, the server does not remember past requests; the client must present session identifiers (like tokens or cookies) in headers with each request.'
    }
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
    test: {
      question: 'Which of the following is true about how CSS blocks browser rendering?',
      options: [
        'The browser displays raw unstyled HTML before parsing CSS.',
        'The browser stops compiling the DOM completely when it encounters a link tag.',
        'The browser constructs the DOM, but waits for the CSSOM tree to build the Render Tree and paint the page.',
        'JavaScript does not block HTML parsing, but CSS always does.'
      ],
      answer: 2,
      explanation: 'CSS is render-blocking. To avoid a "Flash of Unstyled Content" (FOUC), the browser waits for the CSSOM tree to merge with the DOM before rendering visual elements.'
    }
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
    test: {
      question: 'What is the primary function of the <!DOCTYPE html> declaration?',
      options: [
        'It styles the page background and base fonts.',
        'It tells the browser to parse the document as modern HTML5 standard compliant.',
        'It imports jQuery and other scripts automatically.',
        'It sets up routing rules for server requests.'
      ],
      answer: 1,
      explanation: 'The doctype declaration tells the browser to render the page in standards mode rather than quirks mode.'
    }
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
    test: {
      question: 'Why should you avoid skipping heading levels (like jumping from <h1> to <h4>)?',
      options: [
        'It throws a syntax compilation error in the browser.',
        'It breaks the visual layout and prevents CSS from loading.',
        'It disrupts the logical document outline, negatively impacting accessibility and SEO.',
        'It causes image attributes to be ignored.'
      ],
      answer: 2,
      explanation: 'Headings establish document structure. Screen readers and search engine crawlers rely on a logical, sequential hierarchy (h1, then h2, then h3) to understand section relations.'
    }
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
    test: {
      question: 'Which element represents the correct accessibility pattern to bind text to a form input?',
      options: [
        'Using a <span> next to the input with matching colors.',
        'A <label> element with a "for" attribute matching the input\'s "id" attribute.',
        'Placing placeholder text inside the input instead of a label.',
        'Wrapping the input inside a table cell.'
      ],
      answer: 1,
      explanation: 'A <label for="username"> matches an <input id="username">. This links them semantically, enabling screen readers to announce the label when focused, and allowing clicking the label to focus the input.'
    }
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
    test: {
      question: 'What is the main benefit of using <main> over a generic <div> tag?',
      options: [
        'It styles the main section with margins automatically.',
        'It tells browsers and assistive systems exactly where the core, non-repeating content of the page resides.',
        'It speeds up JavaScript evaluation by 50%.',
        'It prevents the page from being scraped by crawlers.'
      ],
      answer: 1,
      explanation: 'The <main> element is a landmark tag. Assistive technologies use it to allow users to skip header/navigation lists and jump directly to the primary page contents.'
    }
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
    test: {
      question: 'Which of the following satisfies basic image accessibility criteria?',
      options: [
        'Adding title="..." to every image.',
        'Providing a descriptive alt="..." attribute for informative images, or an empty alt="" for decorative images.',
        'Avoiding image tags altogether and using CSS background images.',
        'Adding tabindex="0" to every image so screen readers focus them.'
      ],
      answer: 1,
      explanation: 'Alt text should describe the information conveyed by images. If an image is purely decorative, using a null/empty alt="" attribute tells screen readers to safely ignore it.'
    }
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
    test: {
      question: 'Where should external stylesheets ideally be linked in an HTML document?',
      options: [
        'At the very end of the <body> element.',
        'Inside the <head> element to ensure styling starts loading before content renders.',
        'Directly inside the <footer> element.',
        'Inline on the first <div> tag.'
      ],
      answer: 1,
      explanation: 'Linking stylesheets inside the <head> ensures that styles are parsed and available when the browser paints the HTML, preventing a brief flash of unstyled content.'
    }
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
    test: {
      question: 'Which selector has the highest specificity weight?',
      options: [
        'A class selector (e.g., .button-primary)',
        'An element selector (e.g., button)',
        'An ID selector (e.g., #submit-btn)',
        'A combinator selector (e.g., div button)'
      ],
      answer: 2,
      explanation: 'ID selectors possess a significantly higher specificity than class or element selectors, making them harder to override in stylesheets.'
    }
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
    test: {
      question: 'By default (content-box), if an element has a width of 100px, padding of 10px, and border of 2px, what is its total rendered width?',
      options: [
        '100px',
        '112px',
        '124px',
        '120px'
      ],
      answer: 2,
      explanation: 'Under `content-box`, total width = width + left/right padding + left/right border = 100 + 20 + 4 = 124px. Using `border-box` locks the total rendered width to the specified 100px.'
    }
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
    test: {
      question: 'What happens to margin-top and margin-bottom on an inline element (like <span>)?',
      options: [
        'They push elements away vertically normally.',
        'They are completely ignored by the layout engine.',
        'They cause the element to wrap to a new line.',
        'They automatically turn the element into block flow.'
      ],
      answer: 1,
      explanation: 'Inline elements do not respect top/bottom margins or height properties. To apply these styles, change the element\'s display to inline-block, flex, or block.'
    }
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
    test: {
      question: 'Which CSS properties are most performant to animate or transition in browsers?',
      options: [
        'width and height',
        'margin and padding',
        'transform and opacity',
        'top and left positioning'
      ],
      answer: 2,
      explanation: 'Transitions on transform and opacity do not trigger layout (reflow) or paint operations; the browser offloads them directly to the GPU for smooth 60fps renders.'
    }
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
    test: {
      question: 'Which assignment behavior correctly distinguishes const from let?',
      options: [
        'const is block-scoped, let is globally-scoped.',
        'const variables cannot have their reference reassigned; let variables can be reassigned.',
        'const variables are stored in heap memory, let is stored in stack memory.',
        'const is hoisted, let is never hoisted.'
      ],
      answer: 1,
      explanation: 'Reassigning a const variable throws a TypeError. Const locks the binding, though object values and array elements inside a const variable can still be modified.'
    }
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
    test: {
      question: 'What is a closure in JavaScript?',
      options: [
        'A function that runs immediately and destroys all local variables.',
        'A combination of a function bundled together with references to its surrounding lexical scope.',
        'A method used to close files and databases connections.',
        'An arrow function that has no access to parent scope.'
      ],
      answer: 1,
      explanation: 'A closure gives a function access to its outer scope variables even after the outer function has finished executing.'
    }
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
    test: {
      question: 'What is the outcome of the comparison: "" == false vs "" === false?',
      options: [
        'Both evaluate to true.',
        'Both evaluate to false.',
        '"" == false evaluates to true (due to coercion), but "" === false evaluates to false.',
        '"" == false evaluates to false, but "" === false evaluates to true.'
      ],
      answer: 2,
      explanation: 'Double equals (==) performs type coercion, casting empty string and false to equivalent values. Triple equals (===) compares both type and value, yielding false.'
    }
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
    test: {
      question: 'What is the utility of event.preventDefault() inside a form submit event listener?',
      options: [
        'It deletes all values typed inside input fields.',
        'It stops the event from bubbling up to parent nodes.',
        'It prevents the browser from reloading the page during submit.',
        'It closes the browser window automatically.'
      ],
      answer: 2,
      explanation: 'Form submissions naturally reload the browser page. Inside SPA applications, developers call event.preventDefault() to handle state updates using JavaScript instead.'
    }
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
    test: {
      question: 'Which of the following array methods returns a newly constructed array without mutating the original?',
      options: [
        'push()',
        'splice()',
        'map()',
        'reverse()'
      ],
      answer: 2,
      explanation: 'Methods like map(), filter(), and slice() create new arrays, whereas push(), splice(), and reverse() mutate the original array in place.'
    }
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
    test: {
      question: 'Why must React components start with a capital letter (e.g., MyComponent vs mycomponent)?',
      options: [
        'It is a pure aesthetic style choice that has no effect.',
        'React compiler parses lowercase names as standard HTML tags, and capitalized names as custom components.',
        'Capitalized components execute faster in React rendering.',
        'Lowercase names cannot receive parameters (props).'
      ],
      answer: 1,
      explanation: 'JSX compiles down. React treats lowercased elements as string arguments (e.g., "div") and capitalized elements as function references (e.g., MyComponent).'
    }
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
    test: {
      question: 'Which statement accurately describes the core difference between props and state?',
      options: [
        'State is immutable, whereas props can be modified at any time by child components.',
        'Props are read-only configuration parameters passed down from parents; state is internal, dynamic data managed by the component.',
        'Props trigger component mounts, whereas state triggers component compiling.',
        'State is shared globally, whereas props are local to a single file.'
      ],
      answer: 1,
      explanation: 'Props are external inputs that a component receives and cannot edit. State is local, mutable memory that the component owns and updates.'
    }
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
    test: {
      question: 'In React, what characterizes a "controlled" form input?',
      options: [
        'Its styling is managed by class selectors.',
        'Its value is bound to a React state variable, and modified via an onChange listener.',
        'It is validated directly by HTML5 attributes only.',
        'It can only be modified by clicking a submit button.'
      ],
      answer: 1,
      explanation: 'An input is controlled when React state serves as the "single source of truth" for the input\'s current value, updating it instantly as the user types.'
    }
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
    test: {
      question: 'Why does React require a unique "key" prop when rendering arrays of components?',
      options: [
        'To style them with unique border parameters.',
        'To help React identify which items changed, were added, or were removed, optimizing DOM update performance.',
        'To bind event listeners to each element automatically.',
        'To compile the list into CSS columns.'
      ],
      answer: 1,
      explanation: 'Keys provide stable identities. They allow React\'s diff algorithm to match elements across renders and prevent UI state bugs in lists.'
    }
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
    test: {
      question: 'What is a major consequence of Node.js having a single-threaded event loop?',
      options: [
        'It cannot handle asynchronous I/O tasks.',
        'Blocking the main thread with heavy synchronous calculations blocks all other concurrent requests.',
        'It forces developers to write multithreaded compilers.',
        'It prevents connection pools to databases.'
      ],
      answer: 1,
      explanation: 'Because Node.js executes JavaScript on a single thread, a slow CPU-bound loop will prevent the event loop from picking up other client network callbacks.'
    }
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
    test: {
      question: 'How do you define a dynamic route parameter in Express routing?',
      options: [
        'app.get("/users/{id}")',
        'app.get("/users/:id")',
        'app.get("/users?id=val")',
        'app.get("/users/id")'
      ],
      answer: 1,
      explanation: 'Colons prefix route parameters in Express (e.g., `/users/:id`). The matched values are accessible inside handlers at `req.params.id`.'
    }
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
    test: {
      question: 'What does it mean for an HTTP method (like GET) to be "idempotent"?',
      options: [
        'It changes server state differently every time it is called.',
        'Making multiple identical requests yields the same side effects and server state as making a single request.',
        'It requires auth tokens to execute.',
        'It deletes database tables automatically.'
      ],
      answer: 1,
      explanation: 'GET, PUT, and DELETE are idempotent. Calling GET once or ten times should leave the server in the exact same state (no records created/deleted by fetching).'
    }
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
    test: {
      question: 'What is the primary role of the next() function inside an Express middleware callback?',
      options: [
        'It kills the active server process.',
        'It triggers the next middleware or route handler in the execution chain.',
        'It compiles the response layout as JSON.',
        'It queries the MongoDB collections.'
      ],
      answer: 1,
      explanation: 'Middleware functions run in sequence. Calling next() hands off control to the subsequent handler in the pipeline.'
    }
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
    test: {
      question: 'Which status code class indicates a client-side syntax or validation error?',
      options: [
        '2xx (e.g., 200 OK)',
        '3xx (e.g., 301 Moved)',
        '4xx (e.g., 400 Bad Request)',
        '5xx (e.g., 500 Internal Error)'
      ],
      answer: 2,
      explanation: '4xx status codes signal client-side issues (invalid fields, bad auth, missing URL paths). 5xx codes signal server-side crashes.'
    }
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
    test: {
      question: 'What is a core benefit of the document NoSQL database model (like MongoDB) over SQL tabular layouts?',
      options: [
        'It enforces relationship structures strictly on hard drives.',
        'It stores data in flexible, nested BSON documents, allowing schemas to evolve without complex table migrations.',
        'It requires no network cards to communicate.',
        'It does not support index searches.'
      ],
      answer: 1,
      explanation: 'NoSQL document databases support hierarchical, flexible nesting of schemas without requiring predefined structures or schema alteration updates across millions of rows.'
    }
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
    test: {
      question: 'What is encoded inside the first 4 bytes of a MongoDB ObjectID?',
      options: [
        'The host machine ID.',
        'A timestamp representing the document\'s creation time.',
        'The name of the database collection.',
        'An encrypted password hash.'
      ],
      answer: 1,
      explanation: 'The first 4 bytes of a 12-byte ObjectID contain a Unix timestamp representing when the document was generated, which allows extracting creation dates directly from documents.'
    }
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
    test: {
      question: 'In Mongoose, what is the difference between a Schema and a Model?',
      options: [
        'Schemas query the DB, models establish networks.',
        'A Schema defines the structure and constraints of the documents; a Model compiles that schema into a queryable class interface linked to MongoDB.',
        'A Model is stored in JavaScript files, a Schema is stored in MongoDB.',
        'There is no difference; they are exact aliases.'
      ],
      answer: 1,
      explanation: 'A Schema outlines the design (fields, validators). A Model compiles that outline into a wrapper supporting database CRUD queries.'
    }
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
    test: {
      question: 'Which Mongoose option returns the newly updated document instead of the old pre-update document during a findByIdAndUpdate operation?',
      options: [
        '{ overwrite: true }',
        '{ new: true }',
        '{ updated: true }',
        '{ returnNewDocument: true }'
      ],
      answer: 1,
      explanation: 'By default, Mongoose returns the original document before modifications were made. Setting `{ new: true }` instructs it to return the updated record.'
    }
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
    test: {
      question: 'When modeling relationships in MongoDB, under what condition is "Embedding" (nesting documents) preferred over "Referencing" (linking IDs)?',
      options: [
        'When the nested items are queried independently from the parent.',
        'When the child items are bounded in size and accessed exclusively with their parent document.',
        'When the child documents are shared across many different collections.',
        'When database storage needs to be reduced.'
      ],
      answer: 1,
      explanation: 'Embedding minimizes read roundtrips by fetching related records inside a single query, which works well if the nested array scale is low and bounded.'
    }
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
    test: {
      question: 'Which of the following is true regarding block scoping in Python?',
      options: [
        'If statements and loops create new local variable scopes.',
        'Python relies exclusively on indentation blocks to define scope, allowing variables declared inside an "if" block to remain accessible outside it within the same function.',
        'Curly braces override indentations in Python.',
        'All variables are globally scoped by default.'
      ],
      answer: 1,
      explanation: 'Unlike some other languages, variables declared inside conditional or loop blocks (like "if" or "for") remain scoped to the surrounding function namespace.'
    }
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
    test: {
      question: 'Which of the following collections represents an immutable, ordered sequence in Python?',
      options: [
        'List',
        'Set',
        'Tuple',
        'Dictionary'
      ],
      answer: 2,
      explanation: 'Tuples are ordered and immutable. Once created, their items cannot be modified, appended, or deleted, making them ideal read-only data structures.'
    }
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
    test: {
      question: 'Why should you avoid using a mutable object (like an empty list `[]`) as a default parameter value in a Python function?',
      options: [
        'It throws a syntax error immediately.',
        'The default value is instantiated only once when the function is defined, making the default list state persistent and shared across separate calls.',
        'Mutable defaults prevent the function from returning a value.',
        'It locks variables in stack memory.'
      ],
      answer: 1,
      explanation: 'Default arguments are evaluated once at definition. If you modify a default list (e.g., appending values), those modifications persist and affect subsequent function calls.'
    }
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
    test: {
      question: 'What is the purpose of the "self" parameter inside Python instance methods?',
      options: [
        'It declares the method as static.',
        'It references the active instance object calling the method, allowing access to instance attributes.',
        'It imports the system memory variables.',
        'It acts as the class constructor wrapper.'
      ],
      answer: 1,
      explanation: '"self" is a naming convention representing the active class instance. It provides methods access to instance fields and other methods.'
    }
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
    test: {
      question: 'What is the primary benefit of opening a file using the "with" statement (context manager) in Python?',
      options: [
        'It speeds up read operations from hard drives.',
        'It encrypts file content automatically.',
        'It guarantees the file is closed correctly after the block finishes, even if exceptions occur.',
        'It opens the file in multiple write threads simultaneously.'
      ],
      answer: 2,
      explanation: 'The `with` statement utilizes context protocols. It automatically calls `close()` on the file stream resource when exiting the block, avoiding resource leaks.'
    }
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
    test: {
      question: 'Why are vectorized operations in NumPy faster than traditional Python loops?',
      options: [
        'NumPy uses multithreading for every addition.',
        'Vectorized calculations compile logic directly in highly optimized C loops on contiguous arrays, bypassing Python interpreter overhead.',
        'NumPy arrays use stack memory instead of heap.',
        'They automatically delete empty array rows.'
      ],
      answer: 1,
      explanation: 'Vectorization offloads loops to optimized C binaries, avoiding Python loop pointer resolution overhead and leveraging CPU cache-friendly contiguous data layouts.'
    }
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
    test: {
      question: 'Which Pandas index selector selects columns/rows using position-based integer indexes instead of labels?',
      options: [
        'df.loc',
        'df.iloc',
        'df.ix',
        'df.index'
      ],
      answer: 1,
      explanation: '`iloc` is strictly integer-position based (from 0 to length-1 of the axis), whereas `loc` targets index labels.'
    }
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
    test: {
      question: 'What is a major risk when replacing missing numerical data using simple mean imputation (e.g., fillna(df.mean()))?',
      options: [
        'It changes the data structure to a Series.',
        'It artificially reduces data variance and distorts relationships between features.',
        'It raises a SyntaxError during execution.',
        'It encrypts the remaining data columns.'
      ],
      answer: 1,
      explanation: 'Imputing missing values with averages concentrates values at the mean, artificially deflating overall standard deviation and altering core feature correlations.'
    }
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
    test: {
      question: 'What is the correct paradigm for filtering a DataFrame using a boolean condition?',
      options: [
        'df.filter(condition = True)',
        'df[condition_expression] (e.g., df[df["age"] > 21])',
        'df.split(condition)',
        'df.groupby(condition)'
      ],
      answer: 1,
      explanation: 'Pandas uses boolean indexing: passing a Series of boolean values (e.g., `df["age"] > 21`) inside square brackets filters rows matching the True evaluations.'
    }
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
    test: {
      question: 'Which merge type returns only the rows that have matching keys in both left and right DataFrames?',
      options: [
        'Left Join',
        'Outer Join',
        'Inner Join',
        'Right Join'
      ],
      answer: 2,
      explanation: 'An Inner Join returns rows where keys intersect across both DataFrames. Outer Joins preserve all keys, filling unmatched values with NaNs.'
    }
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
    test: {
      question: 'Why is a single-layer perceptron unable to solve the XOR logic classification task?',
      options: [
        'XOR requires fractional weights.',
        'XOR has non-linearly separable classes that cannot be segregated by a single straight decision boundary line.',
        'It has an odd count of output nodes.',
        'Step functions do not support negation.'
      ],
      answer: 1,
      explanation: 'A single perceptron forms a linear decision hyperplane. Since XOR states cannot be divided by a single straight boundary, multi-layer networks with non-linear activations are required.'
    }
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
    test: {
      question: 'Which of the following describes the ReLU activation function?',
      options: [
        'It maps all inputs to values between -1 and 1.',
        'It returns 0 for any input less than or equal to zero; otherwise it returns the input value directly.',
        'It normalizes a list of values to a probability distribution summing to 1.',
        'It returns the derivative of the input weight.'
      ],
      answer: 1,
      explanation: 'Rectified Linear Unit (ReLU) computes `f(x) = max(0, x)`. It introduces non-linearity and is highly computationally efficient.'
    }
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
    test: {
      question: 'What mathematical rule is the primary engine of the backpropagation algorithm?',
      options: [
        'The Quotient Rule of division.',
        'The Chain Rule of calculus (calculating nested derivatives).',
        'Bayes Theorem of conditional probability.',
        'The Pythagorean Theorem.'
      ],
      answer: 1,
      explanation: 'Backpropagation uses the calculus Chain Rule to calculate derivatives of loss with respect to weights layer-by-layer backwards through the network.'
    }
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
    test: {
      question: 'What occurs if the learning rate during gradient descent is configured too high?',
      options: [
        'The model stops learning entirely because gradients vanish.',
        'The optimization path steps right over the minimum error point, potentially diverging and increasing loss.',
        'It changes the model to a linear classifier.',
        'It forces weight vectors to become zero.'
      ],
      answer: 1,
      explanation: 'An excessive learning rate causes optimization to overshoot local minima, producing oscillations that can lead to diverging loss.'
    }
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
    test: {
      question: 'What is the role of hidden layers inside deep neural networks?',
      options: [
        'They directly interface with external CSV files.',
        'They learn feature hierarchies and represent complex, non-linear relationships in data.',
        'They save parameter variables to hard drives.',
        'They calculate evaluation metrics for test sets.'
      ],
      answer: 1,
      explanation: 'Hidden layers act as intermediate representational feature extractors, mapping inputs to non-linear spaces where the target output can be accurately separated.'
    }
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
    test: {
      question: 'Why did the Transformer architecture replace LSTM and recurrent neural networks (RNNs) as the standard for LLMs?',
      options: [
        'LSTMs require more parameters than Transformers.',
        'Transformers process tokens in parallel, enabling rapid training on massive GPU clusters compared to sequential RNN structures.',
        'Transformers do not require text tokenization.',
        'Attention mechanisms require no weight parameter updates.'
      ],
      answer: 1,
      explanation: 'By removing sequential dependency, Transformers allow entire sequences to be processed in parallel during training, facilitating scaling to web-sized training corpora.'
    }
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
    test: {
      question: 'What does a high cosine similarity between two token vectors in an embedding space indicate?',
      options: [
        'The tokens have the exact same count of characters.',
        'The tokens are synonyms or frequently share similar semantic contexts in the training data.',
        'The tokens are located in the same file position.',
        'The tokenizer uses the same character ID.'
      ],
      answer: 1,
      explanation: 'High cosine similarity indicates that the vectors point in nearly identical directions in the high-dimensional space, reflecting a shared semantic context.'
    }
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
    test: {
      question: 'What is the goal of reinforcement learning from human feedback (RLHF)?',
      options: [
        'To pre-train the transformer weights using Wikipedia.',
        'To align generated model responses with human preferences, safety standards, and instruction accuracy.',
        'To compile token indices into BSON format.',
        'To double the tokenizer vocabulary size.'
      ],
      answer: 1,
      explanation: 'RLHF uses human evaluation feedback to train a reward model, which optimizes model generation behavior towards safe and helpful responses.'
    }
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
    test: {
      question: 'How does Chain-of-Thought prompting improve a model\'s performance on logical and mathematical reasoning tasks?',
      options: [
        'It speeds up API response times by bypassing hidden layers.',
        'It instructs the model to generate intermediate reasoning steps before arriving at a final answer, improving search accuracy.',
        'It reduces the token usage significantly.',
        'It disables the self-attention layer to prevent hallucinations.'
      ],
      answer: 1,
      explanation: 'Generating step-by-step reasoning sequences aligns the decoder context with the intermediate logic path, helping the model avoid logical leaps and reach correct final answers.'
    }
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
    test: {
      question: 'In AI agent architectures, what is the purpose of providing a "Tool Schema"?',
      options: [
        'To display buttons on the frontend website.',
        'To define tool capabilities and parameters in JSON Schema so the model knows how to formulate tool calls.',
        'To compile python code into binary.',
        'To cache API responses on proxy servers.'
      ],
      answer: 1,
      explanation: 'Tool schemas describe arguments, types, and functionality to the model in standard formats, enabling it to determine when and how to call external tools.'
    }
  }
};
