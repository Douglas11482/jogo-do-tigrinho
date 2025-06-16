
const rolos = ["🐯", "🍒", "💎", "🍋", "7️⃣", "🍀"];
let saldo = 50;
let custoGiro = 2;
let premio = 15;

const saldoEl = document.getElementById("saldo");
const resultadoEl = document.getElementById("resultado");
const btnGirar = document.getElementById("btnGirar");
const somGiro = document.getElementById("somGiro");
const somGanhou = document.getElementById("somGanhou");

const rolo1 = document.getElementById("rolo1");
const rolo2 = document.getElementById("rolo2");
const rolo3 = document.getElementById("rolo3");

document.getElementById("btnSalvarConfig").onclick = () => {
  saldo = parseFloat(document.getElementById("saldoInicial").value);
  custoGiro = parseFloat(document.getElementById("custoGiro").value);
  premio = parseFloat(document.getElementById("premio").value);
  atualizarSaldo();
};

btnGirar.onclick = async () => {
  if (saldo < custoGiro) {
    resultadoEl.textContent = "Saldo insuficiente.";
    return;
  }

  saldo -= custoGiro;
  atualizarSaldo();
  resultadoEl.textContent = "Girando...";
  somGiro.play();
  btnGirar.disabled = true;

  await animarRolos();

  const simbolos = [rolo1.textContent, rolo2.textContent, rolo3.textContent];
  const ganhou = simbolos.every((val, i, arr) => val === arr[0]);

  if (ganhou) {
    resultadoEl.textContent = "🎉 Você ganhou!";
    saldo += premio;
    somGanhou.play();
  } else {
    resultadoEl.textContent = "❌ Tente novamente!";
  }
  atualizarSaldo();
  btnGirar.disabled = false;
};

function atualizarSaldo() {
  saldoEl.textContent = `💰 Saldo: R$${saldo.toFixed(2)}`;
}

async function animarRolos() {
  for (let i = 0; i < 15; i++) {
    rolo1.textContent = rolos[Math.floor(Math.random() * rolos.length)];
    rolo2.textContent = rolos[Math.floor(Math.random() * rolos.length)];
    rolo3.textContent = rolos[Math.floor(Math.random() * rolos.length)];
    await delay(100);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

atualizarSaldo();
