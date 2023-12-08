// The container for the whole quiz
const quiz = document.getElementById('quiz');

// The container for the quiz data box
const quizDataBoxContainer = document.getElementById('quiz-data-box-container');

// The quiz data box
const quizDataBox = document.getElementById('quiz-data-box');

// The quiz start button
const quizBegin = document.getElementById('quiz-begin');

// The current quiz question container
const quizQuestionContainer = document.getElementById('quiz-question-container');

// The current quiz question
const quizQuestion = document.getElementById('quiz-question');

// The quiz advance button
const quizAdvance = document.getElementById('quiz-advance');
quizAdvance.style.display = 'none';

let nCorrect = 0;

// When the quiz starts
quizBegin.addEventListener('click', (e) => {
  quizAdvance.style.display = 'inline-block';

  let quizData;
  console.log('Loading quiz data');

  try {
    // Parse the quiz data into an object
    quizData = JSON.parse(atob(quizDataBox.value.trim()));
  } catch (e) {
    // Print the error to the console
    console.log(e);

    // Alert the user
    alert('Invalid quiz data. Check to make sure you copy and pasted the correct information into the box.');

    return;
  }

  // Prevent an error with a blank quiz
  if (!quizData.questions || quizData.questions.length < 1) {
    alert('Your quiz has no questions!');
    return;
  }

  // The index of the current question
  let idx = -1;

  // Handle advancing to the next question
  const onAdvanceQuestion = (e=null) => {
    // Change the text on the advance button to "check" instead of "next"
    quizAdvance.innerText = 'Check';

    // Remove the event listener from the advance button
    quizAdvance.removeEventListener('click', onAdvanceQuestion);

    // If there are more questions
    if (idx + 1 < quizData.questions.length) {
      // Increase the index and populate the question
      idx++;

      // Delete any existing data
      quizQuestion.innerHTML = '';
      console.log('QD:', quizData.questions, idx);

      // Populate the quizQuestion div with the question
      switch(quizData.questions[idx].type) {
        case 'MultipleChoice':
          populateMultipleChoice(quizData.questions[idx]);
          break;
      }
    }
    // Otherwise, alert the user's score
    else {
      alert(`You got ${nCorrect} correct out of ${quizData.questions.length} questions (${nCorrect / quizData.questions.length * 100}%). Great job!`);
    }
  }

  // Create a multiple choice question
  const populateMultipleChoice = (question) => {
    // Add the prompt message
    const prompt = document.createElement('h3');
    prompt.innerText = `(${idx + 1}) ${question.prompt}`;
    quizQuestion.appendChild(prompt);

    // Reformat the options to randomize answer order
    let options = question.distractors;

    // Insert the correct answer at a random point
    options.splice(Math.floor(Math.random() * (options.length + 1)), 0, question.answer);

    // For each option, add a radio button
    for (const option of options) {
      // Create a container for the radio button
      const radioContainer = document.createElement('div');
      radioContainer.classList.add('quiz-radio-container');

      // Create the form field
      const inputField = document.createElement('input');
      inputField.type = 'radio';
      inputField.name = 'quiz-mc-question';
      inputField.id = 'quiz-mc-option-' + btoa(option);
      inputField.value = option;

      // Create the text label
      const inputLabel = document.createElement('label');
      inputLabel.htmlFor = 'quiz-mc-option-' + btoa(option);
      inputLabel.id = 'quiz-mc-option-label-' + btoa(option);
      inputLabel.innerText = `${option}`;
      
      // Populate the children
      radioContainer.appendChild(inputField);
      radioContainer.appendChild(inputLabel);
      quizQuestion.appendChild(radioContainer);
    }

    const onCheckMCAnswer = (e) => {
      // For each option
      for (const option of options) {
        // If the option is correct
        if (option == question.answer) {
          // Set the color to green
          document.getElementById('quiz-mc-option-label-' + btoa(option)).style.color = 'green';
          console.log("*" + option, 'quiz-mc-option-label-' + btoa(option))
          
          // If the answer is selected
          if (document.getElementById('quiz-mc-option-' + btoa(option)).checked) {
            // Increment correct answers
            nCorrect++;
          }
        }

        // If it is the selected option (but false)
        else if (document.getElementById('quiz-mc-option-' + btoa(option)).checked) {
          document.getElementById('quiz-mc-option-label-' + btoa(option)).style.color = 'red';
        }
      }

      // Remove the listener from the button
      quizAdvance.removeEventListener('click', onCheckMCAnswer);

      // Change the advance button label to "next" instead of "check"
      quizAdvance.innerText = 'Next';

      // Add the advance listener to the button
      quizAdvance.addEventListener('click', onAdvanceQuestion);
    }

    quizAdvance.addEventListener('click', onCheckMCAnswer);
  }

  // Start with the first question
  onAdvanceQuestion();
});