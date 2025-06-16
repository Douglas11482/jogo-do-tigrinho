const simbolos = ['🐯', '💎', '🍒', '🍋', '🍀', '7️⃣', '⭐', '🔔', '🍉'];
const premioMultiplicador = {
  '🐯': 10,
  '💎': 5,
  '🍒': 2,
};

let saldo = 0;
let custoGiro = 2;
let giroVelocidade = 300; // ms entre trocas
let acelerado = false;
let aposta = custoGiro;

const roletaEl = document.getElementById('roleta');
const resultadoEl = document.getElementById('resultado');
const saldoEl = document.getElementById('saldo');
const btnGirar = document.getElementById('btnGirar');
const btnAcelerar = document.getElementById('btnAcelerar');
const btnAumentarAposta = document.getElementById('btnAumentarAposta');
const btnDiminuirAposta = document.getElementById('btnDiminuirAposta');
const saldoInicialInput = document.getElementById('saldoInicial');
const btnIniciar = document.getElementById('btnIniciar');
const qrcodeCanvas = document.getElementById('qrcode');
const somGiro = document.getElementById('somGiro');
const somGanhou = document.getElementById('somGanhou');

let giroInterval;
let giroAtivo = false;

function atualizarSaldo() {
  saldoEl.textContent = `💰 Saldo: R$ ${saldo.toFixed(2)} | Aposta: R$ ${aposta.toFixed(2)}`;
}

function gerarResultado() {
  let resultado = [];
  for(let i = 0; i < 9; i++) {
    let s = simbolos[Math.floor(Math.random() * simbolos.length)];
    resultado.push(s);
  }
  return resultado;
}

function mostrarResultado(resultado) {
  const cells = roletaEl.querySelectorAll('.slot-cell');
  cells.forEach((cell, i) => {
    cell.textContent = resultado[i];
    cell.classList.remove('winning');
  });
}

function verificarVitoria(resultado) {
  const linhas = [
    [0,1,2],
    [3,4,5],
    [6,7,8]
  ];
  const diagonais = [
    [0,4,8],
    [2,4,6]
  ];

  let ganhos = 0;
  let ganhadores = [];

  function checarLinha(posicoes) {
    const [a,b,c] = posicoes;
    if(resultado[a] === resultado[b] && resultado[b] === resultado[c]) {
      return resultado[a];
    }
    return null;
  }

  linhas.forEach(linha => {
    const simbolo = checarLinha(linha);
    if(simbolo && premioMultiplicador[simbolo]) {
      ganhos += aposta * premioMultiplicador[simbolo];
      ganhadores.push(...linha);
    }
  });

  diagonais.forEach(diag => {
    const simbolo = checarLinha(diag);
    if(simbolo && premioMultiplicador[simbolo]) {
      ganhos += aposta * premioMultiplicador[simbolo];
      ganhadores.push(...diag);
    }
  });

  const cells = roletaEl.querySelectorAll('.slot-cell');
  ganhadores.forEach(i => {
    cells[i].classList.add('winning');
  });

  return ganhos;
}

function girar() {
  if(giroAtivo) return;

  if(saldo < aposta) {
    resultadoEl.textContent = 'Saldo insuficiente para girar!';
    return;
  }

  saldo -= aposta;
  atualizarSaldo();
  resultadoEl.textContent = 'Girando...';
  somGiro.play();

  giroAtivo = true;
  let tempo
