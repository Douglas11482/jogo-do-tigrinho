// Elementos DOM
const rolo = document.getElementById('rolo');
const resultado = document.getElementById('resultado');
const saldoDisplay = document.getElementById('saldo');
const btnGirar = document.getElementById('btnGirar');
const btnSalvarConfig = document.getElementById('btnSalvarConfig');

const saldoInput = document.getElementById('saldoInicial');
const custoInput = document.getElementById('custoGiro');
const premioInput = document.getElementById('premio');

const somGiro = document.getElementById('somGiro');
const somGanhou = document.getElementById('somGanhou');

let saldo = Number(saldoInput.value);
let custoGiro = Number(custoInput.value);
let premio = Number(premioInput.value);

const simbolos = ['🐯', '🍒', '💎', '🍋', '🔔'];

function atualizarSaldoDisplay() {
  saldoDisplay.textContent = `💰 Saldo: R$${saldo.toFixed(2)}`;
}

function salvarConfiguracoes() {
  saldo = Number(saldoInput.value);
  custoGiro = Number(custoInput.value);
  premio = Number(premioInput.value);
  atualizarSaldoDisplay();
  resultado.textContent = '';
}

btnSalvarConfig.addEventListener('click', salvarConfiguracoes);

function girar() {
  if (saldo < custoGiro) {
    resultado.textContent = 'Saldo insuficiente para girar!';
    return;
  }

  saldo -= custoGiro;
  atualizarSaldoDisplay();
  resultado.textContent = 'Girando...';
  btnGirar.disabled = true;

  somGiro.currentTime = 0;
  somGiro.play();

  // Simular giro com animação simples
  let giros = 15;
  let cont = 0;

  const intervalo = setInterval(() => {
    const randomSimbolos = [];
    for (let i = 0; i < 3; i++) {
      const s = simbolos[Math.floor(Math.random() * simbolos.length)];
      randomSimbolos.push(s);
    }
    rolo.textContent = randomSimbolos.join(' ');

    cont++;
    if (cont >= giros) {
      clearInterval(intervalo);

      // Verifica vitória: 3 símbolos iguais
      if (randomSimbolos[0] === randomSimbolos[1] && randomSimbolos[1] === randomSimbolos[2]) {
        saldo += premio;
        atualizarSaldoDisplay();
        resultado.textContent = `🎉 Você ganhou R$${premio.toFixed(2)}!`;
        rolo.classList.add('win');
        somGanhou.currentTime = 0;
        somGanhou.play();
        setTimeout(() => rolo.classList.remove('win'), 2000);
      } else {
        resultado.textContent = 'Tente novamente!';
      }
      btnGirar.disabled = false;
    }
  }, 100);
}

btnGirar.addEventListener('click', girar);

// Inicializa saldo
atualizarSaldoDisplay();
