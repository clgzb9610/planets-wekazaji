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
        game.load.spritesheet("title", "assets/mainMenu/title_sheet.png", 700, 124);
        game.load.image("play", "assets/mainMenu/play.png");
        game.load.image("levels", "assets/mainMenu/levels.png")
        game.load.image("play_hover", "assets/mainMenu/play_hover.png");
        game.load.image("wekazaji", "assets/mainMenu/wekazaji.png");
        game.load.image("wekazaji_hover", "assets/mainMenu/wekazaji_hover.png");
        game.load.image("music", "assets/mainMenu/music.png");
        game.load.image("music_hover", "assets/mainMenu/music_hover.png");
        game.load.image("wekazaji_page", "assets/mainMenu/wakazajiPage.png");
        game.load.image("music_page", "assets/mainMenu/musicPage.png");
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

        var title = game.add.sprite(20, 100, "title");
        title.scale.x = 0.95;
        title.scale.y = 0.95;
        title.animations.add('beaming',[1,2,3],4, true);
        title.animations.play('beaming');

        playButton = game.add.button(210,260,"play",playTheGame,this);
        playButton.scale.x = 0.4;
        playButton.scale.y = 0.4;
        playButton.inputEnabled = true;
        
        levelButton = game.add.button(210,360,"levels",openLevelSelect,this);
        levelButton.scale.x = 0.4;
        levelButton.scale.y = 0.4;
        levelButton.inputEnabled = true;

        wekazaji = game.add.button(210,460,"wekazaji",openWekazaj, this);
        wekazaji.scale.x = 0.4;
        wekazaji.scale.y = 0.4;
        wekazaji.inputEnabled = true;

        music = game.add.button(210,560,"music",openMusic, this);
        music.scale.x = 0.4;
        music.scale.y = 0.4;
        music.inputEnabled = true;

    },
    update:function() {
        menuBack.tilePosition.x -= 1;

        if (playButton.input.pointerOver()) {playButton.loadTexture('play_hover', 0);}
        else {playButton.loadTexture('play', 0);}
        
//        if (levelButton.input.pointerOver()) {levelButton.loadTexture('level_hover', 0);}
//        else {playButton.loadTexture('levels', 0);}

        if (wekazaji.input.pointerOver()) {wekazaji.loadTexture('wekazaji_hover', 0);}
        else {wekazaji.loadTexture('wekazaji', 0);}

        if (music.input.pointerOver()) {music.loadTexture('music_hover', 0);}
        else {music.loadTexture('music', 0);}
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