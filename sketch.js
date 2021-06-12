var dog, dogImage, happyDog, database, foodS, foodStock, state;

var feedTheDog, addTheFood;

var fedTime, lastFed;

var feed,addFood;

var foodObj;

var milkBottle, milkBottleImage, Milk;

var changingGameState, readingGameState;

var bedroom, garden, washroom, bedroomImage, gardenImage, washroomImage;

function preload()
{

  dogImage = loadImage("Images/dogImg.png");
  happyDog = loadAnimation("Images/dogImg1.png");
  milkBottleImage = loadImage("Images/Milk.png");

  bedroomImage = loadImage("Images/virtual pet images/Bed Room.png");
  gardenImage = loadImage("Images/virtual pet images/Garden.png");
  washroomImage = loadImage("Images/virtual pet images/Wash Room.png");

}

function setup() {
  createCanvas(400, 500);

  database = firebase.database();
  
  foodObj = new Food();

  foodStock = database.ref('Food')
  foodStock.on("value", readStock);

  readingGameState = database.ref('gameState');
  readingGameState.on("value",function(data){
    state = data.val();
  });

  dog=createSprite(200,300,150,150);
  dog.addImage(dogImage);
  dog.scale=0.15;
  
  feedTheDog=createButton("Feed the dog");
  feedTheDog.position(400,95);
  feedTheDog.mousePressed(feedDog);

  addTheFood=createButton("Add Food");
  addTheFood.position(500,95);
  addTheFood.mousePressed(addFood);

}

function draw() {

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);

   currentTime = hour();
   if(currentTime==(lastFed+1)){
 
    update("Playing");
    foodObj.garden();

   } else if(currentTime==(lastFed+2)){

    update("Sleeping");
    foodObj.bedroom();

   } else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){

    update("Bathing");
    foodObj.washroom();

   } else{

    update("Hungry");
    foodObj.display();

   }

   if(state!="Hungry"){

    feedTheDog.hide();
    addTheFood.hide();

    dog.remove();

  } else{

   feedTheDog.show();
   addTheFood.show();
   dog.addImage(dogImage);

  }

  drawSprites();

}

function readStock(data){

  foodS = data.val();
  foodObj.updateFoodStock(foodS);

}

function feedDog(){ 
  
  //dog.addAnimation("abc",happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({

    Food : foodObj.getFoodStock(),
    FeedTime : hour(),
    state : "Hungry"

  });
  
}

function addFood(){

  foodS++

  database.ref('/').update({

    Food : foodS

  })

}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}