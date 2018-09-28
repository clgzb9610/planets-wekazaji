/*
planets-wekazaji
A basic ring physics tutorial to build off

source: https://phaser.io/news/2015/07/simulate-planet-gravity-with-box2d-tutorial
*/
var playGame = function(game){};

var game;
var gamePhysics;
var helper;
var levelChanger;

var planetGroup;
var cursors;
var playingNow;

//for the player & walk animations
var player;
var walkR;
var walkL;
var stand;
var fall;

//for the two enemies, populated in levelChanger
var enemy1;
var enemy2;
var enemy1Present = false;
var enemy2Present = false;

var startPadActive;

var teleporter;
var levelGoal;
var playerLastAngle;

var score = 0;
var lastCaption = "";

// a force reducer to let the simulation run smoothly
var forceReducer = 0.00024; //was .00175

var playerVel = 40;


// graphic object where to draw planet gravity area
var gravityGraphics;

var emitter;

var bgm;

var currentLevel=0;

var level = [
    [ //level 0 - collect gears to activate portal
        {objectType: 'planet', x: 0, y: 0, gravRadius: 350, gravForce: 300, sprite: "bigplanet"},
        {objectType:'teleporter', x:0, y: -155, radians: 0, goal:1},
        {objectType: 'startPad', x: -150,y: -40,radians: 0.2-Math.PI/2},
        {objectType: 'gear', x: 30, y: 200, sprite:"gear"},
        {objectType: 'player', x: -155, y: -45},
        {objectType: 'hint', text: "You're on a journey!\nUse arrow keys to move.", delay: 2}
    ], // level 0
    [//level 1 - jumping between planets
        {objectType: 'planet', x: -280, y: -100, gravRadius: 250, gravForce: 250, sprite: "smallstar"},
        {objectType: 'planet', x: 130, y: 150, gravRadius: 400, gravForce: 250, sprite: "starplanet"},
        {objectType: 'teleporter', x: 130, y: -3, radians: 0, goal: 3},
        {objectType: 'startPad', x: -425, y: -50 , radians:1.15 + Math.PI},
        {objectType: 'gear', x: -350, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -220, y: 10, sprite: "gear"},
        {objectType: 'player', x: -430, y: -50},
        {objectType: 'hint', text: "The portal's so far!\nMaybe you can jump?", delay: 2}
    ], // level 1
    [//level 2 - start in void
        {objectType: 'planet', x: -300, y: -50, gravRadius: 250, gravForce: 150, sprite: "axoplanet"},
        {objectType: 'planet', x: 370, y: 350, gravRadius: 400, gravForce: 250, sprite: "fishplanet"},
        {objectType: 'teleporter', x: 395, y: 202, radians: 0.2, goal: 3},
        {objectType: 'startPad', x: 20, y: -15 , radians: 0},
        {objectType: 'gear', x: -350, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -220, y: 10, sprite: "gear"},
        {objectType: 'player', x: 23, y: -30},
        {objectType: 'hint', text: "Whoa!\nYou're not on a planet!", delay:1}
    ], // level 2
    [//level 3 - jumping to planets through void
        {objectType: 'planet', x: -280, y: -100, gravRadius: 230, gravForce: 170, sprite: "soccerplanet"},
        {objectType: 'planet', x: 160, y: 150, gravRadius: 130, gravForce: 140, sprite: "tennisplanet"},
        {objectType: 'planet', x: 60, y: -180, gravRadius: 200, gravForce: 470, sprite: "baseballplanet"},
        {objectType: 'teleporter', x: 278, y: 140, radians: 1.485, goal: 2},
        {objectType: 'startPad', x: 50, y: 180, radians: 1.4 + Math.PI },
        {objectType: 'gear', x: 100, y: -50, sprite: "gear"},
        {objectType: 'gear', x: -180, y: -150, sprite: "gear"},
        {objectType: 'player', x: 30, y: 185},
        {objectType: 'hint', text: "The gravity on the baseball\nplanet is too strong\nto escape without an\noverlapping gravity field.", delay: 5}
    ], // level 3
    [ //level 4 - enemy introduction
        {objectType: 'planet', x: 200, y: 100, gravRadius: 130, gravForce: 240, sprite: "smallrainbow"},
        {objectType: 'planet', x: 150, y: -160, gravRadius: 200, gravForce: 370, sprite: "otherrainbow"},
        {objectType: 'planet', x: -170, y: -400, gravRadius: 180, gravForce: 400, sprite: "rainbowplanet"},
        {objectType: 'teleporter', x: 318, y: 90, radians: 1.5, goal: 2}, //317, 90
        {objectType: 'startPad', x: -270, y: -490, radians: -0.8 },
        {objectType: 'gear', x: -180, y: -350, sprite: "gear"},
        {objectType: 'gear', x: 100, y:-50, sprite: "gear"},
        {objectType: 'player', x: -275, y: -495},
        {objectType: 'enemy1' , x:-110, y: -240, enemyVel: 25, sprite: "enemy"},
        {objectType: 'hint', text: "There's an enemy\nguarding this planet!", delay: 1}
    ], // level 4
    [ //level 5 - fun with overlapping gravity fields
        {objectType: 'planet', x: 200,y: 100, gravRadius: 260, gravForce: 390, sprite: "wafelplanet"},
        {objectType: 'planet', x: 140, y: 360, gravRadius: 120, gravForce: 300, sprite: "donutplanet"},
        {objectType: 'planet', x: 370, y: -250, gravRadius: 150, gravForce: 270, sprite: "orangeplanet"},
        {objectType: 'planet', x: 590, y: -380, gravRadius: 160, gravForce: 270, sprite: "cinnamonplanet"},
        {objectType: 'teleporter', x: 349, y: 140, radians: 1.82, goal: 3},
        {objectType: 'startPad', x: 30, y: 17, radians: -1.1},
        {objectType: 'gear', x: 5, y: 400, sprite: "gear"},
        {objectType: 'gear', x: 390, y: -300, sprite: "gear"},
        {objectType: 'gear', x: 600, y: -400, sprite: "gear"},
        {objectType: 'player', x: 0, y: 10},
        {objectType: 'enemy1', x: 400, y: -20, enemyVel: 25, sprite: "enemy"},
        {objectType: 'hint', text: "Where are those gears?", delay: 0}
    ], // level 5
    [ //level 6 - two enemies
        {objectType: 'planet', x: 0, y: 0, gravRadius: 150, gravForce: 270, sprite: "roseplanet"},
        {objectType: 'planet', x: 300, y: -150, gravRadius: 150, gravForce: 600, sprite: "hydrangea"},
        {objectType: 'planet', x: 300, y: 150, gravRadius: 150, gravForce: 600, sprite: "lilac"},
        {objectType: 'planet', x: 600, y: 0, gravRadius: 150, gravForce: 270, sprite: "hibiscus"},
        {objectType: 'teleporter', x: 696, y: -70, radians: 0.92, goal: 4},
        {objectType: 'startPad', x: -50, y: -110, radians: -0.4},
        {objectType: 'gear', x: -20, y: 50, sprite: "gear"},
        {objectType: 'gear', x: 390, y: 250, sprite: "gear"},
        {objectType: 'gear', x: 250, y: -250, sprite: "gear"},
        {objectType: 'gear', x: 580, y: -100, sprite: "gear"},
        {objectType: 'player', x: -70, y: -140},
        {objectType: 'enemy1', x: 360, y: -20, enemyVel: 15, sprite: "enemy"},
        {objectType: 'enemy2', x: 240, y: 20, enemyVel: 15, sprite: "enemy"},
        {objectType: 'hint', text: "Now there are two of them!", delay: 1}
    ], // level 6
    [ //level 7 - two enemies circling center planet
        {objectType: 'planet', x: 0, y: 0, gravRadius: 200, gravForce: 500, sprite: "catplanet"},
        {objectType: 'planet', x: 0, y: -300, gravRadius: 100, gravForce: 850, sprite: "blueyarn"},
        {objectType: 'planet', x: 0, y: 300, gravRadius: 100, gravForce: 850, sprite: "redyarn"},
        {objectType: 'planet', x: 300, y: 0, gravRadius: 100, gravForce: 850, sprite: "greenyarn"},
        {objectType: 'planet', x: -300, y: 0, gravRadius: 100, gravForce: 850, sprite: "purpleyarn"},
        {objectType: 'teleporter', x: 100, y: 89, radians: 2.35, goal: 4},
        {objectType: 'startPad', x: -75, y: 100, radians: -2.5},
        {objectType: 'gear', x: 100, y: 300, sprite: "gear"},
        {objectType: 'gear', x: -100, y: -300, sprite: "gear"},
        {objectType: 'gear', x: 390, y: 20, sprite: "gear"},
        {objectType: 'gear', x: -250, y: -100, sprite: "gear"},
        {objectType: 'player', x: -100, y: 130},
        {objectType: 'enemy1', x: -150, y: 0, enemyVel: 25, sprite: "enemy"},
        {objectType: 'enemy2', x: 150, y: 0, enemyVel: 45, sprite: "enemy"},
        {objectType: 'hint', text: "Face the devil planet!", delay: 1}
    ], // level 7
    [ //level 8 - find the hidden gear
        {objectType: 'planet', x: 0, y: 0, gravRadius: 300, gravForce: 400, sprite: "treasureBig"},
        {objectType: 'planet', x: 0, y: 650, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'planet', x: 0, y: 1165, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'planet', x: -550, y: 340, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'planet', x: 510, y: 400, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'planet', x: -600, y: -250, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'planet', x: -150, y: -630, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'planet', x: 400, y: -510, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'planet', x: 650, y: -100, gravRadius: 180, gravForce: 250, sprite: "treasureSmall"},
        {objectType: 'teleporter', x: 0, y: 338, radians: -3.2, goal: 1},
        {objectType: 'startPad', x: -170, y: 330, radians: 10},
        {objectType: 'gear', x: 0, y: 1165, sprite: "gear"},
        {objectType: 'player', x: -190, y: 382},
        {objectType: 'hint', text: "It is near.", delay: 1}
    ], // level 8
    [ //level 9 - crazy gears
        {objectType: 'planet', x: 0, y: 0, gravRadius: 400, gravForce: 500, sprite: "gearPlanet"},
        {objectType: 'teleporter', x: 0, y: -204, radians: 0, goal: 42},
        {objectType: 'startPad', x: -75, y: 200, radians: -2.7},
        {objectType: 'gear', x: 0, y: 200, sprite: "gear"},
        {objectType: 'gear', x: 10, y: 190, sprite: "gear"},
        {objectType: 'gear', x: 20, y: 180, sprite: "gear"},
        {objectType: 'gear', x: 30, y: 170, sprite: "gear"},
        {objectType: 'gear', x: 40, y: 160, sprite: "gear"},
        {objectType: 'gear', x: 50, y: 150, sprite: "gear"},
        {objectType: 'gear', x: 60, y: 140, sprite: "gear"},
        {objectType: 'gear', x: 70, y: 130, sprite: "gear"},
        {objectType: 'gear', x: 80, y: 120, sprite: "gear"},
        {objectType: 'gear', x: 90, y: 110, sprite: "gear"},
        {objectType: 'gear', x: 100, y: 90, sprite: "gear"},
        {objectType: 'gear', x: 110, y: 80, sprite: "gear"},
        {objectType: 'gear', x: 120, y: 70, sprite: "gear"},
        {objectType: 'gear', x: 130, y: 60, sprite: "gear"},
        {objectType: 'gear', x: 140, y: 50, sprite: "gear"},
        {objectType: 'gear', x: 150, y: 40, sprite: "gear"},
        {objectType: 'gear', x: 160, y: 30, sprite: "gear"},
        {objectType: 'gear', x: 170, y: 20, sprite: "gear"},
        {objectType: 'gear', x: 180, y: 10, sprite: "gear"},
        {objectType: 'gear', x: 190, y: 0, sprite: "gear"},
        {objectType: 'gear', x: 200, y: -10, sprite: "gear"},
        {objectType: 'gear', x: 0, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -10, y: -190, sprite: "gear"},
        {objectType: 'gear', x: -20, y: -180, sprite: "gear"},
        {objectType: 'gear', x: -30, y: -170, sprite: "gear"},
        {objectType: 'gear', x: -40, y: -160, sprite: "gear"},
        {objectType: 'gear', x: -50, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -60, y: -140, sprite: "gear"},
        {objectType: 'gear', x: -70, y: -130, sprite: "gear"},
        {objectType: 'gear', x: -80, y: -120, sprite: "gear"},
        {objectType: 'gear', x: -90, y: -110, sprite: "gear"},
        {objectType: 'gear', x: -100, y: -90, sprite: "gear"},
        {objectType: 'gear', x: -110, y: -80, sprite: "gear"},
        {objectType: 'gear', x: -120, y: -70, sprite: "gear"},
        {objectType: 'gear', x: -130, y: -60, sprite: "gear"},
        {objectType: 'gear', x: -140, y: -50, sprite: "gear"},
        {objectType: 'gear', x: -150, y: -40, sprite: "gear"},
        {objectType: 'gear', x: -160, y: -30, sprite: "gear"},
        {objectType: 'gear', x: -170, y: -20, sprite: "gear"},
        {objectType: 'gear', x: -180, y: -10, sprite: "gear"},
        {objectType: 'gear', x: -190, y: 0, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -10, sprite: "gear"},
        {objectType: 'player', x: -90, y: 240},
        {objectType: 'hint', text: "mmmmmwwwwahahahahahaha", delay: 1}
    ] // level 9
];

playGame.prototype = {
    init:function(currentLevel){
        console.log("init game");
        this.currentLevel = currentLevel;
    },
    preload: function () {
        game.load.image("smallplanet", "assets/planets/planet.png");
        game.load.image("mediumplanet", "assets/planets/med_planet.png");
        game.load.image("bigplanet", "assets/planets/bigplanet.png");
        game.load.image("starplanet","assets/planets/bigplanet2.png");
        game.load.image("smallstar", "assets/planets/smallplanet2.png");
        game.load.image("fishplanet","assets/planets/bigplanet3.png");
        game.load.image("axoplanet", "assets/planets/smallplanet3.png");
        game.load.image("soccerplanet","assets/planets/bigplanet4.png");
        game.load.image("tennisplanet", "assets/planets/smallplanet4.png");
        game.load.image("baseballplanet", "assets/planets/smallplanet4a.png");
        game.load.image("rainbowplanet", "assets/planets/medplanet5.png");
        game.load.image("smallrainbow", "assets/planets/smallplanet5.png");
        game.load.image("otherrainbow", "assets/planets/smallplanet5a.png");
        game.load.image("cinnamonplanet", "assets/planets/cinnamon roll planet.png");
        game.load.image("orangeplanet", "assets/planets/medplanetorange.png");
        game.load.image("donutplanet", "assets/planets/smallplanet7.png");
        game.load.image("wafelplanet", "assets/planets/wafelplanet.png");
        game.load.image("catplanet", "assets/planets/mediumcat.png");
        game.load.image("blueyarn", "assets/planets/blueyarn.png");
        game.load.image("redyarn", "assets/planets/redyarn.png");
        game.load.image("greenyarn", "assets/planets/greenyarn.png");
        game.load.image("purpleyarn", "assets/planets/yarnplanet.png");
        game.load.image("roseplanet", "assets/planets/rosebush.png");
        game.load.image("hydrangea", "assets/planets/hydrangeas.png");
        game.load.image("lilac", "assets/planets/lilacbush.png");
        game.load.image("hibiscus", "assets/planets/hibiscus.png");
        game.load.image("treasureBig", "assets/planets/sample_treasurePlanet-01.png");
        game.load.image("treasureSmall", "assets/planets/sample_treasurePlanet_small-01.png");
        game.load.image("gearPlanet", "assets/planets/sample_Planet_mid.png");

        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.spritesheet('player',"assets/game/nebspritesv3.0.png",40,47);
        game.load.spritesheet("enemy", "assets/game/enemyblink.png", 41,43);
        game.load.spritesheet('gear', 'assets/game/gearspritessmall.png',38,34);
        game.load.spritesheet('teleporter', 'assets/game/teleporterspritesheet.png', 48, 61);
        game.load.image('startPad','assets/game/startPad.png',50,12);
        game.load.spritesheet('startPadAnimations','assets/game/startPadAnimationSpriteSheet.png',50,17);
        game.load.image("log", "assets/game/shipslog.png");
        game.load.image('blackScreen', "assets/game/blackScreen.png");

        game.load.spritesheet("flames", "assets/game/flameSprites.png", 8, 8);

        game.load.image("dashboard","assets/game/dashboard.png",300,52);
        game.load.image("mute","assets/buttons/mute.png",52,52);
        game.load.image("unMute", "assets/buttons/unMute.png", 52, 52);
        game.load.spritesheet("pause","assets/buttons/pause.png",52,52);
        game.load.image("restart","assets/buttons/restart.png",52,52);

        game.load.audio('bgm', "assets/music/Visager_-_01_-_The_Great_Tree_Loop.mp3");
        game.load.audio('ting', "assets/music/Ting-Popup_Pixels-349896185.mp3");
        game.load.audio('teleporterOpen', "assets/music/zapsplat_magical_portal_open_001_12505.mp3");
        game.load.audio('teleportToPad',"assets/music/zapsplat_magical_telekinesis_blast_002_12511.mp3");
    },
    create: function () {
        // console.log("creating game");

        // new boundaries are centered on 0,0 so the world can rotate
        game.world.setBounds(-350, -320, 350, 320);

        game.time.desiredFps = 70;

        //tiled background image to cover a wide enough area
        background = game.add.tileSprite(-2024, -2024, 1024, 1024, 'space');
        game.add.tileSprite(-2024, -1000, 1024, 1024, 'space');
        game.add.tileSprite(-2024, 24, 1024, 1024, 'space');
        game.add.tileSprite(-2024, 1048, 1024, 1024, 'space');
        game.add.tileSprite(-1000, -2024, 1024, 1024, 'space');
        game.add.tileSprite(-1000, -1000, 1024, 1024, 'space');
        game.add.tileSprite(-1000, 24, 1024, 1024, 'space');
        game.add.tileSprite(-1000, 1048, 1024, 1024, 'space');
        game.add.tileSprite(24, -2024, 1024, 1024, 'space');
        game.add.tileSprite(24, -1000, 1024, 1024, 'space');
        game.add.tileSprite(24, 24, 1024, 1024, 'space');
        game.add.tileSprite(24, 1048, 1024, 1024, 'space');
        game.add.tileSprite(1048, -2024, 1024, 1024, 'space');
        game.add.tileSprite(1048, -1000, 1024, 1024, 'space');
        game.add.tileSprite(1048, 24, 1024, 1024, 'space');
        game.add.tileSprite(1048, 1048, 1024, 1024, 'space');


        enemyGroup = game.add.group();
        planetGroup = game.add.group();
        objectGroup = game.add.group();
        dashboardGroup = game.add.group();
        messageGroup = game.add.group();

        // adding gravitiy line
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        game.stage.backgroundColor = "#222222";

        game.physics.startSystem(Phaser.Physics.BOX2D);

        bgm = game.add.audio('bgm');
        bgm.loop = true;
        bgm.volume = 0.6;
        bgm.play();

        emitter = game.add.emitter(0, 0, 2000);
        emitter.makeParticles('flames', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        emitter.minParticleSpeed.setTo(-20, -20);
        emitter.maxParticleSpeed.setTo(20, 20);
        emitter.gravity = 0;
        emitter.setAlpha(0.55, 0, 1000);
        emitter.setScale(1, 0, 1, 0, 1000);

        //one player exists for all levels
        player = game.add.sprite(-155, -45, "player");
        game.physics.box2d.enable(player);
        player.frame = 4;
        walkR = player.animations.add('walkR', [5, 6, 7, 8], 7, true);
        walkL = player.animations.add('walkL', [0, 1, 2, 3], 7, true);
        stand = player.animations.add('stand', [4], 1);
        fall = player.animations.add('fall', [9], 1);

        //all the helper classes
        gamePhysics = new Physics(game);
        helper = new Helper(game);
        levelChanger = new LevelChanger(game);
        levelChanger.createLevel();

        //player collides with gears and start pad
        player.body.setCategoryContactCallback(2, helper.gearCallback, this);
        player.body.setCategoryContactCallback(3, helper.startPadContactCallback, this);
        player.body.friction = 1;

        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function(){
        //two enemies operate separately, when they exist in a level
        if (enemy1Present) {
            enemy1.update();
        }
        if (enemy1Present && enemy2Present) {
            enemy2.update();
        }

        var playerAngle = gamePhysics.handlePlayerRotation(player);

        gamePhysics.applyGravityToObjects();

        if(playingNow === true) {       //this function isn't called when the game is between levels or changing states
            helper.checkTeleporterOverlap(teleporter);
        }

        helper.messageLocation(playerAngle);    //the messages and the dashboard move around relative to the player, since the camera can't spin
        helper.moveDashboard(playerAngle);

        game.world.bringToTop(messageGroup); //this makes the messageGroup appear on top of all the other objects on screen
        game.world.bringToTop(dashboardGroup);  //so that enemies/objects can't appear above dashboard

        //Handle keyboard input for the player
        helper.handleKeyboardInput(playerAngle);

        gamePhysics.constrainVelocity(player,150);      //if the player goes too fast, the rotational velocity will make them fly out of gravity fields
    }
};
