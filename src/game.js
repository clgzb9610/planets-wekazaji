/*
planets-wekazaji
A basic ring physics tutorial to build off

source: https://phaser.io/news/2015/07/simulate-planet-gravity-with-box2d-tutorial
*/
var playGame = function(game){};

var game;
var helper;

// groups containing crates and planets
// var crateGroup;
var planetGroup;
var cursors;

//for the player & walk animations
var player;
var walkR;
var walkL;
var stand;
var fall;

var enemy;
var enemyPresent = false;

var startPadActive;

var teleporter;
var levelGoal;
var playerLastAngle;
var enemyLastAngle;

var score = 0;
var lastCaption = "";

// a force reducer to let the simulation run smoothly
var forceReducer = 0.0007; //was .00175

var playerVel = 25;
var enemyVel = 25;
var maxEnemyVel = 200;

var enemyCounterClockwise = -1;

//var planetContact = false;

// graphic object where to draw planet gravity area
var gravityGraphics;

var bgm;

var currentLevel=5;
/* x position, y position, gravity radius, gravity force, graphic asset */
var level = [
    [ //level 0 - collect gears to activate portal
        {objectType: 'planet', x: 0, y: 0, gravRadius: 350, gravForce: 300, sprite: "bigplanet"},
        {objectType:'teleporter', x:0, y: -155, radians: 0, goal:1},
        {objectType: 'startPad', x: -150,y: -40,radians: 0.2-Math.PI/2},
        {objectType: 'gear', x: -50, y: 200, sprite:"gear"},
        {objectType: 'player', x: -155, y: -45},
        {objectType: 'hint', text: "You're on a journey!\nUse arrow keys to move."}
    ],
    [//level 1 - jumping between planets
        {objectType: 'planet', x: -280, y: -100, gravRadius: 250, gravForce: 250, sprite: "smallstar"},
        {objectType: 'planet', x: 130, y: 150, gravRadius: 400, gravForce: 250, sprite: "starplanet"},
        {objectType: 'teleporter', x: 130, y: -3, radians: 0, goal: 3},
        {objectType: 'startPad', x: -425, y: -50 , radians:1.15 + Math.PI},
        {objectType: 'gear', x: -350, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -220, y: 10, sprite: "gear"},
        {objectType: 'player', x: -430, y: -50},
        {objectType: 'hint', text: "The portal's so far!\nMaybe you can jump?"}

    ],
    [//level 2 - start in void
        {objectType: 'planet', x: -300, y: -50, gravRadius: 250, gravForce: 150, sprite: "axoplanet"},
        {objectType: 'planet', x: 370, y: 350, gravRadius: 400, gravForce: 250, sprite: "fishplanet"},
        {objectType: 'teleporter', x: 395, y: 202, radians: 0.2, goal: 3},
        {objectType: 'startPad', x: 20, y: -15 , radians: 0},
        {objectType: 'gear', x: -350, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -220, y: 10, sprite: "gear"},
        {objectType: 'player', x: 23, y: -30},
        {objectType: 'hint', text: "Whoa!\nYou're not on a planet!"}
    ],
    [//level 3 - jumping to planets through void
        {objectType: 'planet', x: -280, y: -100, gravRadius: 230, gravForce: 170, sprite: "soccerplanet"},
        {objectType: 'planet', x: 160, y: 150, gravRadius: 130, gravForce: 140, sprite: "tennisplanet"},
        {objectType: 'planet', x: 60, y: -180, gravRadius: 200, gravForce: 470, sprite: "baseballplanet"},
        {objectType: 'teleporter', x: 278, y: 140, radians: 1.485, goal: 2},
        {objectType: 'startPad', x: 50, y: 180, radians: 1.4 + Math.PI },
        {objectType: 'gear', x: 100, y: -50, sprite: "gear"},
        {objectType: 'gear', x: -180, y: -150, sprite: "gear"},
        {objectType: 'player', x: 30, y: 185},
        {objectType: 'hint', text: "The gravity on the\nmidplanet is too strong to\nescape without an\noverlapping gravity field."}
    ],
    [ //level 4 - enemy introduction
        {objectType: 'planet', x: 200, y: 100, gravRadius: 130, gravForce: 240, sprite: "smallrainbow"},
        {objectType: 'planet', x: 150, y: -160, gravRadius: 200, gravForce: 370, sprite: "otherrainbow"},
        {objectType: 'planet', x: -170, y: -400, gravRadius: 180, gravForce: 400, sprite: "rainbowplanet"},
        {objectType: 'teleporter', x: 318, y: 90, radians: 1.5, goal: 2}, //317, 90
        {objectType: 'startPad', x: -270, y: -490, radians: -0.8 },
        {objectType: 'gear', x: -180, y: -350, sprite: "gear"},
        {objectType: 'gear', x: 100, y:-50, sprite: "gear"},
        {objectType: 'player', x: -275, y: -495},
        {objectType: 'enemy' , x:-110, y: -240, sprite: "enemy"},
        {objectType: 'hint', text: "Whoa! There's an enemy\nguarding this planet!"}
    ],
    [ //level 5 - fun with overlapping gravity fields
        {objectType: 'planet', x: 200,y: 100, gravRadius: 260, gravForce: 390, sprite: "bigplanet"},
        {objectType: 'planet', x: 140, y: 360, gravRadius: 120, gravForce: 300, sprite: "smallplanet"},
        {objectType: 'planet', x: 370, y: -250, gravRadius: 150, gravForce: 270, sprite: "mediumplanet"},
        {objectType: 'planet', x: 590, y: -380, gravRadius: 160, gravForce: 270, sprite: "smallplanet"},
        {objectType: 'teleporter', x: 349, y: 140, radians: 1.82, goal: 3},
        {objectType: 'startPad', x: 30, y: 17, radians: -1.1},
        {objectType: 'gear', x: 5, y: 400, sprite: "gear"},
        {objectType: 'gear', x: 390, y: -300, sprite: "gear"},
        {objectType: 'gear', x: 600, y: -400, sprite: "gear"},
        {objectType: 'player', x: 0, y: 10},
        {objectType: 'enemy', x: 400, y: -20, sprite: "enemy"},
        {objectType: 'hint', text: "Where are those gears?"}
    ]
];

playGame.prototype = {
    init:function(currentLevel){
        this.currentLevel = currentLevel;
    },
    preload: function () {
        game.load.image("enemy", "assets/game/redcrate.png");
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
        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.spritesheet('player',"assets/game/nebspritesv2.5.png",40,47);
        game.load.spritesheet('gear', 'assets/game/gearspritessmall.png',38,34);
        game.load.spritesheet('teleporter', 'assets/game/teleporterspritesheet.png', 48, 61);
        game.load.image('startPad','assets/game/startPad.png',50,12);
        game.load.spritesheet('startPadAnimations','assets/game/startPadAnimationSpriteSheet.png',50,17);
        game.load.image("log", "assets/game/shipslog.png");
        game.load.image('blackScreen', "assets/game/blackScreen.png");

        game.load.image("dashboard","assets/game/dashboard.png",300,52);
        game.load.spritesheet("mute","assets/buttons/mute.png",52,52);
        game.load.spritesheet("pause","assets/buttons/pause.png",52,52);
        game.load.image("restart","assets/buttons/restart.png",52,52);

        game.load.audio('bgm', "assets/music/Visager_-_01_-_The_Great_Tree_Loop.mp3");
        game.load.audio('ting', "assets/music/Ting-Popup_Pixels-349896185.mp3");
        game.load.audio('teleporterOpen', "assets/music/zapsplat_magical_portal_open_001_12505.mp3");
        game.load.audio('teleportToPad',"assets/music/zapsplat_magical_telekinesis_blast_002_12511.mp3");
    },
    create: function () {

        // new boundaries are centered on 0,0 so the world can rotate
        game.world.setBounds(-320, -300, 320, 300);

        game.time.desiredFps = 25;

        background=game.add.tileSprite(-1000, -1000, 1024, 1024, 'space');
        game.add.tileSprite(24, 24, 1024, 1024, 'space');
        game.add.tileSprite(-1000, 24, 1024, 1024, 'space');
        game.add.tileSprite(24, -1000, 1024, 1024, 'space');

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

        // waiting for player input
        // game.input.onDown.add(addCrate, this);
        player = game.add.sprite(-155, -45, "player");
        game.physics.box2d.enable(player);
        player.frame = 4;
        walkR = player.animations.add('walkR',[5,6,7,8], 7, true);
        walkL = player.animations.add('walkL', [0,1,2,3], 7, true);
        stand = player.animations.add('stand',[4],1);
        fall = player.animations.add('fall',[9],1);


        // //add enemy - crate
        // enemy = game.add.sprite(-350, 50, "enemy");
        // game.physics.box2d.enable(enemy);
        // enemy.body.static = false;
        // enemy.body.setRectangle(12, 50);
        // enemy.body.setCollisionMask(1);
        // enemyGroup.add(enemy);

        helper = new Helper(game);
        helper.createLevel();

        player.body.setCategoryContactCallback(2, helper.gearCallback, this);
        player.body.setCategoryContactCallback(3,helper.startPadContactCallback,this);

        // text, seconds until it fades
        // helper.addMessage("Hi! There!", 1);
        // game.input.onDown.add(updateMessage, this);
        // addMessage("Arrow keys to move \n Collect gears to fix \n your teleporter", 3);

        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player);



        // // add healthbar
        // // bar = game.add.sprite.rect(350,250,50,10);
        // // { fill: '#ffaaaa', font: '14pt Arial'})
        // // bad.body.setRectangle(50,10);
        // // bar.body.static = true;
        //
        // var maxHealthBar;
        // var healthBar;
        // var maxWidth = 50 // example;
        // var maxHeight = 10 // example;
        // var width = 25 // example;
        // var height = 5 // example;
        // var bmd = game.add.bitmapData(width, height);
        // var bmd2 = game.add.bitmapData(width, height);
        //
        // bmd.ctx.beginPath();
        // bmd.ctx.rect(0, 0, maxWidth, maxHeight);
        // bmd.ctx.fillStyle = '#ffff00';
        // bmd.ctx.fill();
        // maxHealthBar = game.add.sprite(game.world.centerX, game.world.centerY, bmd);
        // maxHealthBar.anchor.setTo(0.5, 0.5);
        //
        // bmd2.ctx.beginPath();
        // bmd2.ctx.rect(0, 0, width, height);
        // bmd2.ctx.fillStyle = '#ffffff';
        // bmd2.ctx.fill();
        // healthBar = game.add.sprite(game.world.centerX, game.world.centerY, bmd2);
        // healthBar.anchor.setTo(0.5, 0.5);
        //add score to the screen
        //scoreCaption = game.add.text(300, 300, 'Score: ' + score, { fill: '#ffaaaa', font: '14pt Arial'});
        //scoreCaption.fixedToCamera = true;
        //scoreCaption.cameraOffset.setTo(300, 300);
    },

    update: function(){

        if (enemyPresent) {
            var enemyAngle = helper.handleEnemyRotation(enemy);

            // Keep the enemy moving
            if (enemyCounterClockwise === -1) {
                enemy.body.velocity.x += enemyVel * Math.cos(enemyAngle - (Math.PI / 2)) ;
                enemy.body.velocity.y += enemyVel * Math.sin(enemyAngle - (Math.PI / 2)) ;

            } else {
                enemy.body.velocity.x += enemyVel * Math.cos(enemyAngle + (Math.PI / 2)) ;
                enemy.body.velocity.y += enemyVel * Math.sin(enemyAngle + (Math.PI / 2)) ;
            }

            //    console.log("enemy x: " + enemy.body.x);
            //    console.log("enemy y: " + enemy.body.y);

            helper.constrainVelocity(enemy,maxEnemyVel);
        }

        var playerAngle = helper.handlePlayerRotation(player);

        helper.applyGravityToObjects();
        helper.checkTeleporterOverlap(teleporter);

        helper.messageLocation(playerAngle);
        helper.moveDashboard(playerAngle);


        //Handle keyboard input for the player
        helper.handleKeyboardInput(playerAngle);

        helper.constrainVelocity(player,150);
    },
    render: function() {
    //     game.debug.body(player);
    //     game.debug.body(teleporter);
        // game.debug.cameraInfo(game.camera, 32, 32);
        // game.debug.spriteCoords(player, 32, 500);
    }
};
