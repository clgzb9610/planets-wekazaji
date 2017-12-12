var deadState = function (game) {};

var menuBack;

deadState.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.image("play", "assets/mainMenu/play.png");
    },
    create:function () {
        menuBack = game.add.tileSprite(0, 0, 1024, 1024, 'space');
        playButton = game.add.button(250,350,"play",playTheGame,this);
        console.log("this is dead state")
    },
    update:function() {
        menuBack.tilePosition.x -= 1;
    },
    render:function(){
    }
};

function playTheGame(){
    game.camera.fade('#000000',500);
    game.camera.onFadeComplete.add(fadeComplete,this);
}