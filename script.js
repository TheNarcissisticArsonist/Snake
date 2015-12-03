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
direction = []; //[x,y]
width = null;
height = null;
speed = null;
gameInProgress = false;
lastFrameTime = null;
currentTime = null;
delta = null;
alive = false;
snakeColor = "#00ff00";

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
    if(width == null) {
      return;
    }
  }
  while(width % 1 != 0 || width < 0);
  do {
    height = prompt("How tall do you want the board to be?\nPlease enter a positive integer.");
    if(height == null) {
      return;
    }
  }
  while(height % 1 != 0 || height < 0);
  do {
    speed = prompt("How fast do you want the snake to move?\nPlease enter a positive integer between 0 and 10.");
    if(speed == null) {
      return;
    }
  }
  while(speed % 1 != 0 || speed > 10 || speed < 0);
  generateBoard(width, height);
  elements.score.innerHTML = "1";
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
}

function createSnake() {
  row = Math.floor(Math.random() * height);
  col = Math.floor(Math.random() * width);
  board[row][col][0].style.backgroundColor = snakeColor;
  board[row][col][2] = true;
  board[row][col][3] = true;
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
    move();
  }

  /*console.log(lastFrameTime);
  console.log(currentTime);
  console.log(delta);*/

  lastFrameTime = currentTime;
  requestAnimationFrame(animate);
}

function move() {
  console.log("Moved");
}

elements.newGame.addEventListener("click", confirmStartNewGame);
elements.reset.addEventListener("click", clearBoard);

clearBoard();
