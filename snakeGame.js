const gameBoard = document.getElementById('gameBoard');
const scoreBoard = document.getElementById('scoreBoard');

let gridSize = 20; // Size of each cell in pixels
let totalCells;
let boardWidth;
let boardHeight;

let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 }; // Start moving to the right
let food = { x: 10, y: 10 }; // Initialize food to some default value
let score = 0;

document.addEventListener('keydown', changeDirection);
window.addEventListener('resize', resizeBoard);

function initializeGame() {
    resizeBoard();
    food = generateFood();
    gameLoop();
}

function resizeBoard() {
    boardWidth = Math.floor(window.innerWidth / gridSize);
    boardHeight = Math.floor(window.innerHeight / gridSize);
    totalCells = boardWidth * boardHeight;

    gameBoard.style.width = `${boardWidth * gridSize}px`;
    gameBoard.style.height = `${boardHeight * gridSize}px`;
    gameBoard.style.gridTemplateColumns = `repeat(${boardWidth}, ${gridSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${boardHeight}, ${gridSize}px)`;

    // Adjust snake position to stay within bounds after resizing
    snake.forEach(segment => {
        segment.x = Math.min(segment.x, boardWidth - 1);
        segment.y = Math.min(segment.y, boardHeight - 1);
    });

    // Adjust food position to stay within bounds after resizing
    if (food.x >= boardWidth) food.x = boardWidth - 1;
    if (food.y >= boardHeight) food.y = boardHeight - 1;
}

function gameLoop() {
    update();
    if (isGameOver()) {
        alert("Game Over! Your score was " + score);
        document.location.reload();
    } else {
        draw();
        setTimeout(gameLoop, 100);
    }
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function draw() {
    gameBoard.innerHTML = '';

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gameBoard.appendChild(cell);
    }

    snake.forEach(segment => {
        const index = segment.y * boardWidth + segment.x;
        if (index >= 0 && index < totalCells) {
            gameBoard.children[index].classList.add('snake');
        }
    });

    const foodIndex = food.y * boardWidth + food.x;
    if (foodIndex >= 0 && foodIndex < totalCells) {
        gameBoard.children[foodIndex].classList.add('food');
    }

    scoreBoard.textContent = `Score: ${score}`;
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    if (keyPressed === LEFT && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (keyPressed === UP && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (keyPressed === RIGHT && direction.x === 0) {
        direction = { x: 1, y: 0 };
    } else if (keyPressed === DOWN && direction.y === 0) {
        direction = { x: 0, y: 1 };
    }
}

function generateFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * boardWidth);
        y = Math.floor(Math.random() * boardHeight);
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

function isGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= boardWidth || head.y < 0 || head.y >= boardHeight) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

initializeGame();
