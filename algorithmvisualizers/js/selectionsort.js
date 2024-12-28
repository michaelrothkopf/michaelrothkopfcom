/**
 * Shuffles an array using Fisher-Yates
 */
const shuffle = (arr) => {
  let i = arr.length;
  while (i > 0) {
    // Pick a random element
    let rand = Math.floor(Math.random() * i);
    i--;
    // Swap the values
    const tmp = arr[i];
    arr[i] = arr[rand];
    arr[rand] = tmp;
  }
  // Return the array
  return arr;
}

/**
 * Draws a set of bars to the screen
 */
const drawBars = (ctx, width, height, y, arr, tgtidx, smlidx, chkidx) => {
  const VERIFY_ODD_COLOR = '#00bb00';
  const VERIFY_EVEN_COLOR = '#00cc00';

  const TARGET_COLOR = '#aa0000';
  const SMALL_COLOR = '#ffd700';
  const CHECK_COLOR = '#0000aa';

  const ODD_COLOR = '#bbbbbb';
  const EVEN_COLOR = '#ffffff';

  for (let i = 0; i < arr.length; i++) {
    // Set the color
    if (tgtidx === -1) {
      if (i % 2 === 0) ctx.fillStyle = VERIFY_EVEN_COLOR;
      else ctx.fillStyle = VERIFY_ODD_COLOR;
    }
    // Set the working colors
    else if (i === tgtidx) ctx.fillStyle = TARGET_COLOR;
    else if (i === smlidx) ctx.fillStyle = SMALL_COLOR;
    else if (i === chkidx) ctx.fillStyle = CHECK_COLOR;
    // Pattern colors
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
const MAX_DELAY = 1000;
const VALIDATION_DELAY = 500;

// Avoid double running
let running = false;

// Get the maximum value
const maxValue = document.getElementById('maxValue');
let mv = maxValue.value;
// Reset the maximum value when it changes
const setMaxValue = document.getElementById('setMaxValue');
setMaxValue.addEventListener('click', async (e) => {
  // If already running, ignore the event
  if (running) return;
  running = true;

  // Set the maximum value
  mv = Math.floor(maxValue.value);
  
  // If the maximum value is invalid
  if (isNaN(mv) || mv < 3 || mv > 100) {
    return alert('You have entered an invalid number! For the best visualization, you should have between 3 and 100 values. Sizes above 100 are prohibited because they can cause performance issues.');
  }

  // Generate the data
  const fullArray = [];
  for (let i = 1; i <= mv; i++) fullArray.push(i);
  // Shuffle the data so it can be sorted (twice for greater randomness)
  shuffle(fullArray);
  shuffle(fullArray);

  // Compute the scale variables
  const barWidth = 1.0 * WIDTH / fullArray.length;
  const unitHeight = 1.0 * HEIGHT / mv;
  const delayTime = MAX_DELAY / speed;

  // Smallest remaining element index
  let si = 0;
  // Iterate over the array
  for (let i = 0; i < fullArray.length - 1; i++) {
    // Set the smallest to the current element
    si = i;

    // Iterate through the rest of the array, attempting to find smaller elements
    for (let j = i; j < fullArray.length; j++) {
      // If the element is smaller, update the index
      if (fullArray[j] < fullArray[si]) si = j;

      // Clear the canvas
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      // Draw the whole array
      drawBars(ctx, barWidth, unitHeight, HEIGHT, fullArray, i, si, j); 

      // Wait delay
      await new Promise(resolve => {
        setTimeout(() => { resolve() }, delayTime);
      });
    }

    // Swap the element with the smallest index
    if (si !== i) {
      const tmp = fullArray[i];
      fullArray[i] = fullArray[si];
      fullArray[si] = tmp;
    }
  }

  // Clear the canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // Draw the whole array again with validation color
  drawBars(ctx, barWidth, unitHeight, HEIGHT, fullArray, -1, -1, -1);

  // Wait delay
  await new Promise(resolve => {
    setTimeout(() => { resolve() }, VALIDATION_DELAY);
  });

  // Clear the canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // Draw the whole array again with normal color
  drawBars(ctx, barWidth, unitHeight, HEIGHT, fullArray, -5, -1, -1); 
  running = false;
});