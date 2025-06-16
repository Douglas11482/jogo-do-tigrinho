let balance = 100;
let bet = 10;
let speed = 200;

const slotGrid = document.getElementById("slot-grid");
const balanceEl = document.getElementById("balance");
const betEl = document.getElementById("bet");
const messageEl = document.getElementById("message");
const qrCodeImg = document.getElementById("qr-code");

const addBalanceBtn = document.getElementById("add-balance-button");
const spinBtn = document.getElementById("spin-button");
const speedUpBtn = document.getElementById("speed-up-button");
const betPlusBtn = document.getElementById("bet-plus");
const betMinusBtn = document.getElementById("bet-minus");

const pixKey = "f8430bc9-d9b8-4318-a3cf-bb016dc5b2d1";

const slotItems = ["🐯", "🍀", "🍎", "⭐", "💎", "🍉", "🍇", "🍒", "🔔"];

let spinning = false;
let spinInterval;
let currentSlots = [];

function criarGrid() {
  slotGrid.innerHTML = "";
  currentSlots = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("slot-cell");
    cell.textContent = slotItems[Math.floor(Math.random() * slotItems.length)];
    slotGrid.appendChild(cell);
    currentSlots.push(cell);
  }
}

function atualizarPainel() {
  balanceEl.textContent = balance.toFixed(2);
  betEl.textContent = bet.toFixed(2);
  atualizarQRCode();
}

function atualizarQRCode() {
  // Gerar QR Code Pix com a chave no formato correto
  const pixData = `00020126360014BR.GOV.BCB.PIX0114${pixKey}0208***5204000053039865405.005802BR5925Jogo do Tigrinho6009Sao Paulo6108054090006304`;
  // Para simplificar, vamos usar a chave diretamente no link da API, que aceita só a chave Pix
  qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=pix:${pixKey}`;
}

function girar() {
  if (spinning) return;
  if (bet > balance) {
    messageEl.textContent = "Saldo insuficiente para apostar.";
    return;
  }
  spinning = true;
  balance -= bet;
  atualizarPainel();
  messageEl.textContent = "Girando...";

  let ticks = 0;
  const maxTicks = 20;

  spinInterval = setInterval(() => {
    for (let cell of currentSlots) {
      cell.textContent = slotItems[Math.floor(Math.random() * slotItems.length)];
    }
    ticks++;
    if (ticks >= maxTicks) {
      clearInterval(spinInterval);
      spinning = false;
      verificarResultado();
    }
  }, speed);
}

function verificarResultado() {
  const values = currentSlots.map(cell => cell.textContent);

  const linhas = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
  ];
  const diagonais = [
    [0,4,8],
    [2,4,6],
  ];

  let ganhou = false;
  for (const linha of linhas) {
    if (values[linha[0]] === values[linha[1]] && values[linha[1]] === values[linha[2]]) {
      ganhou = true;
      break;
    }
  }
  if (!ganhou) {
    for (const diag of diagonais) {
      if (values[diag[0]] === values[diag[1]] && values[diag[1]] === values[diag[2]]) {
        ganhou = true;
        break;
      }
    }
  }

  if (ganhou) {
    balance += bet * 5;
    messageEl.textContent = "Você ganhou! + R$" + (bet * 5).toFixed(2);
  } else {
    messageEl.textContent = "Tente novamente!";
  }

  atualizarPainel();
}

function aumentarVelocidade() {
  if (speed > 50) {
    speed -= 50;
    messageEl.textContent = "Velocidade aumentada!";
  } else {
    messageEl.textContent = "Velocidade máxima!";
  }
}

addBalanceBtn.addEventListener("click", () => {
  balance += 50;
  atualizarPainel();
  messageEl.textContent = "Saldo aumentado em R$50!";
});

betPlusBtn.addEventListener("click", () => {
  if (bet + 10 <= balance) {
    bet += 10;
    atualizarPainel();
  }
});

betMinusBtn.addEventListener("click", () => {
  if (bet - 10 >= 10) {
    bet -= 10;
    atualizarPainel();
  }
});

spinBtn.addEventListener("click", girar);
speedUpBtn.addEventListener("click", aumentarVelocidade);

criarGrid();
atualizarPainel();
