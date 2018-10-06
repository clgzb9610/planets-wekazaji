var mainMenu = function (game) {};

var text;
var menuBack;
var menuBGM;
var wekazajiPOP;

var playButton;
var levelButton;
var wekazaji;
var credits;

mainMenu.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.image("wekazaji_page", "assets/mainMenu/wakazajiPage.png");
        game.load.image("music_page", "assets/mainMenu/musicPage.png");
        game.load.image("close", "assets/mainMenu/x.png");
        game.load.audio('menuBGM', "assets/mainMenu/Visager_-_14_-_Home_Departure_Loop.mp3");
        // from http://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/Home_Departure_Loop

        game.load.spritesheet("newTitle", "assets/mainMenu/bigTitleSheet.png", 700, 700);
        game.load.image("newPlay", "assets/mainMenu/play1.png");
        game.load.image("newPlayHover", "assets/mainMenu/play2.png");
        game.load.image("newLevels", "assets/mainMenu/levels1.png");
        game.load.image("newLevelHover", "assets/mainMenu/levels2.png");
        game.load.image("newCredit", "assets/mainMenu/credits1.png");
        game.load.image("newCreditHover", "assets/mainMenu/credits2.png");
        game.load.image("newMusic", "assets/mainMenu/music1.png");
        game.load.image("newMusicHover", "assets/mainMenu/music2.png");
        game.load.image("blank", "assets/mainMenu/transparent.png");

    },
    create:function () {
        console.log("creating main menu");
        game.time.advancedTiming = true;

        game.world.setBounds(0, 0, 700, 700);

        menuBack = game.add.tileSprite(-320, -320, 1024, 1024, 'space');

        menuBGM = game.add.audio('menuBGM');
        menuBGM.loop = true;
        menuBGM.volume = 0.6;
        menuBGM.play();

        var title = game.add.sprite(70, 4, "newTitle");
        title.scale.x = 0.8;
        title.scale.y = 0.8;
        title.animations.add('beaming',[0,1,2],10, true);
        title.animations.play('beaming');

        playButton = game.add.button(220,560,"newPlay",playTheGame,this);
        playButton.scale.x = 0.4;
        playButton.scale.y = 0.4;
        playButton.inputEnabled = true;
        
        levelButton = game.add.button(270,640,"newLevels",openLevelSelect,this);
        levelButton.scale.x = 0.25;
        levelButton.scale.y = 0.25;
        levelButton.inputEnabled = true;

        wekazaji = game.add.button(100,648,"newCredit",openWekazaj, this);
        wekazaji.scale.x = 0.2;
        wekazaji.scale.y = 0.2;
        wekazaji.inputEnabled = true;

        music = game.add.button(450,648,"newMusic",openMusic, this);
        music.scale.x = 0.2;
        music.scale.y = 0.2;
        music.inputEnabled = true;

    },
    update:function() {
        menuBack.tilePosition.x -= 1;

        if (playButton.input.pointerOver()) {playButton.loadTexture('newPlayHover', 0);}
        else {playButton.loadTexture('newPlay', 0);}
        
       if (levelButton.input.pointerOver()) {levelButton.loadTexture('newLevelHover', 0);}
       else {levelButton.loadTexture('newLevels', 0);}

        if (wekazaji.input.pointerOver()) {wekazaji.loadTexture('newCreditHover', 0);}
        else {wekazaji.loadTexture('newCredit', 0);}

        if (music.input.pointerOver()) {music.loadTexture('newMusicHover', 0);}
        else {music.loadTexture('newMusic', 0);}
    },
    render: function () {
        if (showFPS) {
            game.debug.text(game.time.fps, 2, 14, "#00ff00");
        }
    }
};

function playTheGame(){
    game.camera.fade('#000000',500);
    console.log("playgame has been clicked");
    // game.camera.onFadeComplete.add(fadeComplete,this);
    game.time.events.add(500, fadeComplete, this);
}

function openLevelSelect(){
    game.state.start("levelSelect", true, false, 0);
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

function openMusic(){
    musicPop = game.add.sprite(game.world.centerX, game.world.centerY, 'music_page');
    musicPop.anchor.set(0.5, 0.5);
    musicPop.inputEnabled = true;

    var closeButton = game.make.sprite(280, -330, 'close');
    closeButton.scale.set(0.3);
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;
    closeButton.events.onInputDown.add(closeMusic, this);

    var musicLinkButton = new Phaser.Button(game, 211 - 350, 111 - 350, null, openMusicLink);
    musicLinkButton.inputEnabled = true;
    musicLinkButton.input.useHandCursor = true;
    musicLinkButton.width = 274;
    musicLinkButton.height = 274;

    musicPop.addChild(musicLinkButton);
    musicPop.addChild(closeButton);
}

function openMusicLink() {
    console.log("Music Link was clicked");
    window.open("https://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/", "_blank");
}

function closeMusic(){
    musicPop.destroy();
}