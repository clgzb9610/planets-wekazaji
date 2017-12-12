var ending = function (game) {};

var endingBGM;

ending.prototype = {
    preload:function(){
        game.load.audio('endingBGM', "assets/music/Visager_-_05_-_Roots_Loop.mp3");
    },
    create:function () {
        endingBGM = game.add.audio('endingBGM');
        endingBGM.loop = true;
        endingBGM.volume = 0.6;
        endingBGM.play();

        replayButton = game.add.button(-70,50,"play",replayTheGame,this);
        replayButton.scale.x = 0.4;
        replayButton.scale.y = 0.4;
        replayButton.inputEnabled = true;
    },
    update:function() {
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
    replayButton.destroy();
    game.state.start("PlayGame", true, false, 0, currentLevel = 0);
}