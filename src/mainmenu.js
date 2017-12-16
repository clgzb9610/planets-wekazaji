var mainMenu = function (game) {};

var text;
var menuBack;
var menuBGM;
var wekazajiPOP;

var playButton;
var wekazaji;
var credits;

mainMenu.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.image("title", "assets/mainMenu/mainMenuLogo.png");
        game.load.image("play", "assets/mainMenu/play.png");
        game.load.image("play_hover", "assets/mainMenu/play_hover.png");
        game.load.image("wekazaji", "assets/mainMenu/wekazaji.png");
        game.load.image("wekazaji_hover", "assets/mainMenu/wekazaji_hover.png");
        game.load.image("credits", "assets/mainMenu/credits.png");
        game.load.image("credits_hover", "assets/mainMenu/credits_hover.png");
        game.load.image("wekazaji_page", "assets/mainMenu/wakazajiPage.png");
        game.load.image("close", "assets/mainMenu/x.png");

        game.load.audio('menuBGM', "assets/mainMenu/Visager_-_14_-_Home_Departure_Loop.mp3");
        // from http://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/Home_Departure_Loop
    },
    create:function () {
        console.log("creating main menu");
        game.world.setBounds(0, 0, 700, 700);

        menuBack = game.add.tileSprite(-320, -320, 1024, 1024, 'space');

        menuBGM = game.add.audio('menuBGM');
        menuBGM.loop = true;
        menuBGM.volume = 0.6;
        menuBGM.play();

        var title = game.add.sprite(120, 50, "title");
        title.scale.x = 0.7;
        title.scale.y = 0.7;

        playButton = game.add.button(200,330,"play",playTheGame,this);
        playButton.scale.x = 0.4;
        playButton.scale.y = 0.4;
        playButton.inputEnabled = true;

        wekazaji = game.add.button(200,430,"wekazaji",openWekazaj, this);
        wekazaji.scale.x = 0.4;
        wekazaji.scale.y = 0.4;
        wekazaji.inputEnabled = true;

        credits = game.add.button(200,530,"credits",null, this);
        credits.scale.x = 0.4;
        credits.scale.y = 0.4;
        credits.inputEnabled = true;

    },
    update:function() {
        menuBack.tilePosition.x -= 1;

        if (playButton.input.pointerOver()) {playButton.loadTexture('play_hover', 0);}
        else {playButton.loadTexture('play', 0);}

        if (wekazaji.input.pointerOver()) {wekazaji.loadTexture('wekazaji_hover', 0);}
        else {wekazaji.loadTexture('wekazaji', 0);}

        if (credits.input.pointerOver()) {credits.loadTexture('credits_hover', 0);}
        else {credits.loadTexture('credits', 0);}
    },
    render:function(){

    }
};

function playTheGame(){
    game.camera.fade('#000000',500);
    console.log("playgame has been clicked");
    // game.camera.onFadeComplete.add(fadeComplete,this);
    game.time.events.add(500, fadeComplete, this);
}


function fadeComplete(){
    menuBGM.pause();
    console.log("fadeComplete from main");
    game.state.start("PlayGame", true, false, 0);
}

function openWekazaj(){
    wekazajiPOP = game.add.sprite(game.world.centerX, game.world.centerY, 'wekazaji_page');
    wekazajiPOP.anchor.set(0.5, 0.5);
    wekazajiPOP.inputEnabled = true;

    var closeButton = game.make.sprite(280, -330, 'close');
    closeButton.scale.set(0.3);
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;
    closeButton.events.onInputDown.add(closeWekazaji, this);

    wekazajiPOP.addChild(closeButton);
}

function closeWekazaji(){
    wekazajiPOP.destroy();
}