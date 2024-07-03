const canvas = document.getElementById("canvas-jogo");
const ctx = canvas.getContex("2d");


var tiles = [];
const nTilesX= 10;
const nTilesY= 10;


class Tile {
  construtor(i,j){
    this.i = i;
    this.j = j;
    this.isBomb = false;
    this.isOpen = false;
    this.bombsAroud = 0;
    this.market = false;
  }
 }

function generateTiles(){
  for(let i = 0; i < nTilesX; i++){
    for(let j = 0; j < nTilesY; j++){
      let tile = new Tile(i,j);
      tiles.push(tile);
    }
  }
}

generateTiles();

function draw(){
  tiles.map(t=>{
    ctx.fillStyle = "#999999";
    let x = (t.i * 51) + 1;
    let y = (t.j * 51) + 1;
    ctx.fillRect(x,y,50,50);
  })
}

draw();
