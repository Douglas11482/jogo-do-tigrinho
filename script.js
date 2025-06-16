const simbolos = ['🐯', '🍒', '💎', '🍀', '7️⃣'];
const rolo = document.getElementById('rolo');
const resultadoEl = document.getElementById('resultado');
const saldoEl = document.getElementById('saldo');

const btnGirar = document.getElementById('btnGirar');
const btnSalvarConfig = document.getElementById('btnSalvarConfig');

let saldo = 50;
let custoGiro = 2;
let premio = 15;

let giroInterval;
let girando = false;

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
  resultadoEl.textContent = 'Configurações salvas!';
}

function girar() {
  if (girando) return; // evita clicar várias vezes
  if (saldo < custoGiro) {
    resultadoEl.textContent = 'Saldo insuficiente para girar!';
    return;
  }

  saldo -= custoGiro;
  atualizarSaldo();

  girando = true;
  resultadoEl.textContent = 'Girando...';

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

function verificarResultado(resultados) {
  // Se os 3 símbolos forem iguais, ganhou
  if (resultados[0] === resultados[1] && resultados[1] === resultados[2]) {
    saldo += premio;
    atualizarSaldo();
    resultadoEl.textContent = `🎉 Parabéns! Você ganhou R$${premio.toFixed(2)}!`;
  } else {
    resultadoEl.textContent = 'Tente novamente!';
  }
}

btnSalvarConfig.addEventListener('click', salvarConfiguracoes);
btnGirar.addEventListener('click', girar);

// Inicializa a interface
atualizarSaldo();
