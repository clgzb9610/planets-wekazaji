var Helper = function(game){

    var messageBack;
    var messageCaption;
    var blackScreen;

    /*=============================================================================
       HELPER FUNCTIONS
    =============================================================================*/
// function to add a crate
// function addCrate(e){
//     var crateSprite = game.add.sprite(e.x, e.y, "crate");
//     crateGroup.add(crateSprite);
//     game.physics.box2d.enable(crateSprite);
// }

    this.createLevel= function(){
        if(!level[currentLevel]) {
            // jin - it might be better to check for this in the destroy method before calling createLevel.
            // i think trying to access level[x] out of bounds could be what's crashing it?
            bgm.pause();
            console.log("bgm paused");
            game.physics.clear();
            console.log("destroyed the physics");
            game.state.start("Ending", true, false, 0);
            return;
        }
        for (var i = 0; i < level[currentLevel].length; i++) {
            var addition = level[currentLevel][i];
            if (addition.objectType === 'planet') {
                addPlanet(addition.x, addition.y,
                    addition.gravRadius, addition.gravForce, addition.sprite);
            }
            if(addition.objectType === 'teleporter') {
                addTeleporter(addition.x,addition.y, addition.radians, addition.goal);
            }
            if(addition.objectType === 'startPad') {
                addStartPad(addition.x, addition.y, addition.radians);
            }
            if(addition.objectType === 'gear'){
                addGear(addition.x, addition.y, addition.sprite);
            }
            if(addition.objectType === 'enemy'){
                addEnemy(addition.x, addition.y,"enemy");
            }
            if(addition.objectType === 'player'){
                movePlayer(addition.x,addition.y);
            }
            if(addition.objectType === 'hint'){
                helper.addMessage(addition.text,3);
            }
        }
        addDashboard();
    };

    this.handleEnemyRotation = function(sprite) {
        var angle = enemyGravityToPlanets(sprite);
        if (angle > -361) { // angle == -361 if the player is not in any gravity field.
            // orients players feet toward the ground. Uses var angle as degrees offset by -90
            sprite.body.angle = angle * 180 / Math.PI - 90;
            enemyLastAngle = angle;
        } else {
            angle = enemyLastAngle;
        }
        return angle;
    };

    /* calculates angle between the player and the planet it is gravitationally attracted to.
    * Orients the player's feet to the ground & handles all the world rotation.
    */
    this.handlePlayerRotation = function(player){

        var angleToPlanet = gravityToPlanets(player);
        var playerAngle;

        if (playerLastAngle === undefined){
            playerAngle = angleToPlanet;
            playerLastAngle = playerAngle;
        }
        if (angleToPlanet > -361){ // angle == -361 if the player is not in any gravity field.
            //orients players feet toward the ground. Uses var angle as degrees offset by -90
            var playerRotationToGravity = radiansDelta(playerLastAngle, angleToPlanet);
            var maxPlayerRotationSpeed = 0.15;

            if (Math.abs(playerRotationToGravity) <= maxPlayerRotationSpeed){
                playerAngle = angleToPlanet;
            } else if ( playerRotationToGravity > Math.PI){
                playerAngle = playerLastAngle + maxPlayerRotationSpeed;
            } else {
                playerAngle = playerLastAngle - maxPlayerRotationSpeed;
            }

            player.body.angle = angleToPlanet * 180 / Math.PI - 90;
            playerLastAngle = playerAngle;
        } else{
            playerAngle = playerLastAngle;
        }

        game.world.pivot.x = player.x;          //these two rotate the world around the player
        game.world.pivot.y = player.y;
        game.world.rotation = -playerAngle + (Math.PI/2);     //rotates the world so the controls aren't global

        return playerAngle;
    };

    /* Shortest distance between two angles in range -pi to pi.
    *
    */
    function radiansDelta(fromAngle, toAngle){
        return normalizedRadians(fromAngle - toAngle + Math.PI) - Math.PI;
    }

    /* normalizes a angle to the range 0 to 2 pi.
    *
    */
    function normalizedRadians(rawAngle){
        var TAU = Math.PI * 2;
        return ((rawAngle % TAU) + TAU) % TAU;
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


    function enemyGravityToPlanets(gravObject) {
        var p = findClosestPlanet(gravObject);
        var distanceFromPlanet = Phaser.Math.distance(gravObject.x,gravObject.y,p.x,p.y);
        var angle = Phaser.Math.angleBetween(gravObject.x,gravObject.y,p.x,p.y);

        enemy.body.applyForce(p.gravityForce * Math.cos(angle) * forceReducer * (distanceFromPlanet - p.width / 2),
            p.gravityForce * Math.sin(angle) * forceReducer * (distanceFromPlanet - p.width / 2));
        enemy.body.angle = angle;

        return angle;

    }

    /*
    This is the code that calculates gravity fields for the player, if they are in the radius.
    function returns -361, which is impossible in radian angles,
    if the player is not in any gravity radius.
    */
    function gravityToPlanets(gravObject){
        var angle = -361;
        // looping through all planets
        var p = findClosestPlanet(gravObject);

        if(p !== undefined) {
            var distanceFromPlanet = Phaser.Math.distance(gravObject.x, gravObject.y, p.x, p.y);

            // calculating angle between the planet and the crate
            angle = Phaser.Math.angleBetween(gravObject.x, gravObject.y, p.x, p.y);

            // add gravity force to the gravObject in the direction of planet center
            gravObject.body.applyForce(p.gravityForce * Math.cos(angle) * forceReducer * (distanceFromPlanet - p.width / 2),
                p.gravityForce * Math.sin(angle) * forceReducer * (distanceFromPlanet - p.width / 2));
        }
        return angle;
    }

    /* finds which planet the gravityObject is closest to, if it is within a gravity field.
    * returns undefined if the object is outside all gravity fields.
    */
    function findClosestPlanet(gravObject){
        var closestPlanetDistance = Infinity;
        var closestPlanet;

        for(var j = 0; j < planetGroup.total; j++){
            var p = planetGroup.getChildAt(j);
            var planetGravityRadius = p.width / 2 + p.gravityRadius / 2;
            var distanceFromPlanet = Phaser.Math.distance(gravObject.x, gravObject.y, p.x, p.y);

            if (distanceFromPlanet < planetGravityRadius){
                if (closestPlanet === undefined){
                    closestPlanet = p;
                    closestPlanetDistance = distanceFromPlanet;
                } else if( distanceFromPlanet < closestPlanetDistance){
                    closestPlanet = p;
                    closestPlanetDistance = distanceFromPlanet;
                }
            }
        }
        return closestPlanet;
    }

    this.applyGravityToObjects = function(){
        for (var i = 0; i < objectGroup.total; i++){
            var o = objectGroup.getChildAt(i);
            gravityToPlanets(o);
        }
    };

    /*
    This function implements a max velocity on a sprite, so it cannot accelerate too far and fly out of a
    gravity field. Code from : http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/
    */
    this.constrainVelocity = function(sprite, maxVelocity) {
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
    };

//=======adds text================================================================================================
    this.addMessage = function(text, sec){
        //add score to the screen
        if(lastCaption !== text || game.time.events.duration === 0) {
            messageBack = game.add.sprite(1000, 1000, "log");
            messageBack.scale.setTo(0.5, 0.5);
            messageBack.anchor.set(0.5);
            messageCaption = game.add.text(1000, 1000, text, {fill: '#72fa80', font: '10pt Courier'});
            messageCaption.anchor.set(0.5);
            lastCaption = text;
            if (sec > 0) {
                messageTimer(sec); //fades message
            }
        }
    };

    function messageTimer(sec){
        game.time.events.add(Phaser.Timer.SECOND * sec, fadeMessage, this);
    }

    function fadeMessage(){
        var bubbleTween = game.add.tween(messageBack).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        var textTween = game.add.tween(messageCaption).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        bubbleTween.onComplete.add(destroyMessage, this);
        textTween.onComplete.add(destroyMessage, this);
    }

    function destroyMessage(){
        messageBack.destroy();
        messageCaption.destroy();
    }

    this.messageLocation = function(angle) {
        if(messageBack !== null) {
            messageBack.x = player.x - 190 * Math.cos(angle);
            messageBack.y = player.y - 190 * Math.sin(angle);
            messageCaption.x = player.x - 190 * Math.cos(angle);
            messageCaption.y = player.y - 190 * Math.sin(angle);
            messageBack.angle = angle * 180 / Math.PI - 90;
            messageCaption.angle = angle * 180 / Math.PI - 90;
        }
    };

    this.moveDashboard = function(angle){
        for(var i = 0; i < dashboardGroup.total; i ++) {
            var d = dashboardGroup.getChildAt(i);
            d.x = player.x + 470 * Math.cos(angle);
            d.y = player.y + 470 * Math.sin(angle);
            d.angle = angle * 180 / Math.PI - 90;
        }
    };

//=======================================================================================================

    function addPlanet(posX, posY, gravityRadius, gravityForce, asset) {
        var planet = game.add.sprite(posX, posY, asset);
        planet.gravityRadius = gravityRadius;
        planet.gravityForce = gravityForce;
        planetGroup.add(planet);
        game.physics.box2d.enable(planet);
        planet.body.static = true;

        planet.body.setCircle(planet.width / 2);
        gravityGraphics.drawCircle(planet.x, planet.y, planet.width + planet.gravityRadius);
        planet.body.setCollisionCategory(1);
    }

    function addTeleporter(x, y, radians, goal) {
        teleporter = game.add.sprite(x, y, "teleporter", 6);
        game.physics.box2d.enable(teleporter);
        teleporter.animations.add('swirl', [0, 1, 2, 3, 4, 5], 15, true);
        teleporter.body.setRectangle(48, 61);
        teleporter.body.rotation += radians;
        teleporter.body.static = true;
        teleporter.body.setCollisionMask(0);
        levelGoal = goal;
    }

    function addStartPad(x, y, radians) {
        //console.log("adding startPad");
        startPad = game.add.sprite(x, y, "startPad", 6);
        objectGroup.add(startPad);
        game.physics.box2d.enable(startPad);
        startPad.body.setRectangle(48, 2);
        startPad.body.rotation += radians;
        startPad.body.static = true;
        startPad.body.setCollisionCategory(3);
        // startPad.body.setCategoryContactCallback();

        startPadAnimations = game.add.sprite(x,y,"startPadAnimations");
        game.physics.box2d.enable(startPadAnimations);
        startPadAnimations.body.setRectangle(50,17);
        startPadAnimations.body.static = true;
        startPadAnimations.body.rotation += radians;
        startPadAnimations.body.setCollisionMask(0);

        var teleportToPad = game.add.audio("teleportToPad");
        teleportToPad.play();

        startPadActive = startPadAnimations.animations.add('active',[1,2,3,4,0],12,true);
        startPadAnimations.animations.play('active');
        startPadActive.onLoop.add(startPadAnimationLooped,this);
    }

    function startPadAnimationLooped(){
        if(startPadActive.loopCount > 1){
            startPadActive.loop = false;
        }
    }

    function addDashboard(){
        dashboard = game.add.sprite(-100,-600,"dashboard");
        dashboard.anchor.set(0.5);
        dashboardGroup.add(dashboard);
        mute = game.add.sprite(-100,-600,"mute");
        mute.frame = 0;
        mute.anchor.set(-0.9,0.5);
        dashboardGroup.add(mute);
        pause = game.add.sprite(-100,-600,"pause");
        pause.frame = 0;
        pause.anchor.set(0.5, 0.55);
        dashboardGroup.add(pause);
        restart= game.add.sprite(-100,-600,"restart");
        restart.anchor.set(1.9,0.55);
        dashboardGroup.add(restart);


        pause.inputEnabled = true;
        pause.events.onInputUp.add(helper.pauseGame, self);
        restart.inputEnabled = true;
        restart.events.onInputUp.add(helper.resetLevel,self);
        game.input.onDown.add(helper.unpauseGame, self);
    }

//rebounds the player sprite back after enemy collision
    //rebounds the player sprite back after enemy collision
    this.enemyContactCallback = function(body1, body2, fixture1, fixture2, begin) {
        if (!begin) {
            return;
        }
       // console.log("callback");
        if (enemyCounterClockwise === -1) {
            enemyCounterClockwise = 0;
        } else {
            enemyCounterClockwise = -1;
        }
        enemyVel += 30;
        // enemyCollision = true;

        helper.deadByEnemy();
    };

    function addGear(x, y, sprite) {
        var gear = game.add.sprite(x, y, sprite);
        objectGroup.add(gear);
        game.physics.box2d.enable(gear);
        gear.body.setCollisionCategory(2);
        gear.body.static = false;
        spin = gear.animations.add('spin', [0, 1, 2, 3]);
        gear.animations.play('spin', 10, true);
    }

    function addEnemy(x, y, sprite) {
        //console.log("adding enemy");
        enemy = game.add.sprite(x, y, sprite);
        enemyPresent = true;
        enemyGroup.add(enemy);
        game.physics.box2d.enable(enemy);
        enemy.body.static = false;
        enemy.body.setRectangle(12, 50);
        enemy.body.setCollisionCategory(1);
        enemy.body.setCollisionMask(1);
        player.body.setBodyContactCallback(enemy, helper.enemyContactCallback, this);

    }

    // function moveEnemy(x, y) {
    //     // enemy.body.velocity.x = 0;
    //     // enemy.body.velocity.y = 0;
    //     enemy.body.x = x;
    //     enemy.body.y = y;
    // }

    function movePlayer(x, y) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.body.x = x;
        player.body.y = y;
    }

// kills the gear when touched
    this.gearCallback = function(body1, body2, fixture1, fixture2, begin) {
        //body1, body2, fixture1, fixture2, begin
        // body1 is the player because it's the body that owns the callback
        // body2 is the body it impacted with, in this case the gear
        // fixture1 is the fixture of body1 that was touched
        // fixture2 is the fixture of body2 that was touched

        // This callback is also called for EndContact events, which we are not interested in.
        if (!begin) {
            return;
        }
        var ting = game.add.audio('ting');
        ting.volume = 0.6;
        ting.play();
        score += 1;
        helper.addMessage(score + " / " + levelGoal, 1);
        if (score >= levelGoal) {
            teleporter.animations.play('swirl');
            var teleporterOpenSound = game.add.audio("teleporterOpen");
            teleporterOpenSound.play();
        }
        body2.sprite.destroy();
    };

// function planetContactCallback(body1, body2, fixture1, fixture2, begin) {
//     // console.log("planet touch");
//     if (!begin) {
//         return;
//     }
//     //planetContact = true;
// }

    this.startPadContactCallback = function(body1,body2,fixture1,fixture2,begin){
        if (!begin){
            return;
        }
        //console.log("platform");
        game.time.events.add(Phaser.Timer.SECOND* 0.6, fadeStartPad, this);
    };

    function fadeStartPad(){
        var platformTween = game.add.tween(messageBack).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        platformTween.onComplete.add(destroyStartPad, this);
    }

    function destroyStartPad(){
        startPad.destroy();
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

    this.checkTeleporterOverlap = function(teleporter) {
        console.log("overlap called");
        var teleporterBounds = teleporter.getBounds();
        var playerBounds = player.getBounds();
        if (Phaser.Rectangle.contains(teleporterBounds, playerBounds.centerX, playerBounds.centerY)){
            console.log('teleporter CONTACT');
            if(score < levelGoal) {
                this.addMessage("This portal is broken.\nCollect gears to repair.", 3);
            } else {
                changeLevel();
            }
        }
    };

    function changeLevel() {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        game.input.enabled = false;

        //will be in deadByEnemy
        cursors.left.reset(true);
        cursors.right.reset(true);
        cursors.up.reset(true);
        cursors.down.reset(true);
        player.animations.play('stand');

        // blackScreen = game.add.sprite(game.world.centerX, game.world.centerX, "blackScreen");
        // blackScreen.anchor.set(0.5, 0.5);
        // blackScreen.alpha = 0;
        // var fade = game.add.tween(blackScreen).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
        // fade.onComplete.add(helper.destroyGroups);

        helper.destroyGroups();
    }

    this.destroyGroups = function(){
        teleporter.destroy();
        currentLevel++;
        planetGroup.destroy();
        planetGroup = game.add.group();

        objectGroup.destroy();
        objectGroup = game.add.group();

        dashboardGroup.destroy();
        dashboardGroup = game.add.group();

        enemyGroup.destroy();
        enemyPresent = false;
        enemyGroup = game.add.group();

        gravityGraphics.destroy();
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        score = 0;

        game.input.enabled = true;
        // blackScreen.destroy();
        helper.createLevel();
    };

    this.handleKeyboardInput = function(angle) {
        if (cursors.left.isDown) {
            // player.body.moveLeft(90);
            player.body.velocity.x += playerVel * Math.cos(angle + (Math.PI / 2));
            player.body.velocity.y += playerVel * Math.sin(angle + (Math.PI / 2));
            player.animations.play('walkL');
        }
        else if (cursors.right.isDown) {
            // player.body.moveRight(90);
            player.body.velocity.x += playerVel * Math.cos(angle - (Math.PI / 2));
            player.body.velocity.y += playerVel * Math.sin(angle - (Math.PI / 2));
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
        if (cursors.left.justUp || cursors.right.justUp) {
            player.animations.play('stand');
        }
    };

    this.pauseGame = function(){
        pause.frame = 1;
        game.paused = true;
    };

    this.unpauseGame = function(event){
        var pauseButton = pause.getBounds();
        if(Phaser.Rectangle.contains(pauseButton,event.x,event.y)) {
            game.paused = false;
            pause.frame = 0;
        }
    };


    this.resetLevel = function() {
        currentLevel -= 1;
        // enemyCollision = false;
        changeLevel();
    };

    this.deadByEnemy = function(){
        // console.log("deadbyEnemy is called");
        // player.body.velocity.x = 0;
        // player.body.velocity.y = 0;
        // game.input.enabled = false;
        //
        // var drop = game.add.tween(player);
        // drop.to({ y: game.world.height-player.height }, 500, Phaser.Easing.Bounce.In);
        // drop.onComplete.add(helper.resetLevel, this);
        // drop.start();
        bgm.pause();
        game.world.pivot.x = 0;
        game.world.pivot.y = 0;
        game.camera.reset();
        game.state.start("DeadState", true, false, 0);
    }
};