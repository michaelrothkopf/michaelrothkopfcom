import Quiz from './Quiz.js';

// The whole quiz runtine container
const quizContainer = document.getElementById('quiz');

// The quiz instructions container
const quizInstructionsContainer = document.getElementById('quiz-instructions-container');

// The continue button on the instructions screen
const quizInstructionsContinue = document.getElementById('quiz-instructions-continue');

// The data box input screen
const quizDataBoxContainer = document.getElementById('quiz-data-box-container');

// The data box text area
const quizDataBox = document.getElementById('quiz-data-box');

// The start quiz button
const quizStart = document.getElementById('quiz-start');

// The quiz question sscreen
const quizQuestionContainer = document.getElementById('quiz-question-container');

// The quiz question prompt
const quizQuestionPrompt = document.getElementById('quiz-question-prompt');

// The quiz question input container
const quizQuestionInputContainer = document.getElementById('quiz-question-input-container');

// The quiz question advance button
const quizQuestionAdvance = document.getElementById('quiz-question-advance');

// The quiz results container
const quizResultsContainer = document.getElementById('quiz-results-container');

// The quiz results title
const quizResultsTitle = document.getElementById('quiz-results-title');

// The quiz results description
const quizResultsDescription = document.getElementById('quiz-results-description');

// When the user continues past the instructions screen
quizInstructionsContinue.addEventListener('click', (e) => {
  // Hide the instructions
  quizInstructionsContainer.classList.add('quiz-hidden');

  // Unhide the data box input screen
  quizDataBoxContainer.classList.remove('quiz-hidden');

  // When the user pastes data into the quiz data box
  quizStart.addEventListener('click', (e) => {
    // Create a new quiz using the data in the box
    let quiz;

    let questionsCorrect = 0;
    let questionsAnswered = 0;

    try {
      quiz = new Quiz(quizDataBox.value);
    } catch (e) {
      alert(`Error loading quiz ${e}.`);
      return;
    }

    // Hide the data box input screen
    quizDataBoxContainer.classList.add('quiz-hidden');

    // Unhide the quiz question screen
    quizQuestionContainer.classList.remove('quiz-hidden');

    // Advance to the next quiz question
    const onAdvanceQuestion = (e=null) => {
      // Change the text on the advance button to "check" instead of "next"
      quizQuestionAdvance.innerText = 'Check';

      // Remove the event listener from the advance button
      quizQuestionAdvance.removeEventListener('click', onAdvanceQuestion);

      // Get the next question from the quiz object
      let next = quiz.getNextQuestion();
      questionsAnswered++;

      // If there are no more questions
      if (next === null) {
        // Hide the quiz question screen
        quizQuestionContainer.classList.add('quiz-hidden');

        // Unhide the quiz results screen
        quizResultsContainer.classList.remove('quiz-hidden');

        // Display the results of the quiz in the paragraph
        quizResultsDescription.innerText = `You have completed the quiz. You scored ${questionsCorrect} out of ${questionsAnswered} questions, or ${Math.round(questionsCorrect / questionsAnswered * 100)}%.`
      }

      // Remove any data currently in the quizQuestionInputContainer div
      quizQuestionInputContainer.innerHTML = '';

      // Populate the quizQuestion div with the appropriate question type
      switch(next.type) {
        case 'MultipleChoice':
          populateMultipleChoice(next);
          break;
        case 'TrueFalse':
          populateMultipleChoice({
            prompt: `True or False: ${next.prompt}`,
            answer: next.answer === true ? 'True' : 'False',
            distractors: [next.answer === true ? 'False' : 'True'],
          });
          break;
      }
    }

    // Populate a multiple choice question
    const populateMultipleChoice = (question) => {
      // Set the question prompt
      quizQuestionPrompt.innerText = question.prompt;

      // Reformat all options into one list
      let options = question.distractors;
      options.push(question.answer);

      // Another copy of the options for checking the answer
      let checkOptions = [];

      // While there are more options to populate
      while (options.length > 0) {
        // Pick a random option
        let opt = options.splice(Math.floor(Math.random() * options.length), 1)[0];
        checkOptions.push(opt);

        // Create a container for the radio button
        const radioContainer = document.createElement('div');
        radioContainer.classList.add('quiz-radio-container');
        radioContainer.id = 'quiz-radio-container-' + btoa(opt);

        // Create the radio field
        const inputField = document.createElement('input');
        inputField.type = 'radio';
        inputField.name = 'quiz-mc-question';
        inputField.id = 'quiz-mc-option-' + btoa(opt);
        inputField.value = opt;
        inputField.classList.add('quiz-radio-option', 'quiz-hidden');

        // Create the text label
        const inputLabel = document.createElement('label');
        inputLabel.htmlFor = 'quiz-mc-option-' + btoa(opt);
        inputLabel.id = 'quiz-mc-option-label-' + btoa(opt);
        inputLabel.innerText = opt;

        // Populate the children
        radioContainer.appendChild(inputField);
        radioContainer.appendChild(inputLabel);
        quizQuestionInputContainer.appendChild(radioContainer);
      }

      // When the check button is pressed
      const onCheckAnswer = (e) => {
        // For each option
        for (const opt of checkOptions) {
          // If the option is correct
          if (opt == question.answer) {
            // Mark the answer as correct
            document.getElementById('quiz-radio-container-' + btoa(opt)).classList.add('quiz-radio-container--correct');
            
            // If the element is selected
            if (document.getElementById('quiz-mc-option-' + btoa(opt)).checked) {
              // Increment the number of correct answers
              questionsCorrect++;
            }
          }

          // If it is selected but false
          else if (document.getElementById('quiz-mc-option-' + btoa(opt)).checked) {
            // Mark the answer as incorrect
            document.getElementById('quiz-radio-container-' + btoa(opt)).classList.add('quiz-radio-container--incorrect');
          }
        }

        // Remove the listener from the button
        quizQuestionAdvance.removeEventListener('click', onCheckAnswer);

        // Change the advance button label to "next" instead of "check"
        quizQuestionAdvance.innerText = 'Next';

        // Add the advance listener to the button
        quizQuestionAdvance.addEventListener('click', onAdvanceQuestion);
      }

      quizQuestionAdvance.addEventListener('click', onCheckAnswer);
    }

    onAdvanceQuestion();
  });
});