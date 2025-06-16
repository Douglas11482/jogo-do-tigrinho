const simbolos = ["🐯", "🍒", "💎"];
const multiplicadores = { "🐯": 10, "💎": 5, "🍒": 2 };

let saldo = 50;
let valorAposta = 2;
let velocidade = 1000;

function atualizarSaldo() {
  document.getElementById("saldo").textContent = `💰 Saldo: R$${saldo.toFixed(2)}`;
}

function gerarRoleta() {
  const roleta = [];
  for (let i = 0; i < 3; i++) {
    const linha = [];
    for (let j = 0; j < 3; j++) {
      const simbolo = simbolos[Math.floor(Math.random() * simbolos.length)];
      linha.push(simbolo);
    }
    roleta.push(linha);
  }
  return roleta;
}

function exibirRoleta(roleta) {
  const roletaDiv = document.getElementById("roleta");
  roletaDiv.innerHTML = "";
  roleta.flat().forEach(simbolo => {
    const div = document.createElement("div");
    div.textContent = simbolo;
    roletaDiv.appendChild(div);
  });
}

function verificarVitoria(roleta) {
  const linhas = [...roleta];
  const diagonais = [
    [roleta[0][0], roleta[1][1], roleta[2][2]],
    [roleta[0][2], roleta[1][1], roleta[2][0]]
  ];

  const vitorias = [...linhas, ...diagonais].filter(linha =>
    linha.every(s => s === linha[0])
  );

  if (vitorias.length > 0) {
    const simbolo = vitorias[0][0];
    return valorAposta * multiplicadores[simbolo];
  }
  return 0;
}

document.getElementById("btnSalvarConfig").onclick = () => {
  const novoSaldo = parseFloat(document.getElementById("saldoInicial").value);
  const novaAposta = parseFloat(document.getElementById("valorAposta").value);
  const novaVelocidade = parseInt(document.getElementById("velocidade").value);

  if (!isNaN(novoSaldo)) saldo = novoSaldo;
  if (!isNaN(novaAposta)) valorAposta = novaAposta;
  if (!isNaN(novaVelocidade)) velocidade = novaVelocidade;

  atualizarSaldo();
};

document.getElementById("btnGirar").onclick = () => {
  if (saldo < valorAposta) {
    alert("Saldo insuficiente!");
    return;
  }

  const somGiro = document.getElementById("somGiro");
  somGiro.currentTime = 0;
  somGiro.play();

  saldo -= valorAposta;
  atualizarSaldo();

  const roleta = gerarRoleta();
  exibirRoleta(roleta);

  setTimeout(() => {
    const premio = verificarVitoria(roleta);
    const resultadoDiv = document.getElementById("resultado");

    if (premio > 0) {
      saldo += premio;
      resultadoDiv.textContent = `🎉 Você ganhou R$${premio.toFixed(2)}!`;
      const somGanhou = document.getElementById("somGanhou");
      somGanhou.currentTime = 0;
      somGanhou.play();
    } else {
      resultadoDiv.textContent = "💔 Tente novamente!";
    }

    atualizarSaldo();
  }, velocidade);
};

window.onload = atualizarSaldo;
