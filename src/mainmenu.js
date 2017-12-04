var mainMenu = function (game) {};

var text;
var menuBack;
var menuBGM;

mainMenu.prototype = {
    preload:function(){
        game.load.image("play", "assets/play.png");
        game.load.image("space", "assets/seamlessspacebright.png");
        game.load.image("title", "assets/planets logo-01.png");

        game.load.audio('menuBGM', "assets/Visager_-_14_-_Home_Departure_Loop.mp3");
        // from http://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/Home_Departure_Loop

    },
    create:function () {
        menuBack = game.add.tileSprite(0, 0, 1024, 1024, 'space');

        menuBGM = game.add.audio('menuBGM');
        menuBGM.loop = true;
        menuBGM.volume = 0.6;
        menuBGM.play();

        playButton = game.add.button(160,320,"play",playTheGame,this);
        playButton.anchor.setTo(0.5,0.5);
    },
    update:function() {
        menuBack.tilePosition.x -= 1;
    },
    render:function(){

    }
};

function playTheGame(){
    menuBGM.pause();
    game.state.start("PlayGame", true, false, 0);
}