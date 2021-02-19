/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;
var cellSize = 100;
var cellGap = 3;
var numberOfResources = 300;
var enemiesInterval = 200;
var frame = 0;
var gameOver = false;
var score = 0;
var winningScore = 100;
var gameGrid = [];
var defenders = [];
var enemies = [];
var enemyPositions = [];
var projectiles = [];
var resources = [];
var mouse = {
  x: 0,
  y: 0,
  width: 0.1,
  height: 0.1
};
var canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function (e) {
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function () {
  mouse.y = undefined;
  mouse.y = undefined;
});
var controlsBar = {
  width: canvas.width,
  height: cellSize
};

var Cell = /*#__PURE__*/function () {
  function Cell(x, y) {
    _classCallCheck(this, Cell);

    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }

  _createClass(Cell, [{
    key: "draw",
    value: function draw() {
      if (mouse.x && mouse.y && collision(this, mouse)) {
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
      }
    }
  }]);

  return Cell;
}();

function createGrid() {
  for (var y = cellSize; y < canvas.height; y += cellSize) {
    for (var x = 0; x < canvas.width; x += cellSize) {
      gameGrid.push(new Cell(x, y));
    }
  }
}

createGrid();

function handleGameGrid() {
  for (var i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
}

var Projectile = /*#__PURE__*/function () {
  function Projectile(x, y) {
    _classCallCheck(this, Projectile);

    this.x = x;
    this.y = y - 30;
    this.width = 40;
    this.height = 40;
    this.power = 20;
    this.speed = -5;
    this.squidImage = new Image();
    this.squidImage.src = './dist/sprites/notes2.png';
  }

  _createClass(Projectile, [{
    key: "update",
    value: function update() {
      this.x += this.speed;
    }
  }, {
    key: "draw",
    value: function draw() {
      ctx.drawImage(this.squidImage, this.x, this.y, this.width, this.height);
    }
  }]);

  return Projectile;
}();

function handleProjectiles() {
  for (var i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].draw();

    for (var j = 0; j < enemies.length; j++) {
      if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
        enemies[j].health -= projectiles[i].power;
        projectiles.splice(i, 1);
        i--;
      }
    }

    if (projectiles[i] && projectiles[i].x < 15) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}

var Defender = /*#__PURE__*/function () {
  function Defender(x, y) {
    _classCallCheck(this, Defender);

    this.x = x;
    this.y = y;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.shooting = false;
    this.health = 100;
    this.projectiles = [];
    this.timer = 0;
    this.squidImage = new Image();
    this.squidImage.src = './dist/sprites/MrTentacles6.png';
    this.currentFrame = 0;
    this.columns = 15;
    this.rows = 1;
  }

  _createClass(Defender, [{
    key: "draw",
    value: function draw() {
      var frameWidth = this.squidImage.width / this.columns;
      var frameHeight = this.squidImage.height / this.rows;

      if (frame % 9 === 0) {
        this.currentFrame++;
      }

      var maxFrame = this.columns * this.rows - 1;

      if (this.currentFrame > maxFrame) {
        this.currentFrame = 0;
      }

      var column = this.currentFrame % this.columns;
      var row = Math.floor(this.currentFrame / this.columns);
      ctx.drawImage(this.squidImage, column * frameWidth, row * frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.shooting) {
        this.timer++;

        if (this.timer % 70 === 0) {
          projectiles.push(new Projectile(this.x + 75, this.y + 50));
        }
      } else {
        this.timer = 0;
      }
    }
  }]);

  return Defender;
}();

canvas.addEventListener('click', function () {
  var gridPositionX = mouse.x - mouse.x % cellSize + cellGap;
  var gridPositionY = mouse.y - mouse.y % cellSize + cellGap;
  if (gridPositionY < cellSize) return;

  for (var i = 0; i < defenders.length; i++) {
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
  }

  var defenderCost = 100;

  if (numberOfResources >= defenderCost) {
    defenders.push(new Defender(gridPositionX, gridPositionY));
    numberOfResources -= defenderCost;
  }
});

function handleDefenders() {
  for (var i = 0; i < defenders.length; i++) {
    defenders[i].draw();
    defenders[i].update();

    if (enemyPositions.indexOf(defenders[i].y) !== -1) {
      defenders[i].shooting = true;
    } else {
      defenders[i].shooting = false;
    }

    for (var j = 0; j < enemies.length; j++) {
      if (defenders[i] && collision(defenders[i], enemies[j])) {
        enemies[j].movement = 0;
        defenders[i].health -= 1;
      }

      if (defenders[i] && defenders[i].health <= 0) {
        defenders.splice(i, 1);
        i--;
        enemies[j].movement = enemies[j].speed;
      }
    }
  }
}

var Enemy = /*#__PURE__*/function () {
  function Enemy(verticalPosition) {
    _classCallCheck(this, Enemy);

    this.x = -100;
    this.y = verticalPosition;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
    this.patrickImage = new Image();
    this.patrickImage.src = './dist/sprites/PatrickRun2.png';
    this.currentFrame = 0;
    this.columns = 10;
    this.rows = 1;
  }

  _createClass(Enemy, [{
    key: "update",
    value: function update() {
      this.x += this.movement;
    }
  }, {
    key: "draw",
    value: function draw() {
      var frameWidth = this.patrickImage.width / this.columns;
      var frameHeight = this.patrickImage.height / this.rows;

      if (frame % 10 === 0) {
        this.currentFrame++;
      }

      var maxFrame = this.columns * this.rows - 1;

      if (this.currentFrame > maxFrame) {
        this.currentFrame = 0;
      }

      var column = this.currentFrame % this.columns;
      var row = Math.floor(this.currentFrame / this.columns);
      ctx.drawImage(this.patrickImage, column * frameWidth, row * frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
    }
  }]);

  return Enemy;
}();

function handleEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
    enemies[i].update();

    if (enemies[i].x > canvas.width - 90) {
      gameOver = true; // lives -= 1;
      // if (lives === 0) { gameOver = true }
    }

    if (enemies[i].health <= 0) {
      var gainedResources = enemies[i].maxHealth / 10;
      numberOfResources += gainedResources;
      score += gainedResources;
      var findThisIndex = enemyPositions.indexOf(enemies[i].y);
      enemyPositions.splice(findThisIndex, 1);
      enemies.splice(i, 1);
      i--;
    }
  }

  if (frame % enemiesInterval === 0 && score < winningScore) {
    var verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
    enemies.push(new Enemy(verticalPosition));
    enemyPositions.push(verticalPosition);
    if (enemiesInterval > 120) enemiesInterval -= 50;
  }
}

var amounts = [20, 30, 40];

var Resource = /*#__PURE__*/function () {
  function Resource() {
    _classCallCheck(this, Resource);

    this.x = Math.random() * (canvas.width - cellSize);
    this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
    this.width = cellSize * 0.6;
    this.height = cellSize * 0.6;
    this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    this.coinImage = new Image();
    this.coinImage.src = './dist/sprites/DogeCoinSprite.png';
    this.currentFrame = 0;
    this.coinColumns = 6;
    this.coinRows = 8;
  }

  _createClass(Resource, [{
    key: "draw",
    value: function draw() {
      var frameWidth = this.coinImage.width / this.coinColumns;
      var frameHeight = this.coinImage.height / this.coinRows;

      if (frame % 4 === 0) {
        this.currentFrame++;
      }

      var maxFrame = this.coinColumns * this.coinRows - 1;

      if (this.currentFrame > maxFrame) {
        this.currentFrame = 0;
      }

      var column = this.currentFrame % this.coinColumns;
      var row = Math.floor(this.currentFrame / this.coinColumns);
      ctx.drawImage(this.coinImage, column * frameWidth, row * frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height);
    }
  }]);

  return Resource;
}();

function handleResources() {
  if (frame % 400 === 0 && score < winningScore) {
    resources.push(new Resource());
  }

  for (var i = 0; i < resources.length; i++) {
    resources[i].draw();

    if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) {
      numberOfResources += resources[i].amount;
      resources.splice(i, 1);
      i--;
    }
  }
}

function handleGameStatus() {
  ctx.fillStyle = 'gold';
  ctx.font = '30px Arial';
  ctx.fillText('Score: ' + score, 20, 40);
  ctx.fillText('DogeCoins: ' + numberOfResources, 20, 80);

  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '90px Arial';
    ctx.fillText('GAME OVER', 135, 330);
  }

  if (score >= winningScore && enemies.length === 0) {
    ctx.fillStyle = 'black';
    ctx.font = '60px Arial';
    ctx.fillText('LEVEL COMPLETE', 130, 300);
    ctx.font = '30px Arial'; // ctx.fillText('You win!', 134, 340);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleDefenders();
  handleResources();
  handleProjectiles();
  handleEnemies();
  handleGameStatus();
  frame++;
  if (!gameOver) requestAnimationFrame(animate);
}

animate();

function collision(first, second) {
  if (!(first.x > second.x + second.width || first.x + first.width < second.x || first.y > second.y + second.height || first.y + first.height < second.y)) {
    return true;
  }

  ;
}

;
window.addEventListener('resize', function () {
  canvasPosition = canvas.getBoundingClientRect();
});
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

/***/ })

/******/ });
//# sourceMappingURL=main.js.map