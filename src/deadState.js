var deadState = function (game) {};

var deadBack;
var deadplayButton;

deadState.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.image("play", "assets/mainMenu/play.png");
    },
    create:function () {
        deadBack = game.add.tileSprite(0, 0, 1024, 1024, 'space');
        deadplayButton = game.add.button(250,350,"play",deadplayTheGame,this);
        console.log("this is dead state")
    },
    update:function() {
        deadBack.tilePosition.x -= 1;
    },
    render:function(){
    }
};

function deadplayTheGame(){
    game.camera.fade('#000000',500);
    game.camera.onFadeComplete.add(deadFadeComplete,this);
}
function deadFadeComplete(){
    game.state.start("PlayGame", true, false, currentLevel);
}