/**
 * Evaluates the Collatz conjecture starting at a number n until it reaches 1
 * @param {number} n The starting value
 * @returns Array of all values hit by the conjecture
 */
const collatz = (n) => {
  // Store the resulting array
  const res = [n];

  // While the conjecture has not reached one, store the current "n" as "x"
  for (let x = n; x !== 1; x = res[res.length - 1]) {
    // Perform the Collatz conjecture operations
    if (x % 2 === 0) res.push(x / 2);
    else res.push(3 * x + 1);
  }

  // Return the result
  return [...res, 1];
}

/**
 * Draws a set of bars to the screen
 */
const drawBars = (ctx, width, height, y, arr) => {
  const ONE_COLOR = '#ffd700';
  const ODD_COLOR = '#bbbbbb';
  const EVEN_COLOR = '#ffffff';

  for (let i = 0; i < arr.length; i++) {
    // Set the color
    if (i === arr.length - 1) ctx.fillStyle = ONE_COLOR;
    else if (i % 2 === 0) ctx.fillStyle = EVEN_COLOR;
    else ctx.fillStyle = ODD_COLOR;

    // Draw the bar
    ctx.fillRect(i * width, y, width, -1 * arr[i] * height);
  }
}

// Reference the canvas and the context
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
// Automatically adjust width and height of canvas to fit screen
if (window.innerWidth > 820) ctx.canvas.width = 800;
else ctx.canvas.width = window.innerWidth - 20;
const WIDTH = cvs.clientWidth;
ctx.canvas.height = 5/8 * WIDTH;
const HEIGHT = cvs.clientHeight;

// Get the speed
const speedSlider = document.getElementById('speed');
let speed = speedSlider.value;
speedSlider.addEventListener('change', (e) => {
  speed = speedSlider.value;
});
const MAX_DELAY = 300;

// Avoid double running
let running = false;

// Get the starting value
const startingValue = document.getElementById('startingValue');
let sv = startingValue.value;
// Reset the starting value when it changes
const setStartingValue = document.getElementById('setStartingValue');
setStartingValue.addEventListener('click', async (e) => {
  if (running) return;
  running = true;

  // Set the starting value
  sv = Math.floor(startingValue.value);
  
  // If the starting value is invalid
  if (isNaN(sv) || sv < 1 || sv > 100000) {
    return alert('You have entered an invalid number! The Collatz conjecture needs a natural number (integer greater than zero). Values above 100,000 are prohibited because they can cause performance issues.');
  }

  // Get the data
  const ccd = collatz(sv);

  // Compute the scale variables
  const barWidth = 1.0 * WIDTH / ccd.length;
  const unitHeight = 1.0 * HEIGHT / Math.max(...ccd);
  const delayTime = MAX_DELAY / speed;

  // Clear the canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw each bar in succession with a delay
  for (let i = 1; i < ccd.length; i++) {
    drawBars(ctx, barWidth, unitHeight, HEIGHT, ccd.slice(0, i));

    // Wait some time in ms before proceeding
    await new Promise(resolve => {
      setTimeout(() => { resolve() }, delayTime);
    });
  }

  running = false;
});