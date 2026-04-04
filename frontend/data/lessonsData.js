export const lessonsData = [
  {
    id: "module-1",
    title: "AI Basics",
    level: "beginner",
    steps: [
      {
        type: "explanation",
        content: "Artificial Intelligence (AI) is when computers are programmed to mimic human intelligence, enabling them to solve problems, recognize patterns, and make decisions."
      },
      {
        type: "analogy",
        content: "Think of a calculator versus a chess program. A calculator only follows exact mathematical rules you give it. An AI chess program learns from millions of past games to make strategy decisions on its own!"
      },
      {
        type: "interaction",
        question: "Can you name one AI feature you use daily on your phone? (Take a guess!)"
      },
      {
        type: "quiz",
        question: "Which of these best describes Artificial Intelligence?",
        options: ["A robot that only follows strict literal commands", "A computer recognizing patterns to make decisions", "A website showing static HTML text"],
        answer: "A computer recognizing patterns to make decisions"
      }
    ]
  },
  {
    id: "module-2",
    title: "Machine Learning",
    level: "beginner",
    steps: [
      {
        type: "explanation",
        content: "Machine Learning is a subset of AI. It is a way for computers to learn from data instead of being directly programmed with explicit rules."
      },
      {
        type: "analogy",
        content: "It’s like how you learn to recognize animals by seeing many examples! If you see 100 pictures of cats, you eventually figure out what makes a cat a cat, without someone giving you a literal mathematical formula for it."
      },
      {
        type: "interaction",
        question: "Can you think of a real-world task where learning from examples is better than strict rules?"
      },
      {
        type: "quiz",
        question: "Machine Learning is generally defined as:",
        options: ["A video game", "A way computers learn from data", "A mobile phone application"],
        answer: "A way computers learn from data"
      }
    ]
  },
  {
    id: "module-3",
    title: "Neural Networks",
    level: "intermediate",
    steps: [
      {
        type: "explanation",
        content: "Neural Networks are a type of Machine Learning inspired by the human brain. They use layers of artificial 'neurons' to process complex information like images or audio."
      },
      {
        type: "analogy",
        content: "Imagine a team of detectives solving a crime. Detective 1 looks at fingerprints. Detective 2 checks alibis. Detective 3 looks at the motive. The Chief (the final output layer) takes everyone's partial evidence and makes the final conclusion!"
      },
      {
        type: "explanation",
        content: "Data passes through an Input Layer, then hidden 'Hidden Layers' that extract features, and finally reaches an Output Layer that delivers the classification!"
      },
      {
        type: "interaction",
        question: "If a Neural Network was trying to identify a car in a photo, what 'features' might the early hidden layers look for?"
      },
      {
        type: "quiz",
        question: "What are Neural Networks inspired by?",
        options: ["The human brain's network of neurons", "The structure of the internet", "The solar system's orbital mechanics"],
        answer: "The human brain's network of neurons"
      }
    ]
  }
];
