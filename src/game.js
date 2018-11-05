/*
planets-wekazaji
A basic ring physics tutorial to build off

source: https://phaser.io/news/2015/07/simulate-planet-gravity-with-box2d-tutorial
*/
var playGame = function(game){};

var showDebugInfo = false;
var gearUIScale = 0.6;
var forceReducer = 0.00035;
var playerVel = 40;


// Game Variables
var game;
var gamePhysics;
var helper;
var levelChanger;

var planetGroup;
var objectGroup;
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
var enemy1Present;
var enemy2Present;

var startPadActive;

var teleporter;
var levelGoal;
var playerLastAngle;

var userInterfaceEnabled;

var score;

var transitioning;

var levelCenterX,
    levelCenterY,
    levelBoundaryRadius;

// graphic object where to draw planet gravity area
var gravityGraphics;
var levelBoundary;

var emitter;

var bgm;
var jetpackAudio;
var vortexAudio;
var gearTing;

var currentLevel;
var tutorialShown = false;

//var levelUnlock1 = localStorage.setItem("Level1","1");


var levels = [
    [ //level 0 - collect gears to activate portal
        {objectType: 'planet', x: 0, y: 0, gravRadius: 350, gravForce: 300, sprite: "level0_planet1"},
        {objectType:'teleporter', x:0, y: -215, radians: 0, goal:1},
        {objectType: 'startPad', x: -230,y: -125,radians: -1.1},
        {objectType: 'gear', x: 30, y: 200, sprite:"gear"},
        {objectType: 'player', x: -240, y: -150},
        {objectType: 'levelBoundary', x: 0, y: 0, radius: 1000}
    ], // level 0
    [ //level 1 - crazy gears
        {objectType: 'planet', x: 0, y: 0, gravRadius: 350, gravForce: 200, sprite: "level1_planet1"},
        {objectType: 'teleporter', x: 0, y: -294, radians: 0, goal: 18},
        {objectType: 'startPad', x: -75, y: -300, radians: -0.2},
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
        // {objectType: 'gear', x: 180, y: 10, sprite: "gear"},
        // {objectType: 'gear', x: 190, y: 0, sprite: "gear"},
        // {objectType: 'gear', x: 200, y: -10, sprite: "gear"},
        // {objectType: 'gear', x: 0, y: -200, sprite: "gear"},
        // {objectType: 'gear', x: -10, y: -190, sprite: "gear"},
        // {objectType: 'gear', x: -20, y: -180, sprite: "gear"},
        // {objectType: 'gear', x: -30, y: -170, sprite: "gear"},
        // {objectType: 'gear', x: -40, y: -160, sprite: "gear"},
        // {objectType: 'gear', x: -50, y: -150, sprite: "gear"},
        // {objectType: 'gear', x: -60, y: -140, sprite: "gear"},
        // {objectType: 'gear', x: -70, y: -130, sprite: "gear"},
        // {objectType: 'gear', x: -80, y: -120, sprite: "gear"},
        // {objectType: 'gear', x: -90, y: -110, sprite: "gear"},
        // {objectType: 'gear', x: -100, y: -90, sprite: "gear"},
        // {objectType: 'gear', x: -110, y: -80, sprite: "gear"},
        // {objectType: 'gear', x: -120, y: -70, sprite: "gear"},
        // {objectType: 'gear', x: -130, y: -60, sprite: "gear"},
        // {objectType: 'gear', x: -140, y: -50, sprite: "gear"},
        // {objectType: 'gear', x: -150, y: -40, sprite: "gear"},
        // {objectType: 'gear', x: -160, y: -30, sprite: "gear"},
        // {objectType: 'gear', x: -170, y: -20, sprite: "gear"},
        // {objectType: 'gear', x: -180, y: -10, sprite: "gear"},
        // {objectType: 'gear', x: -190, y: 0, sprite: "gear"},
        // {objectType: 'gear', x: -200, y: -10, sprite: "gear"},
        {objectType: 'player', x: -90, y: -360},
        {objectType: 'levelBoundary', x: 0, y: 0, radius: 1000}
    ], // level 1 - crazy gears
    [//level 2 - jumping between planets
        {objectType: 'planet', x: -280, y: -100, gravRadius: 250, gravForce: 350, sprite: "smallstar"},
        {objectType: 'planet', x: 200, y: 220, gravRadius: 350, gravForce: 350, sprite: "starplanet"},
        {objectType: 'teleporter', x: 150, y: 10, radians: -0.2, goal: 3},
        {objectType: 'startPad', x: -425, y: -50 , radians:1.15 + Math.PI},
        {objectType: 'gear', x: -350, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -220, y: 10, sprite: "gear"},
        {objectType: 'player', x: -430, y: -50},
        {objectType: 'levelBoundary', x: -40, y: 60, radius: 1200}
    ], // level 2 - jumping between planets
    [//level 3 - start in void
        {objectType: 'planet', x: -300, y: -50, gravRadius: 250, gravForce: 250, sprite: "axoplanet"},
        {objectType: 'planet', x: 400, y: 400, gravRadius: 350, gravForce: 350, sprite: "fishplanet"},
        {objectType: 'teleporter', x: 500, y: 210, radians: 0.5, goal: 3},
        {objectType: 'startPad', x: 20, y: -15 , radians: 0},
        {objectType: 'gear', x: -350, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -220, y: 10, sprite: "gear"},
        {objectType: 'player', x: 23, y: -30},
        {objectType: 'levelBoundary', x: 50, y: 175, radius: 1500}
    ], // level 3 - start in void
    [//level 4 - jumping to planets through void
        {objectType: 'planet', x: -440, y: -120, gravRadius: 260, gravForce: 350, sprite: "soccerplanet"},
        {objectType: 'planet', x: 260, y: 250, gravRadius: 270, gravForce: 250, sprite: "tennisplanet"},
        {objectType: 'planet', x: 60, y: -180, gravRadius: 200, gravForce: 350, sprite: "baseballplanet"},
        {objectType: 'teleporter', x: 385, y: 140, radians: 0.9, goal: 2},
        {objectType: 'startPad', x: 60, y: 215, radians: 1.8 + Math.PI },
        {objectType: 'gear', x: 100, y: -50, sprite: "gear"},
        {objectType: 'gear', x: -180, y: -150, sprite: "gear"},
        {objectType: 'player', x: 0, y: 200},
        {objectType: 'levelBoundary', x: -40, y: -10, radius: 1200}
    ], // level 4 - jumping to planets through void
    [ //level 5 - gears in void
        {objectType: 'planet', x: 0, y: 0, gravRadius: 270, gravForce: 350, sprite: "level5_planet1"},
        {objectType: 'planet', x: 900, y: 900, gravRadius: 230, gravForce: 350, sprite: "level5_planet2"},
        {objectType: 'teleporter', x: 786, y: 786, radians: 5.5, goal: 7}, //317, 90
        {objectType: 'startPad', x: 0, y: -160, radians: 6.2 },
        {objectType: 'gear', x: 150, y: 30, sprite: "gear"},
        {objectType: 'gear', x: 350, y: 50, sprite: "gear"},
        {objectType: 'gear', x: 500, y: -200, sprite: "gear"},
        {objectType: 'gear', x: 750, y: -50, sprite: "gear"},
        {objectType: 'gear', x: 900, y:200, sprite: "gear"},
        {objectType: 'gear', x: 1000, y:500, sprite: "gear"},
        {objectType: 'gear', x: 920, y:750, sprite: "gear"},
        {objectType: 'player', x: 0, y: -230},
        {objectType: 'levelBoundary', x: 500, y: 350, radius: 1200}
    ], //level 5 - gears in void
    [ //level 6 - enemy introduction
        {objectType: 'planet', x: -170, y: -400, gravRadius: 220, gravForce: 350, sprite: "rainbowplanet"},
        {objectType: 'planet', x: 200, y: -80, gravRadius: 220, gravForce: 350, sprite: "otherrainbow"},
        {objectType: 'planet', x: 280, y: 350, gravRadius: 200, gravForce: 240, sprite: "smallrainbow"},
        {objectType: 'teleporter', x: 440, y: 350, radians: 1.6, goal: 2}, //317, 90
        {objectType: 'startPad', x: -330, y: -540, radians: -0.8 },
        {objectType: 'gear', x: -180, y: -350, sprite: "gear"},
        {objectType: 'gear', x: 100, y:-50, sprite: "gear"},
        {objectType: 'player', x: -360, y: -570},
        {objectType: 'enemy1' , x:-110, y: -240, enemyVel: 25, sprite: "enemy"},
        {objectType: 'levelBoundary', x: 100, y: -50, radius: 1100}
    ], // level 6 - enemy introduction
    [ //level 7 - enemy hard
        {objectType: 'planet', x: 0, y: 0, gravRadius: 350, gravForce: 350, sprite: "level7_planet1"},
        {objectType: 'teleporter', x: 115, y: 115, radians: 2.4, goal: 2}, //317, 90
        {objectType: 'startPad', x: -70, y: -160, radians: -0.5 },
        {objectType: 'gear', x: -83, y: -83, sprite: "gear"},
        {objectType: 'gear', x: 100, y:-50, sprite: "gear"},
        {objectType: 'player', x: -100, y: -230},
        {objectType: 'enemy1' , x:110, y: -110, enemyVel: 15, sprite: "enemy"},
        {objectType: 'enemy2' , x:-110, y: 110, enemyVel: 15, sprite: "enemy"},
        {objectType: 'levelBoundary', x: 0, y: 0, radius: 750}
    ], // level 7 - small planet with two enemies
    [ //level 8 - fun with overlapping gravity fields
        {objectType: 'planet', x: 200,y: 100, gravRadius: 260, gravForce: 350, sprite: "wafelplanet"},
        {objectType: 'planet', x: 140, y: 610, gravRadius: 190, gravForce: 330, sprite: "donutplanet"},
        {objectType: 'planet', x: 400, y: -380, gravRadius: 200, gravForce: 300, sprite: "orangeplanet"},
        {objectType: 'planet', x: 860, y: -470, gravRadius: 200, gravForce: 300, sprite: "cinnamonplanet"},
        {objectType: 'teleporter', x: 350, y: 250, radians: 2.35, goal: 3},
        {objectType: 'startPad', x: 0, y: 0, radians: -1.1},
        {objectType: 'gear', x: 100, y: 400, sprite: "gear"},
        {objectType: 'gear', x: 390, y: -300, sprite: "gear"},
        {objectType: 'gear', x: 860, y: -480, sprite: "gear"},
        {objectType: 'player', x: -45, y: -25},
        {objectType: 'enemy1', x: 400, y: -20, enemyVel: 25, sprite: "enemy"},
        {objectType: 'levelBoundary', x: 300, y: -100, radius: 1300}
    ], // level 8 - fun with overlapping gravity fields
    [ //level 9 - circular planet chains
        {objectType: 'planet', x: 0, y: 0, gravRadius: 220, gravForce: 250, sprite: "level9_planet1"},
        {objectType: 'planet', x: 220, y: 420, gravRadius: 220, gravForce: 250, sprite: "level9_planet2"},
        {objectType: 'planet', x: -170, y: 750, gravRadius: 220, gravForce: 250, sprite: "level9_planet3"},
        {objectType: 'planet', x: -650, y: 420, gravRadius: 220, gravForce: 250, sprite: "level9_planet4"},
        {objectType: 'planet', x: -730, y: -230, gravRadius: 240, gravForce: 250, sprite: "level9_planet5"},
        {objectType: 'teleporter', x: -640, y: 40, radians: 2.85, goal: 5}, //317, 90
        {objectType: 'startPad', x: -170, y: -80, radians: -1 },
        {objectType: 'gear', x: -480, y: -230, sprite: "gear"},
        {objectType: 'gear', x: -650, y: 420, sprite: "gear"},
        {objectType: 'gear', x: -170, y: 750, sprite: "gear"},
        {objectType: 'gear', x: 220, y: 420, sprite: "gear"},
        {objectType: 'gear', x: 0, y: 100, sprite: "gear"},
        {objectType: 'player', x: -190, y: -110},
        {objectType: 'levelBoundary', x: -400, y: 100, radius: 1300}
    ], //level 9 - circular planet chains
    [ //level 10 - find the hidden gear
        {objectType: 'planet', x: 0, y: 0, gravRadius: 300, gravForce: 300, sprite: "level10_planet1"},
        {objectType: 'planet', x: -20, y: 640, gravRadius: 200, gravForce: 300, sprite: "level10_planet2"},
        {objectType: 'planet', x: 0, y: 1200, gravRadius: 200, gravForce: 300, sprite: "level10_planet3"},
        {objectType: 'planet', x: -540, y: 330, gravRadius: 200, gravForce: 300, sprite: "level10_planet4"},
        {objectType: 'planet', x: 500, y: 390, gravRadius: 200, gravForce: 300, sprite: "level10_planet5"},
        {objectType: 'planet', x: -590, y: -240, gravRadius: 200, gravForce: 300, sprite: "level10_planet6"},
        {objectType: 'planet', x: -150, y: -630, gravRadius: 200, gravForce: 300, sprite: "level10_planet7"},
        {objectType: 'planet', x: 400, y: -510, gravRadius: 200, gravForce: 300, sprite: "level10_planet8"},
        {objectType: 'teleporter', x: 0, y: 267, radians: -3.1, goal: 1},
        {objectType: 'startPad', x: -110, y: -270, radians: -0.3},
        {objectType: 'gear', x: 0, y: 1265, sprite: "gear"},
        {objectType: 'player', x: -120, y: -270},
        {objectType: 'levelBoundary', x: 0, y: 0, radius: 1700}
    ], // level 10 - find hidden gear
    [ //level 11 - two enemies
        {objectType: 'planet', x: 0, y: 0, gravRadius: 230, gravForce: 350, sprite: "roseplanet"},
        {objectType: 'planet', x: 400, y: -230, gravRadius: 230, gravForce: 350, sprite: "hydrangea"},
        {objectType: 'planet', x: 400, y: 230, gravRadius: 230, gravForce: 350, sprite: "lilac"},
        {objectType: 'planet', x: 800, y: 0, gravRadius: 230, gravForce: 350, sprite: "hibiscus"},
        {objectType: 'teleporter', x: 950, y: -70, radians: 1.1, goal: 4},
        {objectType: 'startPad', x: -190, y: 0, radians: -1.5},
        {objectType: 'gear', x: -20, y: 50, sprite: "gear"},
        {objectType: 'gear', x: 390, y: 250, sprite: "gear"},
        {objectType: 'gear', x: 250, y: -250, sprite: "gear"},
        {objectType: 'gear', x: 800, y: -100, sprite: "gear"},
        {objectType: 'player', x: -240, y: 0},
        {objectType: 'enemy1', x: 450, y: 180, enemyVel: 15, sprite: "enemy"},
        {objectType: 'enemy2', x: 450, y: -180, enemyVel: 15, sprite: "enemy"},
        {objectType: 'levelBoundary', x: 400, y: 0, radius: 1100}
    ], // level 11 - two enemies
    [ //level 12 - two enemies circling center planet
        {objectType: 'planet', x: 0, y: 0, gravRadius: 250, gravForce: 350, sprite: "catplanet"},
        {objectType: 'planet', x: 0, y: -471, gravRadius: 200, gravForce: 350, sprite: "blueyarn"},
        {objectType: 'planet', x: 0, y: 470, gravRadius: 200, gravForce: 350, sprite: "redyarn"},
        {objectType: 'planet', x: 470, y: 0, gravRadius: 200, gravForce: 350, sprite: "greenyarn"},
        {objectType: 'planet', x: -470, y: 0, gravRadius: 200, gravForce: 350, sprite: "purpleyarn"},
        {objectType: 'teleporter', x: 100, y: 150, radians: 2.6, goal: 4},
        {objectType: 'startPad', x: -120, y: -180, radians: -0.7},
        {objectType: 'gear', x: 100, y: 300, sprite: "gear"},
        {objectType: 'gear', x: -100, y: -300, sprite: "gear"},
        {objectType: 'gear', x: 390, y: 20, sprite: "gear"},
        {objectType: 'gear', x: -250, y: -100, sprite: "gear"},
        {objectType: 'player', x: -160, y: -230},
        {objectType: 'enemy1', x: -150, y: 0, enemyVel: 25, sprite: "enemy"},
        {objectType: 'enemy2', x: 150, y: 0, enemyVel: 45, sprite: "enemy"},
        {objectType: 'levelBoundary', x: 0, y: 0, radius: 1200}
    ], // level 12 - two enemies circling center planet
    [ //level 13 - maze
        {objectType: 'planet', x: -1000, y: 0, gravRadius: 200, gravForce: 350, sprite: "level13_planet1"}, //base
        {objectType: 'planet', x: -800, y: -370, gravRadius: 200, gravForce: 350, sprite: "level13_planet1"}, //1
        {objectType: 'planet', x: -480, y: -630, gravRadius: 200, gravForce: 350, sprite: "level13_planet2"}, //2
        {objectType: 'planet', x: -1000, y: -730, gravRadius: 200, gravForce: 350, sprite: "level13_planet2"}, //2
        {objectType: 'planet', x: -1400, y: -840, gravRadius: 200, gravForce: 350, sprite: "level13_planet3"}, //3
        {objectType: 'planet', x: -900, y: -1150, gravRadius: 200, gravForce: 350, sprite: "level13_planet3"}, //3
        {objectType: 'planet', x: -200, y: -950, gravRadius: 200, gravForce: 350, sprite: "level13_planet3"}, //3
        {objectType: 'planet', x: -800, y: 370, gravRadius: 200, gravForce: 350, sprite: "level13_planet1"}, //1
        {objectType: 'planet', x: -480, y: 630, gravRadius: 200, gravForce: 350, sprite: "level13_planet2"}, //2
        {objectType: 'planet', x: -1000, y: 730, gravRadius: 200, gravForce: 350, sprite: "level13_planet2"}, //2
        {objectType: 'planet', x: -100, y: 450, gravRadius: 200, gravForce: 350, sprite: "level13_planet3"}, //3
        {objectType: 'planet', x: -300, y: 1000, gravRadius: 200, gravForce: 350, sprite: "level13_planet3"}, //3
        {objectType: 'planet', x: -850, y: 1150, gravRadius: 200, gravForce: 350, sprite: "level13_planet3"}, //3
        {objectType: 'planet', x: -1425, y: 800, gravRadius: 200, gravForce: 350, sprite: "level13_planet3"}, //3
        {objectType: 'teleporter', x: -1400, y: 955, radians: 2.95, goal: 2}, //317, 90
        {objectType: 'startPad', x: -1000, y: -160, radians: 6.2 },
        {objectType: 'gear', x: -1450, y:-700, sprite: "gear"},
        {objectType: 'gear', x: -350, y:-1000, sprite: "gear"},
        {objectType: 'player', x: -1000, y: -230},
        {objectType: 'levelBoundary', x: -800, y: 0, radius: 1900}
    ] //level 13 - maze
];

var initializeVariables = function () {
    enemy1Present = false;
    enemy2Present = false;

    userInterfaceEnabled = true;

    score = 0;

    transitioning = false;

    levelCenterX = 0;
    levelCenterY = 0;
    levelBoundaryRadius = 2000;

    currentLevel = 0;
};

playGame.prototype = {
    init: function(level){
        initializeVariables();

        currentLevel = level;
        
        //level unlock checker
        if (currentLevel === 1) {
        var unlock2 = localStorage.setItem("Level2","true");
        }
        if (currentLevel === 2) {
        var unlock3 = localStorage.setItem("Level3","true");
        }
        if (currentLevel === 3) {
        var unlock4 = localStorage.setItem("Level4","true");
        }
        if (currentLevel === 4) {
        var unlock5 = localStorage.setItem("Level5","true");
        }
        if (currentLevel === 5) {
        var unlock6 = localStorage.setItem("Level6","true");
        }
        if (currentLevel === 6) {
        var unlock7 = localStorage.setItem("Level7","true");
        }
        if (currentLevel === 7) {
        var unlock8 = localStorage.setItem("Level8","true");
        }
        if (currentLevel === 8) {
        var unlock9 = localStorage.setItem("Level9","true");
        }
        
        
    },
    preload: function () {
        game.load.image("level0_planet1", "assets/planets/planet_level0.png");
        game.load.spritesheet("level1_planet1", "assets/planets/gearplanetsheet.png", 354, 354);
        game.load.image("level5_planet1", "assets/planets/level5_planet1.png");
        game.load.image("level5_planet2", "assets/planets/level5_planet2.png");
        game.load.image("level7_planet1", "assets/planets/level7_planet1.png");
        game.load.image("level9_planet1", "assets/planets/level9_planet1.png");
        game.load.image("level9_planet2", "assets/planets/level9_planet2.png");
        game.load.image("level9_planet3", "assets/planets/level9_planet3.png");
        game.load.image("level9_planet4", "assets/planets/level9_planet4.png");
        game.load.image("level9_planet5", "assets/planets/level9_planet5.png");
        game.load.image("level10_planet1", "assets/planets/level10_planet1.png");
        game.load.image("level10_planet2", "assets/planets/level10_planet2.png");
        game.load.image("level10_planet3", "assets/planets/level10_planet3.png");
        game.load.image("level10_planet4", "assets/planets/level10_planet4.png");
        game.load.image("level10_planet5", "assets/planets/level10_planet5.png");
        game.load.image("level10_planet6", "assets/planets/level10_planet6.png");
        game.load.image("level10_planet7", "assets/planets/level10_planet7.png");
        game.load.image("level10_planet8", "assets/planets/level10_planet8.png");
        game.load.image("level13_planet1", "assets/planets/level13_planet1.png");
        game.load.image("level13_planet2", "assets/planets/level13_planet2.png");
        game.load.image("level13_planet3", "assets/planets/level13_planet3.png");
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

        game.load.image("space", "assets/game/seamlessspacebright.png");
        game.load.spritesheet('player',"assets/game/nebspritesv3.0.png",40,47);
        game.load.spritesheet("enemy", "assets/game/enemyblink.png", 41,43);
        game.load.spritesheet('gear', 'assets/game/gearspritessmall.png',38,34);
        game.load.spritesheet('teleporter', 'assets/game/teleporterspritesheet.png', 48, 61);
        game.load.image('startPad','assets/game/startPad.png',50,12);
        game.load.spritesheet('startPadAnimations','assets/game/startPadAnimationSpriteSheet.png',50,17);
        game.load.image("log", "assets/game/shipslog.png");
        game.load.image('blackScreen', "assets/game/blackScreen.png");
        game.load.image("whiteScreen", "assets/game/whiteScreen.png");

        game.load.spritesheet("flames", "assets/game/flameSprites2.png", 20, 20);

        game.load.image("progressBar", "assets/game/progressBar.png");
        game.load.image("gearOutline", "assets/game/gearOutline.png", 300, 300);
        game.load.image("filledInGear", "assets/game/filledGear.png", 300, 300);

        game.load.image("dashboard","assets/game/dashboard.png",300,52);
        game.load.image("mute","assets/buttons/mute.png",52,52);
        game.load.image("unMute", "assets/buttons/unMute.png", 52, 52);
        game.load.spritesheet("pause","assets/buttons/pause.png",52,52);
        game.load.image("restart","assets/buttons/restart.png",52,52);

        game.load.image("newPause", "assets/game/pauseButton.png");
        game.load.image("newPause_hover", "assets/game/pauseButton_hover.png");
        game.load.image("restartButton", "assets/game/restartButton.png");
        game.load.image("restartButton_hover", "assets/game/restartButton_hover.png");
        game.load.image("pausePage", "assets/game/settingPopUp.png");
        game.load.image("closeButton", "assets/mainMenu/closeButton.png");
        game.load.image("closeButton_hover", "assets/mainMenu/closeButton_hover.png");
        game.load.image("muteButton", "assets/game/muteButton.png");
        game.load.image("muteButton_hover", "assets/game/muteButton_hover.png");
        game.load.image("playSoundButton", "assets/game/playSoundButton.png");
        game.load.image("playSoundButton_hover", "assets/game/playSoundButton_hover.png");
        game.load.image("resumeButton", "assets/game/resumeButton.png");
        game.load.image("resumeButton_hover", "assets/game/resumeButton_hover.png");
        game.load.image("toMainButton", "assets/game/toMainButton.png");
        game.load.image("toMainButton_hover", "assets/game/toMainButton_hover.png");
        game.load.spritesheet("controlTutorial_leftright", "assets/game/controlTutorial_sheet.png", 252, 165);

        game.load.audio('jetpack', "assets/music/jetpackAudio.mp3");
        game.load.audio('vortex', "assets/music/VortexSoundEffect.mp3");
        game.load.audio('bgm', "assets/music/Visager_-_01_-_The_Great_Tree_Loop.mp3");
        game.load.audio('ting', "assets/music/Ting-Popup_Pixels-349896185.mp3");
        game.load.audio('teleporterOpen', "assets/music/zapsplat_magical_portal_open_001_12505.mp3");
        game.load.audio('teleportToPad',"assets/music/zapsplat_magical_telekinesis_blast_002_12511.mp3");
    },
    create: function () {
        game.time.desiredFps = 80;

        game.world.setBounds(-350, -320, 700, 700);

        //tiled background image to cover a wide enough area
        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 6; j++) {
                game.add.tileSprite(-3048 + 1024*i, -3048 + 1024*j, 1024, 1024, 'space');
            }
        }

        enemyGroup = game.add.group();
        planetGroup = game.add.group();
        objectGroup = game.add.group();
        userInterface = game.add.group();

        // adding gravitiy line
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        // adding level limit line
        levelBoundary = game.add.graphics(0, 0);
        levelBoundary.lineStyle(12, 0xADD8E6, 0.35);

        game.stage.backgroundColor = "#222222";

        game.physics.startSystem(Phaser.Physics.BOX2D);

        bgm = game.add.audio('bgm');
        bgm.loop = true;
        bgm.volume = 0.6;
        bgm.play();

        jetpackAudio = game.add.audio("jetpack", 0, true);
        jetpackAudio.play();

        vortexAudio = game.add.audio("vortex", 2);

        gearTing = game.add.audio('ting', 0.75);

        emitter = game.add.emitter(0, 0, 2000);
        emitter.makeParticles('flames', [0, 1, 3, 4]);
        emitter.minParticleSpeed.setTo(-20, -20);
        emitter.maxParticleSpeed.setTo(20, 20);
        emitter.gravity = 0;
        emitter.setAlpha(1, 0, 700);
        emitter.setScale(0.5, 2, 0.5, 2, 700);

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
        
        game.world.bringToTop(userInterface);  //so that enemies/objects can't appear above UI

        blackScreen = game.add.sprite(0, 0, "blackScreen");
        blackScreen.scale.setTo(2, 2);
        blackScreen.anchor.set(0.5, 0.5);
        game.add.tween(blackScreen).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
    },

    update: function(){
        if (!transitioning) {
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
            
            //the user interface moves around relative to the player, since the camera can't spin
            helper.moveUI(playerAngle);

            //Handle keyboard input for the player
            helper.handleKeyboardInput(playerAngle);

            //if the player goes too fast, the rotational velocity will make them fly out of gravity fields
            gamePhysics.constrainVelocity(player,150);

            if (helper.playerDistanceFromLevelCenter() >= levelBoundaryRadius) {
                let playerVector = Math.sqrt(
                    Math.pow(player.body.velocity.x, 2) + 
                    Math.pow(player.body.velocity.y, 2)
                );
                let deltaX = player.body.x - levelCenterX,
                    deltaY = player.body.y - levelCenterY,
                    angleFromCenter = Math.atan2(deltaY, deltaX);
                
                let xImpulse = -0.9 * playerVector * Math.cos(angleFromCenter);
                let yImpulse = -0.9 * playerVector * Math.sin(angleFromCenter);

                player.body.velocity.x = xImpulse;
                player.body.velocity.y = yImpulse;
            }
        }
    },
    render: function () {
        if (showDebugInfo) {
            game.debug.text("FPS: " + game.time.fps, 2, 14, "#00ff00");
            game.debug.text("Player X: " + player.x, 2, 28, "#00ff00");
            game.debug.text("Player Y: " + player.y, 2, 42, "#00ff00");
            game.debug.cameraInfo(this.game.camera, 2, 56, "#00ff00");
        }
    }
};


