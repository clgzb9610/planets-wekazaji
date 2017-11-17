/*
planets-wekazaji
A basic ring physics tutorial to build off

source: https://phaser.io/news/2015/07/simulate-planet-gravity-with-box2d-tutorial
 */
var playGame = function(game){};

var game;

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

var teleporter;
var levelGoal;
var lastAngle;

var scoreCaption;
var score = 0;

// a force reducer to let the simulation run smoothly
var forceReducer = 0.0007; //was .00175

var playerVel = 25;
var enemyVel = 45;

var enemyCounterClockwise = -1;

var planetContact = false;

// graphic object where to draw planet gravity area
var gravityGraphics;

var currentLevel = 0;
/* x position, y position, gravity radius, gravity force, graphic asset */
var level = [
    [//level 0
        {objectType: 'planet', x: -280, y: -100, gravRadius: 250, gravForce: 150, sprite: "smallplanet"},
        {objectType: 'planet', x: 130, y: 150, gravRadius: 400, gravForce: 250, sprite: "bigplanet"},
        {objectType: 'teleporter', x: 130, y: -3, goal: 3},
        {objectType: 'gear', x: -350, y: -200, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'gear', x: -220, y: 10, sprite: "gear"}

    ],
    [//level 1
        {objectType: 'planet', x: -280, y: -100, gravRadius: 250, gravForce: 150, sprite: "bigplanet"},
        {objectType: 'planet', x: 130, y: 150, gravRadius: 120, gravForce: 130, sprite: "smallplanet"},
        {objectType: 'planet', x: 60, y: -180, gravRadius: 200, gravForce: 500, sprite: "smallplanet"},
        {objectType: 'teleporter', x:130, y: 30},//temporary change in coordinate, was y=31
        {objectType: 'gear', x: -300, y: -50, sprite: "gear"},
        {objectType: 'gear', x: -200, y: -150, sprite: "gear"},
        {objectType: 'player', x: 25, y: 205}
    ],
    [//level 2
        {objectType:"level3"},
        {objectType:"level3"},
        {objectType:"level3"}
    ]
];

playGame.prototype = {
    init:function(){
      this.currentLevel = currentLevel;
    },
    preload: function () {
        game.load.image("enemy", "assets/redcrate.png");
        game.load.image("smallplanet", "assets/planet.png");
        game.load.image("bigplanet", "assets/bigplanet.png");
        game.load.image("space", "assets/seamlessspacebright.png");
        game.load.spritesheet('player',"assets/nebspritesv2.5.png",40,47);
        game.load.spritesheet('gear', 'assets/gearspritessmall.png',38,34);
        game.load.spritesheet('teleporter', 'assets/teleporterspritesheet.png', 48, 61);
    },
    create: function () {

        // new boundaries are centered on 0,0 so the world can rotate
        game.world.setBounds(-400, -300, 400, 300);

        game.time.desiredFps = 20;
        fuelTimer = game.time.now;

        background=game.add.tileSprite(-1000, -1000, 1024, 1024, 'space');
        game.add.tileSprite(24, 24, 1024, 1024, 'space');
        game.add.tileSprite(-1000, 24, 1024, 1024, 'space');
        game.add.tileSprite(24, -1000, 1024, 1024, 'space');


        // adding groups
        // enemyGroup = game.add.group();
        planetGroup = game.add.group();
        objectGroup = game.add.group();

        // adding graphic objects
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        // stage setup
        game.stage.backgroundColor = "#222222";

        // physics initialization
        game.physics.startSystem(Phaser.Physics.BOX2D);

        /* adding a couple of planets. Arguments are:
         * x position, y position, gravity radius, gravity force, graphic asset */
        // addPlanet(-280, -100, 250, 150, "smallplanet");
        // addPlanet(130, 150, 400, 250, "bigplanet");
        drawLevel();

        // //add teleporter
        // teleporter = game.add.sprite(130, -3, "teleporter", 6);
        // game.physics.box2d.enable(teleporter);
        // teleporter.animations.add('swirl', [0,1,2,3,4,5], 15, true);
        // teleporter.body.setRectangle(40, 47);
        // teleporter.body.static = true;
        // teleporter.body.setCollisionCategory(1);
        // teleporter.body.setCollisionMask(0);


        // waiting for player input
        // game.input.onDown.add(addCrate, this);
        player = game.add.sprite(100, 120, "player");
        game.physics.box2d.enable(player);
        player.frame = 4;
        walkR = player.animations.add('walkR',[5,6,7,8], 7, true);
        walkL = player.animations.add('walkL', [0,1,2,3], 7, true);
        stand = player.animations.add('stand',[4],1);
        fall = player.animations.add('fall',[9],1);

        //add enemy - crate
        enemy = game.add.sprite(100, 120, 'enemy');
        game.physics.box2d.enable(enemy);
        enemy.body.static = false;
        // enemy.body.setCollisionCategory(3);
        enemy.body.setRectangle(12, 50);
        objectGroup.add(enemy);

        // player.body.setCategoryContactCallback(3, enemyContactCallback, this);
        player.body.setBodyContactCallback(enemy, enemyContactCallback, this);

        player.body.setCategoryContactCallback(2, gearCallback, this);

        player.body.setCategoryContactCallback(1,planetContactCallback,this);

        // get keyboard input
        cursors = game.input.keyboard.createCursorKeys();
        //camera follows the player
        game.camera.follow(player);
                                            //
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
        scoreCaption = game.add.text(300, 300, 'Score: ' + score, { fill: '#ffaaaa', font: '14pt Arial'});
        scoreCaption.fixedToCamera = true;
        scoreCaption.cameraOffset.setTo(300, 300);
    },
    update: function(){
        // console.log('planet contact', planetContact);

        angle = planetGrounder(player);
        angle2 = planetGrounder(enemy);

        objGrav();
        checkTeleporterOverlap(teleporter);

        game.world.pivot.x = player.x;          //these two rotate the world around the player
        game.world.pivot.y = player.y;
        game.world.rotation = -angle + (Math.PI/2);     //rotates the world so the controls aren't global


        // Keep the enemy moving

        if (enemyCounterClockwise == -1) {
            enemy.body.velocity.x += enemyVel * Math.cos(angle2 - (Math.PI / 2)) ;
            enemy.body.velocity.y += enemyVel * Math.sin(angle2 - (Math.PI / 2)) ;
            // player.x += 20;

        } else {
            enemy.body.velocity.x += enemyVel * Math.cos(angle2 + (Math.PI / 2)) ;
            enemy.body.velocity.y += enemyVel * Math.sin(angle2 + (Math.PI / 2)) ;

        }

        //Handle keyboard input for the player
        if (cursors.left.isDown ) {
            // player.body.moveLeft(90);
            player.body.velocity.x += playerVel * Math.cos(angle + (Math.PI/2));
            player.body.velocity.y += playerVel * Math.sin(angle + (Math.PI/2));
            player.animations.play('walkL');
        }
        else if (cursors.right.isDown ) {
            // player.body.moveRight(90);
            player.body.velocity.x += playerVel * Math.cos(angle - (Math.PI / 2)) ;
            player.body.velocity.y += playerVel * Math.sin(angle - (Math.PI / 2)) ;
            player.animations.play('walkR');
        }
        if (cursors.up.isDown) {
            player.body.velocity.x += -playerVel * Math.cos(angle);
            player.body.velocity.y += -playerVel * Math.sin(angle);
            player.animations.play('fall');

        }
        if (cursors.down.isDown) {
            player.body.velocity.x += playerVel * Math.cos(angle);
            player.body.velocity.y += playerVel * Math.sin(angle);
            player.animations.play('stand');

        }

        if (cursors.left.justUp || cursors.right.justUp){
            player.animations.play('stand');
        }
        constrainVelocity(player,150);
        constrainVelocity(enemy,300);

    },
    render: function() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }
};

/*=============================================================================
    HELPER FUNCTIONS
=============================================================================*/
// function to add a crate
// function addCrate(e){
//     var crateSprite = game.add.sprite(e.x, e.y, "crate");
//     crateGroup.add(crateSprite);
//     game.physics.box2d.enable(crateSprite);
// }

function drawLevel(){
    for (var i = 0; i < level[currentLevel].length; i++) {
        var addition = level[currentLevel][i];
        if (addition.objectType === 'planet') {
            addPlanet(addition.x, addition.y,
                addition.gravRadius, addition.gravForce, addition.sprite);
        }
        if(addition.objectType === 'teleporter') {
            addTeleporter(addition.x,addition.y);
        }
        if(addition.objectType === 'gear'){
            addGear(addition.x, addition.y, addition.sprite);
        }
        if(addition.objectType === 'player'){
            movePlayer(addition.x,addition.y);
        }

    }
}

// function drawHealthBar(x,y) {
//     var bmd = this.game.add.bitmapData(250, 40);
//     bmd.ctx.fillStyle = '#FEFF03';
//     bmd.ctx.beginPath();
//     bmd.ctx.rect(x, y, 250, 40);
//     bmd.ctx.fill();
//     // bmd.update();
//
//     // this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
//     // this.barSprite.anchor.y = 0.5;
// }

/*
This is the code that calculates gravity fields for the player, if they are in the radius.
I changed it so that this function returns -361, which is impossible in radian angles,
if the player is not in any gravity radius.
 */
function gravityToPlanets(gravObject){
    var p;
    var distance;
    var radius;
    var angle = -361;
    // looping through all planets
    for (var j = 0; j < planetGroup.total; j++) {
        p = planetGroup.getChildAt(j);
        radius = p.width / 2 + p.gravityRadius / 2;

        // calculating distance between the planet and the crate
        distance = Phaser.Math.distance(gravObject.x, gravObject.y, p.x, p.y);

        // checking if the distance is less than gravity radius
        if (distance < radius) {

            // calculating angle between the planet and the crate
            angle = Phaser.Math.angleBetween(gravObject.x, gravObject.y, p.x, p.y);
            // add gravity force to the crate in the direction of planet center

            // console.log(distance-p.width/2, radius-p.width);
            gravObject.body.applyForce(p.gravityForce * Math.cos(angle) * forceReducer * (distance-p.width/2),
                p.gravityForce * Math.sin(angle) * forceReducer* (distance-p.width/2));
        }
    }
    return angle;
}

function planetGrounder(sprite) {
    var angle = gravityToPlanets(sprite);
    if (angle > -361) { // angle == -361 if the player is not in any gravity field.
        //orients players feet toward the ground. Uses var angle as degrees offset by -90
        sprite.body.angle = angle * 180 / Math.PI - 90;
        lastAngle = angle;
    } else {
        angle = lastAngle;
    }
    return angle;
}

function objGrav(){
    for (var i = 0; i < objectGroup.total; i++){
        var o = objectGroup.getChildAt(i);
        gravityToPlanets(o);
    }
}

/*
 This function implements a max velocity on a sprite, so it cannot accelerate too far and fly out of a
 gravity field. Code from : http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/
 */
function constrainVelocity(sprite, maxVelocity) {
    var body = sprite.body;
    var angle, currVelocitySqr, vx, vy;
    vx = body.velocity.x;
    vy = body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;
    if (currVelocitySqr > (maxVelocity * maxVelocity)) {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        body.velocity.x = vx;
        body.velocity.y = vy;
        // console.log('limited speed to: '+ maxVelocity);
    }
}

// function to add a planet
function addPlanet(posX, posY, gravityRadius, gravityForce, asset){
    var planet = game.add.sprite(posX, posY, asset);
    planet.gravityRadius = gravityRadius;
    planet.gravityForce = gravityForce;
    planetGroup.add(planet);
    game.physics.box2d.enable(planet);
    planet.body.static = true;

    // look how I create a circular body
    planet.body.setCircle(planet.width / 2);
    gravityGraphics.drawCircle(planet.x, planet.y, planet.width+planet.gravityRadius);
    planet.body.setCollisionCategory(1);
}

function addTeleporter(x, y, goal) {
    teleporter = game.add.sprite(x, y, "teleporter", 6);
    game.physics.box2d.enable(teleporter);
    teleporter.animations.add('swirl', [0, 1, 2, 3, 4, 5], 15, true);
    teleporter.body.setRectangle(40, 47);
    teleporter.body.static = true;
    teleporter.body.setCollisionMask(0);
    levelGoal = goal;
}

//rebounds the player sprite back after enemy collision
function enemyContactCallback(body1, body2, fixture1, fixture2, begin){
    if (!begin){
        return;
    }

    if (enemyCounterClockwise == -1) {
        enemyCounterClockwise = 0;
        // body2.posx = body2.posx - 10;
    } else {
        enemyCounterClockwise = -1;
        // body2.posx = body2.posx - 10;
    }
    body2.velocity.x = 0;
    body2.velocity.y = 0;
    enemyVel += 5;

    score += 1;
    //just to test when I can get the function to actually call itself!
}

// kills the gear when touched
function gearCallback(body1,body2, fixture1, fixture2, begin) {
    //body1, body2, fixture1, fixture2, begin
    // body1 is the player because it's the body that owns the callback
    // body2 is the body it impacted with, in this case the gear
    // fixture1 is the fixture of body1 that was touched
    // fixture2 is the fixture of body2 that was touched

    // This callback is also called for EndContact events, which we are not interested in.
    if (!begin)
    {
        return;
    }
    score += 1;
    scoreCaption.text = 'Score: ' + score;
    if (score>=1){
        teleporter.animations.play('swirl');
    }
    body2.sprite.destroy();
}

function planetContactCallback(body1, body2, fixture1, fixture2, begin){
    // console.log("planet touch");
    if (!begin){
        return;
    }
    planetContact =  true;
}

function addGear(x, y, sprite){
    var gear = game.add.sprite(x, y, sprite);
    objectGroup.add(gear);
    game.physics.box2d.enable(gear);
    gear.body.setCollisionCategory(2);
    gear.body.static = false;
    gear.animations.add(0,1,2,3);
}

function movePlayer(x, y){
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.body.x = x;
    player.body.y = y;
}

// function addRandomGears(numGears, spriteImage){
//     for (var i = 0; i < numGears; i++) {
//         var gear = game.add.sprite(game.world.randomX, game.world.randomY, spriteImage);
//         objectGroup.add(gear);
//         game.physics.box2d.enable(gear);
//         gear.body.setCollisionCategory(2);
//         // gear.body.sensor = true;
//         gear.body.static = false;
//         gear.animations.add(0,1,2,3);
//     }
// }

function checkTeleporterOverlap(teleporter){
    var playerBounds = player.getBounds();
    var teleporterBounds = teleporter.getBounds();

    if (Phaser.Rectangle.intersects(playerBounds,teleporterBounds) && score >= 1){
        teleporter.destroy();
        console.log('contact with teleporter');
        currentLevel++;
        console.log('currentLevel: ', currentLevel);
        planetGroup.destroy();
        planetGroup = game.add.group();

        gravityGraphics.destroy();
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        console.log('destroy!');
        score = 0;
        drawLevel()
        // game.state.start("PlayGame", true, false, this.currentLevel);
    }
}

// Consistently checks if the players health goes to zero, and if so resets the level.
// function resetLevel(health) {
    // TBD
// }