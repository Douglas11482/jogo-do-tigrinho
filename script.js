let balance = 0;
let addAmounts = [1,2,4,8,16,32,64,80,100,120,140,160,180,200,240,260,320,360,400,440,480,500];
let addIndex = 5;
let currentBet = 1;
let betOptions = [...addAmounts];
let betIndex = 0;
let speedLevel = 1;
let soundMuted = false;

const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const balanceDisplay = document.getElementById('balance');
const betAmountDisplay = document.getElementById('betAmount');
const addAmountDisplay = document.getElementById('addAmountDisplay');

function updateBalanceDisplay() {
    balanceDisplay.textContent = 'Saldo: R$ ' + balance;
}

function updateBetDisplay() {
    betAmountDisplay.textContent = currentBet;
}

function updateAddAmountDisplay() {
    addAmountDisplay.textContent = addAmounts[addIndex];
}

function spinReels() {
    if (balance < currentBet) return;

    balance -= currentBet;
    updateBalanceDisplay();
    if (!soundMuted) document.getElementById('spinSound').play();

    [reel1, reel2, reel3].forEach((reel) => {
        reel.textContent = ['🍒','🍋','🔔','⭐','🍀','💎'][Math.floor(Math.random()*6)];
    });

    const win = Math.random() > 0.8;
    if (win) {
        const prize = Math.random() > 0.95 ? 500 : currentBet * 5;
        balance += prize;
        updateBalanceDisplay();

        const fire = document.getElementById('fireworks');
        const bigWin = document.getElementById('big-win');

        if (prize === 500) {
            bigWin.classList.remove('hidden');
        } else {
            fire.classList.remove('hidden');
        }

        if (!soundMuted) document.getElementById('winSound').play();

        setTimeout(() => {
            fire.classList.add('hidden');
            bigWin.classList.add('hidden');
        }, 2000);
    }
}

document.getElementById('addBalance').onclick = () => {
    balance += addAmounts[addIndex];
    updateBalanceDisplay();
};

document.getElementById('changeAddAmount').onclick = () => {
    addIndex = (addIndex + 1) % addAmounts.length;
    updateAddAmountDisplay();
};

document.getElementById('increaseBet').onclick = () => {
    betIndex = (betIndex + 1) % betOptions.length;
    currentBet = betOptions[betIndex];
    updateBetDisplay();
};

document.getElementById('decreaseBet').onclick = () => {
    betIndex = (betIndex - 1 + betOptions.length) % betOptions.length;
    currentBet = betOptions[betIndex];
    updateBetDisplay();
};

document.getElementById('speed').onclick = () => {
    speedLevel = speedLevel < 3 ? speedLevel + 1 : 1;
    alert('Velocidade: ' + speedLevel);
};

document.getElementById('spin').onclick = spinReels;

document.getElementById('soundToggle').onclick = () => {
    soundMuted = !soundMuted;
    document.getElementById('soundToggle').textContent = soundMuted ? '🔇' : '🔊';
};

document.getElementById('copyPix').onclick = () => {
    navigator.clipboard.writeText('f8430bc9-d9b8-4318-a3cf-bb016dc5b2d1');
    alert('Chave Pix copiada!');
};

new QRCode(document.getElementById('qrcode'), 'f8430bc9-d9b8-4318-a3cf-bb016dc5b2d1');

updateBalanceDisplay();
updateBetDisplay();
updateAddAmountDisplay();
