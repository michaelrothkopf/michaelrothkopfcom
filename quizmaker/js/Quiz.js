export default class Quiz {
  constructor(data=null) {
    // Create the blank quiz attributes
    this.title = '';
    this.subject = '';
    this.settings = {
      randomizeQuestionOrder: false,
    };
    this.questions = [];

    // If there is data to load
    if (data !== null) {
      return this.load(data);
    }
  }

  /**
   * Adds a multiple choice question to the questions list
   * @param {string} prompt The question's prompt
   * @param {string} answer The correct option
   * @param {Array} distractors An array of other options presented alongside the answer
   */
  addMultipleChoiceQuestion(prompt, answer, distractors) {
    this.questions.push({
      type: 'MultipleChoice',
      prompt: prompt,
      answer: answer,
      distractors: distractors,
    });
  }

  /**
   * Adds a true/false question to the questions list
   * @param {string} prompt The statement the solver must assert the truth of
   * @param {boolean} answer Whether the statement is true
   */
  addTrueFalseQuestion(prompt, answer) {
    this.questions.push({
      type: 'TrueFalse',
      prompt: `True or False: ${prompt}`,
      answer: answer,
    });
  }

  /**
   * Gets the next question in a quiz based on its settings
   * @returns The next question
   */
  getNextQuestion() {
    // If there is not already an available questions list
    if (!this.availableQuestions) {
      this.availableQuestions = this.questions;
    }

    // If there are no more available questions
    if (this.availableQuestions.length <= 0) {
      // Return null
      return null;
    }

    // If the quiz is in random order
    if (this.settings.randomizeQuestionOrder) {
      // Return a random element
      return this.availableQuestions.splice(Math.floor(Math.random() * this.availableQuestions.length), 1)[0];
    }

    // Return the first element
    return this.availableQuestions.splice(0, 1)[0];
  }
  
  /**
   * Populates the Quiz class with serialized data
   * @param {any} data The quiz data to load into the class
   * @returns Once completed or upon error
   */
  load(data) {
    let quizData;
    // If the data is a string
    if (typeof data === 'string') {
      try {
        // Parse it directly as JSON
        quizData = JSON.parse(data);
      } catch (e0) {
        // If that fails, try to load it via Base64
        try {
          quizData = JSON.parse(atob(data));
        } catch (e) {
          // If that fails, print an error and abort
          console.error(`[Quiz][E101] Error loading quiz data; string data invalid (${e})`);
          return;
        }
      }
    }
    // Otherwise, the data is an object
    else {
      quizData = data;
    }

    try {
      // Extract the basic attributes from the quiz data
      this.title = quizData.title;
      this.subject = quizData.subject;
      this.settings = quizData.settings;
      this.questions = quizData.questions;
    } catch (e) {
      // Print an error and abort
      console.error(`[Quiz][E102] Error loading quiz data; quiz data invalid (${e})`);
      return;
    }
  }
}