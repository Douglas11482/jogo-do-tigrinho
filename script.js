
const simbolos = ["🐯", "🍒", "💎", "🔔", "🍋"];

let saldo = 50.0;
let custoPorGiro = 2.0;
let premio = 15.0;

const slotEl = document.getElementById("rolo");
const resultadoEl = document.getElementById("resultado");
const saldoEl = document.getElementById("saldo");
const btnGirar = document.getElementById("btnGirar");
const btnSalvarConfig = document.getElementById("btnSalvarConfig");
const saldoInicialInput = document.getElementById("saldoInicial");
const custoGiroInput = document.getElementById("custoGiro");
const premioInput = document.getElementById("premio");
const somGiro = document.getElementById("somGiro");
const somGanhou = document.getElementById("somGanhou");

function atualizarSaldo() {
  saldoEl.innerText = `💰 Saldo: R$${saldo.toFixed(2)}`;
}

function carregarConfig() {
  const config = localStorage.getItem("configJogoTigrinho");
  if (config) {
    const obj = JSON.parse(config);
    saldo = obj.saldo;
    custoPorGiro = obj.custoPorGiro;
    premio = obj.premio;
    saldoInicialInput.value = saldo;
    custoGiroInput.value = custoPorGiro;
    premioInput.value = premio;
  }
  atualizarSaldo();
}

function salvarConfig() {
  saldo = parseFloat(saldoInicialInput.value);
  custoPorGiro = parseFloat(custoGiroInput.value);
  premio = parseFloat(premioInput.value);

  if (isNaN(saldo) || saldo < 0) saldo = 50.0;
  if (isNaN(custoPorGiro) || custoPorGiro < 0) custoPorGiro = 2.0;
  if (isNaN(premio) || premio < 0) premio = 15.0;

  localStorage.setItem(
    "configJogoTigrinho",
    JSON.stringify({ saldo, custoPorGiro, premio })
  );
  atualizarSaldo();
  resultadoEl.innerText = "⚙️ Configurações salvas!";
}

function girar() {
  if (saldo < custoPorGiro) {
    resultadoEl.innerText = "⚠️ Saldo insuficiente!";
    return;
  }

  saldo -= custoPorGiro;
  atualizarSaldo();

  somGiro.play();

  // Animação piscar
  slotEl.classList.add("animar");

  setTimeout(() => {
    slotEl.classList.remove("animar");

    const rolo = [
      simbolos[Math.floor(Math.random() * simbolos.length)],
      simbolos[Math.floor(Math.random() * simbolos.length)],
      simbolos[Math.floor(Math.random() * simbolos.length)],
    ];

    slotEl.innerText = rolo.join(" | ");

    if (rolo[0] === rolo[1] && rolo[1] === rolo[2]) {
      resultadoEl.innerText = `🎉 Você ganhou R$${premio.toFixed(2)}!`;
      saldo += premio;
      atualizarSaldo();
      somGanhou.play();
    } else {
      resultadoEl.innerText = "❌ Não foi dessa vez.";
    }
  }, 600);
}

// Eventos
btnGirar.addEventListener("click", girar);
btnSalvarConfig.addEventListener("click", salvarConfig);

// Carregar configurações salvas
carregarConfig();
