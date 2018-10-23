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
var oneButtonBG;
var twoButtonBG;
var threeButtonBG;
var fourButtonBG;
var fiveButtonBG;
var sixButtonBG;
var sevenButtonBG;
var eightButtonBG;
var nineButtonBG;
var tenButtonBG;


var screen2;
screen2 = false;

var nextArrowL2;

var L2on;
L2on = true;

var level_title2;
var nextArrowL2;



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
        game.load.image("ten", "assets/levelSelect/10.png");
        game.load.image("eleven", "assets/levelSelect/11.png");
        game.load.image("twelve", "assets/levelSelect/12.png");
        game.load.image("thirteen", "assets/levelSelect/13.png");
        game.load.image("fourteen", "assets/levelSelect/14.png");
        game.load.image("reset_placeholder", "assets/levelSelect/resetplaceholder.png");
        game.load.image("unlock_placeholder", "assets/levelSelect/unlockplaceholder.png");
        game.load.image("background", "assets/levelSelect/background.png");
        game.load.spritesheet("level_title", "assets/levelSelect/levelSelectSheet.png", 700, 90);
        game.load.image("nextArrow", "assets/levelSelect/nextArrow.png");
        game.load.audio('bgm', "assets/music/Visager_-_01_-_The_Great_Tree_Loop.mp3");
        

    },
    create:function () {
        //set up background and title banners
        game.world.setBounds(0, 0, 700, 700);

        levelBackground = game.add.tileSprite(-320, -320, 1024, 1024, 'space');
        
        var level_title = game.add.sprite(75, 50, "level_title");
        level_title.scale.x = 0.8;
        level_title.scale.y = 0.8;
        level_title.animations.add('beaming_level',[0,1,2],5, true);
        level_title.animations.play('beaming_level');
        
        //add level buttons
        addPageOneButtons();
        
        //enable level buttons
        enableMenu1Inputs();

        //Level Unlock Logic
        checkLevelProgress();
    },
    update:function() {
        levelBackground.tilePosition.x -= 1;
        if (screen2 == true) {levelBackground2.tilePosition.x -= 1;}

        if (nextArrowR.input.pointerOver()) {nextArrowR.alpha=0.7;}
        else {nextArrowR.alpha=1;}

        if (nextArrowL.input.pointerOver()) {nextArrowL.alpha=0.7;}
        else {nextArrowL.alpha=1;}

        if (oneButton.input.pointerOver()) {oneButton.alpha=0.7;}
        else {oneButton.alpha=1;}
        
        if (twoButton.input.pointerOver()) {twoButton.alpha=0.7;}
        else {twoButton.alpha=1;}
        
        if (threeButton.input.pointerOver()) {threeButton.alpha=0.7;}
        else {threeButton.alpha=1;}
        
        if (fourButton.input.pointerOver()) {fourButton.alpha=0.7;}
        else {fourButton.alpha=1;}
        
        if (fiveButton.input.pointerOver()) {fiveButton.alpha=0.7;}
        else {fiveButton.alpha=1;}
        
        if (sixButton.input.pointerOver()) {sixButton.alpha=0.7;}
        else {sixButton.alpha=1;}
        
        if (sevenButton.input.pointerOver()) {sevenButton.alpha=0.7;}
        else {sevenButton.alpha=1;}
        
        if (eightButton.input.pointerOver()) {eightButton.alpha=0.7;}
        else {eightButton.alpha=1;}
        
        if (nineButton.input.pointerOver()) {nineButton.alpha=0.7;}
        else {nineButton.alpha=1;}
        
        if (screen2 == true) {
            if (tenButton.input.pointerOver()) {tenButton.alpha=0.7;}
            else {tenButton.alpha=1;}
            
            if (elevenButton.input.pointerOver()) {elevenButton.alpha=0.7;}
            else {elevenButton.alpha=1;}
            
            if (twelveButton.input.pointerOver()) {twelveButton.alpha=0.7;}
            else {twelveButton.alpha=1;}
            
            if (thirteenButton.input.pointerOver()) {thirteenButton.alpha=0.7;}
            else {thirteenButton.alpha=1;}
            
            if (fourteenButton.input.pointerOver()) {fourteenButton.alpha=0.7;}
            else {fourteenButton.alpha=1;}
        }
        


    },
    render:function(){
        if (showDebugInfo) {
            game.debug.text(game.time.fps, 2, 14, "#00ff00");
        }
    }
};

function buttonOne() {
    game.state.start("PlayGame", true, true, currentLevel = 0);
}

function buttonTwo() {
    game.state.start("PlayGame", true, true, currentLevel = 1);
}

function buttonThree() {
    game.state.start("PlayGame", true, true, currentLevel = 2);
}

function buttonFour() {
    game.state.start("PlayGame", true, true, currentLevel = 3);
}

function buttonFive() {
    game.state.start("PlayGame", true, true, currentLevel = 4);
}

function buttonSix() {
    game.state.start("PlayGame", true, true, currentLevel = 5);
}

function buttonSeven() {
    game.state.start("PlayGame", true, true, currentLevel = 6);
}

function buttonEight() {
    game.state.start("PlayGame", true, true, currentLevel = 7);
}

function buttonNine() {
    game.state.start("PlayGame", true, true, currentLevel = 8);
}

function buttonTen() {
    game.state.start("PlayGame", true, true, currentLevel = 9);
}

function buttonEleven() {
    game.state.start("PlayGame", true, true, currentLevel = 10);
}

function buttonTwelve() {
    game.state.start("PlayGame", true, true, currentLevel = 11);
}

function buttonThirteen() {
    game.state.start("PlayGame", true, true, currentLevel = 12);
}

function buttonFourteen() {
    game.state.start("PlayGame", true, true, currentLevel = 13);
}



function openNextPage(){
    disableMenu1Inputs();
    levelBackground2 = game.add.tileSprite(-320, -320, 1024, 1024, 'space');
    screen2 = true;

    addPageTwoButtons();
    enableMenu2Inputs();
    checkLevelProgress();
    
}

function closeNextPage(){
    levelBackground2.destroy();
    screen2 = false;
        
    nextArrowR = game.add.button(630, 60, "nextArrow", openNextPage, this);
    nextArrowR.scale.x = 0.1;
    nextArrowR.scale.y = 0.1;
    
    nextArrowL = game.add.button(70, 60, "nextArrow",backtoMenu, this);
    nextArrowL.scale.x = -0.1;
    nextArrowL.scale.y = 0.1;
    
    enableMenu1Inputs();
    
}


function destroyScreen2() {
    tenButtonBG.destroy();
    tenButton.destroy();
    
    elevenButtonBG.destroy();
    elevenButton.destroy();
    
    twelveButtonBG.destroy();
    twelveButton.destroy();
    
    thirteenButtonBG.destroy();
    thirteenButton.destroy();
    
    fourteenButtonBG.destroy();
    fourteenButton.destroy();
    
    level_title2.destroy();
    nextArrowR2.destroy();
    
}

function enableMenu1Inputs() {
    oneButton.inputEnabled = true;
    oneButtonBG.inputEnabled = true;
    if (localStorage.getItem("Level2") == "true") {
        twoButton.inputEnabled = true;
        twoButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level3") == "true") {
        threeButton.inputEnabled = true;
        threeButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level4") == "true") {
        fourButton.inputEnabled = true;
        fourButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level5") == "true") {
        fiveButton.inputEnabled = true;
        fiveButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level6") == "true") {
        sixButton.inputEnabled = true;
        sixButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level7") == "true") {
        sevenButton.inputEnabled = true;
        sevenButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level8") == "true") {
        eightButton.inputEnabled = true;
        eightButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level9") == "true") {
        nineButton.inputEnabled = true;
        nineButtonBG.inputEnabled = true;
    }
}

function enableMenu2Inputs() {
    if (localStorage.getItem("Level10") == "true") {
        tenButton.inputEnabled = true;
        tenButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level11") == "true") {
        elevenButton.inputEnabled = true;
        elevenButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level12") == "true") {
        twelveButton.inputEnabled = true;
        twelveButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level13") == "true") {
        thirteenButton.inputEnabled = true;
        thirteenButtonBG.inputEnabled = true;
    }
    if (localStorage.getItem("Level14") == "true") {
        fourteenButton.inputEnabled = true;
        fourteenButtonBG.inputEnabled = true;
    }
}

function disableMenu1Inputs() {
    oneButton.inputEnabled = false;
    twoButton.inputEnabled = false;
    threeButton.inputEnabled = false;
    fourButton.inputEnabled = false;
    fiveButton.inputEnabled = false;
    sixButton.inputEnabled = false;
    sevenButton.inputEnabled = false;
    eightButton.inputEnabled = false;
    nineButton.inputEnabled = false;
    
    oneButtonBG.inputEnabled = false;
    twoButtonBG.inputEnabled = false;
    threeButtonBG.inputEnabled = false;
    fourButtonBG.inputEnabled = false;
    fiveButtonBG.inputEnabled = false;
    sixButtonBG.inputEnabled = false;
    sevenButtonBG.inputEnabled = false;
    eightButtonBG.inputEnabled = false;
    nineButtonBG.inputEnabled = false;
}

function backtoMenu() {
    game.state.start("MainMenu",1,1);
}

function resetProgress() {
    localStorage.clear();
    backtoMenu();
}

function unlockAll() {
    var unlock2 = localStorage.setItem("Level2","true");
    var unlock3 = localStorage.setItem("Level3","true");
    var unlock4 = localStorage.setItem("Level4","true");
    var unlock5 = localStorage.setItem("Level5","true");
    var unlock6 = localStorage.setItem("Level6","true");
    var unlock7 = localStorage.setItem("Level7","true");
    var unlock8 = localStorage.setItem("Level8","true");
    var unlock9 = localStorage.setItem("Level9","true");
    var unlock10 = localStorage.setItem("Level10","true");
    var unlock11 = localStorage.setItem("Level11","true");
    var unlock12 = localStorage.setItem("Level12","true");
    var unlock13 = localStorage.setItem("Level13","true");
    var unlock14 = localStorage.setItem("Level14","true");
    backtoMenu();
}

function addPageOneButtons() {
    //Next Screen Arrow Right
    nextArrowR = game.add.button(630, 60, "nextArrow", openNextPage, this);
    nextArrowR.scale.x = 0.1;
    nextArrowR.scale.y = 0.1;

    //Next Screen Arrow Left
    nextArrowL = game.add.button(70, 60, "nextArrow",backtoMenu, this);
    nextArrowL.scale.x = -0.1;
    nextArrowL.scale.y = 0.1;

    //Level One
    oneButtonBG = game.add.button(41,191,"background",buttonOne,this);
    oneButtonBG.scale.x = 0.3;
    oneButtonBG.scale.y = 0.3;
    oneButtonBG.alpha = 0.8;

    oneButton = game.add.button(50,200,"one",buttonOne,this);
    oneButton.scale.x = 0.3;
    oneButton.scale.y = 0.3;

    //Level Two
    twoButtonBG = game.add.button(256,191,"background",buttonTwo,this);
    twoButtonBG.scale.x = 0.3;
    twoButtonBG.scale.y = 0.3;
    twoButtonBG.alpha = 0.88;

    twoButton = game.add.button(265,200,"two",buttonTwo,this);
    twoButton.scale.x = 0.3;
    twoButton.scale.y = 0.3;
    twoButton.inputEnabled = true;

    //Level Three
    threeButtonBG = game.add.button(471,191,"background",buttonThree,this);
    threeButtonBG.scale.x = 0.3;
    threeButtonBG.scale.y = 0.3;
    threeButtonBG.alpha = 0.88;

    threeButton = game.add.button(480,200,"three",buttonThree,this);
    threeButton.scale.x = 0.3;
    threeButton.scale.y = 0.3;
    threeButton.inputEnabled = true;

    //Level Four
    fourButtonBG = game.add.button(41,356,"background",buttonFour,this);
    fourButtonBG.scale.x = 0.3;
    fourButtonBG.scale.y = 0.3;
    fourButtonBG.alpha = 0.88;

    fourButton = game.add.button(50,365,"four",buttonFour,this);
    fourButton.scale.x = 0.3;
    fourButton.scale.y = 0.3;
    fourButton.inputEnabled = true;

    //Level Five
    fiveButtonBG = game.add.button(256,356,"background",buttonFive,this);
    fiveButtonBG.scale.x = 0.3;
    fiveButtonBG.scale.y = 0.3;
    fiveButtonBG.alpha = 0.88;

    fiveButton = game.add.button(265,365,"five",buttonFive,this);
    fiveButton.scale.x = 0.3;
    fiveButton.scale.y = 0.3;
    fiveButton.inputEnabled = true;

    //Level Six
    sixButtonBG = game.add.button(471,356,"background",buttonSix,this);
    sixButtonBG.scale.x = 0.3;
    sixButtonBG.scale.y = 0.3;
    sixButtonBG.alpha = 0.88;

    sixButton = game.add.button(480,365,"six",buttonSix,this);
    sixButton.scale.x = 0.3;
    sixButton.scale.y = 0.3;
    sixButton.inputEnabled = true;


    //Level Seven
    sevenButtonBG = game.add.button(41,521,"background",buttonSeven,this);
    sevenButtonBG.scale.x = 0.3;
    sevenButtonBG.scale.y = 0.3;
    sevenButtonBG.alpha = 0.88;

    sevenButton = game.add.button(50,530,"seven",buttonSeven,this);
    sevenButton.scale.x = 0.3;
    sevenButton.scale.y = 0.3;
    sevenButton.inputEnabled = true;

    //Level Eight
    eightButtonBG = game.add.button(256,521,"background",buttonEight,this);
    eightButtonBG.scale.x = 0.3;
    eightButtonBG.scale.y = 0.3;
    eightButtonBG.alpha = 0.88;

    eightButton = game.add.button(265,530,"eight",buttonEight,this);
    eightButton.scale.x = 0.3;
    eightButton.scale.y = 0.3;
    eightButton.inputEnabled = true;


    //Level Nine
    nineButtonBG = game.add.button(471,521,"background",buttonNine,this);
    nineButtonBG.scale.x = 0.3;
    nineButtonBG.scale.y = 0.3;
    nineButtonBG

    nineButton = game.add.button(480,530,"nine",buttonNine,this);
    nineButton.scale.x = 0.3;
    nineButton.scale.y = 0.3;
    nineButton.inputEnabled = true;

    //reset progress button
    resetButton = game.add.button(205, 145, "reset_placeholder", resetProgress, this);
    resetButton.scale.x = 0.3;
    resetButton.scale.y = 0.3;
    resetButton.inputEnabled = true;

    //unlock all levels button
    unlockButton = game.add.button(355, 145, "unlock_placeholder", unlockAll, this);
    unlockButton.scale.x = 0.3;
    unlockButton.scale.y = 0.3;
    unlockButton.inputEnabled = true;
}

function addPageTwoButtons() {
    //top buttons
    var level_title2 = game.add.sprite(75, 50, "level_title");
    level_title2.scale.x = 0.8;
    level_title2.scale.y = 0.8;
    level_title2.animations.add('beaming_level',[0,1,2],5, true);
    level_title2.animations.play('beaming_level');
    
    nextArrowL2 = game.add.button(70, 60, "nextArrow", closeNextPage, this);
    nextArrowL2.scale.x = -0.1;
    nextArrowL2.scale.y = 0.1;
    
    nextArrowL2.events.onInputDown.add(destroyScreen2,this);
    
    nextArrowR.destroy();
    nextArrowR2 = game.add.sprite(630, 60, "nextArrow", this);
    nextArrowR2.scale.x = 0.1;
    nextArrowR2.scale.y = 0.1;
    nextArrowR2.alpha = 0.5;

    //Level ten
    tenButtonBG = game.add.button(41,191,"background",buttonTen,this);
    tenButtonBG.scale.x = 0.3;
    tenButtonBG.scale.y = 0.3;
    tenButtonBG.alpha = 0.8;

    tenButton = game.add.button(50,200,"ten",buttonTen,this);
    tenButton.scale.x = 0.3;
    tenButton.scale.y = 0.3;
    
    
        

    //Level Eleven
    elevenButtonBG = game.add.button(256,191,"background",buttonEleven,this);
    elevenButtonBG.scale.x = 0.3;
    elevenButtonBG.scale.y = 0.3;
    elevenButtonBG.alpha = 0.88;

    elevenButton = game.add.button(265,200,"eleven",buttonEleven,this);
    elevenButton.scale.x = 0.3;
    elevenButton.scale.y = 0.3;
    elevenButton.inputEnabled = true;

    //Level Twelve
    twelveButtonBG = game.add.button(471,191,"background",buttonTwelve,this);
    twelveButtonBG.scale.x = 0.3;
    twelveButtonBG.scale.y = 0.3;
    twelveButtonBG.alpha = 0.88;

    twelveButton = game.add.button(480,200,"twelve",buttonTwelve,this);
    twelveButton.scale.x = 0.3;
    twelveButton.scale.y = 0.3;
    twelveButton.inputEnabled = true;

    //Level Thirteen
    thirteenButtonBG = game.add.button(41,356,"background",buttonThirteen,this);
    thirteenButtonBG.scale.x = 0.3;
    thirteenButtonBG.scale.y = 0.3;
    thirteenButtonBG.alpha = 0.88;

    thirteenButton = game.add.button(50,365,"thirteen",buttonThirteen,this);
    thirteenButton.scale.x = 0.3;
    thirteenButton.scale.y = 0.3;
    thirteenButton.inputEnabled = true;

    //Level Fourteen
    fourteenButtonBG = game.add.button(256,356,"background",buttonFourteen,this);
    fourteenButtonBG.scale.x = 0.3;
    fourteenButtonBG.scale.y = 0.3;
    fourteenButtonBG.alpha = 0.88;

    fourteenButton = game.add.button(265,365,"fourteen",buttonFourteen,this);
    fourteenButton.scale.x = 0.3;
    fourteenButton.scale.y = 0.3;
    fourteenButton.inputEnabled = true;
}


function checkLevelProgress() {
    if (localStorage.getItem("Level2") != "true") {
            twoButton.alpha = 0.1;
            twoButtonBG.alpha = 0.1;
            twoButton.inputEnabled = false;
            twoButtonBG.inputEnabled = false;
        }
    if (localStorage.getItem("Level3") != "true") {
        threeButton.alpha = 0.1;
        threeButtonBG.alpha = 0.1;
        threeButton.inputEnabled = false;
        threeButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level4") != "true") {
        fourButton.alpha = 0.1;
        fourButtonBG.alpha = 0.1;
        fourButton.inputEnabled = false;
        fourButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level5") != "true") {
        fiveButton.alpha = 0.1;
        fiveButtonBG.alpha = 0.1;
        fiveButton.inputEnabled = false;
        fiveButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level6") != "true") {
        sixButton.alpha = 0.1;
        sixButtonBG.alpha = 0.1;
        sixButton.inputEnabled = false;
        sixButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level7") != "true") {
        sevenButton.alpha = 0.1;
        sevenButtonBG.alpha = 0.1;
        sevenButton.inputEnabled = false;
        sevenButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level8") != "true") {
        eightButton.alpha = 0.1;
        eightButtonBG.alpha = 0.1;
        eightButton.inputEnabled = false;
        eightButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level9") != "true") {
        nineButton.alpha = 0.1;
        nineButtonBG.alpha = 0.1;
        nineButton.inputEnabled = false;
        nineButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level10") != "true") {
        tenButtonBG.alpha = 0.1;
        tenButton.inputEnabled = false;
        tenButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level11") != "true") {
        elevenButtonBG.alpha = 0.1;
        elevenButton.inputEnabled = false;
        elevenButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level12") != "true") {
        twelveButtonBG.alpha = 0.1;
        twelveButton.inputEnabled = false;
        twelveButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level13") != "true") {
        thirteenButtonBG.alpha = 0.1;
        thirteenButton.inputEnabled = false;
        thirteenButtonBG.inputEnabled = false;
    }
    if (localStorage.getItem("Level14") != "true") {
        fourteenButtonBG.alpha = 0.1;
        fourteenButton.inputEnabled = false;
        fourteenButtonBG.inputEnabled = false;
    }
}