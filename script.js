const imagens = ["🐯", "🍒", "💎"];
const multiplicadores = {
  "🐯": 10,
  "💎": 5,
  "🍒": 2
};

let saldo = 50;
let aposta = 2;
let velocidade = "normal";

const grid = document.getElementById("slotGrid");
const saldoDisplay = document.getElementById("saldo");
const resultado = document.getElementById("resultado");
const somGiro = document.getElementById("somGiro");
const somGanhou = document.getElementById("somGanhou");

function atualizarSaldo() {
  saldoDisplay.textContent = `💰 Saldo: R$${saldo.toFixed(2)}`;
}

function salvarConfig() {
  saldo = parseFloat(document.getElementById("saldoInicial").value);
  aposta = parseFloat(document.getElementById("custoGiro").value);
  velocidade = document.getElementById("velocidade").value;
  atualizarSaldo();
}

function gerarSimbolos() {
  let simbolos = [];
  for (let i = 0; i < 9; i++) {
    const simbolo = imagens[Math.floor(Math.random() * imagens.length)];
    simbolos.push(simbolo);
  }
  return simbolos;
}

function desenharSimbolos(simbolos) {
  grid.innerHTML = "";
  simbolos.forEach(simbolo => {
    const slot = document.createElement("div");
    slot.textContent = simbolo;
    grid.appendChild(slot);
  });
}

function verificarLinhas(simbolos) {
  const linhas = [
    [0,1,2], [3,4,5], [6,7,8], // horizontais
    [0,4,8], [2,4,6]           // diagonais
  ];

  for (const linha of linhas) {
    const [a, b, c] = linha;
    if (simbolos[a] === simbolos[b] && simbolos[b] === simbolos[c]) {
      return simbolos[a]; // símbolo vencedor
    }
  }

  return null;
}

function girar() {
  if (saldo < aposta) {
    resultado.textContent = "Saldo insuficiente.";
    return;
  }

  resultado.textContent = "";
  saldo -= aposta;
  atualizarSaldo();

  if (velocidade !== "instantaneo") somGiro.play();

  const simbolos = gerarSimbolos();
  desenharSimbolos(simbolos);

  const vencedor = verificarLinhas(simbolos);
  if (vencedor) {
    const premio = aposta * multiplicadores[vencedor];
    saldo += premio;
    atualizarSaldo();
    resultado.textContent = `🎉 Você ganhou R$${premio.toFixed(2)} com ${vencedor}${vencedor}${vencedor}!`;
    somGanhou.play();
  } else {
    resultado.textContent = "Tente novamente!";
  }
}

document.getElementById("btnSalvarConfig").addEventListener("click", salvarConfig);
document.getElementById("btnGirar").addEventListener("click", () => {
  if (velocidade === "rapido") {
    setTimeout(girar, 100);
  } else if (velocidade === "instantaneo") {
    girar();
  } else {
    setTimeout(girar, 500);
  }
});

// Inicialização
salvarConfig();
