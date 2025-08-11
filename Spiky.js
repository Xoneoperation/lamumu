// Timer Variables
let timerInterval;
let totalSeconds = 0;

// 🕒 Start Timer
function startTimer() {
  timerInterval = setInterval(() => {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById("timeDisplay").innerText = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

// 🛑 Stop Timer
function stopTimer() {
  clearInterval(timerInterval);
}

// 🔊 Audio Control Functions
function initAudio() {
  bgMusic = document.getElementById("bgMusic");
  
  // Try to load the audio
  bgMusic.load();
  
  // Add error handling for audio
  bgMusic.addEventListener('error', function(e) {
    console.warn('Audio file could not be loaded. Game will continue without music.');
    // Hide audio control button if audio fails
    const audioBtn = document.getElementById('audioControl');
    if (audioBtn) {
      audioBtn.style.display = 'none';
    }
  });
  
  bgMusic.addEventListener('canplaythrough', function() {
    console.log('Audio loaded successfully');
    // Show audio control button when audio is ready
    const audioBtn = document.getElementById('audioControl');
    if (audioBtn) {
      audioBtn.style.display = 'block';
    }
  });
}

function playAudio() {
  if (bgMusic) {
    bgMusic.play().catch(e => {
      console.log('Audio play failed:', e);
      // Try again with user interaction
      document.addEventListener('click', function playOnClick() {
        bgMusic.play().catch(err => console.log('Audio still blocked'));
        document.removeEventListener('click', playOnClick);
      }, { once: true });
    });
  }
}

function toggleAudio() {
  if (!bgMusic) return;
  
  const audioBtn = document.getElementById('audioControl');
  if (bgMusic.paused) {
    bgMusic.play().catch(e => console.log('Audio play failed:', e));
    audioBtn.textContent = '🔊';
    audioEnabled = true;
  } else {
    bgMusic.pause();
    audioBtn.textContent = '🔇';
    audioEnabled = false;
  }
}

function startGame() {
  const username = document.getElementById("username").value;
  
  if (username) {
    // Try to play audio (may be blocked by browser)
    playAudio();

/* function startGame() {
  const username = document.getElementById("username").value;
  //const password = document.getElementById("password").value;
   // Autoplay the background music
   const bgMusic = document.getElementById("bgMusic");
    bgMusic.play();
  //if (username && password) {
  if (username) { */
    // Make a request to http://localhost:5000/api/auth/teddy-auth
    fetch("https://dems-nft.onrender.com/api/auth/teddy-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //body: JSON.stringify({ username, password }),
      body: JSON.stringify({username}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data?.success) {
          sessionStorage.setItem("tk", data?.data?.token); // Handle the response data
          document.getElementById("startScreen").style.display = "none";
          document.getElementById("page").style.display = "block";
          makeMaze();
          totalSeconds = 0; // Reset Timer
          startTimer();

         
        } else {
          window.alert("Invalid password");
        }
      })
      //.catch((error) => {
      //  console.error("Error:", error);
      //  window.alert("Failed to authenticate. Please try again.");
     // });
  //} else {
   // window.alert("Username and password are required");
  }

  //enableVirtualButtons()
}

function shareOnTwitter() {
  const score =
    document.getElementById("moves")?.innerText || "an amazing score";
  const time = document.getElementById("time")?.innerText || "unknown time";
  const tweetText = `I escaped the COW MAZE  in ${score} moves! under 🕒 ${time}. Think you can beat my time? find out here at https://the-lamumu-adventure.vercel.app/  @lamumudotxyz
 `;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;

  window.open(twitterShareUrl, "_blank");
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function changeBrightness(factor, sprite) {
  var virtCanvas = document.createElement("canvas");
  virtCanvas.width = 500;
  virtCanvas.height = 500;
  var context = virtCanvas.getContext("2d");
  context.drawImage(sprite, 0, 0, 500, 500);

  var imgData = context.getImageData(0, 0, 500, 500);

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = imgData.data[i] * factor;
    imgData.data[i + 1] = imgData.data[i + 1] * factor;
    imgData.data[i + 2] = imgData.data[i + 2] * factor;
  }
  context.putImageData(imgData, 0, 0);

  var spriteOutput = new Image();
  spriteOutput.src = virtCanvas.toDataURL();
  virtCanvas.remove();
  return spriteOutput;
}

let level = 0;

function displayVictoryMess(moves) {
  
  if (level < 3) {
    level++;
    makeMaze();
    console.log(level);
  } else {
    const time = document.getElementById("timeDisplay").innerText;
    console.log(time);

    // Retrieve the authorization token from sessionStorage
    const token = sessionStorage.getItem("tk");

    // Make an authorized request to update the steps and time
    fetch("https://dems-nft.onrender.com/api/user/update-teddy", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request header
      },
      body: JSON.stringify({ step: Number(moves), timeStr: time }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error));

    document.getElementById("time").innerHTML = `Time: ${time} secs`;
    document.getElementById("moves").innerHTML =
      "You Moved " + moves + " Steps.";
    toggleVisablity("Message-Container");
    document.getElementById("endScreen").style.display = "block";
  }
}

function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
  document.getElementById("endScreen").style.display = "none";
  level = 0;
  totalSeconds = 0; // Reset Timer
  startTimer();
  makeMaze();
}

function Maze(Width, Height) {
  var mazeMap;
  var width = Width;
  var height = Height;
  var startCoord, endCoord;
  var dirs = ["n", "s", "e", "w"];
  var modDir = {
    n: {
      y: -1,
      x: 0,
      o: "s",
    },
    s: {
      y: 1,
      x: 0,
      o: "n",
    },
    e: {
      y: 0,
      x: 1,
      o: "w",
    },
    w: {
      y: 0,
      x: -1,
      o: "e",
    },
  };

  this.map = function () {
    return mazeMap;
  };
  this.startCoord = function () {
    return startCoord;
  };
  this.endCoord = function () {
    return endCoord;
  };

  function genMap() {
    mazeMap = new Array(height);
    for (y = 0; y < height; y++) {
      mazeMap[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        mazeMap[y][x] = {
          n: false,
          s: false,
          e: false,
          w: false,
          visited: false,
          priorPos: null,
        };
      }
    }
  }

  function defineMaze() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = {
      x: 0,
      y: 0,
    };
    var numCells = width * height;
    while (!isComp) {
      move = false;
      mazeMap[pos.x][pos.y].visited = true;

      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          //Check if the tile is already visited
          if (!mazeMap[nx][ny].visited) {
            //Carve through walls from this tile to next
            mazeMap[pos.x][pos.y][direction] = true;
            mazeMap[nx][ny][modDir[direction].o] = true;

            //Set Currentcell as next cells Prior visited
            mazeMap[nx][ny].priorPos = pos;
            //Update Cell position to newly visited location
            pos = {
              x: nx,
              y: ny,
            };
            cellsVisited++;
            //Recursively call this method on the next tile
            move = true;
            break;
          }
        }
      }

      if (!move) {
        //  If it failed to find a direction,
        //  move the current position back to the prior cell and Recall the method.
        pos = mazeMap[pos.x][pos.y].priorPos;
      }
      if (numCells == cellsVisited) {
        isComp = true;
      }
    }
  }

  function defineStartEnd() {
    switch (rand(4)) {
      case 0:
        startCoord = {
          x: 0,
          y: 0,
        };
        endCoord = {
          x: height - 1,
          y: width - 1,
        };
        break;
      case 1:
        startCoord = {
          x: 0,
          y: width - 1,
        };
        endCoord = {
          x: height - 1,
          y: 0,
        };
        break;
      case 2:
        startCoord = {
          x: height - 1,
          y: 0,
        };
        endCoord = {
          x: 0,
          y: width - 1,
        };
        break;
      case 3:
        startCoord = {
          x: height - 1,
          y: width - 1,
        };
        endCoord = {
          x: 0,
          y: 0,
        };
        break;
    }
  }

  genMap();
  defineStartEnd();
  defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  var map = Maze.map();
  var cellSize = cellsize;
  var drawEndMethod;
  ctx.lineWidth = cellSize / 40;

  this.redrawMaze = function (size) {
    cellSize = size;
    ctx.lineWidth = cellSize / 50;
    drawMap();
    drawEndMethod();
  };

  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize;
    var y = yCord * cellSize;

    if (cell.n == false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.s === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.e === false) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.w === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }

  function drawMap() {
    for (x = 0; x < map.length; x++) {
      for (y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }

  function drawEndFlag() {
    var coord = Maze.endCoord();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        colorSwap = !colorSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }

  function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coord = Maze.endCoord();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }

  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = drawEndFlag;
  }
  clear();
  drawMap();
  drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  drawSprite = drawSpriteCircle;
  if (sprite != null) {
    drawSprite = drawSpriteImg;
  }
  var player = this;
  var map = maze.map();
  var cellCoords = {
    x: maze.startCoord().x,
    y: maze.startCoord().y,
  };
  var cellSize = _cellsize;
  var halfCellSize = cellSize / 2;

  this.redrawPlayer = function (_cellsize) {
    cellSize = _cellsize;
    drawSpriteImg(cellCoords);
  };

  function drawSpriteCircle(coord) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function drawSpriteImg(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var scaleFactor = 1.5;
    ctx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function removeSprite(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
      case 65:
      case 37: // west
        if (cell.w == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x - 1,
            y: cellCoords.y,
          };
          drawSprite(cellCoords);
        }
        break;
      case 87:
      case 38: // north
        if (cell.n == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y - 1,
          };
          drawSprite(cellCoords);
        }
        break;
      case 68:
      case 39: // east
        if (cell.e == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x + 1,
            y: cellCoords.y,
          };
          drawSprite(cellCoords);
        }
        break;
      case 83:
      case 40: // south
        if (cell.s == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y + 1,
          };
          drawSprite(cellCoords);
        }
        break;
    }
  }

  this.bindKeyDown = function () {
    window.addEventListener("keydown", check, false);

    $("#view").swipe({
      swipe: function (
        event,
        direction,
        distance,
        duration,
        fingerCount,
        fingerData
      ) {
        console.log(direction);
        switch (direction) {
          case "up":
            check({
              keyCode: 38,
            });
            break;
          case "down":
            check({
              keyCode: 40,
            });
            break;
          case "left":
            check({
              keyCode: 37,
            });
            break;
          case "right":
            check({
              keyCode: 39,
            });
            break;
        }
      },
      threshold: 0,
    });
  };

  this.unbindKeyDown = function () {
    window.removeEventListener("keydown", check, false);
    $("#view").swipe("destroy");
  };

  drawSprite(maze.startCoord());

  this.bindKeyDown();
}

var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
// sprite.src = 'media/sprite.png';

window.onload = function () {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  //Load and edit sprites
  var completeOne = false;
  var completeTwo = false;
  var isComplete = () => {
    if (completeOne === true && completeTwo === true) {
      console.log("Runs");
      setTimeout(function () {
        makeMaze();
      }, 500);
    }
  };
  sprite = new Image();
  sprite.src = "./Spiky.png";
  sprite.setAttribute("crossOrigin", " ");
  sprite.onload = function () {
    sprite = changeBrightness(1.2, sprite);
    completeOne = true;
    console.log(completeOne);
    isComplete();
  };

  finishSprite = new Image();
  finishSprite.src = "./portal.png";
  finishSprite.setAttribute("crossOrigin", " ");
  finishSprite.onload = function () {
    finishSprite = changeBrightness(1.1, finishSprite);
    completeTwo = true;
    console.log(completeTwo);
    isComplete();
  };
};

window.onresize = function () {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  cellSize = mazeCanvas.width / difficulty;
  if (player != null) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
};

function makeMaze() {
  //document.getElementById("mazeCanvas").classList.add("border");
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  var e = [10, 12, 15, 20];
  difficulty = e[level];
  cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
  if (document.getElementById("mazeContainer").style.opacity < "100") {
    document.getElementById("mazeContainer").style.opacity = "100";
  }
}

function restartGame() {
  window.location.reload();
}

// 🕹️ Mobile Button Controls
// function enableVirtualButtons() {
//   document.getElementById('btnUp').addEventListener('click', () => player.check({ keyCode: 38 }));
//   document.getElementById('btnDown').addEventListener('click', () => player.check({ keyCode: 40 }));
//   document.getElementById('btnLeft').addEventListener('click', () => player.check({ keyCode: 37 }));
//   document.getElementById('btnRight').addEventListener('click', () => player.check({ keyCode: 39 }));
// }



// Timer Variables
/* let timerInterval;
let totalSeconds = 0;
let audioEnabled = false;
let bgMusic = null;

// 🕒 Start Timer
function startTimer() {
  timerInterval = setInterval(() => {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById("timeDisplay").innerText = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

// 🛑 Stop Timer
function stopTimer() {
  clearInterval(timerInterval);
}


    
    // Make a request to the API
    fetch("https://dems-nft.onrender.com/api/auth/teddy-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data?.success) {
          sessionStorage.setItem("tk", data?.data?.token);
          document.getElementById("startScreen").style.display = "none";
          document.getElementById("page").style.display = "block";
          makeMaze();
          totalSeconds = 0;
          startTimer();
          
          // Enable mobile controls if on mobile device
          if (isMobileDevice()) {
            enableMobileControls();
          }
        } else {
          window.alert("Invalid username");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Continue offline if API fails
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("page").style.display = "block";
        makeMaze();
        totalSeconds = 0;
        startTimer();
        
        if (isMobileDevice()) {
          enableMobileControls();
        }
      });
  } else {
    window.alert("Username is required");
  }
}

// Detect if device is mobile
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth <= 768;
}

// Mobile Controls
let mobileControlsActive = false;
let currentPlayer = null;

function enableMobileControls() {
  if (mobileControlsActive) return;
  mobileControlsActive = true;
  
  const controls = document.getElementById('mobileControls');
  if (controls) {
    controls.style.display = 'block';
  }
  
  // Add touch event listeners to control buttons
  const buttons = document.querySelectorAll('.control-btn');
  buttons.forEach(btn => {
    // Prevent default touch behavior
    btn.addEventListener('touchstart', handleControlTouch, { passive: false });
    btn.addEventListener('touchend', handleControlRelease, { passive: false });
    btn.addEventListener('mousedown', handleControlTouch);
    btn.addEventListener('mouseup', handleControlRelease);
  });
}

function handleControlTouch(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  btn.classList.add('pressed');
  
  const keyCode = parseInt(btn.dataset.key);
  if (keyCode && currentPlayer) {
    // Simulate keyboard event for the game
    const event = { keyCode: keyCode };
    if (currentPlayer.check) {
      currentPlayer.check(event);
    }
  }
}

function handleControlRelease(e) {
  e.preventDefault();
  const btn = e.currentTarget;
  btn.classList.remove('pressed');
}

function shareOnTwitter() {
  const score = document.getElementById("moves")?.innerText || "an amazing score";
  const time = document.getElementById("time")?.innerText || "unknown time";
  const tweetText = `I escaped the COW MAZE in ${score} moves! under 🕒 ${time}. Think you can beat my time? find out here at https://steddy-teddy.vercel.app/ @steadyteddys`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  window.open(twitterShareUrl, "_blank");
}

function rand(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function changeBrightness(factor, sprite) {
  var virtCanvas = document.createElement("canvas");
  virtCanvas.width = 500;
  virtCanvas.height = 500;
  var context = virtCanvas.getContext("2d");
  context.drawImage(sprite, 0, 0, 500, 500);

  var imgData = context.getImageData(0, 0, 500, 500);

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = imgData.data[i] * factor;
    imgData.data[i + 1] = imgData.data[i + 1] * factor;
    imgData.data[i + 2] = imgData.data[i + 2] * factor;
  }
  context.putImageData(imgData, 0, 0);

  var spriteOutput = new Image();
  spriteOutput.src = virtCanvas.toDataURL();
  virtCanvas.remove();
  return spriteOutput;
}

let level = 0;

function displayVictoryMess(moves) {
  if (level < 3) {
    level++;
    makeMaze();
    console.log(level);
  } else {
    const time = document.getElementById("timeDisplay").innerText;
    console.log(time);

    const token = sessionStorage.getItem("tk");

    // Only send to API if we have a token
    if (token) {
      fetch("https://dems-nft.onrender.com/api/user/update-teddy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ step: Number(moves), timeStr: time }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
    }

    document.getElementById("time").innerHTML = `Time: ${time}`;
    document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
    toggleVisablity("Message-Container");
    document.getElementById("endScreen").style.display = "block";
  }
}

function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
  document.getElementById("endScreen").style.display = "none";
  level = 0;
  totalSeconds = 0;
  startTimer();
  makeMaze();
}

function Maze(Width, Height) {
  var mazeMap;
  var width = Width;
  var height = Height;
  var startCoord, endCoord;
  var dirs = ["n", "s", "e", "w"];
  var modDir = {
    n: { y: -1, x: 0, o: "s" },
    s: { y: 1, x: 0, o: "n" },
    e: { y: 0, x: 1, o: "w" },
    w: { y: 0, x: -1, o: "e" },
  };

  this.map = function () {
    return mazeMap;
  };
  this.startCoord = function () {
    return startCoord;
  };
  this.endCoord = function () {
    return endCoord;
  };

  function genMap() {
    mazeMap = new Array(height);
    for (y = 0; y < height; y++) {
      mazeMap[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        mazeMap[y][x] = {
          n: false,
          s: false,
          e: false,
          w: false,
          visited: false,
          priorPos: null,
        };
      }
    }
  }

  function defineMaze() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = { x: 0, y: 0 };
    var numCells = width * height;
    
    while (!isComp) {
      move = false;
      mazeMap[pos.x][pos.y].visited = true;

      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          if (!mazeMap[nx][ny].visited) {
            mazeMap[pos.x][pos.y][direction] = true;
            mazeMap[nx][ny][modDir[direction].o] = true;
            mazeMap[nx][ny].priorPos = pos;
            pos = { x: nx, y: ny };
            cellsVisited++;
            move = true;
            break;
          }
        }
      }

      if (!move) {
        pos = mazeMap[pos.x][pos.y].priorPos;
      }
      if (numCells == cellsVisited) {
        isComp = true;
      }
    }
  }

  function defineStartEnd() {
    switch (rand(4)) {
      case 0:
        startCoord = { x: 0, y: 0 };
        endCoord = { x: height - 1, y: width - 1 };
        break;
      case 1:
        startCoord = { x: 0, y: width - 1 };
        endCoord = { x: height - 1, y: 0 };
        break;
      case 2:
        startCoord = { x: height - 1, y: 0 };
        endCoord = { x: 0, y: width - 1 };
        break;
      case 3:
        startCoord = { x: height - 1, y: width - 1 };
        endCoord = { x: 0, y: 0 };
        break;
    }
  }

  genMap();
  defineStartEnd();
  defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  var map = Maze.map();
  var cellSize = cellsize;
  var drawEndMethod;
  ctx.lineWidth = cellSize / 40;

  this.redrawMaze = function (size) {
    cellSize = size;
    ctx.lineWidth = cellSize / 50;
    drawMap();
    drawEndMethod();
  };

  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize;
    var y = yCord * cellSize;

    if (cell.n == false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.s === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.e === false) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.w === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }

  function drawMap() {
    for (x = 0; x < map.length; x++) {
      for (y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }

  function drawEndFlag() {
    var coord = Maze.endCoord();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        colorSwap = !colorSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }

  function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coord = Maze.endCoord();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }

  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = drawEndFlag;
  }
  clear();
  drawMap();
  drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  drawSprite = drawSpriteCircle;
  if (sprite != null) {
    drawSprite = drawSpriteImg;
  }
  var player = this;
  var map = maze.map();
  var cellCoords = {
    x: maze.startCoord().x,
    y: maze.startCoord().y,
  };
  var cellSize = _cellsize;
  var halfCellSize = cellSize / 2;

  // Store reference for mobile controls
  currentPlayer = this;

  this.redrawPlayer = function (_cellsize) {
    cellSize = _cellsize;
    drawSpriteImg(cellCoords);
  };

  function drawSpriteCircle(coord) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function drawSpriteImg(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function removeSprite(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }

  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
      case 65:
      case 37: // west
        if (cell.w == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x - 1,
            y: cellCoords.y,
          };
          drawSprite(cellCoords);
        }
        break;
      case 87:
      case 38: // north
        if (cell.n == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y - 1,
          };
          drawSprite(cellCoords);
        }
        break;
      case 68:
      case 39: // east
        if (cell.e == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x + 1,
            y: cellCoords.y,
          };
          drawSprite(cellCoords);
        }
        break;
      case 83:
      case 40: // south
        if (cell.s == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y + 1,
          };
          drawSprite(cellCoords);
        }
        break;
    }
  }

  // Expose check function for mobile controls
  this.check = check;

  this.bindKeyDown = function () {
    window.addEventListener("keydown", check, false);

    $("#view").swipe({
      swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
        console.log(direction);
        switch (direction) {
          case "up":
            check({ keyCode: 38 });
            break;
          case "down":
            check({ keyCode: 40 });
            break;
          case "left":
            check({ keyCode: 37 });
            break;
          case "right":
            check({ keyCode: 39 });
            break;
        }
      },
      threshold: 0,
    });
  };

  this.unbindKeyDown = function () {
    window.removeEventListener("keydown", check, false);
    $("#view").swipe("destroy");
    currentPlayer = null;
  };

  drawSprite(maze.startCoord());
  this.bindKeyDown();
}

var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;

window.onload = function () {
  // Initialize audio
  initAudio();
  
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  //Load and edit sprites
  var completeOne = false;
  var completeTwo = false;
  var isComplete = () => {
    if (completeOne === true && completeTwo === true) {
      console.log("Runs");
      setTimeout(function () {
        makeMaze();
      }, 500);
    }
  };
  
  sprite = new Image();
  sprite.src = "./Spiky.png";
  sprite.setAttribute("crossOrigin", " ");
  sprite.onload = function () {
    sprite = changeBrightness(1.2, sprite);
    completeOne = true;
    console.log(completeOne);
    isComplete();
  };

  finishSprite = new Image();
  finishSprite.src = "./portal.png";
  finishSprite.setAttribute("crossOrigin", " ");
  finishSprite.onload = function () {
    finishSprite = changeBrightness(1.1, finishSprite);
    completeTwo = true;
    console.log(completeTwo);
    isComplete();
  };
};

window.onresize = function () {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  
  // Adjust canvas size based on viewport
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  
  // Ensure canvas doesn't exceed mobile viewport
  if (window.innerWidth <= 768) {
    const maxSize = Math.min(viewWidth, viewHeight) * 0.7;
    ctx.canvas.width = maxSize;
    ctx.canvas.height = maxSize;
  }
  
  cellSize = mazeCanvas.width / difficulty;
  if (player != null) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
};

function makeMaze() {
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  
  // Adjust difficulty for mobile devices
  var e = isMobileDevice() ? [8, 10, 12, 15] : [10, 12, 15, 20];
  difficulty = e[level];
  cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
  
  if (document.getElementById("mazeContainer").style.opacity < "100") {
    document.getElementById("mazeContainer").style.opacity = "100";
  }
}

function restartGame() {
  window.location.reload();
}
*/