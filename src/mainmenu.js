var mainMenu = function (game) {};

var text;
var menuBack;
var menuBGM;

var playButton;
var closeButton;
var levelButton;
var credits;
var music;

var skipButton, startNextSlideButton;
var startStory = ["start1", "start2", "start3", "start4", "start5", "start6", "start7"];
var currentStartSlide = 0;

mainMenu.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.audio('menuBGM', "assets/mainMenu/Visager_-_14_-_Home_Departure_Loop.mp3");

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

        game.load.image("credits", "assets/mainMenu/newCredit.png");
        game.load.image("music_page", "assets/mainMenu/newMusic.png");
        game.load.image("closeButton", "assets/mainMenu/closeButton.png");
        game.load.image("closeButton_hover", "assets/mainMenu/closeButton_hover.png");

        game.load.image("start1", "assets/mainMenu/start1.png");
        game.load.image("start2", "assets/mainMenu/start2.png");
        game.load.image("start3", "assets/mainMenu/start3.png");
        game.load.image("start4", "assets/mainMenu/start4.png");
        game.load.image("start5", "assets/mainMenu/start5.png");
        game.load.image("start6", "assets/mainMenu/start6.png");
        game.load.image("start7", "assets/mainMenu/start7.png");

        game.load.image("skipButton", "assets/mainMenu/skipButton.png");
        game.load.image("skipButton_hover", "assets/mainMenu/skipButton_hover.png");
        game.load.image("nextSlideButton", "assets/ending/nextSlideButton.png");
        game.load.image("nextSlideButton_hover", "assets/ending/nextSlideButton_hover.png");

    },
    create:function () {
        game.time.advancedTiming = true;

        game.world.setBounds(0, 0, 700, 700);

        menuBack = game.add.tileSprite(-320, -320, 1024, 1024, 'space');

        menuBGM = game.add.audio('menuBGM');
        menuBGM.loop = true;
        menuBGM.volume = 0.6;
        menuBGM.play();

        // var title = game.add.sprite(70, 4, "newTitle");
        // title.scale.x = 0.8;
        // title.scale.y = 0.8;
        // title.animations.add('beaming',[0,1,2],3, true);
        // title.animations.play('beaming');
        for (var i = 0; i < 3; i++) {
            var item1 = game.add.sprite(70, 4, 'newTitle', i);
            item1.alpha = 1;
            item1.scale.x = 0.8;
            item1.scale.y = 0.8;
            var tween1 = game.add.tween(item1).to({alpha:0}, 2000, Phaser.Easing.Linear.None, true, 0, false);
            tween1.yoyo(true, 1000);
            var j = i + 1;
            if (j === 3){j = 0;}
            var item2 = game.add.sprite(70, 4, 'newTitle', j);
            item2.alpha = 0;
            item2.scale.x = 0.8;
            item2.scale.y = 0.8;
            var tween2 = game.add.tween(item2).to({alpha:1}, 2000, Phaser.Easing.Linear.None, true, 0, false);
            tween2.yoyo(true, 1000);
        }


        playButton = game.add.button(200,560,"newPlay",fadeToStory,this);
        playButton.scale.x = 0.4;
        playButton.scale.y = 0.4;
        playButton.inputEnabled = true;
        
        levelButton = game.add.button(270,640,"newLevels",openLevelSelect,this);
        levelButton.scale.x = 0.25;
        levelButton.scale.y = 0.25;
        levelButton.inputEnabled = true;

        credits = game.add.button(100,648,"newCredit",openCredits, this);
        credits.scale.x = 0.2;
        credits.scale.y = 0.2;
        credits.inputEnabled = true;

        music = game.add.button(450,648,"newMusic",openMusic, this);
        music.scale.x = 0.2;
        music.scale.y = 0.2;
        music.inputEnabled = true;

        startNextSlideButton = game.add.button(570, 570, "nextSlideButton", startNextSlide, this);
        startNextSlideButton.scale.setTo(0.4);
        startNextSlideButton.inputEnabled = true;
        startNextSlideButton.visible = false;

        skipButton = game.add.button(460, 620, "skipButton", playTheGame, this);
        skipButton.scale.setTo(0.35);
        skipButton.inputEnabled = true;
        skipButton.visible = false;

    },
    update:function() {
        menuBack.tilePosition.x -= 1;
        if (playButton.input.pointerOver()) {playButton.loadTexture('newPlayHover', 0);}
        else {playButton.loadTexture('newPlay', 0);}
        if (levelButton.input.pointerOver()) {levelButton.loadTexture('newLevelHover', 0);}
        else {levelButton.loadTexture('newLevels', 0);}
        if (credits.input.pointerOver()) {credits.loadTexture('newCreditHover', 0);}
        else {credits.loadTexture('newCredit', 0);}
        if (music.input.pointerOver()) {music.loadTexture('newMusicHover', 0);}
        else {music.loadTexture('newMusic', 0);}
        if (startNextSlideButton.input.pointerOver()) {startNextSlideButton.loadTexture('nextSlideButton_hover', 0);}
        else {startNextSlideButton.loadTexture('nextSlideButton', 0);}
        if (skipButton.input.pointerOver()) {skipButton.loadTexture('skipButton_hover', 0);}
        else {skipButton.loadTexture('skipButton', 0);}
    },
    render: function () {
        if (showDebugInfo) {
            game.debug.text(game.time.fps, 2, 14, "#00ff00");
        }
    }
};

function fadeToStory(){
    game.time.events.add(500, startNextSlide, this);

    playButton.inputEnabled = false;
    levelButton.inputEnabled = false;
    credits.inputEnabled = false;
    music.inputEnabled = false;
}

function startNextSlide(){
    console.log(startStory[currentStartSlide]);
    if(currentStartSlide === 0){
        startNextSlideButton.visible = true;
        skipButton.visible = true;
        startNextSlideButton.alpha = 0;
        skipButton.alpha = 0;
        game.add.tween(startNextSlideButton).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(skipButton).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
    var slide = game.add.sprite(0, 0, startStory[currentStartSlide]);
    slide.alpha = 0;
    game.add.tween(slide).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);

    startNextSlideButton.bringToTop();
    skipButton.bringToTop();

    if(currentStartSlide === 7){
        playTheGame();
    }
    currentStartSlide++;
}

function playTheGame(){
    game.camera.fade('#000000',500);
    game.time.events.add(500, fadeComplete, this);
}

//function openLevelSelect(){
//    game.state.start("levelSelect", true, false, 0);
//}

function openLevelSelect() {
    game.camera.fade('#000000',500);
    game.time.events.add(500, levelSelectComplete, this);
}

function levelSelectComplete() {
    game.state.start("levelSelect", true, false, 0);
}

function fadeComplete(){
    menuBGM.pause();
    currentStartSlide = 0;
    game.state.start("PlayGame", true, false, 0);
}

function openCredits(){
    creditPop = game.add.sprite(game.world.centerX, game.world.centerY, 'credits');
    creditPop.anchor.set(0.5, 0.5);
    creditPop.inputEnabled = true;

    closeButton = game.add.button(200, -200, 'closeButton', closeCredits, this);
    closeButton.scale.set(0.2);
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;

    closeButton.onInputOver.add(closeOver, this);
    closeButton.onInputOut.add(closeOut, this);

    creditPop.addChild(closeButton);
}

function closeCredits(){
    creditPop.destroy();
}

function openMusic(){
    musicPop = game.add.sprite(game.world.centerX, game.world.centerY, 'music_page');
    musicPop.anchor.set(0.5, 0.5);
    musicPop.inputEnabled = true;

    closeButton = game.add.button(200, -200, 'closeButton', closeMusic, this);
    closeButton.scale.set(0.2);
    closeButton.inputEnabled = true;
    closeButton.input.priorityID = 1;
    closeButton.input.useHandCursor = true;

    closeButton.onInputOver.add(closeOver, this);
    closeButton.onInputOut.add(closeOut, this);

    var musicLinkButton = new Phaser.Button(game, 211 - 310, 111 - 250, null, openMusicLink);
    musicLinkButton.inputEnabled = true;
    musicLinkButton.input.useHandCursor = true;
    musicLinkButton.width = 210;
    musicLinkButton.height = 210;

    musicPop.addChild(musicLinkButton);
    musicPop.addChild(closeButton);
}

function openMusicLink() {
    window.open("https://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/", "_blank");
}

function closeMusic(){
    musicPop.destroy();
}

function closeOver(){
    closeButton.loadTexture('closeButton_hover', 0);
}

function closeOut(){
    closeButton.loadTexture("closeButton", 0);
}