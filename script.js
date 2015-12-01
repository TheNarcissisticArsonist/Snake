elements = {
  boardCont:    document.getElementById("gameBoard"),
  newGame:      document.getElementById("newGameButton"),
  reset:        document.getElementById("resetGameButton"),
  score:        document.getElementById("score"),
  speed:        document.getElementById("speed"),
  width:        document.getElementById("width"),
  height:       document.getElementById("height")
};
board = [];
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
}
function generateBoard(w, h) {
  //Temp
}
function clearBoardHTML() {
  //Temp
}

elements.newGame.addEventListener("click", confirmStartNewGame);
elements.reset.addEventListener("click", clearBoardHTML);
