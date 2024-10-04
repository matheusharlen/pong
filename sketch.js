//variáveis da bolinha
let xBolinha = 300;
let yBolinha = 200;
let diametro = 15;
let raio = diametro/2;

// Variaveis de controle booleanas da Raquete e Bola. Usadas para dtectar colisões e evitar multiplas detecções na mesma colisão.
let colidiuMinhaRaquete = false;
let colidiuRaqueteOponente = false;
let bolaEmMovimento = false;

let velocidadeGlobal = 8;

//variáveis de velocidade da bolinha
let velocidadeXBolinha = 0;
let velocidadeYBolinha= 0;

// Variaveis que definem o tamanho das raquetes
let comprimentoRaquete = 12;
let alturaRaquete = 70;


//Variáveis da Minha Raquete (Player 1)
let yRaquete = 200;
let xRaquete = 0;

//Raquete do Oponente (Player 2 ou IA)
let yOponente = 160;
let xOponente = 600 - comprimentoRaquete - 0;
let velocidadeYOponente; //Usada no modo singleplayer na função de movimentar o oponente

//Variaveis de Placar
let meusPontos = 0;
let pontosOponente = 0;

//Variável "IA" para chance de acerto da raquete na bola
let chanceDeErro = 0;

//Variável de controle de colisão
let colisao = false;

//Variável de controle que indica o estado atual do jogo, inicialmente é definida como menu para entrar na funçãop de escolha de jogo.
let estadoDoJogo = 'menu';

//Variaveis dos sons
let raquetada;
let ponto;
let trilha;

//Variável para escolha do modo de jogo. Singleplayer o Multiplayer
let modoDeJogo = ''; 

let jogoPausado = false;
let mostrandoMenuPausa = false;

//Função de criação do canvas e carregamento da trilha sonora e definição da taxa de quadros por segundo
function setup() {
  frameRate(60);
  createCanvas(600, 400);
  trilha.loop();
  
}

//Função responsavel por atualizar e desenhar todos os elemtnos na tela 
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

//Função que exibe o menu inicial com as opções de jogo
function mostrarMenu() {
  background(0);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text('Bem-vindo ao Pong!', width / 2, height / 2 - 120);

  //Texto com instruções aos jogadores
  textSize(16);
  text('Modo Singleplayer: Use as teclas W e S ou as setas para cima e para baixo.', width / 2, height / 2 - 85);
  text('Modo Multiplayer: Player 1 utiliza as teclas W e S. E o', width / 2, height / 2 - 60);
  text(' player 2 utiliza as teclas seta para cima e seta para baixo.', width / 2, height / 2 - 40);
  text('O primeiro a atingir 10 pontos vence o jogo.', width / 2, height / 2 - 20);

  //Botão jogar contra a máquina (IA)
  rectMode(CENTER);
  fill(50, 205, 50);
  rect(width / 2, height / 2 + 10, 220, 40);
  fill(255);
  textSize(20);
  text('Jogar contra a máquina', width / 2, height / 2 + 16);

  // Botão do modo multiplayer (2 jogadores)
  fill(50, 205, 50);
  rect(width / 2, height / 2 + 60, 220, 40);
  fill(255);
  textSize(20);
  text('Multiplayer', width / 2, height / 2 + 67);
}

//Função que detecta os cliques dos mouses e executa a ação com base no estado do jogo
function mousePressed() {
  if (estadoDoJogo === 'menu') {
    // Botão jogar contra a máquina
    let dentroDoBotao1 =
      mouseX > width / 2 - 90 &&
      mouseX < width / 2 + 90 &&
      mouseY > height / 2 - 10 &&
      mouseY < height / 2 + 30;

    // Botão multiplayer
    let dentroDoBotao2 =
      mouseX > width / 2 - 90 &&
      mouseX < width / 2 + 90 &&
      mouseY > height / 2 + 40 &&
      mouseY < height / 2 + 80;

    if (dentroDoBotao1) {
      modoDeJogo = 'singleplayer';
      estadoDoJogo = 'jogando';
      reiniciarBola();
    } else if (dentroDoBotao2) {
      modoDeJogo = 'multiplayer';
      estadoDoJogo = 'jogando';
      reiniciarBola();
    }
  } else if (estadoDoJogo === 'fimDeJogo') {
    // Verifica se o clique foi dentro do botão Jogar Novamente
    let dentroDoBotao =
      mouseX > width / 2 - 80 &&
      mouseX < width / 2 + 80 &&
      mouseY > height / 2 + 20 &&
      mouseY < height / 2 + 60;

    if (dentroDoBotao) {
      reiniciarJogo();
    }
  } else if(estadoDoJogo === 'jogando'){
    if (
      mouseX > width - 40 &&
      mouseX < width - 10 &&
      mouseY > 10 &&
      mouseY < 40
    ) {
      jogoPausado = true;
    } else if (jogoPausado) {
      // Verifica se o clique foi dentro do botão "Continuar"
      let dentroDoBotaoContinuar =
        mouseX > width / 2 - 70 &&
        mouseX < width / 2 + 70 &&
        mouseY > height / 2 - 10 &&
        mouseY < height / 2 + 30;

      // Verifica se o clique foi dentro do botão "Novo Jogo"
      let dentroDoBotaoNovoJogo =
        mouseX > width / 2 - 70 &&
        mouseX < width / 2 + 70 &&
        mouseY > height / 2 + 40 &&
        mouseY < height / 2 + 80;

      if (dentroDoBotaoContinuar) {
        jogoPausado = false;
      } else if (dentroDoBotaoNovoJogo) {
        reiniciarJogo();
        
      }
    }
  }
}

//Função principal que executa o loop do jogo
function executarJogo() {
  if(jogoPausado){
    mostrarMenuPausa();
    return;
  }
  background(0);
  rectMode(CORNER); // Redefine o modo de desenho dos retângulos para coordenadas x e y
  mostraBolinha();
  movimentoBolinha();
  verificaBolinha();
  mostraRaquete();
  movimentoRaquete();
  mostraOponente();
//Movimenta o oponente com base no modo de jogo (singleplayer ou multiplayer)
  if(modoDeJogo === 'singleplayer'){
    movimentaOponente(); //IA
  } else if (modoDeJogo === 'multiplayer'){
    movimentaSegundoJogador(); //Player 2
  }
  
  verificaColisaoRaquete(xRaquete, yRaquete); //Verifica colisão com a raquete do jogador
  verificaColisaoRaquete(xOponente, yOponente); // Verifica colisão com a raquete do oponente
  placarJogo(); // Atualiza ao placar
  contadorDePontos(); // Verifica se um ponto foi marcado

  fill(45);
  rect(width - 40, 10, 30, 30);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text('||', width - 25, 25);
}

// Função do Menu de Pausa
function mostrarMenuPausa(){
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text('Jogo Pausado', width / 2, height / 2 - 40);

  // Botão "Continuar"
  rectMode(CENTER);
  fill(50, 205, 50);
  rect(width / 2, height / 2 + 10, 140, 40);
  fill(255);
  textSize(20);
  text('Continuar', width / 2, height / 2 + 10);

  // Botão "Novo Jogo"
  fill(50, 205, 50);
  rect(width / 2, height / 2 + 60, 140, 40);
  fill(255);
  textSize(20);
  text('Novo Jogo', width / 2, height / 2 + 60);
}


// Função que cria a bolinha (desenha na tela)
function mostraBolinha(){
  circle(xBolinha, yBolinha, diametro);
}

// Função que faz o movimento da bolinha nos eixos x e y (Constrain faz o limite da velocidade da bolinha para evitar que fique muito rápida)
function movimentoBolinha(){  
  // Limita a velocidade máxima
  if (bolaEmMovimento) { // Esse if é para garatir que a bolinha só se movimentar após o atraso inicial definido em reiniciar bolinha
        
    //velocidadeXBolinha = constrain(velocidadeXBolinha, -velocidadeGlobal, velocidadeGlobal);
    //velocidadeYBolinha = constrain(velocidadeYBolinha, -velocidadeGlobal, velocidadeGlobal);

    xBolinha += velocidadeXBolinha; // Faz o movimento da bolinha no eixo x
    yBolinha += velocidadeYBolinha; // Faz o movimento da bolinha no eixo y
  }
}


// Função que verifica se a bolinha tocou uma das bordas da tela e inverte a sua direção 
function verificaBolinha(){   
   if (yBolinha + raio > height || yBolinha - raio < 0){
    velocidadeYBolinha *= -1 ;
  }
}

// Função que desenha a raquete do usuário
function mostraRaquete(){
  rect(xRaquete, yRaquete, comprimentoRaquete, alturaRaquete);
}

// Função que controla o movimento da raquete do player 1 no eixo y
function movimentoRaquete(){
  if(modoDeJogo === 'singleplayer') { 
    if(keyIsDown(UP_ARROW) || keyIsDown(87)){
        yRaquete -= 10; 
      }
    if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
        yRaquete += 10; 
      }
  } else if (modoDeJogo === 'multiplayer'){
    if(keyIsDown(87)){
      yRaquete -= 10; 
    }
  if(keyIsDown(83)){
      yRaquete += 10; 
    }
  }    
    yRaquete = constrain(yRaquete, 0, height - alturaRaquete);
}

// Função que verifica a colisão entre a bolinha e uma raquete (Player 1 ou Player 2)
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
    velocidadeYBolinha = normalizado * velocidadeGlobal; // Reduzido o multiplicador para 2

    // Inverte a velocidade horizontal e aumenta levemente
    velocidadeXBolinha *= -1; // Inverte a direção

    // Limita a velocidade vertical
    //let velocidadeMaximaY = 10; // Ajuste conforme necessário
    //velocidadeYBolinha = constrain(velocidadeYBolinha, -velocidadeMaximaY, velocidadeMaximaY);

    raquetada.play();
  }
}


// Função que cria a raquete do oponente

function mostraOponente(){
  rect(xOponente, yOponente, comprimentoRaquete, alturaRaquete);
}

// Função da IA para o oponente (Calcula chance de erro no modo singleplayer)
function calculaChanceDoErro() {
    if(modoDeJogo === 'singleplayer'){    
      if (pontosOponente >= meusPontos) {
        chanceDeErro = random(-1, 1.5);
      } else {
        chanceDeErro = random(-0.5, 0.5);
      }      
    } else {
      chanceDeErro = 0;
    }
}
  
// FUnção que controla o movimento do oponente no modo singleplayer (IA)
function movimentaOponente() {
  let velocidadeMaxima = 5; 
  velocidadeYOponente = (yBolinha - yOponente - alturaRaquete / 2) * 0.1;
  velocidadeYOponente = constrain(velocidadeYOponente, -velocidadeMaxima, velocidadeMaxima);
  yOponente += velocidadeYOponente + chanceDeErro;
  yOponente = constrain(yOponente, 0, height - alturaRaquete);
  calculaChanceDoErro();
}

// Função que controla o movimento do segundo jogador (Multiplayer)
function movimentaSegundoJogador(){
    if(keyIsDown(UP_ARROW)){
         yOponente -= 10; 
      }
     if(keyIsDown(DOWN_ARROW)){
         yOponente += 10; 
      }
    
  yOponente = constrain(yOponente, 5, 325);
  
}

// Função que desenha o placar e exibe os pontos dos jogadores
function placarJogo() {
  stroke(255);
  textAlign(CENTER);
  textSize(16);

  if (modoDeJogo === 'multiplayer') {
    // Placar para Multiplayer
    fill(color(0, 128, 128));
    rect(150, 10, 60, 20);
    fill(255);
    text('P1: ' + meusPontos, 180, 22);

    fill(color(0, 255, 127));
    rect(390, 10, 60, 20);
    fill(255);
    text('P2: ' + pontosOponente, 420, 22);
  } else {
    // Placar para Singleplayer
    fill(color(0, 128, 128));
    rect(150, 10, 40, 20);
    fill(255);
    text(meusPontos, 170, 22);

    fill(color(0, 255, 127));
    rect(450, 10, 40, 20);
    fill(255);
    text(pontosOponente, 470, 22);
  }
}

// Função que verifica se um ponto foi marcado e atualzia o placar
function contadorDePontos() {
  if (xBolinha + raio > width) { // Ponto para player 1
    meusPontos += 1;
    ponto.play();
    reiniciarBola();
  }
  if (xBolinha - raio < 0) { // Ponto para o player 2 ou IA
    pontosOponente += 1;
    ponto.play();
    reiniciarBola();
  }

  // Verifica se alguém atingiu 10 pontos
  if (meusPontos === 10 || pontosOponente === 10) {
    estadoDoJogo = 'fimDeJogo';
  }
}

// Função auxiliar que carrega os arquivos de som antes do início do jogo
function preload() {
    trilha = loadSound("trilha.mp3");
    ponto = loadSound("ponto.mp3");
    raquetada = loadSound("raquetada.mp3");
}

// Função queexibe a tela de fim de jogo e anuncia o vencedor com opção para jogar novamente
function mostrarFimDeJogo() {
  background(0);
  textAlign(CENTER);
  fill(255);
  textSize(32);

  if (modoDeJogo === 'singleplayer') {
    if (meusPontos === 10) {
      text('Você venceu!', width / 2, height / 2 - 20);
    } else {
      text('O oponente venceu!', width / 2, height / 2 - 20);
    }
  } else if (modoDeJogo === 'multiplayer') {
    if (meusPontos === 10) {
      text('Player 1 venceu!', width / 2, height / 2 - 20);
    } else {
      text('Player 2 venceu!', width / 2, height / 2 - 20);
    }
  }

  // Botão para jogar novamente
  rectMode(CENTER);
  fill(50, 205, 50);
  rect(width / 2, height / 2 + 40, 160, 40);
  fill(255);
  textSize(20);
  text('Jogar Novamente', width / 2, height / 2 + 47);
}

//Função que reinia a posição e velocidade da bolinha após um ponto ser marcado, define tambem um atraso de 1 segundo antes da bolinha ser lançada
function reiniciarBola() {
  xBolinha = width / 2;
  yBolinha = height / 2;
  bolaEmMovimento = false; // Pausa movimento da bolinha
  velocidadeXBolinha = 0;
  velocidadeYBolinha = 0;

  setTimeout(() => {
    definirDirecaoAleatoria();
    bolaEmMovimento = true;
  }, 1000); // Atraso de 1 segundo
}

// Função que define uma direção aleatória para a bolinha após ser reiniciada
function definirDirecaoAleatoria() {
  let angulo = random(-PI / 4, PI / 4); // Ângulo de lançamento
  let direcao = random([1, -1]);
  //let velocidadeInicial = 8; // Velocidade que a bolinha é lançada até tocar em alguma raquete
  velocidadeXBolinha = direcao * velocidadeGlobal * cos(angulo);
  velocidadeYBolinha = velocidadeGlobal * sin(angulo);
}

// Funçao que reinicia o jogo para o estado inicial
function reiniciarJogo() {
  // Reinicia as variáveis do jogo
  meusPontos = 0;
  pontosOponente = 0;
  xBolinha = width / 2;
  yBolinha = height / 2;
  velocidadeXBolinha = 0;
  velocidadeYBolinha = 0;
  bolaEmMovimento = false;
  estadoDoJogo = 'menu'; // Retona ao menu inicial
  modoDeJogo = ''; // Limpa o modo de jogo
  jogoPausado = false;
  mostrandoMenuPausa = false;
  
}
