//variáveis da bolinha
let xBolinha = 300;
let yBolinha = 200;
let diametro = 15;
let raio = diametro/2;
let colidiuMinhaRaquete = false;
let colidiuRaqueteOponente = false;
let bolaEmMovimento = false;



//variáveis de velocidade da bolinha
let velocidadeXBolinha = 0;
let velocidadeYBolinha= 0;


let comprimentoRaquete = 12;
let alturaRaquete = 70;


//Variáveis da Minha Raquete
let yRaquete = 200;
let xRaquete = 0;

//Variável de controle de ponto
let colisao = false;

//Raquete do Oponente
let yOponente = 160;
let xOponente = 600 - comprimentoRaquete - 0;
let velocidadeYOponente;

//Variaveis de Placar
let meusPontos = 0;
let pontosOponente = 0;

//Variável "IA" para deixar o jogo simples
let chanceDeErro = 0;

let estadoDoJogo = 'menu';

let raquetada;
let ponto;
let trilha;

//Função de criação da tela e carregamento da trilha sonora
function setup() {
  frameRate(60);
  createCanvas(600, 400);
  trilha.loop();
  
}

function draw() {
  background(0);

  if (estadoDoJogo === 'menu') {
    mostrarMenu();
  } else if (estadoDoJogo === 'jogando') {
    executarJogo();
  } else if (estadoDoJogo === 'fimDeJogo') {
    mostrarFimDeJogo();
  }
}

function mostrarMenu() {
  background(0);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text('Bem-vindo ao Pong!', width / 2, height / 2 - 60);
  textSize(16);
  text('Use as setas para cima e para baixo para mover sua raquete.', width / 2, height / 2 - 20);
  text('O primeiro a atingir 10 pontos vence o jogo.', width / 2, height / 2 + 10);

  // Desenha o botão
  rectMode(CENTER);
  fill(50, 205, 50);
  rect(width / 2, height / 2 + 60, 120, 40);
  fill(255);
  textSize(20);
  text('Iniciar Jogo', width / 2, height / 2 + 67);
}
function mousePressed() {
  if (estadoDoJogo === 'menu') {
    // Verifica se o clique foi dentro do botão
    let dentroDoBotao =
      mouseX > width / 2 - 60 &&
      mouseX < width / 2 + 60 &&
      mouseY > height / 2 + 40 &&
      mouseY < height / 2 + 80;

    if (dentroDoBotao) {
      estadoDoJogo = 'jogando';
      reiniciarBola();
    }
  } else if (estadoDoJogo === 'fimDeJogo') {
    // Verifica se o clique foi dentro do botão "Jogar Novamente"
    let dentroDoBotao =
      mouseX > width / 2 - 80 &&
      mouseX < width / 2 + 80 &&
      mouseY > height / 2 + 20 &&
      mouseY < height / 2 + 60;

    if (dentroDoBotao) {
      reiniciarJogo();
    }
  }
}

function executarJogo() {
  rectMode(CORNER);
  mostraBolinha();
  movimentoBolinha();
  verificaBolinha();
  mostraRaquete();
  movimentoRaquete();
  mostraOponente();
  movimentaOponente();
  verificaColisaoRaquete(xRaquete, yRaquete);
  verificaColisaoRaquete(xOponente, yOponente);
  placarJogo();
  contadorDePontos();
}


//Função que cria a bolinha
function mostraBolinha(){
  circle(xBolinha, yBolinha, diametro);
}

//função que faz o movimento da bolinha nos eixos x e y.
function movimentoBolinha(){
  
  // Limitar a velocidade máxima
  if (bolaEmMovimento) {
        
    let velocidadeMaxima = 10; // Ajuste este valor conforme necessário
    velocidadeXBolinha = constrain(velocidadeXBolinha, -velocidadeMaxima,         velocidadeMaxima);
    velocidadeYBolinha = constrain(velocidadeYBolinha, -velocidadeMaxima,         velocidadeMaxima);

    xBolinha += velocidadeXBolinha;
    yBolinha += velocidadeYBolinha;
  }
}


//função que verifica se a bolinha tocou uma das bordas da tela.
function verificaBolinha(){
  
   
   if (yBolinha + raio > height || yBolinha - raio < 0){
    velocidadeYBolinha *= -1 ;
  }
}

//Função que cria a raquete do usuário
function mostraRaquete(){
  rect(xRaquete, yRaquete, comprimentoRaquete, alturaRaquete);
}

//Função que controla o movimento da raquete do usuário no eixo y
function movimentoRaquete(){
  if(keyIsDown(UP_ARROW)){
       yRaquete -= 10; 
    }
   if(keyIsDown(DOWN_ARROW)){
       yRaquete += 10; 
    }
  
    yRaquete = constrain(yRaquete, 0, height - alturaRaquete);

}



function colisaoRaquete(){
  if(xBolinha - raio < xRaquete + comprimentoRaquete && yBolinha - raio < yRaquete +  alturaRaquete && yBolinha + raio > yRaquete  ){
    velocidadeXBolinha *= -1;
    raquetada.play();
  }
}

//Função que Verifica se a bolinha colidiu com a Raquete do Jogador 1 com a Raquete do Oponente, nessa eu preferi utilizar parametros diferentes para melhor aprendizado.
/*function verificaColisaoRaquete(xRaquete,yRaquete, minhaRaquete){
     colisao = collideRectCircle(xRaquete, yRaquete, comprimentoRaquete, alturaRaquete, xBolinha, yBolinha, diametro);
     if (minhaRaquete){
       if(colisao && !colidiuMinhaRaquete){
         velocidadeXBolinha *= -1;
         xBolinha += velocidadeXBolinha;
         raquetada.play();
         colidiuMinhaRaquete = true
       } else if (!colisao) {
         colidiuMinhaRaquete = false;
       }
       
     } else {
       if (colisao && !colidiuRaqueteOponente){
         velocidadeXBolinha *= -1;
         xBolinha += velocidadeXBolinha;
         raquetada.play();
         colidiuRaqueteOponente = true;
       } else if(!colisao) {
         colidiuRaqueteOponente = false;
       }
     }
} */

/*function verificaColisaoRaquete(xRaquete, yRaquete){
  colisao = collideRectCircle(
    xRaquete,
    yRaquete,
    comprimentoRaquete,
    alturaRaquete,
    xBolinha,
    yBolinha,
    diametro
  );
  if (colisao){
    if (velocidadeXBolinha > 0) {
      xBolinha = xRaquete - raio - 3; // Aumentado de -1 para -3
    } else {
      xBolinha = xRaquete + comprimentoRaquete + raio + 3; // Aumentado de +1 para +3
    }
    velocidadeXBolinha *= -5;
    //velocidadeYBolinha *= -1;
    raquetada.play();
  }
}

*/

function verificaColisaoRaquete(xRaquete, yRaquete) {
  colisao = collideRectCircle(
    xRaquete,
    yRaquete,
    comprimentoRaquete,
    alturaRaquete,
    xBolinha,
    yBolinha,
    diametro
  );
  if (colisao) {
    // Calcula a posição relativa do ponto de colisão na raquete
    let pontoColisaoRaquete = yBolinha - (yRaquete + alturaRaquete / 2);
    let normalizado = pontoColisaoRaquete / (alturaRaquete / 2);

    // Ajusta a velocidade vertical com base no ponto de colisão
    velocidadeYBolinha += normalizado * 5; // O multiplicador pode ser ajustado

    // Inverte a velocidade horizontal e aumenta levemente
    velocidadeXBolinha *= -1.05; // Inverte a direção e aumenta 5%

    // Limita a velocidade vertical para evitar valores extremos
    let velocidadeMaximaY = 10;
    velocidadeYBolinha = constrain(velocidadeYBolinha, -velocidadeMaximaY, velocidadeMaximaY);

    raquetada.play();
  }
}


//Função que cria a raquete do oponente. Poderia ter utilizado a função mostraRaquete para diminuir o código e utilizar parametros diferentes para chamar as variaveis x e y: function mostraRaquete(x,y) {rect(x, y, raqueteComprimento, raqueteAltura);} 




function mostraOponente(){
  rect(xOponente, yOponente, comprimentoRaquete, alturaRaquete);
}


function movimentaOponente() {
  let velocidadeMaxima = 5;
  velocidadeYOponente = (yBolinha - yOponente - alturaRaquete / 2) * 0.1;
  velocidadeYOponente = constrain(velocidadeYOponente, -velocidadeMaxima, velocidadeMaxima);
  yOponente += velocidadeYOponente + chanceDeErro;
  yOponente = constrain(yOponente, 0, height - alturaRaquete);
  calculaChanceDoErro();
}


function placarJogo(){
    stroke(255);
    textAlign(CENTER);
    textSize(16);
    fill(color(0,128,128))
    rect(150, 10, 40, 20);
    fill(255);
    text(meusPontos, 170, 26);
    fill(color(0,255,127));
    rect(450, 10, 40, 20);
    fill(255);
    text(pontosOponente, 470, 26);
    
}


function contadorDePontos() {
  if (xBolinha + raio > width) { // Ponto para você
    meusPontos += 1;
    ponto.play();
    reiniciarBola();
  }
  if (xBolinha - raio < 0) { // Ponto para o oponente
    pontosOponente += 1;
    ponto.play();
    reiniciarBola();
  }

  // Verifica se alguém atingiu 10 pontos
  if (meusPontos === 10 || pontosOponente === 10) {
    estadoDoJogo = 'fimDeJogo';
  }
}



function movimentaSegundoJogador(){
  if(keyIsDown(87)){
       yOponente -= 10; 
    }
   if(keyIsDown(83)){
       yOponente += 10; 
    }
  
yOponente = constrain(yOponente, 5, 325);

}


function preload() {
    trilha = loadSound("trilha.mp3");
    ponto = loadSound("ponto.mp3");
    raquetada = loadSound("raquetada.mp3");
}


function calculaChanceDoErro() {
  if (pontosOponente >= meusPontos) {
    chanceDeErro = random(-1, 1);
  } else {
    chanceDeErro = random(-0.5, 0.5);
  }
}


function placarJogo() {
  stroke(255);
  textAlign(CENTER);
  textSize(16);
  fill(color(0, 128, 128));
  rect(150, 10, 40, 20);
  fill(255);
  text(meusPontos, 170, 26);
  fill(color(0, 255, 127));
  rect(450, 10, 40, 20);
  fill(255);
  text(pontosOponente, 470, 26);
}
function mostrarFimDeJogo() {
  background(0);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  if (meusPontos === 10) {
    text('Você venceu!', width / 2, height / 2 - 20);
  } else {
    text('O oponente venceu!', width / 2, height / 2 - 20);
  }

  // Botão para jogar novamente
  rectMode(CENTER);
  fill(50, 205, 50);
  rect(width / 2, height / 2 + 40, 160, 40);
  fill(255);
  textSize(20);
  text('Jogar Novamente', width / 2, height / 2 + 47);
}

  
  
function reiniciarBola() {
  xBolinha = width / 2;
  yBolinha = height / 2;
  bolaEmMovimento = false;
  velocidadeXBolinha = 0;
  velocidadeYBolinha = 0;

  setTimeout(() => {
    definirDirecaoAleatoria();
    bolaEmMovimento = true;
  }, 1000); // Atraso de 1 segundo
}
  
function definirDirecaoAleatoria() {
  let angulo = random(-PI / 2, PI / 2);
  let direcao = random([1, -1]);
  let velocidadeInicial = 8;
  velocidadeXBolinha = direcao * velocidadeInicial * cos(angulo);
  velocidadeYBolinha = velocidadeInicial * sin(angulo);
}


function reiniciarJogo() {
  // Reinicia as variáveis do jogo
  meusPontos = 0;
  pontosOponente = 0;
  xBolinha = width / 2;
  yBolinha = height / 2;
  velocidadeXBolinha = 0;
  velocidadeYBolinha = 0;
  bolaEmMovimento = false;
  estadoDoJogo = 'menu';
}
/*


function touchAlto() {
  // Quando o toque começa (toque para baixo), decrementa a variável
  while(touchStarted){
    yRaquete -= 10;
  }
//  return false; // Impede o comportamento padrão do toque no navegador
}

function toqueBaixo() {
  // Quando o toque termina (toque subindo), incrementa a variável
  
do{
  yRaquete += 10; 
} while(touchEnded); 
//  return false; // Impede o comportamento padrão do toque no navegador
}*/