const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

dotenv.config({ path: '../.env' });

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-scholar');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Module.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();
    console.log('Cleared existing content.');

    // Create Modules
    const moduleTypes = [
      { title: 'What is AI?', description: 'Introduction to Artificial Intelligence.', order: 1 },
      { title: 'Machine Learning Basics', description: 'How computers learn from data.', order: 2 },
      { title: 'Data & Algorithms', description: 'The fuel and engines of AI.', order: 3 },
      { title: 'AI Ethics', description: 'Bias, Privacy, and Responsible AI.', order: 4 },
      { title: 'Mini Projects', description: 'Hands-on project-based learning.', order: 5 }
    ];
    const createdModules = await Module.insertMany(moduleTypes);
    console.log('Modules seeded.');

    // Create Lessons
    const lessonsData = [
      {
        moduleId: createdModules[0]._id,
        title: 'Introduction to AI',
        order: 1,
        content: [
          { type: 'text', value: 'Artificial Intelligence (AI) is when computers can do things that usually require human intelligence.' },
          { type: 'example', value: 'Like Siri answering your questions, or YouTube recommending videos you like!' }
        ]
      },
      {
        moduleId: createdModules[1]._id,
        title: 'How do machines learn?',
        order: 1,
        content: [
          { type: 'text', value: 'Machine Learning is a type of AI. Instead of giving the computer exact rules, we give it lots of examples (data), and it figures out the rules itself.' },
          { type: 'image', value: 'https://cdn-icons-png.flaticon.com/512/2103/2103423.png' } // Placeholder illustration
        ]
      },
      {
        moduleId: createdModules[3]._id, // AI Ethics
        title: 'Bias in AI',
        order: 1,
        content: [
          { type: 'text', value: 'Sometimes, AI can make unfair decisions. This happens because the data used to train the AI has human biases.' },
          { type: 'example', value: 'If an AI is trained only on pictures of cats, it might not recognize a dog!' }
        ]
      },
      {
        moduleId: createdModules[4]._id, // Mini Projects
        title: 'Project: Try Image Recognition',
        order: 1,
        content: [
          { type: 'text', value: 'In this project, you will upload a picture to our AI, and it will tell you what objects it sees!' },
          { type: 'project', value: 'vision_demo' }
        ]
      }
    ];

    const createdLessons = await Lesson.insertMany(lessonsData);
    console.log('Lessons seeded.');

    // Create Quizzes
    const quizzesData = [
      {
        lessonId: createdLessons[0]._id, // Intro to AI
        title: 'Intro to AI Quiz',
        difficulty: 'easy',
        questions: [
          {
            questionText: 'What does AI stand for?',
            options: ['Apple Intelligence', 'Artificial Intelligence', 'Automated Internet'],
            correctOptionIndex: 1,
            explanation: 'AI stands for Artificial Intelligence!'
          }
        ]
      },
      {
        lessonId: createdLessons[2]._id, // AI Ethics - Bias
        title: 'AI Ethics Quiz: Bias',
        difficulty: 'medium',
        questions: [
          {
            questionText: 'Why might an AI make unfair decisions?',
            options: ['Because it is evil', 'Because computers are bad', 'Because the data it learned from was biased'],
            correctOptionIndex: 2,
            explanation: 'AI learns from data. If the data has biases, the AI will copy them.'
          }
        ]
      }
    ];

    await Quiz.insertMany(quizzesData);
    console.log('Quizzes seeded.');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error with seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
