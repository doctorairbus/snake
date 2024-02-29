document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM caricato");

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  if (!canvas || !ctx) {
    console.error("Impossibile ottenere il canvas o il contesto del disegno.");
    return;
  }

  const tileSize = 20;
  let speed = 900;
  let direction = 'right';
  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let score = 0;
  let gameInterval;

  function startGame() {
    clearInterval(gameInterval);

    speed = 150;
    direction = 'right';
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    score = 0;

    generateFood();
    gameInterval = setInterval(draw, speed);
    canvas.focus();
  }

  function draw() {
    console.log("Disegno del gioco");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();

    moveSnake();
    checkCollision();
  }

  function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
      ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
  }

  function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
  }

  function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
  }

  function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === 'right') head.x++;
    if (direction === 'left') head.x--;
    if (direction === 'up') head.y--;
    if (direction === 'down') head.y++;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      generateFood();
      increaseSpeed();
    } else {
      snake.pop();
    }
  }

  function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / tileSize));
    food.y = Math.floor(Math.random() * (canvas.height / tileSize));
  }

  function increaseSpeed() {
    speed -= 5; // Increase speed
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
  }

  function checkCollision() {
    const head = snake[0];
    if (
      head.x < 0 || head.x >= canvas.width / tileSize ||
      head.y < 0 || head.y >= canvas.height / tileSize ||
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      clearInterval(gameInterval);
      const playAgain = confirm('Game Over! Your Score: ' + score + '\nPlay Again?');
      if (playAgain) {
        startGame();
      }
    }
  }

  canvas.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
  });

  canvas.addEventListener('touchstart', event => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  });

  canvas.addEventListener('touchmove', event => {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && direction !== 'left') direction = 'right';
      else if (dx < 0 && direction !== 'right') direction = 'left';
    } else {
      if (dy > 0 && direction !== 'up') direction = 'down';
      else if (dy < 0 && direction !== 'down') direction = 'up';
    }
  });

  startGame();
});
