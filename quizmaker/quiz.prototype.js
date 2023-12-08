const quizData = {
  title: 'MacBain Unit 4 Test',
  subject: 'AP World History: Modern',
  settings: {
    randomizeQuestionOrder: false,
  },
  questions: [
    {
      type: 'MultipleChoice',
      prompt: 'Which of the following is typically blue?',
      answer: 'Blueberry',
      distractors: [
        'Watermelon',
        'Apple',
        'Strawberry'
      ]
    },
    {
      type: 'TrueFalse',
      prompt: 'Dogs run faster than cheetas.', // Will appear as "True or False: Dogs run faster than cheetahs."
      answer: true,
    }
  ],
};