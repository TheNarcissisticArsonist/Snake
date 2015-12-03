elements = {
  boardCont:    document.getElementById("gameBoard"),
  newGame:      document.getElementById("newGameButton"),
  reset:        document.getElementById("resetGameButton"),
  score:        document.getElementById("score"),
  speed:        document.getElementById("speed"),
  width:        document.getElementById("width"),
  height:       document.getElementById("height"),
  countdown:    document.getElementById("countdown")
};
board = []; //board[row][column][element, food?, snake?, snakehead?]
currentDirection = []; //[row,column]
oldDirection = []; //[row,column]
snake = []; //[[row,column],[row,column], ...]
deadSnake = []; //[row, column]
snakeWasHere = []; //[row, column]
food = [];
width = null;
height = null;
totalSquares = null;
speed = null;
score = 0;
gameInProgress = false;
gameOverBool = false;
lastFrameTime = null;
currentTime = null;
delta = null;
alive = false;
snakeColor = "#005500";
snakeHeadColor = "#00ff00";
foodColor = "#0000ff";
emptySquareColor = "#252525";
deadSnakeColor = "#ff0000";

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
    width = prompt("How wide do you want the board to be?\nPlease enter an integer greater than 2.");
    if(width == null) {
      return;
    }
  }
  while(width % 1 != 0 || width < 3);
  do {
    height = prompt("How tall do you want the board to be?\nPlease enter an integer greater than 2.");
    if(height == null) {
      return;
    }
  }
  while(height % 1 != 0 || height < 3);
  totalSquares = width * height;
  do {
    speed = prompt("How fast do you want the snake to move?\nPlease enter a positive integer between 0 and 10.");
    if(speed == null) {
      return;
    }
  }
  while(speed % 1 != 0 || speed > 10 || speed <= 0 || Number(speed) == NaN);
  generateBoard(width, height);
  score = 1;
  elements.score.innerHTML = String(score);
  elements.speed.innerHTML = String(speed);
  elements.width.innerHTML = String(width);
  elements.height.innerHTML = String(height);
  startGameLoop();
}
function generateBoard(w, h) {
  clearBoard();
  for(i=0; i<h; ++i) { //i is the row
    board[i] = [];
    for(j=0; j<w; ++j) { //j is the column
      board[i][j] = [];
      elements.boardCont.innerHTML += "<div class='boardSquare' id='boardSquare"+String(i)+String(j)+"'></div>";
    }
    elements.boardCont.innerHTML += "<br>";
  }
  grabBoard();
}
function grabBoard() {
  for(i=0; i<height; ++i) {
    for(j=0; j<width; ++j) {
      board[i][j][0] = document.getElementById("boardSquare"+String(i)+String(j));
      board[i][j][1] = false;
      board[i][j][2] = false;
      board[i][j][3] = false;
    }
  }
}
function clearBoard() {
  elements.boardCont.innerHTML = "";
  board = [];
  snake = [];
  currentDirection = [];
  oldDirection = [];
  deadSnake = [];
  snakeWasHere = [];
  gameOverBool = false;
}
function clearBoardAndUI() {
  if(confirm("Are you sure you want to reset?")) {
    clearBoard();
    elements.score.innerHTML = "";
    elements.speed.innerHTML = "";
    elements.width.innerHTML = "";
    elements.height.innerHTML = "";
  }
}

function createSnake() {
  row = Math.floor(Math.random() * (height-2) + 1);
  col = Math.floor(Math.random() * (width-2) + 1);
  board[row][col][0].style.backgroundColor = snakeHeadColor;
  board[row][col][2] = true;
  board[row][col][3] = true;

  snake[0] = [row, col];

  switch(Math.floor(Math.random() * 4)) {
    case 0:
      currentDirection = [0,1];
      break;
    case 1:
      currentDirection = [0,-1];
      break;
    case 2:
      currentDirection = [1,0];
      break;
    case 3:
      currentDirection = [-1,0];
      break;
  }
}

function startGameLoop() {
  alive = true;
  elements.countdown.style.display = "inline-block";
  elements.countdown.style.width = "120px";
  elements.countdown.style.height = "48px";
  left = (window.innerWidth - elements.countdown.style.width.slice(0,-2))/2;
  myTop = (window.innerHeight - elements.countdown.style.height.slice(0,-2))/2; //"top" is interpreted as window.top, so I can't use it -_-
  elements.countdown.style.left = String(left)+"px";
  elements.countdown.style.top = String(myTop)+"px";
  elements.countdown.style.margin = "0px";
  elements.countdown.style.opacity = 1;

  elements.countdown.innerHTML = "3";
  window.setTimeout(function() {
    elements.countdown.innerHTML = "2";
    window.setTimeout(function() {
      elements.countdown.innerHTML = "1";
      window.setTimeout(function() {
        elements.countdown.innerHTML = "Go!";
        opacity = 1;
        elements.countdown.style.opacity = opacity;
        lastFrameTime = new Date().getTime();
        createSnake();
        animate();
        fadeOutLoop = window.setInterval(function() {
          opacity -= 0.1;
          elements.countdown.style.opacity = opacity;
            if(opacity <= 0) {
              elements.countdown.style.display = "none";
              elements.countdown.innerHTML = "&nbsp;";
              window.clearInterval(fadeOutLoop);
            }
        },20);
      },1000);
    },1000);
  },1000);
}
function animate() {
  currentTime = new Date().getTime();
  delta += currentTime - lastFrameTime;

  if(delta > 1000/speed) {
    delta = 0;
    updateSnakePosition();
    eat();
    updateDisplay();
  }

  /*console.log(lastFrameTime);
  console.log(currentTime);
  console.log(delta);*/

  if(gameOverBool) {
    board[deadSnake[0]][deadSnake[1]][0].style.backgroundColor = deadSnakeColor;
    gameOver();
  }
  else {
    lastFrameTime = currentTime;
    requestAnimationFrame(animate);
  }
}
function gameOver() {
  alert("Game over!");
}

function updateSnakePosition() {
  snakeWasHere = [snake[snake.length-1][0], snake[snake.length-1][1]];
  for(i=snake.length-1; i>0; --i) {
    snake[i][0] = snake[i-1][0];
    snake[i][1] = snake[i-1][1];
  }
  snake[0][0] += currentDirection[0];
  snake[0][1] += currentDirection[1];
  for(i=0; i<snake.length; ++i) {
    if(snake[i][0]<0 || snake[i][1]<0 || snake[i][0]>height-1 || snake[i][1]>width-1) {
      gameOverBool = true;
      deadSnake = [snake[i][0]-currentDirection[0],snake[i][1]-currentDirection[1]];
    }
    if(i>0) {
      if(snake[i] == snake[0]) {
        gameOverBool = true;
        deadSnake = [snake[i][0]-currentDirection[0],snake[i][1]-currentDirection[1]];
      }
    }
  }
  if(!gameOverBool) {
    for(i=0; i<height; ++i) {
      for(j=0; j<width; ++j) {
        board[i][j][2] = false;
        board[i][j][3] = false;
      }
    }
    board[snake[0][0]][snake[0][1]][2] = true;
    board[snake[0][0]][snake[0][1]][3] = true;
    for(i=1; i<snake.length; ++i) {
      board[snake[i][0]][snake[i][1]][2] = true;
    }
  }
}
function eat() {
  if(gameOverBool) {
    return;
  }
  if(board[snake[0][0]][snake[0][1]][1] == true) {
    board[snake[0][0]][snake[0][1]][1] = false;
    snake.push(snakeWasHere);
    board[snakeWasHere[0]][snakeWasHere[1]][1] = false;
    board[snakeWasHere[0]][snakeWasHere[1]][2] = true;
  }
}
function updateDirection(newDir) {
  if(newDir != currentDirection && newDir != oldDirection) {
    oldDirection = currentDirection
    currentDirection = newDir;
  }
}
function updateDisplay() {
  for(i=0; i<height; ++i) {
    for(j=0; j<width; ++j) {
      if(board[i][j][3]) {
        board[i][j][0].style.backgroundColor = snakeHeadColor;
      }
      else if(board[i][j][2]) {
        board[i][j][0].style.backgroundColor = snakeColor;
      }
      else if(board[i][j][1]) {
        board[i][j][0].style.backgroundColor = foodColor;
      }
      else {
        board[i][j][0].style.backgroundColor = emptySquareColor;
      }
    }
  }
  score = snake.length;
  elements.score.innerHTML = score;
}

elements.newGame.addEventListener("click", confirmStartNewGame);
elements.reset.addEventListener("click", clearBoardAndUI);

document.addEventListener("keydown", function(event) {
  switch(event.which) {
    case 78: //n
      confirmStartNewGame();
      break;
    case 82: //4
      clearBoardAndUI();
      break;
    case 38: //up
      updateDirection([-1,0]);
      break;
    case 37: //left
      updateDirection([0,-1]);
      break;
    case 40: //down
      updateDirection([1,0]);
      break;
    case 39: //right
      updateDirection([0,1]);
      break;
  }
});

clearBoard();
