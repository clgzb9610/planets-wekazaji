var levelSelect = function (game) {};


var levelBackground;

//level button variables
var oneButton;
var twoButton;
var threeButton;
var fourButton;
var fiveButton;
var sixButton;
var sevenButton;
var eightButton;
var nineButton;
var tenButton;

//level button backgrounds


levelSelect.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.image("one", "assets/levelSelect/1.png");
        game.load.image("two", "assets/levelSelect/2.png");
        game.load.image("background", "assets/levelSelect/background.png");

    },
    create:function () {
        console.log("creating level select");
        game.world.setBounds(0, 0, 700, 700);

        levelBackground = game.add.tileSprite(-320, -320, 1024, 1024, 'space');
        
        //Level One
        oneButtonBG = game.add.button(41,191,"background",startLevel,this);
        oneButtonBG.scale.x = 0.3;
        oneButtonBG.scale.y = 0.3;
        
        oneButton = game.add.button(50,200,"one",startLevel,this);
        oneButton.scale.x = 0.3;
        oneButton.scale.y = 0.3;
        oneButton.inputEnabled = true;
        
        //Level Two
        twoButtonBG = game.add.button(271,191,"background",startLevel,this);
        twoButtonBG.scale.x = 0.3;
        twoButtonBG.scale.y = 0.3;
        
        twoButton = game.add.button(280,200,"two",startLevel,this);
        twoButton.scale.x = 0.3;
        twoButton.scale.y = 0.3;
        twoButton.inputEnabled = true;
        


    },
    update:function() {
        levelBackground.tilePosition.x -= 1;

    },
    render:function(){

    }
};


function test() {}

function startLevel(level) {
    if (level == "one") {
        start = 1;
        replayTheGame(start);
    }
}

function replayTheGame(start){
    game.camera.fade('#000000',500);
    // game.camera.onFadeComplete.add(refadeComplete,this);
    game.time.events.add(500, refadeComplete(start), this);
}

function refadeComplete(start){
    destroyEndStateObjects();
    game.state.start("PlayGame", true, false, 0,currentLevel = start);
}