

const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS    = 20;
let playfield;
let cells;
let isPaused = false;
let timedId;
let isGameOver = false;
let overlay = document.querySelector('.overlay');
let ScoreElement = document.querySelector('.Score');
let btnRestart = document.querySelector('.btn-restart');
let GbtnRestart = document.querySelector('.G-btn-restart');
let Score = 0;
let RScore = 0
let RScoreElement = document.querySelector('.R-Score');
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

function init(){
    Score = 0;
    RScore = 0;
    ScoreElement.innerHTML = 0;
    RScoreElement.innerHTML = 0;
    //RScore = Score;
    isGameOver = false;
    generatePlayfield()
    cells = document.querySelectorAll('.tetris div');
    generateTetromino()
    
    moveDown();
    drawPlayfield();
    drawTetromino();
}

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
    const rowTetro    = -2;


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

// keyboard and clicks

btnRestart.addEventListener('click', function(){
    document.querySelector('.tetris').innerHTML = '';
    overlay.style.display = 'none';

    init();
})

GbtnRestart.addEventListener('click', function()
{
   document.querySelector('.tetris').innerHTML = '';

   init();
})


document.addEventListener('keydown', onKeyLeft)

function onKeyLeft(event){
    
    if(event.key == 'Escape'){
        togglePaused();
    }

    if(!isPaused) {
        if(event.key == ' ')
            {
                dropTetrominoDown()
            }

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
    }
    draw()
}

const btnLeft = document.querySelector('.ArrowLeft')
const btnRight = document.querySelector('.ArrowRight')

btnLeft.addEventListener('click', function(){
    moveTetrominoLeft()
    draw()
})
btnRight.addEventListener('click', function(){
    moveTetrominoRight()
    draw()
})


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

function dropTetrominoDown()
{
    while(isValid())
        {
        tetromino.row++;
        }

        tetromino.row--;
}

function togglePaused()
{
    if(isPaused)
        {
            startLoop()
        }
        else 
        {
            stopLoop();
        }
        isPaused = !isPaused;
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
      const rotateMatrix = [


      ];

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

function isOutsideOfTopGameBoard(row)
{
    return tetromino.row + row < 0;
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
              if(isOutsideOfTopGameBoard(row)) {continue}
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

function countScore(destroyRows)
{
   if(destroyRows == 1)
   {
    Score += 100;
    RScore += 100;
   }
   if(destroyRows == 2)
   {
    Score += 225;
    RScore += 225;
   }
   if(destroyRows == 3)
   {
    Score += 350;
    Score += 350;
   }
   if(destroyRows == 4)
   {
    Score += 475;
    RScore += 475;
   }

   ScoreElement.innerHTML = Score;
   RScoreElement.innerHTML = RScore;
}

function placeTetromino(){
    const tetrominoMatrixSize = tetromino.matrix.length;
    for(let row = 0; row < tetrominoMatrixSize; row++){
        for (let column = 0; column < tetrominoMatrixSize; column++){
            if(isOutsideOfTopGameBoard(row))
                {
                    isGameOver = true;
                    //RScore.innerHTML = Score;
                    overlay.style.display = 'flex';
                    return;
                }
           
            if(tetromino.matrix[row][column]){
                     playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }

    }
    let filledRows = findfilledRows();
    removefilledRows(filledRows)
    countScore(filledRows.length)
   generateTetromino()
}


function findfilledRows()
{
    const fillRows = [];

    for(let row = 0; row < PLAYFIELD_ROWS; row++)
        {
            let filledColumns = 0;
               for(let column = 0; column < PLAYFIELD_COLUMNS; column++)
                {
                    if (playfield[row][column] !=0)
                        {
                            filledColumns++;
                        }
                }
                //for 2
                if (PLAYFIELD_COLUMNS == filledColumns)
                    {
                        fillRows.push(row);
                    }
        }
        // for 1
        return fillRows;
}
// findFilledRows

function removefilledRows(filledRows)
{
    for (let i = 0; i < filledRows.length; i++)
        {
            const row = filledRows[i];
            dropRowsAbove(row);
        }
}

function dropRowsAbove(rowDelete)
{
    for (let row = rowDelete; row > 0 ; row--)
        {
            playfield[row] = playfield[row - 1]
        }
        playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
    
}

function moveDown()
{
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
}

function startLoop()
{
   timedId = setTimeout(  ()=> requestAnimationFrame(moveDown), 700 )
}

startLoop()

function stopLoop()
{
  clearTimeout(timedId); 

  timedId = null;
}

init();