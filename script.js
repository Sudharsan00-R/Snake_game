
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;

let snakes = {
    p1: {
        body: [{ x: 200, y: 300 }, { x: 180, y: 300 }, { x: 160, y: 300 }],
        dx: GRID_SIZE,
        dy: 0,
        score: 0,
        color: '#FF3366' // Neon red
    },
    p2: {
        body: [{ x: 600, y: 300 }, { x: 620, y: 300 }, { x: 640, y: 300 }],
        dx: -GRID_SIZE,
        dy: 0,
        score: 0,
        color: '#33D1FF' // Neon blue
    }
};

let foods = {
    p1: { x: 400, y: 200, color: '#FF3366' },
    p2: { x: 400, y: 400, color: '#33D1FF' }
};

let gameOver = false;

function initGame() {
    snakes.p1.body = [{ x: 200, y: 300 }, { x: 180, y: 300 }, { x: 160, y: 300 }];
    snakes.p2.body = [{ x: 600, y: 300 }, { x: 620, y: 300 }, { x: 640, y: 300 }];
    snakes.p1.dx = GRID_SIZE;
    snakes.p1.dy = 0;
    snakes.p2.dx = -GRID_SIZE;
    snakes.p2.dy = 0;
    snakes.p1.score = 0;
    snakes.p2.score = 0;
    placeFood('p1');
    placeFood('p2');
    gameOver = false;
    updateScores();
    document.getElementById('gameOver').style.display = 'none';
}

function placeFood(player) {
    do {
        foods[player].x = Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE;
        foods[player].y = Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE;
    } while (isPositionOccupied(foods[player]));
}

function isPositionOccupied(pos) {
    return Object.values(snakes).some(snake =>
        snake.body.some(segment => segment.x === pos.x && segment.y === pos.y)
    );
}

function updateScores() {
    document.getElementById('score1').textContent = snakes.p1.score;
    document.getElementById('score2').textContent = snakes.p2.score;
}

function gameLoop() {
    if (gameOver) return;
    moveSnakes();
    if (checkCollisions()) return;
    checkFood();
    draw();
    setTimeout(gameLoop, 100);
}

function moveSnakes() {
    const head1 = { x: snakes.p1.body[0].x + snakes.p1.dx, y: snakes.p1.body[0].y + snakes.p1.dy };
    snakes.p1.body.unshift(head1);
    snakes.p1.body.pop();

    const head2 = { x: snakes.p2.body[0].x + snakes.p2.dx, y: snakes.p2.body[0].y + snakes.p2.dy };
    snakes.p2.body.unshift(head2);
    snakes.p2.body.pop();
}

function checkCollisions() {
    const head1 = snakes.p1.body[0];
    const head2 = snakes.p2.body[0];
    let loser = '';

    if (head1.x < 0 || head1.x >= canvas.width || head1.y < 0 || head1.y >= canvas.height) loser = 'Player 1';
    if (head2.x < 0 || head2.x >= canvas.width || head2.y < 0 || head2.y >= canvas.height) loser = 'Player 2';

    if (snakes.p1.body.slice(1).some(s => s.x === head1.x && s.y === head1.y)) loser = 'Player 1';
    if (snakes.p2.body.slice(1).some(s => s.x === head2.x && s.y === head2.y)) loser = 'Player 2';

    if (snakes.p2.body.some(s => s.x === head1.x && s.y === head1.y)) loser = 'Player 1';
    if (snakes.p1.body.some(s => s.x === head2.x && s.y === head2.y)) loser = 'Player 2';

    if (loser) {
        gameOver = true;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('loserText').textContent = `${loser} loses!`;
        return true;
    }
    return false;
}

function checkFood() {
    if (snakes.p1.body[0].x === foods.p1.x && snakes.p1.body[0].y === foods.p1.y) {
        snakes.p1.score++;
        snakes.p1.body.push({ ...snakes.p1.body[snakes.p1.body.length - 1] });
        placeFood('p1');
        updateScores();
    }

    if (snakes.p2.body[0].x === foods.p2.x && snakes.p2.body[0].y === foods.p2.y) {
        snakes.p2.score++;
        snakes.p2.body.push({ ...snakes.p2.body[snakes.p2.body.length - 1] });
        placeFood('p2');
        updateScores();
    }
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSnake(snakes.p1);
    drawSnake(snakes.p2);
    drawFood(foods.p1);
    drawFood(foods.p2);
}

function drawSnake(snake) {
    ctx.shadowBlur = 10;
    ctx.shadowColor = snake.color;
    ctx.fillStyle = snake.color;
    snake.body.forEach(segment => {
        ctx.fillRect(segment.x + 1, segment.y + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    ctx.shadowBlur = 0;
}

function drawFood(food) {
    ctx.shadowBlur = 15;
    ctx.shadowColor = food.color;
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, GRID_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function resetGame() {
    initGame();
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    switch (e.key) {
        case 'ArrowUp': if (snakes.p1.dy === 0) { snakes.p1.dx = 0; snakes.p1.dy = -GRID_SIZE; } break;
        case 'ArrowDown': if (snakes.p1.dy === 0) { snakes.p1.dx = 0; snakes.p1.dy = GRID_SIZE; } break;
        case 'ArrowLeft': if (snakes.p1.dx === 0) { snakes.p1.dx = -GRID_SIZE; snakes.p1.dy = 0; } break;
        case 'ArrowRight': if (snakes.p1.dx === 0) { snakes.p1.dx = GRID_SIZE; snakes.p1.dy = 0; } break;
        case 'w': case 'W': if (snakes.p2.dy === 0) { snakes.p2.dx = 0; snakes.p2.dy = -GRID_SIZE; } break;
        case 's': case 'S': if (snakes.p2.dy === 0) { snakes.p2.dx = 0; snakes.p2.dy = GRID_SIZE; } break;
        case 'a': case 'A': if (snakes.p2.dx === 0) { snakes.p2.dx = -GRID_SIZE; snakes.p2.dy = 0; } break;
        case 'd': case 'D': if (snakes.p2.dx === 0) { snakes.p2.dx = GRID_SIZE; snakes.p2.dy = 0; } break;
    }
});

initGame();
gameLoop();
