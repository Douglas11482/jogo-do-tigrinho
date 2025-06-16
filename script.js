// Símbolos e valores de prêmio multiplicador
const simbolos = [
  { emoji: "🐯", premio: 10 },
  { emoji: "💎", premio: 5 },
  { emoji: "🍒", premio: 2 }
];

let saldo = 50;
const aposta = 2;
let velocidadeGiro = 300; // ms entre trocas
let girando = false;

const saldoEl = document.getElementById("saldo");
const resultadoEl = document.getElementById("resultado");
const roletaCells = Array.from(document.querySelectorAll(".slot-cell"));
const btnGirar = document.getElementById("btnGirar");
const btnAcelerar = document.getElementById("btnAcelerar");
const btnDoar = document.getElementById("btnDoar");
const somGiro = document.getElementById("somGiro");
const somGanhou = document.getElementById("somGanhou");

// Atualiza saldo na tela
function atualizaSaldo() {
  saldoEl.textContent = `💰 Saldo: R$ ${saldo.toFixed(2)}`;
}

// Sorteia um símbolo aleatório
function simboloAleatorio() {
  const idx = Math.floor(Math.random() * simbolos.length);
  return simbolos[idx];
}

// Exibe símbolos na roleta
function exibirSimbolos(simbolosEscolhidos) {
  roletaCells.forEach((cell, i) => {
    cell.textContent = simbolosEscolhidos[i].emoji;
    cell.dataset.symbol = simbolosEscolhidos[i].emoji;
    cell.classList.remove("winning");
  });
}

// Verifica vitórias horizontais e diagonais (não verticais)
function verificarVitoria(simbolosEscolhidos) {
  const linhas = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6]
  ];

  let ganhou = false;
  let premioTotal = 0;
  let posicoesVencedoras = [];

  for (const linha of linhas) {
    const [a,b,c] = linha;
    if (simbolosEscolhidos[a].emoji === simbolosEscolhidos[b].emoji &&
        simbolosEscolhidos[b].emoji === simbolosEscolhidos[c].emoji) {
      ganhou = true;
      const premioSimbolo = simbolos.find(s => s.emoji === simbolosEscolhidos[a].emoji).premio;
      premioTotal += premioSimbolo * aposta;
      posicoesVencedoras.push(...linha);
    }
  }
  return { ganhou, premioTotal, posicoesVencedoras };
}

// Anima o giro da roleta
async function girar() {
  if (girando) return;
  if (saldo < aposta) {
    resultadoEl.textContent = "Saldo insuficiente!";
    return;
  }
  girando = true;
  resultadoEl.textContent = "";
  saldo -= aposta;
  atualizaSaldo();
  somGiro.currentTime = 0;
  somGiro.play();

  let ciclos = 20;
  let simbolosEscolhidos = [];

  for (let i=0; i< ciclos; i++) {
    simbolosEscolhidos = [];
    for (let j=0; j<9; j++) {
      simbolosEscolhidos.push(simboloAleatorio());
    }
    exibirSimbolos(simbolosEscolhidos);
    await new Promise(r => setTimeout(r, velocidadeGiro));
  }

  somGiro.pause();

  const { ganhou, premioTotal, posicoesVencedoras } = verificarVitoria(simbolosEscolhidos);
  if (ganhou) {
    somGanhou.currentTime = 0;
    somGanhou.play();
    saldo += premioTotal;
    atualizaSaldo();
    resultadoEl.textContent = `🎉 Você ganhou R$ ${premioTotal.toFixed(2)}!`;
    posicoesVencedoras.forEach(i => roletaCells[i].classList.add("winning"));
  } else {
    resultadoEl.textContent = "Tente novamente!";
  }

  girando = false;
}

btnGirar.addEventListener("click", girar);

btnAcelerar.addEventListener("click", () => {
  velocidadeGiro = velocidadeGiro === 300 ? 100 : 300;
  btnAcelerar.textContent = velocidadeGiro === 100 ? "Desacelerar Giro" : "Acelerar Giro";
});

// Botão doar - abre link Pix ou página
btnDoar.addEventListener("click", () => {
  // Pode mudar para sua página de doação ou um link Pix
  window.open("https://mpago.la/2m3B5", "_blank");
});

// Inicializa saldo
atualizaSaldo();

// Gera QR Code Pix
const chavePix = "f8430bc9-d9b8-4318-a3cf-bb016dc5b2d1";
const valorPix = "10.00"; // exemplo valor fixo
const qrContent = `00020126360014BR.GOV.BCB.PIX0114${chavePix}0208Compra520400005303986540${valorPix}5802BR5925Jogo do Tigrinho6009Sao Paulo61080540900062070503***6304`;

QRCode.toCanvas(document.getElementById('qrcode'), qrContent, { width: 130 }, function (error) {
  if (error) console.error(error);
});
