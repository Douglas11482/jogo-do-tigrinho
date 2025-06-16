const simbolos = ['🐯', '🍒', '💎', '🍀', '7️⃣'];
const rolo = document.getElementById('rolo');
const resultadoEl = document.getElementById('resultado');
const saldoEl = document.getElementById('saldo');
const btnGirar = document.getElementById('btnGirar');
const btnSalvarConfig = document.getElementById('btnSalvarConfig');
const somGiro = document.getElementById('somGiro');
const somGanhou = document.getElementById('somGanhou');

let saldo = 50;
let custoGiro = 2;
let premio = 15;
let girando = false;
let giroInterval;

function atualizarSaldo() {
  saldoEl.textContent = `💰 Saldo: R$${saldo.toFixed(2)}`;
}

function salvarConfiguracoes() {
  const saldoInicial = Number(document.getElementById('saldoInicial').value);
  const custo = Number(document.getElementById('custoGiro').value);
  const premioValor = Number(document.getElementById('premio').value);

  if (saldoInicial < 0 || custo < 0 || premioValor < 0) {
    alert('Valores não podem ser negativos!');
    return;
  }

  saldo = saldoInicial;
  custoGiro = custo;
  premio = premioValor;

  atualizarSaldo();
  resultadoEl.textContent = '⚙️ Configurações salvas!';
}

function girar() {
  if (girando) return;
  if (saldo < custoGiro) {
    resultadoEl.textContent = '❌ Saldo insuficiente!';
    return;
  }

  saldo -= custoGiro;
  atualizarSaldo();
  resultadoEl.textContent = '🎲 Girando...';
  girando = true;

  somGiro.currentTime = 0;
  somGiro.play();

  let contador = 0;
  giroInterval = setInterval(() => {
    let resultado = '';
    for (let i = 0; i < 3; i++) {
      resultado += simbolos[Math.floor(Math.random() * simbolos.length)] + ' ';
    }
    rolo.textContent = resultado.trim();
    contador++;

    if (contador > 15) {
      clearInterval(giroInterval);
      verificarResultado(rolo.textContent.split(' '));
      girando = false;
    }
  }, 100);
}

function verificarResultado(resultado) {
  if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
    saldo += premio;
    atualizarSaldo();
    resultadoEl.textContent = `🎉 Você ganhou R$${premio.toFixed(2)}!`;
    somGanhou.currentTime = 0;
    somGanhou.play();
  } else {
    resultadoEl.textContent = '🙁 Não foi dessa vez!';
  }
}

btnSalvarConfig.addEventListener('click', salvarConfiguracoes);
btnGirar.addEventListener('click', girar);
atualizarSaldo();
