const simbolos = ['🐯', '💎', '🍒', '🍋', '🍀', '7️⃣', '⭐', '🔔', '🍉'];
const premioMultiplicador = {
  '🐯': 10,
  '💎': 5,
  '🍒': 2,
};

let saldo = 50.00;
const custoGiro = 2.00;
let giroVelocidade = 300; // ms entre trocas
let acelerado = false;

const roletaEl = document.getElementById('roleta');
const resultadoEl = document.getElementById('resultado');
const saldoEl = document.getElementById('saldo');
const btnGirar = document.getElementById('btnGirar');
const btnAcelerar = document.getElementById('btnAcelerar');
const somGiro = document.getElementById('somGiro');
const somGanhou = document.getElementById('somGanhou');
const btnDoar = document.getElementById('btnDoar');
const qrcodeCanvas = document.getElementById('qrcode');

let giroInterval;
let giroAtivo = false;

// Atualiza saldo na tela
function atualizarSaldo() {
  saldoEl.textContent = `💰 Saldo: R$ ${saldo.toFixed(2)}`;
}

// Gera resultado aleatório de 9 símbolos
function gerarResultado() {
  let resultado = [];
  for(let i = 0; i < 9; i++) {
    let s = simbolos[Math.floor(Math.random() * simbolos.length)];
    resultado.push(s);
  }
  return resultado;
}

// Exibe os símbolos no grid
function mostrarResultado(resultado) {
  const cells = roletaEl.querySelectorAll('.slot-cell');
  cells.forEach((cell, i) => {
    cell.textContent = resultado[i];
    cell.classList.remove('winning');
  });
}

// Verifica combinações vencedoras horizontais e diagonais
function verificarVitoria(resultado) {
  // Ganha só horizontal e diagonal, nunca vertical.
  // 3 linhas horizontais (0,1,2), (3,4,5), (6,7,8)
  // 2 diagonais: (0,4,8), (2,4,6)

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

  // Verificar horizontais
  linhas.forEach(linha => {
    const simbolo = checarLinha(linha);
    if(simbolo && premioMultiplicador[simbolo]) {
      ganhos += custoGiro * premioMultiplicador[simbolo];
      ganhadores.push(...linha);
    }
  });

  // Verificar diagonais
  diagonais.forEach(diag => {
    const simbolo = checarLinha(diag);
    if(simbolo && premioMultiplicador[simbolo]) {
      ganhos += custoGiro * premioMultiplicador[simbolo];
      ganhadores.push(...diag);
    }
  });

  // Marcar células vencedoras
  const cells = roletaEl.querySelectorAll('.slot-cell');
  ganhadores.forEach(i => {
    cells[i].classList.add('winning');
  });

  return ganhos;
}

function girar() {
  if(giroAtivo) return; // evita cliques múltiplos

  if(saldo < custoGiro) {
    resultadoEl.textContent = 'Saldo insuficiente para girar!';
    return;
  }

  saldo -= custoGiro;
  atualizarSaldo();
  resultadoEl.textContent = 'Girando...';
  somGiro.play();

  giroAtivo = true;

  // Animação giro - troca símbolos rápido
  let tempoGiro = 2000; // 2 segundos
  let tempoDecorrido = 0;

  giroInterval = setInterval(() => {
    let simbolosAleatorios = gerarResultado();
    mostrarResultado(simbolosAleatorios);
    tempoDecorrido += giroVelocidade;
    if(tempoDecorrido >= tempoGiro) {
      clearInterval(giroInterval);

      // resultado final fixo
      let resultadoFinal = gerarResultado();
      mostrarResultado(resultadoFinal);

      // Verifica ganhos
      let ganhos = verificarVitoria(resultadoFinal);

      if(ganhos > 0) {
        saldo += ganhos;
        atualizarSaldo();
        resultadoEl.textContent = `🎉 Você ganhou R$ ${ganhos.toFixed(2)}!`;
        somGiro.pause();
        somGiro.currentTime = 0;
        somGanhou.play();
      } else {
        resultadoEl.textContent = 'Que pena, tente novamente!';
      }
      giroAtivo = false;
    }
  }, giroVelocidade);
}

function alternarVelocidade() {
  if(acelerado) {
    giroVelocidade = 300;
    btnAcelerar.textContent = 'Acelerar Giro';
    acelerado = false;
  } else {
    giroVelocidade = 100;
    btnAcelerar.textContent = 'Velocidade Normal';
    acelerado = true;
  }
}

function gerarQRCode() {
  const chavePix = "f8430bc9-d9b8-4318-a3cf-bb016dc5b2d1"; // chave pix exemplo
  const pixText = `00020126360014BR.GOV.BCB.PIX0114${chavePix}52040000530398654040.005802BR5925Jogo do Tigrinho6009Sao Paulo61080540900062070503***6304`;

  QRCode.toCanvas(qrcodeCanvas, pixText, { width: 150 }, function (error) {
    if (error) console.error(error);
  });
}

// Botão doar simulado
btnDoar.onclick = () => {
  alert('Função de doação simulada. Use o QR code para doar via Pix.');
};

btnGirar.onclick = girar;
btnAcelerar.onclick = alternarVelocidade;

atualizarSaldo();
gerarQRCode();
