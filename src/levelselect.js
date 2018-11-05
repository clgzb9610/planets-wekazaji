var levelSelect = function (game) {};


var levelBackground,
    levelBackground2;

//level button variables
var buttons;
var buttonBG;

var screen2;

var nextArrowL2;

var L2on;

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
        game.load.image("blackScreen", "assets/game/blackScreen.png");
        game.load.spritesheet("level_title", "assets/levelSelect/levelSelectSheet.png", 700, 90);
        game.load.image("nextArrow", "assets/levelSelect/nextArrow.png");
        game.load.audio('bgm', "assets/music/Visager_-_01_-_The_Great_Tree_Loop.mp3");
    },
    create:function () {
        //set up background and title banners
        game.world.setBounds(0, 0, 700, 700);

        screen2 = false;
        L2on = true;
        buttons = [];
        buttonBG = [];

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

        blackScreen = game.add.sprite(0, 0, "blackScreen");
        blackScreen.scale.setTo(2, 2);
        blackScreen.anchor.set(0.5, 0.5);
        game.add.tween(blackScreen).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
    },
    update:function() {
        levelBackground.tilePosition.x -= 1;
        if (screen2 === true) {levelBackground2.tilePosition.x -= 1;}
        
        enableButtonHovers();

    },
    render:function(){
        if (showDebugInfo) {
            game.debug.text(game.time.fps, 2, 14, "#00ff00");
        }
    }
};

function enableButtonHovers() {
    if (nextArrowR.input.pointerOver()) {nextArrowR.alpha=0.7;}
    else {nextArrowR.alpha=1;}

    if (nextArrowL.input.pointerOver()) {nextArrowL.alpha=0.7;}
    else {nextArrowL.alpha=1;}

    for (i = 0; i < 9; i++) {
        if (buttons[i].input.pointerOver()) {buttons[i].alpha=0.7}
        else {buttons[i].alpha = 1;}
    }

    if (screen2 === true) {
        for (i = 9; i < 14; i++) {
            if (buttons[i].input.pointerOver()) {buttons[i].alpha=0.7}
            else {buttons[i].alpha = 1};
        }
    }
}

function buttonOne() {
    game.state.start("PlayGame", true, true, level = 0);
}

function buttonTwo() {
    game.state.start("PlayGame", true, true, level = 1);
}

function buttonThree() {
    game.state.start("PlayGame", true, true, level = 2);
}

function buttonFour() {
    game.state.start("PlayGame", true, true, level = 3);
}

function buttonFive() {
    game.state.start("PlayGame", true, true, level = 4);
}

function buttonSix() {
    game.state.start("PlayGame", true, true, level = 5);
}

function buttonSeven() {
    game.state.start("PlayGame", true, true, level = 6);
}

function buttonEight() {
    game.state.start("PlayGame", true, true, level = 7);
}

function buttonNine() {
    game.state.start("PlayGame", true, true, level = 8);
}

function buttonTen() {
    game.state.start("PlayGame", true, true, level = 9);
}

function buttonEleven() {
    game.state.start("PlayGame", true, true, level = 10);
}

function buttonTwelve() {
    game.state.start("PlayGame", true, true, level = 11);
}

function buttonThirteen() {
    game.state.start("PlayGame", true, true, level = 12);
}

function buttonFourteen() {
    game.state.start("PlayGame", true, true, level = 13);
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
    for (i = 9; i < 14; i++) {
        buttonBG[i].destroy();
        buttons[i].destroy();
    }
    
    level_title2.destroy();
    nextArrowR2.destroy();
    
}

function enableMenu1Inputs() {
    buttons[0].inputEnabled = true;
    buttonBG[0].inputEnabled = true;
    for (i = 2; i < 10; i++) {
        if (localStorage.getItem("Level" + i.toString()) === "true") {
            buttons[i-1].inputEnabled = true;
            buttonBG[i-1].inputEnabled = true;
        }
    }
}

function enableMenu2Inputs() {
    for (i = 10; i < 14; i++) {
        if (localStorage.getItem("Level" + i.toString()) === "true") {
            buttons[i-1].inputEnabled = true;
            buttonBG[i-1].inputEnabled = true;
        }
    }
}


function disableMenu1Inputs() {
    for (i = 0; i < 9; i++) {
        buttons[i].inputEnabled = false;
        buttonBG[i].inputEnabled = false;
    }
}

function backtoMenu() {
    blackScreen = game.add.sprite(0, 0, "blackScreen");
    blackScreen.alpha = 0;
    blackScreen.scale.setTo(2, 2);
    blackScreen.anchor.set(0.5, 0.5);
    game.add.tween(blackScreen).to(
        {alpha: 1},
        200,
        Phaser.Easing.Linear.None,
        true
    ).onComplete.add(function () {
        game.state.start("MainMenu",1,1)
    });
}

function resetProgress() {
    localStorage.clear();
    backtoMenu();
}

function unlockAll() {
    for (i = 2; i < 15; i++) {
        localStorage.setItem("Level" + i.toString(), "true");
    }
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
    
//    var gridPosX = 0;
//    var gridPosY = 0;
//    for (i = 0; i <10; i++) {
//        buttonBG[0] = game.add.button(41 + gridPosX, 191 + gridPosY,"background", )
//    }

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

    //Level Three
    buttonBG[2] = game.add.button(471,191,"background",buttonThree,this);
    buttonBG[2].scale.x = 0.3;
    buttonBG[2].scale.y = 0.3;
    buttonBG[2].alpha = 0.88;

    buttons[2] = game.add.button(480,200,"three",buttonThree,this);
    buttons[2].scale.x = 0.3;
    buttons[2].scale.y = 0.3;

    //Level Four
    buttonBG[3] = game.add.button(41,356,"background",buttonFour,this);
    buttonBG[3].scale.x = 0.3;
    buttonBG[3].scale.y = 0.3;
    buttonBG[3].alpha = 0.88;

    buttons[3] = game.add.button(50,365,"four",buttonFour,this);
    buttons[3].scale.x = 0.3;
    buttons[3].scale.y = 0.3;

    //Level Five
    buttonBG[4] = game.add.button(256,356,"background",buttonFive,this);
    buttonBG[4].scale.x = 0.3;
    buttonBG[4].scale.y = 0.3;
    buttonBG[4].alpha = 0.88;

    buttons[4] = game.add.button(265,365,"five",buttonFive,this);
    buttons[4].scale.x = 0.3;
    buttons[4].scale.y = 0.3;

    //Level Six
    buttonBG[5] = game.add.button(471,356,"background",buttonSix,this);
    buttonBG[5].scale.x = 0.3;
    buttonBG[5].scale.y = 0.3;
    buttonBG[5].alpha = 0.88;

    buttons[5] = game.add.button(480,365,"six",buttonSix,this);
    buttons[5].scale.x = 0.3;
    buttons[5].scale.y = 0.3;


    //Level Seven
    buttonBG[6] = game.add.button(41,521,"background",buttonSeven,this);
    buttonBG[6].scale.x = 0.3;
    buttonBG[6].scale.y = 0.3;
    buttonBG[6].alpha = 0.88;

    buttons[6] = game.add.button(50,530,"seven",buttonSeven,this);
    buttons[6].scale.x = 0.3;
    buttons[6].scale.y = 0.3;

    //Level Eight
    buttonBG[7] = game.add.button(256,521,"background",buttonEight,this);
    buttonBG[7].scale.x = 0.3;
    buttonBG[7].scale.y = 0.3;
    buttonBG[7].alpha = 0.88;

    buttons[7] = game.add.button(265,530,"eight",buttonEight,this);
    buttons[7].scale.x = 0.3;
    buttons[7].scale.y = 0.3;


    //Level Nine
    buttonBG[8] = game.add.button(471,521,"background",buttonNine,this);
    buttonBG[8].scale.x = 0.3;
    buttonBG[8].scale.y = 0.3;
    buttonBG[8]

    buttons[8] = game.add.button(480,530,"nine",buttonNine,this);
    buttons[8].scale.x = 0.3;
    buttons[8].scale.y = 0.3;

//    //reset progress button
//    resetButton = game.add.button(205, 145, "reset_placeholder", resetProgress, this);
//    resetButton.scale.x = 0.3;
//    resetButton.scale.y = 0.3;
//    resetButton.inputEnabled = true;
//
//    //unlock all levels button
//    unlockButton = game.add.button(355, 145, "unlock_placeholder", unlockAll, this);
//    unlockButton.scale.x = 0.3;
//    unlockButton.scale.y = 0.3;
//    unlockButton.inputEnabled = true;
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

    //Level Twelve
    buttonBG[11] = game.add.button(471,191,"background",buttonTwelve,this);
    buttonBG[11].scale.x = 0.3;
    buttonBG[11].scale.y = 0.3;
    buttonBG[11].alpha = 0.88;

    buttons[11] = game.add.button(480,200,"twelve",buttonTwelve,this);
    buttons[11].scale.x = 0.3;
    buttons[11].scale.y = 0.3;

    //Level Thirteen
    buttonBG[12] = game.add.button(41,356,"background",buttonThirteen,this);
    buttonBG[12].scale.x = 0.3;
    buttonBG[12].scale.y = 0.3;
    buttonBG[12].alpha = 0.88;

    buttons[12] = game.add.button(50,365,"thirteen",buttonThirteen,this);
    buttons[12].scale.x = 0.3;
    buttons[12].scale.y = 0.3;

    //Level Fourteen
    buttonBG[13] = game.add.button(256,356,"background",buttonFourteen,this);
    buttonBG[13].scale.x = 0.3;
    buttonBG[13].scale.y = 0.3;
    buttonBG[13].alpha = 0.88;

    buttons[13] = game.add.button(265,365,"fourteen",buttonFourteen,this);
    buttons[13].scale.x = 0.3;
    buttons[13].scale.y = 0.3;
}


function checkLevelProgress() {
    for (i = 2; i < 15; i++) {
        if (localStorage.getItem(("Level" + i.toString())) != "true") {
            buttons[i-1].alpha = 0.1;
            buttonBG[i-1].alpha = 0.1;
            buttons[i-1].inputEnabled = false;
            buttonBG[i-1].inputEnabled = false;}
            }
    }

