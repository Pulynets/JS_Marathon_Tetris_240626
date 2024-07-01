


const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

let playfield;

const TETROMINO_NAMES = [
    'O',
    'T',
    'I',
    'S',
    'Z',
    'J',
    'L'
]

const TETROMINOES = {
    'O' : [
        [1, 1],
        [1, 1]
        ],
    'T' : [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
        ],
    'I' : [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
        ],
    'S' : [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
        ],
    'Z' : [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
        ],
    'J' : [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
        ],
    'L' : [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
        ]
}

let tetromino = {
    name:   '',
    matrix: [],
    column: 0,
    row:    0
}

// COMMON
function convertPositionToIndex(row, col){
    return row * PLAYFIELD_COLUMNS + col;
}

// GENERATION
function generateTetromino(){
    const nameTetro   = getRandomFigure(TETROMINO_NAMES);
    const matrix      = TETROMINOES[nameTetro];
    const columnTetro = Math.floor( PLAYFIELD_COLUMNS / 2 - matrix.length / 2);
    const rowTetro    = 0;

    tetromino = {
        name:   nameTetro,
        matrix: matrix,
        column: columnTetro,
        row:    rowTetro
    }
}

function getRandomFigure(array){
    const figureIndex = Math.floor(Math.random() * (array.length));
    return array[figureIndex];
}

function generatePlayfield(){
    for(let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++)
        {
            const div = document.createElement('div');
            document.querySelector('.tetris').append(div);
        }

        playfield = new Array(PLAYFIELD_ROWS).fill()
                            .map( ()=> new Array(PLAYFIELD_COLUMNS).fill(0))
        
        console.table(playfield)
}

// KEYBOARD
document.addEventListener('keydown', onKeyDown)

function onKeyDown(event){

    if(event.key == 'ArrowLeft'){
        moveTetrominoLeft();
    }
    if(event.key == 'ArrowRight'){
        moveTetrominoRight();
    }
    if(event.key == 'ArrowDown'){
        moveTetrominoDown();
    }
    if(event.key == 'ArrowUp'){
        rotate();
    }
    draw()
}

function moveTetrominoLeft(){
    tetromino.column -= 1;
        if(!isValid()){
            tetromino.column += 1;
        }
}

function moveTetrominoRight(){
    tetromino.column += 1;
        if(!isValid()){
            tetromino.column -= 1;
        }
}

function moveTetrominoDown(){
    tetromino.row += 1;
        if(!isValid()){
            tetromino.row -= 1;
            placeTetramino()
        }
}

function draw(){
    cells.forEach( el => el.removeAttribute('class'))
    drawPlayfield();
    drawTetramino();
}

// ROTATE

// Код для прикладу обертання фігур
// let showRotated = [
//     [1,2,3],
//     [4,5,6],
//     [7,8,9]
// ]

function rotate(){
    rotateTetromino();
    draw();
}

function rotateTetromino(){
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    // showRotated = rotateMatrix(showRotated) // Код для прикладу обертання фігур
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix;
    }
}

function rotateMatrix(matrixTetromino){
    const N = matrixTetromino.length;
    const rotateMatrix = [];

    for(let i = 0; i < N; i++){
        rotateMatrix[i] = [];
        for(let j = 0; j < N; j++){
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
}

// COLLISIONS
function isValid(){
    const matrixSize = tetromino.matrix.length; 
    for(let row = 0; row < matrixSize; row++ ){
        for(let column = 0; column < matrixSize; column++){
            if(isOutsideGameBoard(row, column)){ return false }
            if(hasCollisions(row, column)){ return false }            
        }
    }

    return true;
}

function isOutsideGameBoard(row, column){
    return tetromino.matrix[row][column] &&
           (tetromino.row + row >= PLAYFIELD_ROWS ||
            tetromino.column + column < 0 ||
            tetromino.column + column >= PLAYFIELD_COLUMNS)
}

function hasCollisions(row, column){
    return tetromino.matrix[row][column] && playfield[tetromino.row + row]?.[tetromino.column + column]

}

// DRAW
function drawTetramino(){
    const name = tetromino.name;
    const tetraminoMatrixSize = tetromino.matrix.length;
      
    for(let row = 0; row < tetraminoMatrixSize; row++ ){
        for(let column = 0; column < tetraminoMatrixSize; column++){
            // Код для прикладу обертання фігур
            // const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            // cells[cellIndex].innerHTML = showRotated[row][column];


            if(!tetromino.matrix[row][column]){continue}
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
            
        }
    }
}

function drawPlayfield(){    
    for( let row = 0; row < PLAYFIELD_ROWS; row++ ){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if(!playfield[row][column]) continue;
           const nameFigure = playfield[row][column];
           const cellIndex  = convertPositionToIndex(row, column);

           cells[cellIndex].classList.add(nameFigure);
        }

    }
}

function placeTetramino(){
    const tetraminoMatrixSize = tetromino.matrix.length;

    for( let row = 0; row < tetraminoMatrixSize; row++ ){
        for(let column = 0; column < tetraminoMatrixSize; column++){
            if(tetromino.matrix[row][column]){
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }

    }

    generateTetromino()
}

// MAIN
generatePlayfield()
let cells = document.querySelectorAll('.tetris div');

generateTetromino()

draw()