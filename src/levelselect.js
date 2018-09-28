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



levelSelect.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.image("one", "assets/levelSelect/1.png");
        game.load.image("two", "assets/levelSelect/2.png");
        game.load.image("three", "assets/levelSelect/3.png");
        game.load.image("four", "assets/levelSelect/4.png");
        game.load.image("five", "assets/levelSelect/5.png");
        game.load.image("six", "assets/levelSelect/6.png");
        game.load.image("seven", "assets/levelSelect/7.png");
        game.load.image("eight", "assets/levelSelect/8.png");
        game.load.image("nine", "assets/levelSelect/9.png");
        game.load.image("background", "assets/levelSelect/background.png");

    },
    create:function () {
        console.log("creating level select");
        game.world.setBounds(0, 0, 700, 700);

        levelBackground = game.add.tileSprite(-320, -320, 1024, 1024, 'space');
        
        //Level One
        oneButtonBG = game.add.button(41,191,"background",buttonOne,this);
        oneButtonBG.scale.x = 0.3;
        oneButtonBG.scale.y = 0.3;
        
        oneButton = game.add.button(50,200,"one",buttonOne,this);
        oneButton.scale.x = 0.3;
        oneButton.scale.y = 0.3;
        oneButton.inputEnabled = true;
        
        //Level Two
        twoButtonBG = game.add.button(256,191,"background",buttonTwo,this);
        twoButtonBG.scale.x = 0.3;
        twoButtonBG.scale.y = 0.3;
        
        twoButton = game.add.button(265,200,"two",buttonTwo,this);
        twoButton.scale.x = 0.3;
        twoButton.scale.y = 0.3;
        twoButton.inputEnabled = true;
        
        //Level Three
        threeButtonBG = game.add.button(471,191,"background",buttonThree,this);
        threeButtonBG.scale.x = 0.3;
        threeButtonBG.scale.y = 0.3;
        
        threeButton = game.add.button(480,200,"three",buttonThree,this);
        threeButton.scale.x = 0.3;
        threeButton.scale.y = 0.3;
        threeButton.inputEnabled = true;
        
        //Level Four
        fourButtonBG = game.add.button(41,356,"background",buttonFour,this);
        fourButtonBG.scale.x = 0.3;
        fourButtonBG.scale.y = 0.3;
        
        fourButton = game.add.button(50,365,"four",buttonFour,this);
        fourButton.scale.x = 0.3;
        fourButton.scale.y = 0.3;
        fourButton.inputEnabled = true;
        
        //Level Five
        fiveButtonBG = game.add.button(256,356,"background",buttonFive,this);
        fiveButtonBG.scale.x = 0.3;
        fiveButtonBG.scale.y = 0.3;
        
        fiveButton = game.add.button(265,365,"five",buttonFive,this);
        fiveButton.scale.x = 0.3;
        fiveButton.scale.y = 0.3;
        fiveButton.inputEnabled = true;
        
        //Level Six
        sixButtonBG = game.add.button(471,356,"background",buttonSix,this);
        sixButtonBG.scale.x = 0.3;
        sixButtonBG.scale.y = 0.3;
        
        sixButton = game.add.button(480,365,"six",buttonSix,this);
        sixButton.scale.x = 0.3;
        sixButton.scale.y = 0.3;
        sixButton.inputEnabled = true;
        
        
        //Level Seven
        sevenButtonBG = game.add.button(41,526,"background",buttonSeven,this);
        sevenButtonBG.scale.x = 0.3;
        sevenButtonBG.scale.y = 0.3;
        
        sevenButton = game.add.button(50,535,"seven",buttonSeven,this);
        sevenButton.scale.x = 0.3;
        sevenButton.scale.y = 0.3;
        sevenButton.inputEnabled = true;
        
//        //Level Eight
        eightButtonBG = game.add.button(256,526,"background",buttonEight,this);
        eightButtonBG.scale.x = 0.3;
        eightButtonBG.scale.y = 0.3;
        
        eightButton = game.add.button(265,535,"eight",buttonThree,this);
        eightButton.scale.x = 0.3;
        eightButton.scale.y = 0.3;
        eightButton.inputEnabled = true;
        
        
//        //Level Nine
        nineButtonBG = game.add.button(471,526,"background",buttonNine,this);
        nineButtonBG.scale.x = 0.3;
        nineButtonBG.scale.y = 0.3;
        
        threeButton = game.add.button(480,535,"nine",buttonNine,this);
        threeButton.scale.x = 0.3;
        threeButton.scale.y = 0.3;
        threeButton.inputEnabled = true;

    },
    update:function() {
        levelBackground.tilePosition.x -= 1;

    },
    render:function(){

    }
};


function test() {}

function startLevel(level) {
    if (level == 0) {
        start = 0;
        refadeComplete();
    }
}

function buttonOne() {
    game.state.start("PlayGame", true, false, currentLevel = 0);
}

function buttonTwo() {
    game.state.start("PlayGame", true, false, currentLevel = 1);
}

function buttonThree() {
    game.state.start("PlayGame", true, false, currentLevel = 2);
}

function buttonFour() {
    game.state.start("PlayGame", true, false, currentLevel = 3);
}

function buttonFive() {
    game.state.start("PlayGame", true, false, currentLevel = 4);
}

function buttonSix() {
    game.state.start("PlayGame", true, false, currentLevel = 5);
}

function buttonSeven() {
    game.state.start("PlayGame", true, false, currentLevel = 6);
}

function buttonEight() {
    game.state.start("PlayGame", true, false, currentLevel = 7);
}

function buttonNine() {
    game.state.start("PlayGame", true, false, currentLevel = 8);
}