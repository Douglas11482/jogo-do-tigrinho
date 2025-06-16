// Gera QR Code
new QRCode(document.getElementById("qrcode"), {
  text: "00020126580014br.gov.bcb.pix0136f8430bc9-d9b8-4318-a3cf-bb016dc5b2d152040000530398654061.005802BR5925TigrinhoJogos6009SAOPAULO62070503***6304A13F",
  width: 120, height: 120
});

// Elementos
const rolo = document.getElementById("rolo");
const resEl = document.getElementById("resultado");
const sdEl = document.getElementById("saldo");
const btnG = document.getElementById("btnGirar");
const btnS = document.getElementById("btnSalvarConfig");
const inpSd = document.getElementById("saldoInicial");
const inpCt = document.getElementById("custoGiro");
const sg = document.getElementById("somGiro");
const sw = document.getElementById("somGanhou");

// Variáveis
let saldo = parseFloat(inpSd.value);
let custo = parseFloat(inpCt.value);
const mult = { "🐯":10, "💎":5, "🍒":2 };

// Atualiza saldo
function atualiza() {
  sdEl.innerText = `💰 Saldo: R$${saldo.toFixed(2)}`;
}
btnS.onclick = () => {
  saldo = parseFloat(inpSd.value) || saldo;
  custo = parseFloat(inpCt.value) || custo;
  atualiza();
  resEl.innerText = "";
};

// Giro
btnG.onclick = () => {
  if (saldo < custo) { resEl.innerText="Saldo insuficiente!"; return; }
  saldo -= custo; atualiza();
  sg.currentTime=0; sg.play();
  resEl.innerText="Girando...";
  rolo.classList.remove("win");
  let cnt=0, final=[];
  const iv = setInterval(()=>{
    final=[...Array(3)].map(()=>Object.keys(mult)[Math.floor(Math.random()*3)]);
    rolo.innerText = final.join(" ");
    if(++cnt>15){
      clearInterval(iv);
      const [a,b,c]=final;
      if(a===b&&b===c){
        const ganho=custo*mult[a];
        saldo+=ganho; atualiza();
        resEl.innerText=`🎉 Ganhou R$${ganho.toFixed(2)}!`;
        rolo.classList.add("win");
        sw.currentTime=0; sw.play();
      } else resEl.innerText="😿 Tente novamente";
    }
  },100);
};
atualiza();
