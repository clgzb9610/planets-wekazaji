var ending = function (game) {};

var endingBGM;
var currentSlide = 0;
var slideList = ["slide1", "slide2", "slide3", "slide4", "slide5", "slide6", "slide7"];
var nextSlideButton, playAgainButton, backToMenuButton;

ending.prototype = {
    preload:function(){
        game.load.image("playAgain", "assets/game/playAgain.png");
        game.load.image("playAgain_hover", "assets/game/playAgain_hover.png");
        game.load.image("backToMenu", "assets/game/toMainButton.png");
        game.load.image("backToMenu_hover", "assets/game/toMainButton_hover.png");
        game.load.audio('endingBGM', "assets/music/Visager_-_05_-_Roots_Loop.mp3");

        game.load.image("slide1", "assets/ending/slide1.png");
        game.load.image("slide2", "assets/ending/slide2.png");
        game.load.image("slide3", "assets/ending/slide3.png");
        game.load.image("slide4", "assets/ending/slide4.png");
        game.load.image("slide5", "assets/ending/slide5.png");
        game.load.image("slide6", "assets/ending/slide6.png");
        game.load.image("slide7", "assets/ending/slide7.png");
        game.load.image("nextSlideButton", "assets/ending/nextSlideButton.png");
        game.load.image("nextSlideButton_hover", "assets/ending/nextSlideButton_hover.png");
    },
    create:function () {
        game.world.setBounds(-300, -320, 300, 320);
        endingBGM = game.add.audio('endingBGM');
        endingBGM.loop = true;
        endingBGM.volume = 0.6;
        endingBGM.play();

        slide1 = game.add.sprite(50, 30, 'slide1');
        slide1.anchor.setTo(0.5);

        blackScreen = game.add.sprite(0, 0, "blackScreen");
        blackScreen.scale.setTo(2, 2);
        blackScreen.anchor.set(0.5, 0.5);
        game.add.tween(blackScreen).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);

        nextSlideButton = game.add.button(260, 260, "nextSlideButton");
        nextSlideButton.scale.setTo(0.4);
        nextSlideButton.inputEnabled = true;
        nextSlideButton.events.onInputUp.add(nextSlide, self);

        backToMenuButton = game.add.button(-225,280,"backToMenu",endBackToMenu,this);
        backToMenuButton.scale.setTo(0.8);
        backToMenuButton.inputEnabled = true;
        backToMenuButton.visible = false;
        backToMenuButton.alpha = 0;

        playAgainButton = game.add.button(60,280,"playAgain",replayTheGame,this);
        playAgainButton.scale.setTo(0.8);
        playAgainButton.inputEnabled = true;
        playAgainButton.visible = false;
        playAgainButton.alpha = 0;

    },
    update:function() {
        if (playAgainButton.input.pointerOver()) {playAgainButton.loadTexture('playAgain_hover', 0);}
        else {playAgainButton.loadTexture('playAgain', 0);}
        if (backToMenuButton.input.pointerOver()) {backToMenuButton.loadTexture('backToMenu_hover', 0);}
        else {backToMenuButton.loadTexture('backToMenu', 0);}
        if (nextSlideButton.input.pointerOver()) {nextSlideButton.loadTexture('nextSlideButton_hover', 0);}
        else {nextSlideButton.loadTexture('nextSlideButton', 0);}
    },
    render: function () {
        if (showDebugInfo) {
            game.debug.text(game.time.fps, 2, 14, "#00ff00");
        }
    }
};

function nextSlide(){
    currentSlide++;
    console.log(slideList[currentSlide]);
    var slide = game.add.sprite(50, 30, slideList[currentSlide]);
    slide.anchor.setTo(0.5);
    slide.alpha = 0;
    game.add.tween(slide).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
    nextSlideButton.bringToTop();
    if(currentSlide === 6){
        playAgainButton.bringToTop();
        backToMenuButton.bringToTop();
        nextSlideButton.visible = false;
        playAgainButton.visible = true;
        backToMenuButton.visible = true;
        game.add.tween(playAgainButton).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
        game.add.tween(backToMenuButton).to( { alpha: 1 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
    }
}


function replayTheGame(){
    game.camera.fade('#000000',500);
    game.time.events.add(500, refadeComplete, this);
}

function refadeComplete(){
    destroyEndStateObjects();
    currentSlide = 0;
    game.state.start("PlayGame", true, false, 0, currentLevel = 0);
}

function endBackToMenu(){
    game.camera.fade('#000000',500);
    game.time.events.add(500, endFadeCompleteMenu, this);
}
function endFadeCompleteMenu(){
    destroyEndStateObjects();
    currentSlide = 0;
    game.state.start("MainMenu", true, false, 0);
}

function destroyEndStateObjects(){
    endingBGM.destroy();
    // endBack.destroy();
    playAgainButton.destroy();
    backToMenuButton.destroy();
}