elements = {
  boardCont:    document.getElementById("gameBoard"),
  newGame:      document.getElementById("newGameButton"),
  reset:        document.getElementById("resetGameButton"),
  score:        document.getElementById("score"),
  speed:        document.getElementById("speed"),
  width:        document.getElementById("width"),
  height:       document.getElementById("height")
};
board = []; //board[row][column][element, food?, snake?, snakehead?]
gameInProgress = false;

function confirmStartNewGame() {
  if(confirm("Starting new game...")) {
    //Start approved
    startNewGame();
  }
}
function startNewGame() {
  width = 0;
  height = 0;
  speed = 0;
  do {
    width = prompt("How wide do you want the board to be?\nPlease enter a positive integer.");
  }
  while(width % 1 != 0 || height < 0);
  do {
    height = prompt("How tall do you want the board to be?\nPlease enter a positive integer.");
  }
  while(height % 1 != 0 || height < 0);
  do {
    speed = prompt("How fast do you want the snake to move?\nPlease enter a positive integer between 0 and 10.");
  }
  while(speed % 1 != 0 || speed > 10 || speed < 0);
  generateBoard(width, height);
}
function generateBoard(w, h) {
  clearBoard();
  for(i=0; i<h; ++i) { //i is the row
    board[i] = [];
    for(j=0; j<h; ++j) { //j is the column
      elements.boardCont.innerHTML += "<div class='boardSquare' id='boardSquare"+String(i)+String(j)+"'></div>";
      board[i][j] = [document.getElementById("boardSquare"+String(i)+String(j)), false, false, false];
    }
    elements.boardCont.innerHTML += "<br>";
  }
}
function clearBoard() {
  elements.boardCont.innerHTML = "";
  board = [];
}

elements.newGame.addEventListener("click", confirmStartNewGame);
elements.reset.addEventListener("click", clearBoard);

clearBoard();
