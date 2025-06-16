const rolo = document.getElementById('rolo');
const resultado = document.getElementById('resultado');
const saldoDisplay = document.getElementById('saldo');
const btnGirar = document.getElementById('btnGirar');
const btnSalvarConfig = document.getElementById('btnSalvarConfig');
const btnVelocidade = document.getElementById('btnVelocidade');
const somGiro = document.getElementById('somGiro');
const somGanhou = document.getElementById('somGanhou');

let saldo = 50;
let custoGiro = 2;
let velocidade = 500; // velocidade do giro em ms
let girando = false;

const desenhos = ['🐯', '🍒', '💎'];

// Prêmios automáticos: tigre 10x, diamante 5x, cereja 2x
const premios = {
  '🐯': 10,
  '💎': 5,
  '🍒': 2
};

function atualizarSaldoDisplay() {
  saldoDisplay.textContent = `💰 Saldo: R$${saldo.toFixed(2)}`;
}

btnSalvarConfig.addEventListener('click', () => {
  const saldoInit = parseFloat(document.getElementById('saldoInicial').value);
  const custo = parseFloat(document.getElementById('custoGiro').value);
  if (!isNaN(saldoInit) && saldoInit >= 0) saldo = saldoInit;
  if (!isNaN(custo) && custo >= 0) custoGiro = custo;
  atualizarSaldoDisplay();
  resultado.textContent = '';
});

btnVelocidade.addEventListener('click', () => {
  if (velocidade === 500) {
    velocidade = 150; 
    btnVelocidade.textContent = 'Velocidade: Rápida';
  } else {
    velocidade = 500;
    btnVelocidade.textContent = 'Velocidade: Normal';
  }
});

function girarSlot() {
  if (girando) return;
  if (saldo < custoGiro) {
    resultado.textContent = 'Saldo insuficiente para girar!';
    return;
  }

  saldo -= custoGiro;
  atualizarSaldoDisplay();
  resultado.textContent = '';
  rolo.classList.remove('win');

  somGiro.currentTime = 0;
  somGiro.play();

  girando = true;

  // Simular giro - muda rapidamente os símbolos antes de parar
  let contador = 0;
  const totalGiros = 15;
  let finalResultado = [];

  const intervalo = setInterval(() => {
    let temp = [];
    for(let i = 0; i < 3; i++){
      const aleatorio = desenhos[Math.floor(Math.random() * desenhos.length)];
      temp.push(aleatorio);
    }
    rolo.textContent = temp.join(' ');
    contador++;

    if(contador >= totalGiros){
      clearInterval(intervalo);
      finalResultado = temp;
      girando = false;
      somGiro.pause();
      verificarResultado(finalResultado);
    }
  }, velocidade);
}

function verificarResultado(array) {
  // Premiação só se os 3 símbolos forem iguais
  if(array[0] === array[1] && array[1] === array[2]){
    const simbolo = array[0];
    const premioMultiplicador = premios[simbolo] || 0;
    const ganho = premioMultiplicador * custoGiro;
    saldo += ganho;
    resultado.textContent = `🎉 Você ganhou R$${ganho.toFixed(2)}! (${simbolo} x3)`;
    rolo.classList.add('win');
    somGanhou.currentTime = 0;
    somGanhou.play();
  } else {
    resultado.textContent
