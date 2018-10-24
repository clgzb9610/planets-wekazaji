var levelSelect = function (game) {};


var levelBackground;

//level button variables
var buttons = [];
var buttonBG = [];

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

        if (buttons[0].input.pointerOver()) {buttons[0].alpha=0.7;}
        else {buttons[0].alpha=1;}
        
        if (buttons[1].input.pointerOver()) {buttons[1].alpha=0.7;}
        else {buttons[1].alpha=1;}
        
        if (buttons[2].input.pointerOver()) {buttons[2].alpha=0.7;}
        else {buttons[2].alpha=1;}
        
        if (buttons[3].input.pointerOver()) {buttons[3].alpha=0.7;}
        else {buttons[3].alpha=1;}
        
        if (buttons[4].input.pointerOver()) {buttons[4].alpha=0.7;}
        else {buttons[4].alpha=1;}
        
        if (buttons[5].input.pointerOver()) {buttons[5].alpha=0.7;}
        else {buttons[5].alpha=1;}
        
        if (buttons[6].input.pointerOver()) {buttons[6].alpha=0.7;}
        else {buttons[6].alpha=1;}
        
        if (buttons[7].input.pointerOver()) {buttons[7].alpha=0.7;}
        else {buttons[7].alpha=1;}
        
        if (buttons[8].input.pointerOver()) {buttons[8].alpha=0.7;}
        else {buttons[8].alpha=1;}
        
        if (screen2 == true) {
            if (buttons[9].input.pointerOver()) {buttons[9].alpha=0.7;}
            else {buttons[9].alpha=1;}
            
            if (buttons[10].input.pointerOver()) {buttons[10].alpha=0.7;}
            else {buttons[10].alpha=1;}
            
            if (buttons[11].input.pointerOver()) {buttons[11].alpha=0.7;}
            else {buttons[11].alpha=1;}
            
            if (buttons[12].input.pointerOver()) {buttons[12].alpha=0.7;}
            else {buttons[12].alpha=1;}
            
            if (buttons[13].input.pointerOver()) {buttons[13].alpha=0.7;}
            else {buttons[13].alpha=1;}
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
    buttonBG[9].destroy();
    buttons[9].destroy();
    
    buttonBG[10].destroy();
    buttons[10].destroy();
    
    buttonBG[11].destroy();
    buttons[11].destroy();
    
    buttonBG[12].destroy();
    buttons[12].destroy();
    
    buttonBG[13].destroy();
    buttons[13].destroy();
    
    level_title2.destroy();
    nextArrowR2.destroy();
    
}

//function enableMenu1Inputs() {
//    buttons[0].inputEnabled = true;
//    oneButtonBG.inputEnabled = true;
//    for (i = 2; i < 10; i++) {
//        if (localStorage.getItem("Level" + i.toString()) == "true") {
//            buttons[i-1].inputEnabled = true;
//            
//        }
//    }
//}

function enableMenu1Inputs() {
    buttons[0].inputEnabled = true;
    buttonBG[0].inputEnabled = true;
    if (localStorage.getItem("Level2") == "true") {
        buttons[1].inputEnabled = true;
        buttonBG[1].inputEnabled = true;
    }
    if (localStorage.getItem("Level3") == "true") {
        buttons[2].inputEnabled = true;
        buttonBG[2].inputEnabled = true;
    }
    if (localStorage.getItem("Level4") == "true") {
        buttons[3].inputEnabled = true;
        buttonBG[3].inputEnabled = true;
    }
    if (localStorage.getItem("Level5") == "true") {
        buttons[4].inputEnabled = true;
        buttonBG[4].inputEnabled = true;
    }
    if (localStorage.getItem("Level6") == "true") {
        buttons[5].inputEnabled = true;
        buttonBG[5].inputEnabled = true;
    }
    if (localStorage.getItem("Level7") == "true") {
        buttons[6].inputEnabled = true;
        buttonBG[6].inputEnabled = true;
    }
    if (localStorage.getItem("Level8") == "true") {
        buttons[7].inputEnabled = true;
        buttonBG[7].inputEnabled = true;
    }
    if (localStorage.getItem("Level9") == "true") {
        buttons[8].inputEnabled = true;
        buttonBG[8].inputEnabled = true;
    }
}

function enableMenu2Inputs() {
    if (localStorage.getItem("Level10") == "true") {
        buttons[9].inputEnabled = true;
        buttonBG[9].inputEnabled = true;
    }
    if (localStorage.getItem("Level11") == "true") {
        buttons[10].inputEnabled = true;
        buttonBG[10].inputEnabled = true;
    }
    if (localStorage.getItem("Level12") == "true") {
        buttons[11].inputEnabled = true;
        buttonBG[11].inputEnabled = true;
    }
    if (localStorage.getItem("Level13") == "true") {
        buttons[12].inputEnabled = true;
        buttonBG[12].inputEnabled = true;
    }
    if (localStorage.getItem("Level14") == "true") {
        buttons[13].inputEnabled = true;
        buttonBG[13].inputEnabled = true;
    }
}

function disableMenu1Inputs() {
    buttons[0].inputEnabled = false;
    buttons[1].inputEnabled = false;
    buttons[2].inputEnabled = false;
    buttons[3].inputEnabled = false;
    buttons[4].inputEnabled = false;
    buttons[5].inputEnabled = false;
    buttons[6].inputEnabled = false;
    buttons[7].inputEnabled = false;
    buttons[8].inputEnabled = false;
    
    buttonBG[0].inputEnabled = false;
    buttonBG[1].inputEnabled = false;
    buttonBG[2].inputEnabled = false;
    buttonBG[3].inputEnabled = false;
    buttonBG[4].inputEnabled = false;
    buttonBG[5].inputEnabled = false;
    buttonBG[6].inputEnabled = false;
    buttonBG[7].inputEnabled = false;
    buttonBG[8].inputEnabled = false;
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
    buttonBG[0] = game.add.button(41,191,"background",buttonOne,this);
    buttonBG[0].scale.x = 0.3;
    buttonBG[0].scale.y = 0.3;
    buttonBG[0].alpha = 0.8;

    buttons[0] = game.add.button(50,200,"one",buttonOne,this);
    buttons[0].scale.x = 0.3;
    buttons[0].scale.y = 0.3;

    //Level Two
    buttonBG[1] = game.add.button(256,191,"background",buttonTwo,this);
    buttonBG[1].scale.x = 0.3;
    buttonBG[1].scale.y = 0.3;
    buttonBG[1].alpha = 0.88;

    buttons[1] = game.add.button(265,200,"two",buttonTwo,this);
    buttons[1].scale.x = 0.3;
    buttons[1].scale.y = 0.3;
    buttons[1].inputEnabled = true;

    //Level Three
    buttonBG[2] = game.add.button(471,191,"background",buttonThree,this);
    buttonBG[2].scale.x = 0.3;
    buttonBG[2].scale.y = 0.3;
    buttonBG[2].alpha = 0.88;

    buttons[2] = game.add.button(480,200,"three",buttonThree,this);
    buttons[2].scale.x = 0.3;
    buttons[2].scale.y = 0.3;
    buttons[2].inputEnabled = true;

    //Level Four
    buttonBG[3] = game.add.button(41,356,"background",buttonFour,this);
    buttonBG[3].scale.x = 0.3;
    buttonBG[3].scale.y = 0.3;
    buttonBG[3].alpha = 0.88;

    buttons[3] = game.add.button(50,365,"four",buttonFour,this);
    buttons[3].scale.x = 0.3;
    buttons[3].scale.y = 0.3;
    buttons[3].inputEnabled = true;

    //Level Five
    buttonBG[4] = game.add.button(256,356,"background",buttonFive,this);
    buttonBG[4].scale.x = 0.3;
    buttonBG[4].scale.y = 0.3;
    buttonBG[4].alpha = 0.88;

    buttons[4] = game.add.button(265,365,"five",buttonFive,this);
    buttons[4].scale.x = 0.3;
    buttons[4].scale.y = 0.3;
    buttons[4].inputEnabled = true;

    //Level Six
    buttonBG[5] = game.add.button(471,356,"background",buttonSix,this);
    buttonBG[5].scale.x = 0.3;
    buttonBG[5].scale.y = 0.3;
    buttonBG[5].alpha = 0.88;

    buttons[5] = game.add.button(480,365,"six",buttonSix,this);
    buttons[5].scale.x = 0.3;
    buttons[5].scale.y = 0.3;
    buttons[5].inputEnabled = true;


    //Level Seven
    buttonBG[6] = game.add.button(41,521,"background",buttonSeven,this);
    buttonBG[6].scale.x = 0.3;
    buttonBG[6].scale.y = 0.3;
    buttonBG[6].alpha = 0.88;

    buttons[6] = game.add.button(50,530,"seven",buttonSeven,this);
    buttons[6].scale.x = 0.3;
    buttons[6].scale.y = 0.3;
    buttons[6].inputEnabled = true;

    //Level Eight
    buttonBG[7] = game.add.button(256,521,"background",buttonEight,this);
    buttonBG[7].scale.x = 0.3;
    buttonBG[7].scale.y = 0.3;
    buttonBG[7].alpha = 0.88;

    buttons[7] = game.add.button(265,530,"eight",buttonEight,this);
    buttons[7].scale.x = 0.3;
    buttons[7].scale.y = 0.3;
    buttons[7].inputEnabled = true;


    //Level Nine
    buttonBG[8] = game.add.button(471,521,"background",buttonNine,this);
    buttonBG[8].scale.x = 0.3;
    buttonBG[8].scale.y = 0.3;
    buttonBG[8]

    buttons[8] = game.add.button(480,530,"nine",buttonNine,this);
    buttons[8].scale.x = 0.3;
    buttons[8].scale.y = 0.3;
    buttons[8].inputEnabled = true;

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
    buttonBG[9] = game.add.button(41,191,"background",buttonTen,this);
    buttonBG[9].scale.x = 0.3;
    buttonBG[9].scale.y = 0.3;
    buttonBG[9].alpha = 0.8;

    buttons[9] = game.add.button(50,200,"ten",buttonTen,this);
    buttons[9].scale.x = 0.3;
    buttons[9].scale.y = 0.3;
        
    //Level Eleven
    buttonBG[10] = game.add.button(256,191,"background",buttonEleven,this);
    buttonBG[10].scale.x = 0.3;
    buttonBG[10].scale.y = 0.3;
    buttonBG[10].alpha = 0.88;

    buttons[10] = game.add.button(265,200,"eleven",buttonEleven,this);
    buttons[10].scale.x = 0.3;
    buttons[10].scale.y = 0.3;
    buttons[10].inputEnabled = true;

    //Level Twelve
    buttonBG[11] = game.add.button(471,191,"background",buttonTwelve,this);
    buttonBG[11].scale.x = 0.3;
    buttonBG[11].scale.y = 0.3;
    buttonBG[11].alpha = 0.88;

    buttons[11] = game.add.button(480,200,"twelve",buttonTwelve,this);
    buttons[11].scale.x = 0.3;
    buttons[11].scale.y = 0.3;
    buttons[11].inputEnabled = true;

    //Level Thirteen
    buttonBG[12] = game.add.button(41,356,"background",buttonThirteen,this);
    buttonBG[12].scale.x = 0.3;
    buttonBG[12].scale.y = 0.3;
    buttonBG[12].alpha = 0.88;

    buttons[12] = game.add.button(50,365,"thirteen",buttonThirteen,this);
    buttons[12].scale.x = 0.3;
    buttons[12].scale.y = 0.3;
    buttons[12].inputEnabled = true;

    //Level Fourteen
    buttonBG[13] = game.add.button(256,356,"background",buttonFourteen,this);
    buttonBG[13].scale.x = 0.3;
    buttonBG[13].scale.y = 0.3;
    buttonBG[13].alpha = 0.88;

    buttons[13] = game.add.button(265,365,"fourteen",buttonFourteen,this);
    buttons[13].scale.x = 0.3;
    buttons[13].scale.y = 0.3;
    buttons[13].inputEnabled = true;
}


function checkLevelProgress() {
    if (localStorage.getItem("Level2") != "true") {
            buttons[1].alpha = 0.1;
            buttonBG[1].alpha = 0.1;
            buttons[1].inputEnabled = false;
            buttonBG[1].inputEnabled = false;
        }
    if (localStorage.getItem("Level3") != "true") {
        buttons[2].alpha = 0.1;
        buttonBG[2].alpha = 0.1;
        buttons[2].inputEnabled = false;
        buttonBG[2].inputEnabled = false;
    }
    if (localStorage.getItem("Level4") != "true") {
        buttons[3].alpha = 0.1;
        buttonBG[3].alpha = 0.1;
        buttons[3].inputEnabled = false;
        buttonBG[3].inputEnabled = false;
    }
    if (localStorage.getItem("Level5") != "true") {
        buttons[4].alpha = 0.1;
        buttonBG[4].alpha = 0.1;
        buttons[4].inputEnabled = false;
        buttonBG[4].inputEnabled = false;
    }
    if (localStorage.getItem("Level6") != "true") {
        buttons[5].alpha = 0.1;
        buttonBG[5].alpha = 0.1;
        buttons[5].inputEnabled = false;
        buttonBG[5].inputEnabled = false;
    }
    if (localStorage.getItem("Level7") != "true") {
        buttons[6].alpha = 0.1;
        buttonBG[6].alpha = 0.1;
        buttons[6].inputEnabled = false;
        buttonBG[6].inputEnabled = false;
    }
    if (localStorage.getItem("Level8") != "true") {
        buttons[7].alpha = 0.1;
        buttonBG[7].alpha = 0.1;
        buttons[7].inputEnabled = false;
        buttonBG[7].inputEnabled = false;
    }
    if (localStorage.getItem("Level9") != "true") {
        buttons[8].alpha = 0.1;
        buttonBG[8].alpha = 0.1;
        buttons[8].inputEnabled = false;
        buttonBG[8].inputEnabled = false;
    }
    if (localStorage.getItem("Level10") != "true") {
        buttonBG[9].alpha = 0.1;
        buttons[9].inputEnabled = false;
        buttonBG[9].inputEnabled = false;
    }
    if (localStorage.getItem("Level11") != "true") {
        buttonBG[10].alpha = 0.1;
        buttons[10].inputEnabled = false;
        buttonBG[10].inputEnabled = false;
    }
    if (localStorage.getItem("Level12") != "true") {
        buttonBG[11].alpha = 0.1;
        buttons[11].inputEnabled = false;
        buttonBG[11].inputEnabled = false;
    }
    if (localStorage.getItem("Level13") != "true") {
        buttonBG[12].alpha = 0.1;
        buttons[12].inputEnabled = false;
        buttonBG[12].inputEnabled = false;
    }
    if (localStorage.getItem("Level14") != "true") {
        buttonBG[13].alpha = 0.1;
        buttons[13].inputEnabled = false;
        buttonBG[13].inputEnabled = false;
    }
}