

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS    = 20;
let playfield;
let Score;
const TETROMINO_NAMES = [
    'R',
    'Y',
    'G',
    'C',
    'B',
    'O',
    'P',
    'BR',
    'BL',
    'W'
]

const TETROMINOES = {
    'R' : [
        [1, 1],
        [1, 1]
    ],
    'Y' : [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    'G' : [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
        
    ],
    'C' :  [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
    'B' : [
        [1]
    ],
     'O' : [
            [1, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
    
    'P' : [
        [1, 1, 1],
        [1, 0, 1],
        [0, 0, 0]
    ],
    'BR' : [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1]
    ],
    'BL' : [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'W' : [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ]

}

let tetromino = {
    name: '',
    matrix: [],
    column: 0,
    row: 0
}


// common

function convertPositionToIndex(row, col){
 return row * PLAYFIELD_COLUMNS + col;
}

function randomFigure(array){
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


//score

//function showScore(){


   // Score = new component("30px", "Consolas", "black", 360, 40, "text");
   // Score.text = "Score"

// const Score = Math.floor( score + 125 - matrix.width * 2 )
//}
// generate

function generateTetromino(){
    const nameTetro = randomFigure(TETROMINO_NAMES);
    const matrix    = TETROMINOES[nameTetro];

    const columnTetro = Math.floor( PLAYFIELD_COLUMNS / 2 - matrix.length / 2);
    const rowTetro    = 0;


    tetromino = {
        name: nameTetro,
        matrix: matrix,
        column: columnTetro,
        row: rowTetro,
    }
}

function generatePlayfield(){

    for(let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++ ){
       const div = document.createElement('div');
       document.querySelector('.tetris').append(div);
    }
    playfield = new Array(PLAYFIELD_ROWS).fill()
                    .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0) )

                    console.table(playfield)
}

// keyboard

document.addEventListener('keydown', onKeyLeft)

function onKeyLeft(event){
     
    if(event.key == 'ArrowUp'){
        rotate();
    }
    if(event.key == 'ArrowLeft'){
        moveTetrominoLeft()
    }
    
    if(event.key == 'ArrowRight'){
        
        moveTetrominoRight()
    }
    if(event.key == 'ArrowDown'){
        
         moveTetrominoDown()
        
    }
    draw()
}

function moveTetrominoDown(){
    tetromino.row += 1;
    if(!isValid()){
        tetromino.row -= 1;
        placeTetromino()   
    }
}
function moveTetrominoLeft(){
    tetromino.column -= 1;
    if (!isValid()){
        tetromino.column +=1;
    }
}
function moveTetrominoRight(){
    tetromino.column += 1;
    if (!isValid()){
        tetromino.column -=1;
    }
}
function draw(){
    cells.forEach( el => el.removeAttribute('class') )
    drawPlayfield();
    drawTetromino();
}

// rotate
// Код для прикладу алгоритму обертання фігур
//let showRotated = [
 //   [1, 2, 3],
  //  [4, 5, 6],
  //  [7, 8, 9]
//]

function rotate(){
    rotateTetromino();
    draw();
}

function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix)
   // showRotated = rotateMatrix(showRotated) // Код для прикладу алгоритму обертання фігур
    tetromino.matrix = rotatedMatrix;
    if (!isValid){
        tetromino.matrix = oldMatrix;
    }
    
}

function rotateMatrix(matrixTetromino){

      const N = matrixTetromino.length;
      const rotateMatrix = [];

      for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++ ){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
      }

      return rotateMatrix;
}

// collision

function isValid(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++)
        {
        for(let column = 0; column < matrixSize; column++)
            {
            if(isOutsideOfGameBoard(row, column)){ return false}
            if(hasCollisions(row, column)){ return false}
            
        }

    }
    
    return true;
}

function isOutsideOfGameBoard(row, column)
{
   return tetromino.matrix[row][column] &&  
          (tetromino.row + row >= PLAYFIELD_ROWS  || 
          tetromino.column + column < 0 || 
          tetromino.column + column >= PLAYFIELD_COLUMNS)
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] && playfield[tetromino.row + row]?.[tetromino.column + 
        column]
}

// falling

//function fallTetromino(){

   // for(let row = 0; row < tetrominoMatrixSize; row--)
      //  {
       //  for(let column = 0; column < tetrominoMatrixSize; column++)
         //   {
          //      moveTetrominoDown()
          //  }
    //}
//}


// drawing

function drawTetromino(){
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row++)
        {
        for(let column = 0; column < tetrominoMatrixSize; column++){
            // Код для прикладу алгоритму обертання фігур

           //  const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + 
           //     column);
             // cells[cellIndex].innerHTML = showRotated[row][column];

             if (!tetromino.matrix[row][column]) { continue }
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + 
                column);
            cells[cellIndex].classList.add(name);

        }

    }
}

function drawPlayfield(){
    for(let row = 0; row < PLAYFIELD_ROWS; row++){
       for (let column = 0; column < PLAYFIELD_COLUMNS; column++){
         
        if (!playfield[row][column]) continue;
        const nameFigure = playfield[row][column];
        const cellIndex = convertPositionToIndex(row, column);
        
        cells[cellIndex].classList.add(nameFigure);
       }
    }

}


function placeTetromino(){
    const tetrominoMatrixSize = tetromino.matrix.length;
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for (let column = 0; column < tetrominoMatrixSize; column++){
            if(tetromino.matrix[row][column]){
                     playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }

    }
   generateTetromino()
}

generatePlayfield()
let cells = document.querySelectorAll('.tetris div');
generateTetromino()

drawPlayfield()
drawTetromino()