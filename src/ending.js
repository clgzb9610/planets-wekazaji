var ending = function (game) {};

var endingBGM;

ending.prototype = {
    preload:function(){
        game.load.image("spacebeach", "assets/game/vacationeb.png");
        game.load.image("playAgain", "assets/deadState/playAgain.png");
        game.load.image("playAgain_hover", "assets/deadState/playAgain_hover.png");
        game.load.image("backToMenu", "assets/deadState/backToMenu.png");
        game.load.image("backToMenu_hover", "assets/deadState/backtoMenu_hover.png");
        game.load.audio('endingBGM', "assets/music/Visager_-_05_-_Roots_Loop.mp3");
    },
    create:function () {
        game.world.setBounds(-300, -320, 300, 320);
        endingBGM = game.add.audio('endingBGM');
        endingBGM.loop = true;
        endingBGM.volume = 0.6;
        endingBGM.play();

        endBack = game.add.tileSprite(-320, -320, 1024, 1024, 'spacebeach');

        endplayButton = game.add.button(-115,-250,"playAgain",replayTheGame,this);
        endplayButton.scale.setTo(0.5, 0.5);

        backToMenuButton = game.add.button(-150,-150,"backToMenu",endBackToMenu,this);
        backToMenuButton.scale.setTo(0.5, 0.5);
    },
    update:function() {
        // endBack.tilePosition.x -= 1;
        // endBack.tilePosition.y += 1;

        if (endplayButton.input.pointerOver()) {endplayButton.loadTexture('playAgain_hover', 0);}
        else {endplayButton.loadTexture('playAgain', 0);}
        if (backToMenuButton.input.pointerOver()) {backToMenuButton.loadTexture('backToMenu_hover', 0);}
        else {backToMenuButton.loadTexture('backToMenu', 0);}
    }
};

function replayTheGame(){
    game.camera.fade('#000000',500);
    // game.camera.onFadeComplete.add(refadeComplete,this);
    game.time.events.add(500, refadeComplete, this);
}

function refadeComplete(){
    destroyEndStateObjects();
    game.state.start("PlayGame", true, false, 0, currentLevel = 0);
}

function endBackToMenu(){
    game.camera.fade('#000000',500);
    // game.camera.onFadeComplete.add(endFadeCompleteMenu,this);
    game.time.events.add(500, endFadeCompleteMenu, this);
}
function endFadeCompleteMenu(){
    //TODO: i think we need to destroy all the objects when we change states, not just this button
    destroyEndStateObjects();

    console.log("clicked go to main");
    game.state.start("MainMenu", true, false, currentLevel = 0);
}

function destroyEndStateObjects(){
    endingBGM.destroy();
    endBack.destroy();
    endplayButton.destroy();
    backToMenuButton.destroy();
}