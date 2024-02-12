document.addEventListener('DOMContentLoaded', function () {
  const startScreen = document.getElementById('start-screen');
  const startButton = document.getElementById('start-button');
  const gameContainer = document.getElementById('game-container');
  const snake = document.getElementById('snake');
  const food = document.getElementById('food');
  const endScreen = document.getElementById('end-screen');
  const restartButton = document.getElementById('restart-button');
  const scoreDisplay = document.getElementById('score');
  const difficultySelect = document.getElementById('difficulty');

  let snakeSegments = [{ x: 0, y: 0 }];
  let foodX = 0;
  let foodY = 0;
  let score = 0;
  let speed = 200;
  let interval;
  let dx = 20;
  let dy = 0;
  let gameStarted = false;
  let tailLength = 5; // Длина хвоста

  function startGame() {
    gameStarted = true;
    startScreen.style.display = 'none';
    endScreen.style.display = 'none';
    clearInterval(interval);
    score = 0;
    snakeSegments = [{ x: 0, y: 0 }];
    const difficulty = difficultySelect.value;
    switch (difficulty) {
      case 'easy':
        speed = 20;
        break;
      case 'normal':
        speed = 15;
        break;
      case 'hard':
        speed = 10;
        break;
      default:
        speed = 150;
    }
    interval = setInterval(moveSnake, speed);
    generateFood();
  }

  function endGame() {
    gameStarted = false;
    clearInterval(interval);
    scoreDisplay.textContent = 'Score: ' + score;
    endScreen.style.display = 'block';
  }

  function moveSnake() {
    const newHead = { x: snakeSegments[0].x + dx, y: snakeSegments[0].y + dy };
    snakeSegments.unshift(newHead);

    if (snakeSegments[0].x === foodX && snakeSegments[0].y === foodY) {
      score++;
      generateFood();
      tailLength += 2; // Увеличиваем длину хвоста при съедании еды
    } else {
      // Удаляем лишние сегменты хвоста, если длина хвоста превышает заданное значение
      while (snakeSegments.length > tailLength) {
        snakeSegments.pop();
      }
    }

    renderSnake();
    checkCollisions();
  }

  function renderSnake() {
    snake.innerHTML = '';
    snakeSegments.forEach((segment, index) => {
      const segmentElement = document.createElement('div');
      segmentElement.className = 'snake-segment';
      segmentElement.style.left = segment.x + 'px';
      segmentElement.style.top = segment.y + 'px';
      snake.appendChild(segmentElement);
    });
  }

  function checkCollisions() {
    for (let i = 1; i < snakeSegments.length; i++) {
      if (
        snakeSegments[i].x === snakeSegments[0].x &&
        snakeSegments[i].y === snakeSegments[0].y
      ) {
        endGame();
        break;
      }
    }

    if (
      snakeSegments[0].x < 0 ||
      snakeSegments[0].x >= gameContainer.offsetWidth ||
      snakeSegments[0].y < 0 ||
      snakeSegments[0].y >= gameContainer.offsetHeight
    ) {
      endGame();
    }
  }

  function generateFood() {
    foodX = Math.floor(Math.random() * (gameContainer.offsetWidth / 20)) * 20;
    foodY = Math.floor(Math.random() * (gameContainer.offsetHeight / 20)) * 20;
    food.style.left = foodX + 'px';
    food.style.top = foodY + 'px';
  }

  startButton.addEventListener('click', startGame);

  restartButton.addEventListener('click', startGame);

  document.addEventListener('keydown', function (event) {
    if (gameStarted) {
      switch (event.key) {
        case 'ArrowLeft':
          if (dx !== 20) {
            dx = -20;
            dy = 0;
          }
          break;
        case 'ArrowRight':
          if (dx !== -20) {
            dx = 20;
            dy = 0;
          }
          break;
        case 'ArrowUp':
          if (dy !== 20) {
            dx = 0;
            dy = -20;
          }
          break;
        case 'ArrowDown':
          if (dy !== -20) {
            dx = 0;
            dy = 20;
          }
          break;
      }
    }
  });
});
