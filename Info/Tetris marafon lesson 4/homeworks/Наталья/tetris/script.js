const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;

let playfileld;

const TETROMINO_NAMES = [
    "O",
    "L",
    "J",
    "I",
    "Z",
    "S",
    "T",
    "T2",
    "plus",
    "point",
    "r"
];

const TETROMINOES = {
    "O": [
        [1, 1],
        [1, 1]
    ],

    "L": [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],

    "J": [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],

    "I": [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],

    "Z": [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],

    "S": [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],

    "T": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],

    "T2": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],

    "plus": [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],

    "point": [
        [1]
    ],

    "r": [
        [1, 0],
        [1, 1]
    ]
};

let tetromino = {
    name: "",
    matrix: [],
    column: 0,
    row: 0
}



//малюємо поле та матрицю з 0 відповідно до кожного div
function generatePlayfield() {

    for (let i = 0; i < PLAYFILED_COLUMNS * PLAYFILED_ROWS; i++) {
        const div = document.createElement("div");
        document.querySelector(".tetris").append(div);
    };

    playfileld = new Array(PLAYFILED_ROWS).fill()
        .map(() => new Array(PLAYFILED_COLUMNS).fill(0))
};

//обирається та фіксується данні про наступну деталь
function generateTetromino() {
    const nameTetro = randomFigure(TETROMINO_NAMES);
    const matrix = TETROMINOES[nameTetro];

    const columnTetro = Math.floor(PLAYFILED_COLUMNS / 2 - matrix.length / 2); //початкові позиції фігури
    const rowTetro = -2;

    tetromino = {
        name: nameTetro,
        matrix: matrix,
        column: columnTetro,
        row: rowTetro
    }
};

function draw() {
    // drawPlayfield();
    cells.forEach(element => element.removeAttribute("class"));
    drawPlayfield();
    drawTetromino ();
};

function drawPlayfield() {

    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if(!playfileld[row][column]) continue;
            const nameFigure = playfileld[row][column];
            const cellIndex = convertPositionToIndex(row, column);

            cells[cellIndex].classList.add(nameFigure)
        }
    }
};

function drawTetromino () {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if(!tetromino.matrix[row][column]){continue}
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            if(cellIndex < 0){continue}  //ДЗ 2 1. Поставити const rowTetro = -2; і прописати код таким чином, щоб працювало коректно
            cells[cellIndex].classList.add(name)
        }        
    }
};

function convertPositionToIndex(row, column) {
    return row * PLAYFILED_COLUMNS + column
};


//keyboard

document.addEventListener("keydown", onKeyDown);

function onKeyDown(event) {
    if (event.key == "ArrowLeft") {
        moveTetraminoLeft()
    }else if (event.key == "ArrowRight") {
        moveTetraminoRight()
    }else if (event.key == "ArrowDown") {
        moveTetraminoDoun()
    }else if(event.key == "ArrowUp"){
        rotate()
    }
    draw();
};

function moveTetraminoLeft() {
    tetromino.column -= 1;
    if (!isValid()) {
        tetromino.column += 1
    }
};

function moveTetraminoRight() {
    tetromino.column += 1
    if (!isValid()) {
        tetromino.column -= 1
    }
};

function moveTetraminoDoun() {
    tetromino.row += 1
    if (!isValid()) {
        tetromino.row -= 1;
        placeTetramino();
    }
};


//rotate

function rotate() {
    rotateTetramino();
    draw()
}

function rotateTetramino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(oldMatrix);
    tetromino.matrix = rotatedMatrix;
    if(!isValid()){
        tetromino.matrix = oldMatrix
    }
}

function rotateMatrix(matrixTetramino) {
    const N = matrixTetramino.length;
    const rotateMatrix = [];

    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetramino[N - j - 1][i];            
        }        
    }

    return rotateMatrix
}


//collisions

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if(isOutsideofGameboard(row, column)){
                return false
            }
            if(hasCollisions(row, column)){
                return false
            }   
        }        
    }
    return true
}

function isOutsideofGameboard(row, column) {
    return tetromino.matrix[row][column] &&
            (tetromino.row + row >= PLAYFILED_ROWS ||
            tetromino.column + column >= PLAYFILED_COLUMNS ||
            tetromino.column + column < 0)
};

function hasCollisions(row, column) {
    return tetromino.matrix[row][column] && playfileld[tetromino.row + row] ?. [tetromino.column + column]
}

function randomFigure(array) {
    let num = Math.floor(Math.random() * array.length);
    return array[num]
};

function placeTetramino() {
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row <tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if(tetromino.matrix[row][column]){
                playfileld[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }        
    }

    generateTetromino()
}

generatePlayfield();

let cells = document.querySelectorAll(".tetris div");

generateTetromino();
draw();

//ДЗ 2 3. Реалізувати самостійний рух падіння фігур до низу

let timerId = setTimeout(function tick() {
    moveTetraminoDoun()
    draw();
    timerId = setTimeout(tick, 1000); // (*)
  }, 1000);