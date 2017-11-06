var mainMenu = function (game) {};

var text;

mainMenu.prototype = {
    preload:function(){
        this.game.load.image("play", "assets/play.png");
    },
    create:function () {
        game.stage.backgroundColor = "#000000"; //set the background color
        var style = { font: "bold 32px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        text = game.add.text(0, 0, "press start to start game!", style);

        var playButton = this.game.add.button(160,320,"play",this.playTheGame,this);
        playButton.anchor.setTo(0.5,0.5);
    },
    playTheGame:function () {
        this.game.state.start("PlayGame", true, false, 0);
    },
    render:function(){

    }
};