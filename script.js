const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake, direction, food, score, speed, interval;
const gridSize = 20;

const screens = {
  start: document.getElementById("startScreen"),
  game: document.getElementById("gameScreen"),
  over: document.getElementById("gameOverScreen"),
  leaderboard: document.getElementById("leaderboardScreen")
};

function showScreen(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function initGame() {
  snake = [{x: 200, y: 200}];
  direction = "RIGHT";
  score = 0;
  speed = 150;

  spawnFood();
  document.getElementById("score").textContent = score;

  clearInterval(interval);
  interval = setInterval(gameLoop, speed);
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

function gameLoop() {
  update();
  draw();
}

function update() {
  const head = {...snake[0]};

  if (direction === "RIGHT") head.x += gridSize;
  if (direction === "LEFT") head.x -= gridSize;
  if (direction === "UP") head.y -= gridSize;
  if (direction === "DOWN") head.y += gridSize;

  if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
    return gameOver();
  }

  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = score;

    spawnFood();

    if (score % 10 === 0) {
      speed -= 10;
      clearInterval(interval);
      interval = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "cyan";
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });

  ctx.fillStyle = "magenta";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function gameOver() {
  clearInterval(interval);

  document.getElementById("finalScore").textContent = score;

  saveScore(score);

  showScreen(screens.over);
}

function saveScore(newScore) {
  let scores = JSON.parse(localStorage.getItem("cyberSnakeLeaders")) || [];

  scores.push(newScore);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);

  localStorage.setItem("cyberSnakeLeaders", JSON.stringify(scores));
}

function loadLeaderboard() {
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";

  let scores = JSON.parse(localStorage.getItem("cyberSnakeLeaders")) || [];

  scores.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${score}`;
    list.appendChild(li);
  });
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

document.getElementById("startBtn").onclick = () => {
  showScreen(screens.game);
  initGame();
};

document.getElementById("restartBtn").onclick = () => {
  showScreen(screens.game);
  initGame();
};

document.getElementById("leaderboardBtn").onclick = () => {
  loadLeaderboard();
  showScreen(screens.leaderboard);
};

document.getElementById("backBtn").onclick = () => {
  showScreen(screens.start);
};
