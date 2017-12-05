var mainMenu = function (game) {};

var text;
var menuBack;
var menuBGM;
var wakazajiPOP;

var playButton;
var wakazaji;
var credits;

mainMenu.prototype = {
    preload:function(){
        game.load.image("space", "assets/seamlessspacebright.png");
        game.load.image("title", "assets/mainMenuLogo.png");
        game.load.image("play", "assets/play.png");
        game.load.image("play_hover", "assets/play_hover.png");
        game.load.image("wakazaji", "assets/wekazaji.png");
        game.load.image("wakazaji_hover", "assets/wekazaji_hover.png");
        game.load.image("credits", "assets/credits.png");
        game.load.image("credits_hover", "assets/credits_hover.png");
        game.load.image("wakazaji_page", "assets/wekazajiPage.png");
        game.load.image("close", "assets/x.png");

        game.load.audio('menuBGM', "assets/Visager_-_14_-_Home_Departure_Loop.mp3");
        // from http://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/Home_Departure_Loop
    },
    create:function () {
        menuBack = game.add.tileSprite(0, 0, 1024, 1024, 'space');

        menuBGM = game.add.audio('menuBGM');
        menuBGM.loop = true;
        menuBGM.volume = 0.6;
        menuBGM.play();

        var title = game.add.sprite(170, 70, "title");
        title.scale.x = 0.7;
        title.scale.y = 0.7;

        playButton = game.add.button(250,350,"play",playTheGame,this);
        playButton.scale.x = 0.4;
        playButton.scale.y = 0.4;
        playButton.inputEnabled = true;

        wakazaji = game.add.button(250,450,"wakazaji",openWekazaj, this);
        wakazaji.scale.x = 0.4;
        wakazaji.scale.y = 0.4;
        wakazaji.inputEnabled = true;

        credits = game.add.button(250,550,"credits",null, this);
        credits.scale.x = 0.4;
        credits.scale.y = 0.4;
        credits.inputEnabled = true;

    },
    update:function() {
        menuBack.tilePosition.x -= 1;

        if (playButton.input.pointerOver()) {playButton.loadTexture('play_hover', 0);}
        else {playButton.loadTexture('play', 0);}

        if (wakazaji.input.pointerOver()) {wakazaji.loadTexture('wakazaji_hover', 0);}
        else {wakazaji.loadTexture('wakazaji', 0);}

        if (credits.input.pointerOver()) {credits.loadTexture('credits_hover', 0);}
        else {credits.loadTexture('credits', 0);}
    },
    render:function(){

    }
};

function playTheGame(){
    menuBGM.pause();
    game.state.start("PlayGame", true, false, 0);
}

function openWekazaj(){
    wakazajiPOP = game.add.sprite(game.world.centerX, game.world.centerY, 'wakazaji_page');
    wakazajiPOP.anchor.set(0.5);
    wakazajiPOP.inputEnabled = true;

    var closeButton = game.make.sprite(330, -380, 'close');
    closeButton.scale.set(0.3);
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;
    closeButton.events.onInputDown.add(closeWakazaji, this);

    wakazajiPOP.addChild(closeButton);
}

function closeWakazaji(){
    wakazajiPOP.destroy();
}