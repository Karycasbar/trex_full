var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage;
var obstacle, obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score;
var cloudsGroup, obstaclesGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg,restartImg, gameOver, restart;
var jumpSound, checkPointSound, dieSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //crear sprite de trex
    trex = createSprite(50,height-70,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided",trex_collided);
    trex.scale = 0.5;
  //crear sprite de suelo
    ground = createSprite(width/2,height-80,width,2);
    ground.addImage("ground",groundImage);
    ground.x = ground.width /2;
    ground.velocityX = -4;

    invisibleGround = createSprite(width/2,height-10,width,125);
    invisibleGround.visible = false;

    gameOver = createSprite(width/2, height/2-50);
    gameOver.addImage(gameOverImg);

    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    var rand = Math.round(random(1,100));

    score = 0;

    obstaclesGroup = new Group();
    cloudsGroup = new Group();

    trex.setCollider("circle",0,0,40);
    //trex.setCollider("rectangle",0,0,400,trex.height);
    trex.debug = false;

      
}

function draw() {
  background(255);
 
  
  //console.log("Hola" + trex.x);
  fill("black");
  text("Puntación "+score, width/2, 50);
  
  if(gameState == PLAY){
    gameOver.visible = false;
    restart.visible = false;

    //mueve el suelo
    ground.velocityX = -(4+3*score/100);

    //genera la puntución
    score = score + Math.round(getFrameRate()/60);
    if(score>0 && score % 100 == 0){
      checkPointSound.play();
    }

    //hacer que el trex salte al presionar la barra espaciadora
    if ((touches.length>0 || keyDown("space")) && trex.y>=height-180) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
      }
      trex.velocityY = trex.velocityY + 0.8
      
      if (ground.x < 0) {
      ground.x = ground.width / 2;
      }
      //aparece las nubes
    spawnClouds();
    //aparece los obstaculos en el suelo
    spawnObstacles();

      if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
        //trex.velocityY = -12;
        //jumpSound.play();
      }

  }else if(gameState == END){
    gameOver.visible = true;
    restart.visible = true;

    trex.velocityY = 0;

    //detiene el suelo
    ground.velocityX = 0;
    trex.changeAnimation("collided", trex_collided);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    /*if(mousePressedOver(restart)){
      //console.log("Reinicia el juego");
      reset();
    }*/

    if(touches.length>0 || keyDown("space")){
      reset();
      touches = [];
    }
  }

 
  //console.log(trex.y);
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds(){
  if(frameCount % 60 == 0){
  cloud = createSprite(width+20,height,40,10);
  cloud.addImage(cloudImage);
  cloud.scale = 0.4;
  cloud.y = Math.round(random(10,60));
  cloud.velocityX = -3;

  cloud.lifetime = 350;
  cloudsGroup.add(cloud);

  //ajustar la profundidad
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;
  }
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite(width+20,height-95,10,40);
    obstacle.velocityX = -(6+score/100);

    //generar los obtaculos al azar
    var rand = Math.round(random(1,6));
    switch (rand){
      case 1: 
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default: break;
    }
    //asignar escala y ciclo de vida
    obstacle.scale = 0.5;
    obstacle.lifetime = 350;

    obstaclesGroup.add(obstacle);

  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}