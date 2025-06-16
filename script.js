// Setup valores para apostas e adicionar saldo
const addAmounts = [1, 2, 5, 10, 20, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400];
let currentAddIndex = 5; // Começa em R$20
let betAmounts = [1, 2, 4, 8, 16, 32, 64, 80, 100, 120, 140, 160, 180, 200, 240, 260, 320, 360, 400, 440, 480, 500];
let currentBetIndex = 0;

let balance = 100;
let spinning = false;
let spinSpeed = 1; // 1 = lento, 2 = médio, 3 = rápido
const maxSpeed = 3;

const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3')
];

const spinBtn = document.getElementById('spinBtn');
const speedBtn = document.getElementById('speedBtn');
const muteBtn = document.getElementById('muteBtn');
const addBalanceBtn = document.getElementById('addBalance');
const cycleAddAmountBtn = document.getElementById('cycleAddAmount');
const addAmountDisplay = document.getElementById('addAmountDisplay');
const betValueDisplay = document.getElementById('betValue');
const decreaseBetBtn = document.getElementById('decreaseBet');
const increaseBetBtn = document.getElementById('increaseBet');
const balanceDisplay = document.getElementById('balance');
const pixKeySpan = document.getElementById('pixKey');
const copyPixBtn = document.getElementById('copyPixBtn');

const fireworks = document.getElementById('fireworks');
const winMainText = document.getElementById('winMainText');
const winSubText = document.getElementById('winSubText');

const spinSound = document.getElementById('spinSound');
const winSound = document.getElementById('winSound');
const bigWinSound = document.getElementById('bigWinSound');

let soundEnabled = true;

const symbols = [
  '🐯', '🍀', '⭐', '💎', '🍒', '🍋', '🔔', '7️⃣', '🍉'
];

function updateDisplays() {
  addAmountDisplay.textContent = addAmounts[currentAddIndex];
  betValueDisplay.textContent = `R$ ${betAmounts[currentBetIndex]}`;
  balanceDisplay.textContent = `Saldo: R$ ${balance}`;
}

function playSound(sound) {
  if (!soundEnabled) return;
  sound.currentTime = 0;
  sound.play();
}

cycleAddAmountBtn.onclick = () => {
  currentAddIndex++;
  if (currentAddIndex >= addAmounts.length) currentAddIndex = 0;
  updateDisplays();
};

addBalanceBtn.onclick = () => {
  balance += addAmounts[currentAddIndex];
  updateDisplays();
};

decreaseBetBtn.onclick = () => {
  if (currentBetIndex > 0) {
    currentBetIndex--;
    updateDisplays();
  }
};

increaseBetBtn.onclick = () => {
  if (currentBetIndex < betAmounts.length - 1) {
    currentBetIndex++;
    updateDisplays();
  }
};

speedBtn.onclick = () => {
  spinSpeed++;
  if (spinSpeed > maxSpeed) spinSpeed = 1;
  speedBtn.textContent = spinSpeed === 1 ? '⏩' : spinSpeed === 2 ? '⏩⏩' : '⏩⏩⏩';
};

muteBtn.onclick = () => {
  soundEnabled = !soundEnabled;
  muteBtn.textContent = soundEnabled ? '🔊' : '🔇';
};

copyPixBtn.onclick = () => {
  navigator.clipboard.writeText(pixKeySpan.textContent).then(() => {
    alert('Chave Pix copiada!');
  });
};

function spinAnimation(reel, symbol) {
  return new Promise((resolve) => {
    let position = 0;
    const totalSteps = 30 * spinSpeed; // mais rápido = menos tempo
    const stepTime = 20 / spinSpeed;

    const interval = setInterval(() => {
      reel.textContent = symbols[position % symbols.length];
      position++;
      if (position > totalSteps) {
        clearInterval(interval);
        reel.textContent = symbol;
        resolve();
      }
    }, stepTime);
  });
}

function getRandomSymbol() {
  const idx = Math.floor(Math.random() * symbols.length);
  return symbols[idx];
}

function checkWin(resultSymbols) {
  // Vitória simples: se os 3 símbolos iguais na linha
  if (resultSymbols[0] === resultSymbols[1] && resultSymbols[1] === resultSymbols[2]) {
    return true;
  }
  return false;
}

function isMaxWin(amount) {
  // Definir valor máximo de ganho aqui
  return amount >= 500; // exemplo: 500 ou mais é máximo
}

async function spin() {
  if (spinning) return;
  if (balance < betAmounts[currentBetIndex]) {
    alert('Saldo insuficiente para apostar.');
    return;
  }
  spinning = true;

  playSound(spinSound);

  balance -= betAmounts[currentBetIndex];
  updateDisplays();

  // Simular sorteio rolando verticalmente
  const finalSymbols = [];
  for (let i = 0; i < 3; i++) {
    finalSymbols[i] = getRandomSymbol();
  }

  // Anima reels (rolagem vertical simulada)
  const promises = reels.map((reel, i) => spinAnimation(reel, finalSymbols[i]));
  await Promise.all(promises);

  const won = checkWin(finalSymbols);

  if (won) {
    let winAmount = betAmounts[currentBetIndex] * 10; // exemplo multiplicador
    balance += winAmount;
    updateDisplays();

    if (isMaxWin(winAmount)) {
      // Vitória máxima - animação especial
      winMainText.textContent = 'GRANDE GANHO';
      winSubText.textContent = 'Parabéns!!';
      fireworks.classList.remove('hidden');
      playSound(bigWinSound);

      await new Promise((r) => setTimeout(r, 2000));
      fireworks.classList.add('hidden');
    } else {
      // Vitória normal
      fireworks.classList.remove('hidden');
      winMainText.textContent = '';
      winSubText.textContent = '';
      playSound(winSound);
      await new Promise((r) => setTimeout(r, 2000));
      fireworks.classList.add('hidden');
    }
  }

  spinning = false;
}

spinBtn.onclick = spin;

updateDisplays();
