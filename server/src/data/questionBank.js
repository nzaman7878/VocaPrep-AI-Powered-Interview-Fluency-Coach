export const questionBank = {
  roles: {
    'Frontend Developer': {
      technical: [
        'Explain the virtual DOM in React and how it improves performance.',
        'How does state management work in a React application? Compare Context API and Redux.',
        'Can you explain the event loop in JavaScript and how it handles asynchronous operations?',
        'Describe the CSS box model and the difference between block and inline elements.',
        'How do you optimize a React application for better performance?',
      ],
      behavioral: [
        'Tell me about a time you had to learn a new front-end framework or library quickly.',
        'Describe a situation where you disagreed with a designer about a UI component. How did you handle it?',
      ],
      situational: [
        'You are tasked with building a complex dashboard, but the API endpoints are not ready yet. How do you proceed?',
        'A critical bug is reported in production on a feature you just deployed. What is your immediate course of action?',
      ],
    },
    'Backend Developer': {
      technical: [
        'Explain how Node.js handles concurrency despite being single-threaded.',
        'What are the main differences between SQL and NoSQL databases? When would you choose MongoDB over a SQL database?',
        'How do you secure a RESTful API? Discuss authentication and authorization strategies.',
        'Explain the concept of middleware in Express.js. Give examples of when you would use it.',
        'How would you approach designing a scalable microservices architecture?',
      ],
      behavioral: [
        'Tell me about a time you had to optimize a slow-performing database query or API endpoint.',
        'Describe a situation where you had to push back on a product requirement because of technical constraints.',
      ],
      situational: [
        'Your service is experiencing a sudden spike in traffic and latency is increasing. How do you troubleshoot and mitigate the issue?',
        'You need to integrate a third-party API that has poor documentation and frequent downtime. How do you handle this integration?',
      ],
    },
    'Full Stack Developer': {
      technical: [
        'Describe the complete request-response cycle from the browser to the database in a MERN stack application.',
        'How do you handle state across the frontend and backend to ensure data consistency?',
        'Explain the concept of JWTs and how they are used for user authentication in a web application.',
        'What are WebSockets, and how do they differ from HTTP polling?',
        'Discuss your approach to writing unit and integration tests for a full-stack application.',
      ],
      behavioral: [
        'Tell me about a full-stack feature you built from scratch. What were the most challenging parts of the implementation?',
        'Describe a time when you had to balance frontend user experience requirements with backend performance constraints.',
      ],
      situational: [
        'You are leading a project where the frontend and backend teams are blocked by each other. How do you resolve this?',
        'A user reports that data they submitted is not showing up on the page. How do you trace the issue across the entire stack?',
      ],
    },
  },
  general: {
    behavioral: [
      'Tell me about a time you faced a significant technical challenge at work and how you overcame it.',
      'Describe a situation where you showed leadership on a project, even if you did not have a formal leadership title.',
      'Tell me about a time you failed or made a mistake. What did you learn from it?',
      'Describe a time when you had to work with a difficult colleague. How did you manage the relationship to achieve your goals?',
    ],
    situational: [
      'You are falling behind on a critical project deadline due to unforeseen blockers. How do you communicate this and get back on track?',
      'Your team is divided on which technology stack to use for a new project. How do you help reach a consensus?',
      'You are assigned a complex task with very vague requirements. What steps do you take to clarify them before starting development?',
    ],
  },
};
