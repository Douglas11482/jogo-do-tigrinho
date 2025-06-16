// Gera QR Code
new QRCode(document.getElementById("qrcode"), {
  text: "00020126580014br.gov.bcb.pix0136f8430bc9-d9b8-4318-a3cf-bb016dc5b2d152040000530398654061.005802BR5925TigrinhoJogos6009SAOPAULO62070503***6304A13F",
  width: 120, height: 120
});

// Elementos
const rolo = document.getElementById("rolo");
const resultadoEl = document.getElementById("resultado");
const saldoEl = document.getElementById("saldo");
const btnGirar = document.getElementById("btnGirar");
const btnSalvar = document.getElementById("btnSalvarConfig");
const inpSaldo = document.getElementById("saldoInicial");
const inpCusto = document.getElementById("custoGiro");
const somGiro = document.getElementById("somGiro");
const somWin = document.getElementById("somGanhou");

// Variáveis
let saldo = parseFloat(inpSaldo.value);
let custo = parseFloat(inpCusto.value);
const mult = { "🐯":10, "💎":5, "🍒":2 };

// Atualiza saldo
function atualizarSaldo() {
  saldoEl.innerText = `💰 Saldo: R$${saldo.toFixed(2)}`;
}
btnSalvar.onclick = () => {
  saldo = parseFloat(inpSaldo.value) || saldo;
  custo = parseFloat(inpCusto.value) || custo;
  atualizarSaldo();
  resultadoEl.innerText = "";
};

// Função de giro
btnGirar.onclick = () => {
  if (saldo < custo) {
    resultadoEl.innerText = "Saldo insuficiente!";
    return;
  }
  saldo -= custo;
  atualizarSaldo();
  somGiro.currentTime = 0; somGiro.play();
  resultadoEl.innerText = "Girando...";
  rolo.classList.remove("win");

  let cont = 0;
  let final = [];
  const intervalo = setInterval(() => {
    final = [0,1,2].map(() => {
      const keys = Object.keys(mult);
      return keys[Math.floor(Math.random() * keys.length)];
    });
    rolo.innerText = final.join(" ");
    cont++;
    if (cont > 15) {
      clearInterval(intervalo);
      const [a,b,c] = final;
      if (a===b && b===c) {
        const ganho = custo * mult[a];
        saldo += ganho; atualizarSaldo();
        resultadoEl.innerText = `🎉 Ganhou R$${ganho.toFixed(2)}!`;
        rolo.classList.add("win");
        somWin.currentTime = 0; somWin.play();
      } else {
        resultadoEl.innerText = "😿 Tente novamente";
      }
    }
  }, 100);
};

// Inicia
atualizarSaldo();
