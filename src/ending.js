var ending = function (game) {};

var endingBGM;

ending.prototype = {
    preload:function(){
        game.load.image("deadspace", "assets/deadState/deadBack.png");
        game.load.image("playAgain", "assets/deadState/playAgain.png");
        game.load.image("playAgain_hover", "assets/deadState/playAgain_hover.png");
        game.load.image("backToMenu", "assets/deadState/backToMenu.png");
        game.load.image("backToMenu_hover", "assets/deadState/backtoMenu_hover.png");
        game.load.audio('endingBGM', "assets/music/Visager_-_05_-_Roots_Loop.mp3");
    },
    create:function () {
        endingBGM = game.add.audio('endingBGM');
        endingBGM.loop = true;
        endingBGM.volume = 0.6;
        endingBGM.play();

        deadBack = game.add.tileSprite(-320, -320, 1024, 1024, 'deadspace');

        endplayButton = game.add.button(-115,0,"playAgain",replayTheGame,this);
        endplayButton.scale.setTo(0.5, 0.5);

        backToMenuButton = game.add.button(-150,100,"backToMenu",endBackToMenu,this);
        backToMenuButton.scale.setTo(0.5, 0.5);
    },
    update:function() {
        deadBack.tilePosition.x -= 1;
        deadBack.tilePosition.y += 1;

        if (endplayButton.input.pointerOver()) {endplayButton.loadTexture('playAgain_hover', 0);}
        else {endplayButton.loadTexture('playAgain', 0);}
        if (backToMenuButton.input.pointerOver()) {backToMenuButton.loadTexture('backToMenu_hover', 0);}
        else {backToMenuButton.loadTexture('backToMenu', 0);}
    },
    render:function(){

    }
};

function replayTheGame(){
    game.camera.fade('#000000',500);
    game.camera.onFadeComplete.add(refadeComplete,this);
}

function refadeComplete(){
    endingBGM.pause();
    endplayButton.destroy();
    game.state.start("playGame", true, false, 0, currentLevel = 0);
}

function endBackToMenu(){
    game.camera.fade('#000000',500);
    game.camera.onFadeComplete.add(endFadeCompleteMenu,this);
}
function endFadeCompleteMenu(){
    backToMenuButton.destroy();
    game.state.start("MainMenu", true, false, currentLevel = 0);
}