const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

const cellSize = 100;
const cellGap = 3;
let numberOfResources = 300;
let enemiesInterval = 200;
let frame = 0;
let gameOver = false;
let score = 0;
const winningScore = 100;

const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];

const mouse = {
    x: 0,
    y: 0,
    width: 0.1,
    height: 0.1,
}
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function(){
    mouse.y = undefined;
    mouse.y = undefined;
});

const controlsBar = {
    width: canvas.width,
    height: cellSize,
}
class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
function createGrid(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
        for (let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}

class Projectile {
    constructor(x, y){
        this.x = x;
        this.y = y-30;
        this.width = 40;
        this.height = 40;
        this.power = 20;
        this.speed = -5;
        this.squidImage = new Image();
        this.squidImage.src = './dist/sprites/notes2.png';
    }
    update(){
        this.x += this.speed;
    }
    draw(){
      
        ctx.drawImage(this.squidImage,  this.x, this.y, this.width, this.height)
    }
}
function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++){
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])){
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x < 15){
            projectiles.splice(i, 1);
            i--;
        }
    }
}

class Defender {
    constructor(x, y){
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
    draw(){
        let frameWidth = this.squidImage.width / this.columns;
        let frameHeight = this.squidImage.height / this.rows;
        
        if (frame % 9 === 0) {
            this.currentFrame++;
        }
        let maxFrame = this.columns * this.rows - 1;
        if (this.currentFrame > maxFrame){
            this.currentFrame = 0;
        }
        let column = this.currentFrame % this.columns;
        let row = Math.floor(this.currentFrame / this.columns);
           
        ctx.drawImage(this.squidImage, column * frameWidth, row * frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height)
   
        
    }
    update(){
        if (this.shooting){
            this.timer++;
            if (this.timer % 70 === 0){
                projectiles.push(new Projectile(this.x + 75, this.y + 50));
            }
        } else {
            this.timer = 0;
        }
    }
}
canvas.addEventListener('click', function(){
    const gridPositionX = mouse.x  - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < defenders.length; i++){
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return;
    }
    let defenderCost = 100;
    if (numberOfResources >= defenderCost){
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    }
});
function handleDefenders(){
    for (let i = 0; i < defenders.length; i++){
        defenders[i].draw();
        defenders[i].update();
        if (enemyPositions.indexOf(defenders[i].y) !== -1){
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
        }
        for (let j = 0; j < enemies.length; j++){
            if (defenders[i] && collision(defenders[i], enemies[j])){
                enemies[j].movement = 0;
                defenders[i].health -= 1;
            }
            if (defenders[i] && defenders[i].health <= 0){
                defenders.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}

class Enemy {
    constructor(verticalPosition){
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
    update(){
        this.x += this.movement;
    }
    draw(){
        let frameWidth = this.patrickImage.width / this.columns;
        let frameHeight = this.patrickImage.height / this.rows;
        
        if (frame % 10 === 0) {
            this.currentFrame++;
        }
        let maxFrame = this.columns * this.rows - 1;
        if (this.currentFrame > maxFrame){
            this.currentFrame = 0;
        }
        let column = this.currentFrame % this.columns;
        let row = Math.floor(this.currentFrame / this.columns);
           
        ctx.drawImage(this.patrickImage, column * frameWidth, row * frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height)
    }
}
function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].draw();
        enemies[i].update();
        if (enemies[i].x > canvas.width -90){
            gameOver = true;
            // lives -= 1;
            // if (lives === 0) { gameOver = true }
        }
        if (enemies[i].health <= 0){
            let gainedResources = enemies[i].maxHealth/10;
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
          }
    }
    if (frame % enemiesInterval === 0 && score < winningScore){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
        if (enemiesInterval > 120) enemiesInterval -= 50;
    }
}

const amounts = [20, 30, 40];
class Resource {
    constructor(){
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
    
    draw(){
        let frameWidth = this.coinImage.width / this.coinColumns;
        let frameHeight = this.coinImage.height / this.coinRows;
        
        if (frame % 4 === 0) {
            this.currentFrame++;
        }
        let maxFrame = this.coinColumns * this.coinRows - 1;
        if (this.currentFrame > maxFrame){
            this.currentFrame = 0;
        }
        let column = this.currentFrame % this.coinColumns;
        let row = Math.floor(this.currentFrame / this.coinColumns);
           
        ctx.drawImage(this.coinImage, column * frameWidth, row * frameHeight, frameWidth, frameHeight, this.x, this.y, this.width, this.height)
    }
}
function handleResources(){
    if (frame % 400 === 0 && score < winningScore){
        resources.push(new Resource());
    }
    for (let i = 0; i < resources.length; i++){
        resources[i].draw();
        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)){
            numberOfResources += resources[i].amount;
            resources.splice(i, 1);
            i--;
        }
    }
}

function handleGameStatus(){
    ctx.fillStyle = 'gold';
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + score, 20, 40);
    ctx.fillText('DogeCoins: ' + numberOfResources, 20, 80);
    if (gameOver){
        ctx.fillStyle = 'black';
        ctx.font = '90px Arial';
        ctx.fillText('GAME OVER', 135, 330);
    }
    if (score >= winningScore && enemies.length === 0){
        ctx.fillStyle = 'black';
        ctx.font = '60px Arial';
        ctx.fillText('LEVEL COMPLETE', 130, 300);
        ctx.font = '30px Arial';
        // ctx.fillText('You win!', 134, 340);
    }
}


function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
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

function collision(first, second){
    if (    !(first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
    ) {
        return true;
    };
};

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})

const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}