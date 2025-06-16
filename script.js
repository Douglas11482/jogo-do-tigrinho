const simbolos = ['🐯', '🍒', '💎'];
let saldo = 0;
let aposta = 2;
let velocidade = 500;

const roleta = document.getElementById("roleta");
const btnGirar = document.getElementById("btnGirar");
const btnAcelerar = document.getElementById("btnAcelerar");
const btnAumentarAposta = document.getElementById("btnAumentarAposta");
const btnDiminuirAposta = document.getElementById("btnDiminuirAposta");
const saldoDisplay = document.getElementById("saldo");
const resultado = document.getElementById("resultado");
const valorAposta = document.getElementById("valorAposta");

document.getElementById("btnIniciar").onclick = () => {
  saldo = parseFloat(document.getElementById("saldoInicial").value);
  atualizarTela();
  gerarQRCodePix();
};

btnAcelerar.onclick = () => {
  velocidade = Math.max(100, velocidade - 100);
};

btnAumentarAposta.onclick = () => {
  aposta += 1;
  atualizarTela();
};

btnDiminuirAposta.onclick = () => {
  aposta = Math.max(1, aposta - 1);
  atualizarTela();
};

btnGirar.onclick = () => {
  if (saldo < aposta) {
    resultado.textContent = "Saldo insuficiente!";
    return;
  }

  saldo -= aposta;

  const grade = [];
  for (let i = 0; i < 9; i++) {
    grade.push(simbolos[Math.floor(Math.random() * simbolos.length)]);
  }

  desenharGrade(grade);
  verificarVitoria(grade);
  atualizarTela();
};

function desenharGrade(grade) {
  roleta.innerHTML = '';
  grade.forEach(simbolo => {
    const span = document.createElement("div");
    span.textContent = simbolo;
    roleta.appendChild(span);
  });

  document.getElementById("somGiro").play();
}

function verificarVitoria(g) {
  let ganho = 0;

  const linhas = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const [a, b, c] of linhas) {
    if (g[a] === g[b] && g[b] === g[c]) {
      if (g[a] === '🐯') ganho += aposta * 10;
      else if (g[a] === '💎') ganho += aposta * 5;
      else if (g[a] === '🍒') ganho += aposta * 2;
    }
  }

  if (ganho > 0) {
    saldo += ganho;
    resultado.textContent = `🎉 Você ganhou R$${ganho.toFixed(2)}!`;
    document.getElementById("somGanhou").play();
  } else {
    resultado.textContent = "Tente novamente!";
  }
}

function atualizarTela() {
  saldoDisplay.textContent = `💰 Saldo: R$${saldo.toFixed(2)}`;
  valorAposta.textContent = `Aposta: R$${aposta.toFixed(2)}`;
}

// Gera QRCode com a chave Pix fornecida
function gerarQRCodePix() {
  const chavePix = "f8430bc9-d9b8-4318-a3cf-bb016dc5b2d1";
  const valor = ""; // Pode ser vazio para doação
  const nome = "Jogo Tigrinho";
  const cidade = "BRASIL";
  const payload = `00020126360014BR.GOV.BCB.PIX0114${chavePix}5204000053039865802BR5913${nome}6006${cidade}62070503***6304`;
  
  QRCode.toCanvas(document.getElementById("qrcode"), payload, { width: 180 });
}
