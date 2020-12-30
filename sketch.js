// add your code here
var player1anim,player2anim,player1,player2;
var bgimg;
var database;
var position1,position2;
var gameState;
var resetbutton;
var disp_text;
var element1,element2;
var player1Score = 0;
var player2Score = 0;


function preload(){
    player2anim = loadAnimation("assests/player1a.png","assests/player1b.png","assests/player1a.png");
    player1anim = loadAnimation("assests/player2a.png","assests/player2b.png","assests/player2a.png");
    bgimg = loadImage("assests/Kabaddi3.jpeg");
}


function setup(){

    createCanvas(500,500);
    database = firebase.database();


    player1 = createSprite(400,250,50,50);
    player1.addAnimation("moving1",player1anim);
    player1.scale= -0.3;
    player1.debug = true;
    player1anim.frameDelay = 200;
    player1.setCollider("circle",0,0,50);
    database.ref('player1/position').on("value",(data)=>{
      position1 = data.val();
      player1.x = position1.x;
      player1.y = position1.y;
    });



    player2 = createSprite(100,250,50,50);
    player2.addAnimation("moving2",player2anim);
    player2.scale = 0.3;
    player2.debug = true;
    player2anim.frameDelay = 200;
    player2.setCollider("circle",0,0,50);
    database.ref('player2/position').on("value",(data)=>{
      position2 = data.val();
      player2.x = position2.x;
      player2.y = position2.y;
    });

   var gameStateref = database.ref('gameState');
   gameStateref.on("value",(data)=>{
     gameState = data.val();
   });

   var player1ScoreRef = database.ref('player1Score');
   player1ScoreRef.on("value",(data)=>{
     player1Score = data.val();
   });

   var player2ScoreRef = database.ref('player2Score');
   player2ScoreRef.on("value",(data)=>{
    player2Score = data.val();
  });


   resetbutton = createButton('RESET');
    resetbutton.position(355,30);
    resetbutton.mousePressed(()=>{
        database.ref('/').set({
            'player1Score' : 0,
            'player2Score' : 0,
            'gameState' : 0,
            player1 : null,
            player2 : null,
                    
    });
   });

    
}


function draw(){
                                background("#F4BA62");
                                textSize(18);
                                fill ("black");
                                stroke("red");
                                text ("RED SCORE  :  " + player1Score, 50,60);
                                stroke("yellow")
                                text ("YELLOW SCORE  :  " + player2Score, 300,60);

                            // Draws the lines
                                        // central
                                    for(var i=0;i<500;i=i+20){
                                        stroke(0)
                                        strokeWeight(2);
                                        line (250,i,250,i+10);
                                    }

                                        //left
                                    for(var i=0;i<500;i=i+20){
                                        stroke ("yellow");
                                        strokeWeight(2);
                                        line (100,i,100,i+10);
                                    }

                                        //right
                                    for(var i=0;i<500;i=i+20){
                                        stroke ("red");
                                        strokeWeight(2);
                                    line (400,i,400,i+10);
                                    }

                                                             
                                   
                                        
                                    if(gameState === 0 ){
                                        textSize(20);
                                        stroke("grey")
                                        text("Press space to Toss", 160,250);
                                        
                                    }

                                        if(keyDown("space") && gameState === 0){
                                          resetPosition1();
                                          resetPosition2();
                                          console.log("Hii...........")
                                             select_player = Math.round(random(1,2));
                                            console.log(select_player);

                                                if(select_player === 1){
                                                   updateState(1);
                                                    alert("Yellow  RIDE");
                                                }   
                                                  else { 
                                                    updateState(2);
                                                    alert("Red RIDE");
                                                  }  
                                                
                                                    
                                                
                                                }

                                   
                                        if(keyDown(LEFT_ARROW) && gameState === 1){
                                            writePosition1(-5,0);
                                          }
                                        if(keyDown(RIGHT_ARROW) && gameState === 1){
                                            writePosition1(5,0);
                                          }
                                        if(keyDown(UP_ARROW)){
                                            writePosition1(0,-5);
                                          }
                                        if(keyDown(DOWN_ARROW)){
                                            writePosition1(0,5);
                                          }
                                       


                                          if(keyDown("a") && gameState === 2){
                                            writePosition2(-5,0);
                                          }
                                          if(keyDown("d") && gameState === 2){
                                            writePosition2(5,0);
                                          }
                                          if(keyDown("w")){
                                            writePosition2(0,-5);
                                          }
                                          if(keyDown("s")){
                                            writePosition2(0,5);
                                          }
                                          

                                      if(gameState === 2){
                                        if(player2.x > 400){
                                              alert("RED WON")
                                            database.ref('/').update({
                                                'gameState' : 0,
                                                'player1Score': player1Score - 5,
                                                'player2Score': player2Score + 5
                                            });


                                        }
                                      
                                        
                                        if(player1.isTouching(player2)){
                                               // updatestate(0)
                                            database.ref('/').update({
                                                'gameState' : 0,
                                                'player1Score': player1Score + 5,
                                                'player2Score': player2Score - 5
                                            });
                                            
                                            
                                            alert("RED LOST");                                           
                                               
                                            
                                        }
                                      }


                                    if (gameState === 1){
                                      

                                        if(player1.x < 100){
                                                //updatestate(0);
                                            database.ref('/').update({
                                                'gameState' : 0,
                                                'player1Score': player1Score + 5,
                                                'player2Score': player2Score - 5
                                            });

                                              alert("YELLOw WON")
                                        }
                                      
                                        
                                        if(player1.isTouching(player2)){
                                                //updatestate(0);
                                            database.ref('/').update({
                                                'gameState' : 0,
                                                'player1Score': player1Score - 5,
                                                'player2Score': player2Score + 5
                                            });
                                            
                                            alert("YELLOW LOST");                                           
                                               
                                            
                                        }
                                    }
                                   
         drawSprites();
}



/*function readPosition1(data1){
    position1 = data1.val();
    player1.x = position1.x;
    player1.y = position1.y;
    //console.log("hi1")
}

function readPosition2(data2){
    position2 = data2.val();
    player2.x = position2.x;
    player2.y = position2.y;
   // console.log("hi2")
}
*/
function writePosition1(x1,y1){
    database.ref('player1/position').set({
        'x':position1.x + x1,
        'y':position1.y + y1
        
    })
   // console.log("hi3")
}

function writePosition2(x2,y2){
    database.ref('player2/position').set({
        'x':position2.x + x2,
        'y':position2.y + y2
    })
    //console.log("hi4")
}

/*function getState(data){
    
     gameState = data.val();      
}*/

function updateState(state){
    database.ref('/').update({
        'gameState': state
    })
}

/*function readScore1(data1){
    player1Score = data1.val();
}

function readScore2(data2){
    player2Score = data2.val();
}

function showError(){
    console.log("Reading Failed");
}*/

//update position of player1(yellow) in database when reset is clicked
function resetPosition1() {
  database.ref("player1/position").set({
    x: 400,
    y: 300,
  });
  console.log("pos11111..........")
}

//update position of player2(red) in database when reset is clicked
function resetPosition2() {
  database.ref("player2/position").set({
    x: 100,
    y: 300,
  });
  console.log("pos222..........")
}