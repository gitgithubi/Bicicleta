let path,mainCyclist;
let player1,player2,player3;
let pathImg,mainRacerImg1,mainRacerImg2,mainRacerImg3;
let oppPink1Img,oppPink2Img;
let oppYellow1Img,oppYellow2Img;
let oppRed1Img,oppRed2Img;
let gameOverImg,cycleBell;
let pinkCG, yellowCG,redCG; 
let END = 0;
let PLAY = 1;
let gameState = PLAY;
let distância = 0;
let gameOver, restart;
let turbo = "Turbo: ";
let potência = 100;

function preload() {
 pathImg = loadImage("Road.png");
 mainRacerImg1 = loadAnimation("mainPlayer1.png","mainPlayer2.png");
 mainRacerImg2 = loadAnimation("mainPlayer3.png");
 mainRacerImg3 = loadAnimation("mainPlayer2.png","mainPlayer1.png");
 oppPink1Img = loadAnimation("opponent1.png","opponent2.png");
 oppPink2Img = loadAnimation("opponent3.png");
 oppYellow1Img = loadAnimation("opponent4.png","opponent5.png");
 oppYellow2Img = loadAnimation("opponent6.png");
 oppRed1Img = loadAnimation("opponent7.png","opponent8.png");
 oppRed2Img = loadAnimation("opponent9.png");
 cycleBell = loadSound("bell.mp3");
 gameOverImg = loadImage("gameOver.png");
}

function setup() {
 createCanvas(1200,300);

 path = createSprite(100,150);
 path.addImage(pathImg);
 path.velocityX = -5;

 mainCyclist  = createSprite(70,150);
 mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
 mainCyclist.scale = 0.07;
 mainCyclist.setCollider("rectangle",0,0,40,400);
 mainCyclist.debug = true;
 
 gameOver = createSprite(650,150);
 gameOver.addImage(gameOverImg);
 gameOver.scale = 0.8;
 gameOver.visible = false;  
  
 pinkCG = new Group();
 yellowCG = new Group();
 redCG = new Group();
}

function draw() {
  background(0);
  
  drawSprites();
  textSize(20);
  fill(255);
  text("Distância: "+ distância,900,30);

  edges = createEdgeSprites();

  text(turbo + potência, 800, 30);

  if (gameState === PLAY) { 
    
  distância = distância + Math.round(getFrameRate()/45);
  path.velocityX = -(6 + 2*distância/150);

  if (mainCyclist.y <= 50) {
    mainCyclist.y = 50;
  } else if (mainCyclist.y >= 250) {
    mainCyclist.y = 250;
 }

  if (distância % 400 === 0) {
   cycleBell.play();
  }

  if (mainCyclist.x <= 60) {
    mainCyclist.x = mainCyclist.width/2;
    mainCyclist.velocityX = 0; 
  } 
  
  if (mainCyclist.x <= 60 && keyDown("shift")) {
    mainCyclist.x = mainCyclist.x +1;
    mainCyclist.velocityX = mainCyclist.velocityX +0.9;
    mainCyclist.velocityX = mainCyclist.velocityX -0.5; 
    potência = potência -1;
  } 
  
  if (mainCyclist.x <= 60 && keyDown("shift")) {
   if (potência <= 0) {
    mainCyclist.x = mainCyclist.width/2;
    mainCyclist.velocityX = 0;
   }
  }

  if (keyDown("shift") && potência >0) {
    mainCyclist.velocityX = mainCyclist.velocityX +0.9;
    mainCyclist.velocityX = mainCyclist.velocityX -0.5; 
    potência = potência -1;
  } else if (potência === 0) {
    potência = 0;
    mainCyclist.velocityY = 0;
    mainCyclist.velocityX = mainCyclist.velocityX -0.5; 
  } else if (potência <= 0) {
    potência = 0;
    mainCyclist.velocityX = mainCyclist.velocityX -0.5; 
  } else {
    mainCyclist.velocityX = mainCyclist.velocityX -0.5; 
  }

  if (mainCyclist.velocityX === mainCyclist.velocityX -0.5) {
    mainCyclist.addAnimation("MainBacking",mainRacerImg3);
  }

  if (keyDown("shift") && potência === 0) {
    text("Sem combustível!",630,30);
    mainCyclist.velocityY = 0; 
  }

  if (keyDown(DOWN_ARROW)) {
    mainCyclist.velocityY = 3; 
  } else if (keyDown(UP_ARROW)) {
    mainCyclist.velocityY = -3;
  }
  
  if (path.x <= 0){
    path.x = path.width/2;
  } else if (keyDown("space")) {
    cycleBell.play();
  }

  let select_oppPlayer = Math.round(random(1,3));
  
  if (World.frameCount % 150 === 0) {
   if (select_oppPlayer == 1) {
      pinkCyclists();
  } else if (select_oppPlayer == 2) {
      yellowCyclists();
  } else {
      redCyclists();
  }
 }
  
  if (pinkCG.isTouching(mainCyclist)){
   gameState = END;
   player1.velocityY = 0;
   player1.addAnimation("opponentPlayer1",oppPink2Img);
   player1.velocityY = -4;
  }
    
  if (yellowCG.isTouching(mainCyclist)){
    gameState = END;
    player2.velocityY = 0;
    player2.addAnimation("opponentPlayer2",oppYellow2Img);
  }
    
 if (redCG.isTouching(mainCyclist)){
    gameState = END;
    player3.velocityY = 0;
    player3.addAnimation("opponentPlayer3",oppRed2Img);
  }
    
} else if (gameState === END) {
    gameOver.visible = true;
    gameOver.depth = 4;
  
    textSize(20);
    fill(255);
    text("Press Space to Restart the game!", 500,200);
  
    path.velocityX = 0;
    mainCyclist.velocityY = 0;
    mainCyclist.addAnimation("SahilRunning",mainRacerImg2);
  
    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);
  
    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);
  
    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);

    potência = 0;
    mainCyclist.velocityX = 0;

    if (keyDown("space")) {
       reset();
    }
 }
}

function pinkCyclists() {
  player1 = createSprite(1100,Math.round(random(50, 250)));
  player1.scale = 0.06;
  player1.velocityX = -(6 + 2*distância/170);
  player1.addAnimation("opponentPlayer1",oppPink1Img);
  player1.setLifetime = 170;
  pinkCG.add(player1);
  player1.depth = 2;
}

function yellowCyclists() {
  player2 = createSprite(1100,Math.round(random(50, 250)));
  player2.scale = 0.06;
  player2.velocityX = -(6 + 2*distância/170);
  player2.addAnimation("opponentPlayer2",oppYellow1Img);
  player2.setLifetime = 170;
  yellowCG.add(player2);
  player2.depth = 2;
}

function redCyclists()    {
 player3 = createSprite(1100,Math.round(random(50, 250)));
 player3.scale = 0.06;
 player3.velocityX = -(6 + 2*distância/170);
 player3.addAnimation("opponentPlayer3",oppRed1Img);
 player3.setLifetime = 170;
 redCG.add(player3);
 player3.depth = 2;
}

function reset(){
 gameState = PLAY;
 gameOver.visible = false;
 mainCyclist.addAnimation("SahilRunning",mainRacerImg1);
  
 pinkCG.destroyEach();
 yellowCG.destroyEach();
 redCG.destroyEach();
  
 distância = 0;

 potência = 100;
}