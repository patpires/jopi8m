const canvas = document.getElementById("canvas-jogo");
const ctx = canvas.getContext("2d");

var tiles = [];
const nTilesX = 10;
const nTilesY = 10;
var nBombs = 10;
var gameOver = false;
var bombsImage = new Image();
bombsImage.src = 'Bomba.png';
var freeGif = new Image();
freeGif.src = 'free.gif';

class Tile {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.isBomb = false;
    this.isOpen = false;
    this.bombsAround = 0;
    this.marked = false;
    this.openedAround = false;
  }
}

function generateTiles() {
  tiles = [];
  for (let i = 0; i < nTilesX; i++) {
    for (let j = 0; j < nTilesY; j++) {
      let tile = new Tile(i, j);
      tiles.push(tile);
    }
  }
}

function generateBombs() {
  let placedBombs = 0;
  while (placedBombs < nBombs) {
    let randomIndex = Math.floor(Math.random() * tiles.length);
    if (!tiles[randomIndex].isBomb) {
      tiles[randomIndex].isBomb = true;
      placedBombs++;
    }
  }
}

function calculateBombsAround(tile) {
  let bombCounter = 0;
  for (let i = tile.i - 1; i <= tile.i + 1; i++) {
    for (let j = tile.j - 1; j <= tile.j + 1; j++) {
      if (i != tile.i || j != tile.j) {
        if (getTile(i, j)?.isBomb) bombCounter += 1;
      }
    }
  }
  return bombCounter;
}

function getTile(i, j) {
  return tiles.find(t => t.i == i && t.j == j);
}

function initializeGame() {
  generateTiles();
  generateBombs();
  tiles.forEach(tile => {
    tile.bombsAround = calculateBombsAround(tile);
  });
  gameOver = false;
  draw();
}

function draw() {
  ctx.clearRect(0, 0, 411, 411);
  tiles.forEach(t => {
    drawTile(t);
  });
}

function drawTile(tile) {
  let x = (tile.i * 41) + 1;
  let y = (tile.j * 41) + 1;
  if (tile.isOpen) {
    if (tile.isBomb) {
      ctx.fillStyle = "red";
      ctx.fillRect(x, y, 40, 40);
      ctx.drawImage(bombsImage, x, y, 40, 40);
    } else {
      ctx.drawImage(freeGif, x, y, 40, 40);
      if (tile.bombsAround) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(tile.bombsAround, x + 25, y + 38);
      }
    }
  } else {
    if (tile.marked) {
      ctx.fillStyle = "#0000ff";
    } else {
      ctx.fillStyle = "#aaaaaa";
    }
    ctx.fillRect(x, y, 40, 40);
  }
}

function openTile(tile) {
  if (tile.isOpen || tile.marked || gameOver) return;
  tile.isOpen = true;
  if (tile.isBomb) {
    gameOver = true;
    draw();
    setTimeout(() => {
      alert('Oh, Você acertou em uma Bomba!');
      initializeGame();
    }, 1000);
  } else {
    if (!tile.openedAround && tile.bombsAround == 0) openAround(tile);
    draw();
    checkWinCondition();
  }
}

function openAround(tile) {
  tile.openedAround = true;
  for (let i = tile.i - 1; i <= tile.i + 1; i++) {
    for (let j = tile.j - 1; j <= tile.j + 1; j++) {
      if (i != tile.i || j != tile.j) {
        const currentTile = getTile(i, j);
        if (currentTile && !currentTile?.isBomb) openTile(currentTile);
      }
    }
  }
}

function checkWinCondition() {
  let allTilesOpened = tiles.every(tile => tile.isOpen || tile.isBomb);
  let allBombsDisarmed = tiles.filter(tile => tile.isBomb).every(tile => !tile.isBomb);
  if (allTilesOpened || allBombsDisarmed) {
    gameOver = true;
    draw();
    setTimeout(() => {
      alert('Parabéns, você venceu a batalha!');
      initializeGame();
    }, 1000);
  }
}

initializeGame();

document.addEventListener("click", e => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const i = Math.floor((mouseX / 411) * 10);
  const j = Math.floor((mouseY / 411) * 10);
  let tile = getTile(i, j);
  openTile(tile);
});

document.addEventListener("contextmenu", e => {
  e.preventDefault();
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const i = Math.floor((mouseX / 411) * 10);
  const j = Math.floor((mouseY / 411) * 10);
  let tile = getTile(i, j);
  if (!tile.isOpen) {
    if (tile.isBomb) {
      tile.isBomb = false; // Desarma a bomba
      tile.marked = !tile.marked;
      alert('Parabéns! Você desarmou uma bomba!');
      checkWinCondition();
    } else {
      gameOver = true;
      draw();
      setTimeout(() => {
        alert('Oh, não tinha Bomba aqui! Game Over pra você!');
        initializeGame();
      }, 1000);
    }
    draw();
  }
});

