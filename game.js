/*
planets-wekazaji
A basic ring physics tutorial to build off

source: https://phaser.io/news/2015/07/simulate-planet-gravity-with-box2d-tutorial
 */


var game;

// groups containing crates and planets
var crateGroup;
var planetGroup;
var cursors;

//for the player & walk animations
var player;
var walkR;
var walkL;
var stand;
var fall;

// a force reducer to let the simulation run smoothly
var forceReducer = 0.01; //was .005

// graphic object where to draw planet gravity area
var gravityGraphics;

window.onload = function(){
    game = new Phaser.Game(900, 800, Phaser.AUTO, "");
    game.state.add("PlayGame",playGame);
    game.state.start("PlayGame");
};

var playGame = function(game){};

playGame.prototype = {
    preload: function () {
        game.load.image("crate", "assets/crate.png");
        game.load.image("planet", "assets/planet.png");
        game.load.image("bigplanet", "assets/bigplanet.png");
        game.load.image('dude', 'assets/dude.png');
        game.load.spritesheet('player',"assets/nebspritesv2.5.png",40,47);
    },
    create: function () {

        // adding groups

        crateGroup = game.add.group();
        planetGroup = game.add.group();

        // adding graphic objects
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        // stage setup
        game.stage.backgroundColor = "#222222";

        // physics initialization
        game.physics.startSystem(Phaser.Physics.BOX2D);

        /* adding a couple of planets. Arguments are:
         * x position, y position, gravity radius, gravity force, graphic asset */
        addPlanet(180, 200, 250, 150, "planet");
        addPlanet(600, 400, 400, 250, "bigplanet");

        // waiting for player input
        // game.input.onDown.add(addCrate, this);
        player = game.add.sprite(650, 100, "player");
        player.frame = 4;
        walkR = player.animations.add('walkR',[5,6,7,8], 15, true);
        walkL = player.animations.add('walkL', [0,1,2,3], 15, true);
        stand = player.animations.add('stand',[4],1);
        fall = player.animations.add('fall',[9],1);

        // player = game.add.sprite(200, 200, 'dude');
        game.physics.box2d.enable(player);
        // player.body.fixedRotation = true;

        cursors = game.input.keyboard.createCursorKeys();
        // cursor = game.input.mouse.capture = true;
    },

    update: function(){

        // looping through all planets
        for (var j = 0; j < planetGroup.total; j++) {
            var p = planetGroup.getChildAt(j);

            // calculating distance between the planet and the crate
            var distance = Phaser.Math.distance(player.x, player.y, p.x, p.y);

            // checking if the distance is less than gravity radius
            if (distance < p.width / 2 + p.gravityRadius / 2) {

                // calculating angle between the planet and the crate
                var angle = Phaser.Math.angleBetween(player.x, player.y, p.x, p.y);

                // add gravity force to the crate in the direction of planet center
                player.body.applyForce(p.gravityForce * Math.cos(angle) * forceReducer,
                                  p.gravityForce * Math.sin(angle) * forceReducer);

                // player.body.setZeroRotation();

                player.body.angle = angle * 180 / Math.PI - 90;

            }
         }

        //Handle keyboard input for the player
        if (cursors.left.isDown) {
            player.body.moveLeft(90);
            player.animations.play('walkL');
        }
        else if (cursors.right.isDown) {
            player.body.moveRight(90);
            player.animations.play('walkR');
        }
        if (cursors.up.isDown) {
            player.body.moveUp(90);
            player.animations.play('stand');
        }
        else if (cursors.down.isDown) {
            player.body.moveDown(90);
            player.animations.play('stand');
        }

        if (cursors.left.justUp || cursors.right.justUp){
            if (player.body.velocity < 200) {           //TODO: can't figure out how to do stand animation when still
                player.animations.play('stand');
            } else {
                player.animations.play('fall');
            }
        }

        /* Mouse input - follow the pointer
         * code source: https://phaser.io/examples/v2/input/follow-mouse
         */

        // //  only move when you click
        // if (game.input.mousePointer.isDown)
        // {
        //     //  400 is the speed it will move towards the mouse
        //     game.physics.box2d.moveToPointer(player, 400);
        //
        //     //  if it's overlapping the mouse, don't move any more
        //     if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
        //     {
        //         player.body.velocity.setTo(0, 0);
        //     }
        // }
        // else
        // {
        //     player.body.velocity = (0, 0);
        // }

    },

    render: function() {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);

    }

};

// function to add a crate
// function addCrate(e){
//     var crateSprite = game.add.sprite(e.x, e.y, "crate");
//     crateGroup.add(crateSprite);
//     game.physics.box2d.enable(crateSprite);
// }

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
}