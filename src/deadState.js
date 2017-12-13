var deadState = function (game) {};

var deadBack;
var deadplayButton;

deadState.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.image("play", "assets/mainMenu/play.png");
    },
    create:function () {
        deadBack = game.add.tileSprite(-320, -300, 1024, 1024, 'space');
        //deadText = game.add.text(-70, 100, "You died!", {fill:'#000000', font: '20pt Helvetica', align: 'center'});
        deadplayButton = game.add.button(-70,50,"play",deadplayTheGame,this);
        deadplayButton.scale.setTo(0.4, 0.4);
        console.log("this is dead state");
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