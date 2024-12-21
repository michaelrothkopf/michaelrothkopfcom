// Hook into the board
const cb = Chessboard('chessBoard', {
  position: 'start',
  draggable: true,
  showNotation: false,

  // Animation settings
  moveSpeed: 'slow',
  snapbackSpeed: 500,
  snapSpeed: 100,
});

console.log(cb);