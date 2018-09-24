var levelSelect = function (game) {};


var levelBackground;


levelSelect.prototype = {
    preload:function(){
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.spritesheet("title", "assets/mainMenu/title_sheet.png", 700, 124);
        game.load.image("play", "assets/mainMenu/play.png");
        game.load.image("levels", "assets/mainMenu/levels.png")
        game.load.image("play_hover", "assets/mainMenu/play_hover.png");
        game.load.image("wekazaji", "assets/mainMenu/wekazaji.png");
        game.load.image("wekazaji_hover", "assets/mainMenu/wekazaji_hover.png");
        game.load.image("music", "assets/mainMenu/music.png");
        game.load.image("music_hover", "assets/mainMenu/music_hover.png");
        game.load.image("wekazaji_page", "assets/mainMenu/wakazajiPage.png");
        game.load.image("music_page", "assets/mainMenu/musicPage.png");
        game.load.image("close", "assets/mainMenu/x.png");

        game.load.audio('menuBGM', "assets/mainMenu/Visager_-_14_-_Home_Departure_Loop.mp3");
        // from http://freemusicarchive.org/music/Visager/Songs_from_an_Unmade_Forest_World/Home_Departure_Loop
    },
    create:function () {
        console.log("creating main menu");
        game.world.setBounds(0, 0, 700, 700);

        levelBackground = game.add.tileSprite(-320, -320, 1024, 1024, 'space');


    },
    update:function() {
        levelBackground.tilePosition.x -= 1;

    },
    render:function(){

    }
};