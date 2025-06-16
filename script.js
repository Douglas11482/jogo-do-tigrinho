
const icons = ['🍒', '🍋', '🔔', '⭐', '🍀', '💎', '7️⃣'];
let balance = 0;
let betIndex = 0;
const betValues = [1,2,4,8,16,32,64,80,100,120,140,160,180,200,240,260,320,360,400,440,480,500];
let addAmounts = [1,2,4,8,16,32,64,80,100,120,140,160,180,200,240,260,320,360,400,440,480,500,1000];
let addIndex = 0;
let currentSpeed = 1;
let muted = false;

const balanceDisplay = document.getElementById('balance');
const betDisplay = document.getElementById('bet-display');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const bigWinSound = document.getElementById('big-win-sound');

document.getElementById('adjust-add-amount').onclick = () => {
  addIndex = (addIndex + 1) % addAmounts.length;
};
document.getElementById('add-balance').onclick = () => {
  balance += addAmounts[addIndex];
  updateBalance();
};
document.getElementById('increase-bet').onclick = () => {
  if (betIndex < betValues.length - 1) betIndex++;
  updateBet();
};
document.getElementById('decrease-bet').onclick = () => {
  if (betIndex > 0) betIndex--;
  updateBet();
};
document.getElementById('sound-toggle').onclick = () => {
  muted = !muted;
};
document.getElementById('speed-button').onclick = () => {
  currentSpeed = currentSpeed >= 3 ? 1 : currentSpeed + 1;
};

document.getElementById('spin-button').onclick = () => {
  const bet = betValues[betIndex];
  if (balance < bet) return alert("Saldo insuficiente!");
  balance -= bet;
  updateBalance();
  if (!muted) spinSound.play();
  animateReels().then(() => {
    const win = Math.random() < 0.2;
    if (win) {
      const gain = bet * (Math.floor(Math.random() * 10) + 1);
      balance += gain;
      updateBalance();
      showFireworks(gain >= 500);
      if (!muted) (gain >= 500 ? bigWinSound : winSound).play();
    }
  });
};

function updateBalance() {
  balanceDisplay.textContent = "Saldo: R$ " + balance;
}
function updateBet() {
  betDisplay.textContent = "Aposta: R$ " + betValues[betIndex];
}
function animateReels() {
  const reels = ['reel1', 'reel2', 'reel3'];
  return Promise.all(reels.map((id, i) => new Promise(resolve => {
    const reel = document.getElementById(id);
    let count = 0;
    const interval = setInterval(() => {
      reel.textContent = icons[Math.floor(Math.random() * icons.length)];
      count++;
      if (count > 10 + currentSpeed * 5) {
        clearInterval(interval);
        resolve();
      }
    }, 50 / currentSpeed);
  })));
}
function showFireworks(big) {
  const fw = document.getElementById('fireworks');
  fw.classList.remove('hidden');
  fw.textContent = big ? "🎆 GRANDE GANHO 🎆
Parabéns!!" : "🎉";
  setTimeout(() => fw.classList.add('hidden'), 2000);
}
function copyPix() {
  const pix = document.getElementById('pix-key').textContent;
  navigator.clipboard.writeText(pix);
}
updateBalance();
updateBet();
