import Quiz from './Quiz.js';

// // Create listeners for all the checkboxes
// const initializeCheckboxes = () => {
//   // Handle clicks for the checkboxes
//   const onCheckboxClick = (e) => {
//     // Toggle whether the checkbox is checked
//     if (e.target.dataset.checked === 'yes') {
//       e.target.dataset.checked = 'no';
//     }
//     else {
//       e.target.dataset.checked = 'yes';
//     }
//   }

//   // For every checkbox with the class .editor-checkbox
//   for (const checkbox of document.getElementsByClassName('editor-checkbox')) {
//     // Add the event listener
//     checkbox.addEventListener('click', onCheckboxClick);
//   }
// }

// initializeCheckboxes();

// The whole editor
const editor = document.getElementById('editor');
const quizEditorContainer = document.getElementById('quiz-editor-container');

// The navigation elements
const questionSelectorContainer = document.getElementById('question-selector-container');
const questionSelectorQuestions = document.getElementById('question-selector-questions');
const quizSettingsNavButton = document.getElementById('quiz-settings-nav');
const newQuestionButton = document.getElementById('new-question-button');
const newQuestionMultipleChoiceButton = document.getElementById('new-question-multiple-choice');

// The quiz settings screen
const quizSettingsContainer = document.getElementById('quiz-settings-container');
const quizNameInput = document.getElementById('quiz-name');
const quizSettingsRandomizeQuestions = document.getElementById('quiz-settings-randomize-questions');
const copyQuizDataButton = document.getElementById('copy-quiz-data');
const importQuizButton = document.getElementById('import-quiz');
const helpInformationToggle = document.getElementById('help-information-toggle');
const helpInformation = document.getElementById('help-information');

// The question editor screen
const questionEditorContainer = document.getElementById('question-editor-container');
const quizQuestionPrompt = document.getElementById('quiz-question-prompt');
// const questionTypeMultipleChoice = document.getElementById('question-type-multiple-choice');
// // const questionTypeTrueFalse = document.getElementById('question-type-true-false');
const quizQuestionAnswer = document.getElementById('quiz-question-answer');
const questionOptionsTable = document.getElementById('question-options-table');
const addDistractorButton = document.getElementById('add-distractor-button');

// Initialize the global editor state
const editorState = {
  quiz: new Quiz(),
  currentScreen: 'quiz-settings',
  currentQuestion: -1,
  exported: false,
};

// Try to load the editor state from autosaved data
try {
  editorState.quiz = new Quiz(localStorage.getItem('editor-autosave'));
} catch (e) {
  editorState.quiz = new Quiz();
}

// Sets the quiz to a different quiz
const setQuiz = (quizData) => {
  editorState.quiz = new Quiz(quizData);
  editorState.currentScreen = 'quiz-settings';
  editorState.currentQuestion = -1;
  editorState.exported = false;

  updateScreen();
  autosave();
}

// Handles importing a quiz
const importQuiz = (e) => {
  let data = prompt('Paste the quiz data into the box below...');
  try {
    setQuiz(data);
  } catch (e) {
    console.log(e);
    alert('There was an error with the quiz data you provided. It may be invalid.');
  }
}

// Saves the current editor state to localstorage
const autosave = () => {
  localStorage.setItem('editor-autosave', editorState.quiz.toString());
  editorState.exported = false;
}

// Copies the quiz data to clipboard
const copyQuizData = () => {
  navigator.clipboard.writeText(editorState.quiz.toString());
  editorState.exported = true;
}

// Sets the current screen and calls update
const setCurrentScreen = (newScreen) => {
  editorState.currentScreen = newScreen;
  updateScreen();
}

// Selects the settings screen
const navigateSettings = () => {
  editorState.currentQuestion = -1;

  quizNameInput.value = editorState.quiz.title;
  quizSettingsRandomizeQuestions.checked = editorState.quiz.settings.randomizeQuestionOrder;

  setCurrentScreen('quiz-settings');
}

// Selects the question with the index questionIndex
const navigateQuestion = (questionIndex) => {
  editorState.currentQuestion = parseInt(questionIndex);

  // Update the question fields
  const q = editorState.quiz.questions[editorState.currentQuestion];
  quizQuestionPrompt.value = q.prompt;

  // If the question is a multiple choice question
  if (q.type === 'MultipleChoice') {
    // Set the multiple choice answer box value to the question's current answer
    quizQuestionAnswer.value = q.answer;

    updateDistractors();

    // Show the table
    questionOptionsTable.classList.remove('editor-hidden');
  }
  // Otherwise, hide the table
  else {
    questionOptionsTable.classList.add('editor-hidden');
  }

  setCurrentScreen(`question-editor`);
}

// Draws the distractors to the screen, clearing the previous data
const updateDistractors = () => {
  const q = editorState.quiz.questions[editorState.currentQuestion];

  while (questionOptionsTable.childElementCount > 1) {
    questionOptionsTable.deleteRow(1);
  }

  // Populate the distractors
  for (const distractor of q.distractors) {
    const tr = document.createElement('tr');

    addDistractorRow(tr, distractor);
    
    questionOptionsTable.appendChild(tr);
  }
}

// Creates a distractor row
const addDistractorRow = (tr, distractor) => {
  // Create the checkbox
  // const checkboxTd = document.createElement('td');
  // const checkbox = document.createElement('button');
  // checkbox.setAttribute('data-checked', 'no');
  // checkboxTd.appendChild(checkbox);

  // Create the distractor input
  const inputTd = document.createElement('td');
  const inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.value = distractor;
  inputBox.addEventListener('change', (e) => {
    writeDistractors();

    autosave();
  });
  // input.name = `question-option-text-${crypto.randomUUID}`;
  inputTd.appendChild(inputBox);

  // Create the delete button input
  const deleteTd = document.createElement('td');
  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'X';
  deleteBtn.addEventListener('click', (e) => {
    e.target.parentElement.parentElement.remove();
    writeDistractors();
    updateDistractors();

    autosave();
  });
  deleteTd.appendChild(deleteBtn);

  // Append all children to the row
  tr.appendChild(inputTd);
  tr.appendChild(deleteTd);
}

const writeDistractors = () => {
  // Reset the distractors
  editorState.quiz.questions[editorState.currentQuestion].distractors = [];

  // For every child row of the table
  for (let i = 0; i < questionOptionsTable.children.length; i++) {
    // Ignore the first row
    if (i === 0) continue;

    // Add the distractor text to the list
    editorState.quiz.questions[editorState.currentQuestion].distractors.push(questionOptionsTable.children[i].children[0].children[0].value);
  }
}

// Refreshes the list of questions on the left-hand panel
const updateQuestionList = () => {
  // Clear the current question list
  while (questionSelectorQuestions.firstChild) {
    questionSelectorQuestions.removeChild(questionSelectorQuestions.lastChild);
  }

  // If the active list option is the settings box
  if (editorState.currentQuestion === -1) {
    quizSettingsNavButton.classList.add('question-navigation-button--selected');
  } else {
    quizSettingsNavButton.classList.remove('question-navigation-button--selected');
  }

  // For each question in the quiz
  let i = 0;
  for (const question of editorState.quiz.questions) {
    // Create a new button with the correct identifiers
    const qqButton = document.createElement('button');
    qqButton.classList.add('question-navigation-button');
    qqButton.setAttribute('id', `quiz-question-${i}`);
    qqButton.setAttribute('data-question-index', i);
    if (question.prompt.length > 18) {
      qqButton.innerText = `[${i + 1}] ${question.prompt.substring(0,15)}...`;
    }
    else {
      qqButton.innerText = `[${i + 1}] ${question.prompt}`;
    }

    // If the active list option is the question being rendered
    if (editorState.currentQuestion === i) {
      qqButton.classList.add('question-navigation-button--selected');
    }

    qqButton.onclick = (e) => {
      navigateQuestion(e.target.getAttribute('data-question-index'));
    };

    // Add the child to the list
    questionSelectorQuestions.appendChild(qqButton);
    i++;
  }

  // Done
  return;
}

// Updates the DOM to match the current screen
const updateScreen = () => {
  // Update the question list
  updateQuestionList();

  // If the screen is the quiz settings screen
  if (editorState.currentScreen === 'quiz-settings') {
    // Hide other screens
    questionEditorContainer.classList.add('editor-hidden');

    // Unhide the quiz settings screen
    quizSettingsContainer.classList.remove('editor-hidden');
  }
  // If the screen is the question editor screen
  else if (editorState.currentScreen === 'question-editor') {
    // Hide other screens
    quizSettingsContainer.classList.add('editor-hidden');

    // Unhide the question editor screen
    questionEditorContainer.classList.remove('editor-hidden');
  }
}

// Editor event handlers
window.addEventListener('beforeunload', (e) => {
  if (editorState.exported) {
    return undefined;
  }
  return 'It appears you have not exported the latest version of your quiz. If you leave the page, your work may be lost.';
});

// Settings event handlers
quizSettingsNavButton.addEventListener('click', navigateSettings);
copyQuizDataButton.addEventListener('click', copyQuizData);
importQuizButton.addEventListener('click', importQuiz);
quizNameInput.addEventListener('change', (e) => {
  editorState.quiz.title = e.target.value;

  autosave();
});
quizSettingsRandomizeQuestions.addEventListener('change', (e) => {
  editorState.quiz.settings.randomizeQuestionOrder = e.target.checked;

  autosave();
});
helpInformationToggle.addEventListener('click', (e) => {
  helpInformation.classList.toggle('editor-hidden');
});

// Question editor event handlers
addDistractorButton.addEventListener('click', (e) => {
  const tr = document.createElement('tr');
  addDistractorRow(tr, 'New Option');
  questionOptionsTable.appendChild(tr);

  autosave();
});
quizQuestionPrompt.addEventListener('change', (e) => {
  editorState.quiz.questions[editorState.currentQuestion].prompt = e.target.value;
  updateQuestionList();

  autosave();
});
quizQuestionAnswer.addEventListener('change', (e) => {
  editorState.quiz.questions[editorState.currentQuestion].answer = e.target.value;

  autosave();
});
newQuestionMultipleChoiceButton.addEventListener('click', (e) => {
  editorState.quiz.addMultipleChoiceQuestion('', '', []);
  navigateQuestion(editorState.quiz.questions.length - 1);

  autosave();
});

navigateSettings();