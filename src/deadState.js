var deadState = function (game) {};

var deadBack;
var deadplayButton;

deadState.prototype = {
    preload:function(){
        game.load.image("deadspace", "assets/deadState/deadBack.png");
        game.load.image("deadTitle", "assets/deadState/deadTitle.png");
        game.load.image("playAgain", "assets/deadState/playAgain.png");
        game.load.image("playAgain_hover", "assets/deadState/playAgain_hover.png");
        //game.load.image("backToMenu", "assets/deadState/backToMenu.png");
        //game.load.image("backToMenu_hover", "assets/deadState/backtoMenu_hover.png");
    },
    create:function () {
        deadBack = game.add.tileSprite(-320, -320, 1024, 1024, 'deadspace');
        deadTitle = game.add.sprite(-300, -250, 'deadTitle');

        deadplayButton = game.add.button(-115,0,"playAgain",deadplayTheGame,this);
        deadplayButton.scale.setTo(0.5, 0.5);

        //backToMenuButton = game.add.button(-150,100,"backToMenu",deadBackToMenu,this);
        //backToMenuButton.scale.setTo(0.5, 0.5);
    },
    update:function() {
        deadBack.tilePosition.x -= 1;
        deadBack.tilePosition.y += 1;

        if (deadplayButton.input.pointerOver()) {deadplayButton.loadTexture('playAgain_hover', 0);}
        else {deadplayButton.loadTexture('playAgain', 0);}
        //if (backToMenuButton.input.pointerOver()) {backToMenuButton.loadTexture('backToMenu_hover', 0);}
        //else {backToMenuButton.loadTexture('backToMenu', 0);}
    },
    render:function(){
    }
};

function deadplayTheGame(){
    game.camera.fade('#000000',500);
    // game.camera.onFadeComplete.add(deadFadeComplete,this);
    game.time.events.add(500, deadFadeComplete, this);
}
function deadFadeComplete(){
    deadplayButton.destroy();
    game.state.start("PlayGame", true, false, currentLevel);
}

// function deadBackToMenu(){
//     game.camera.fade('#000000',500);
//     game.camera.onFadeComplete.add(deadFadeCompleteMenu,this);
// }
// function deadFadeCompleteMenu(){
//     backToMenuButton.destroy();
//     game.state.start("MainMenu", true, false, currentLevel = 0);
// }