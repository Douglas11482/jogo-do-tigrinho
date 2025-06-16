const symbols = ['🐯', '🍒', '🍋', '💎', '🔔', '🍀', '⭐', '7️⃣', '👑'];
const grid = document.getElementById('grid');
const balanceEl = document.getElementById('balance');
const betEl = document.getElementById('bet');
const messageEl = document.getElementById('message');
const spinBtn = document.getElementById('spin');
const fastSpinBtn = document.getElementById('fast-spin');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');

let balance = 1000;
let spinning = false;

function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const div = document.createElement('div');
    div.classList.add('grid-item');
    div.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    grid.appendChild(div);
  }
}

function getGridSymbols() {
  return [...document.querySelectorAll('.grid-item')].map(el => el.textContent);
}

function checkWin(symbols) {
  const wins = [
    [0, 1, 2], // Linha 1
    [3, 4, 5], // Linha 2
    [6, 7, 8], // Linha 3
    [0, 4, 8], // Diagonal principal
    [2, 4, 6]  // Diagonal secundária
  ];

  for (const [a, b, c] of wins) {
    if (symbols[a] === symbols[b] && symbols[b] === symbols[c]) {
      return symbols[a];
    }
  }

  return null;
}

function spin(speed = 200) {
  if (spinning) return;
  const bet = parseInt(betEl.value);
  if (isNaN(bet) || bet <= 0) {
    messageEl.textContent = "Aposta inválida!";
    return;
  }
  if (bet > balance) {
    messageEl.textContent = "Saldo insuficiente!";
    return;
  }

  spinning = true;
  messageEl.textContent = '';
  spinSound.play();

  let iterations = 10;
  let interval = setInterval(() => {
    createGrid();
    iterations--;
    if (iterations <= 0) {
      clearInterval(interval);
      const finalSymbols = getGridSymbols();
      const winSymbol = checkWin(finalSymbols);
      if (winSymbol) {
        const winnings = bet * 5;
        balance += winnings;
        messageEl.textContent = `Você ganhou R$ ${winnings}!`;
        winSound.play();
      } else {
        balance -= bet;
        messageEl.textContent = 'Tente novamente!';
      }
      balanceEl.textContent = balance;
      spinning = false;
    }
  }, speed);
}

spinBtn.addEventListener('click', () => spin(200));
fastSpinBtn.addEventListener('click', () => spin(80));

createGrid();

// Tigrinho animado no fundo (estrelas ou partículas)
const canvas = document.getElementById("tigrinho-bg");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticles() {
  particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    d: Math.random() * 0.5 + 0.2,
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
    ctx.fill();
    p.y += p.d;
    if (p.y > canvas.height) {
      p.y = 0;
      p.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(drawParticles);
}

createParticles();
drawParticles();
