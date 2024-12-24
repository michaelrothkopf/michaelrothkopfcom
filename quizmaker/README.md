# Michael Rothkopf's Quiz Maker

This simple tool allows users to make custom quizzes for studying.

The main page allows you to paste quiz data in Base64-encoded JSON. It then runs through the quiz's questions, showing each answer as correct or incorrect as you go and giving you a final score.

The quiz data is encrypted in Base64 so you don't accidentally look at the answers.

## Stack

The quiz maker is written entirely in HTML, CSS, and pure JS. There are no external dependencies.

The custom format, exemplified in [the prototype file](quiz.prototype.js), meets the specific needs of the quiz maker. I intentionally used a simple format to easily allow a Python or JS script to convert other quiz data files to work with my quiz maker.

## Editor

The editor provides a graphical interface to create quizzes. Its import functionality allows it to edit quizzes made before the editor was available and quizzes in long-term storage in a local file or even a document.

By default, the editor auto-saves the working quiz to localStorage to avoid accidentally deleting data when the tab is closed. Autosaving occurs after each operation.