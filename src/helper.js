var Helper = function(game){

    var messageBack;
    var messageCaption;
    var blackScreen;
    var levelComplete = false;

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
        levelComplete = false;
        if(!level[currentLevel]) {
            bgm.pause();
            // console.log("bgm paused");
            game.physics.clear();
            // console.log("destroyed the physics");
            game.world.pivot.x = 0;
            game.world.pivot.y = 0;
            game.world.rotation = 0;
            game.camera.reset();
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
            if(addition.objectType === 'enemy1'){
                enemy1Present = true;
                enemy1 = new Enemy(game, addition.x, addition.y);
            }
            if(addition.objectType === 'enemy2'){
                enemy2Present = true;
                enemy2 = new Enemy(game, addition.x, addition.y);
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



//=======adds text================================================================================================
    this.addMessage = function(text, delay){
        //add score to the screen
        if(lastCaption !== text || game.time.events.duration === 0) {
            messageBack = game.add.sprite(1000, 1000, "log");
            messageBack.scale.setTo(0.5, 0.5);
            messageBack.anchor.set(0.5);
            messageCaption = game.add.text(1000, 1000, text, {fill: '#72fa80', font: '10pt Courier'});
            messageCaption.anchor.set(0.5);
            messageGroup.add(messageBack);
            messageGroup.add(messageCaption);
            lastCaption = text;
            console.log("add message with delay:,", delay);
            if (delay > 0) {
                messageTimer(delay); //fades message
            }
        }
    };

    function messageTimer(delay){
        game.time.events.add(Phaser.Timer.SECOND * delay, fadeMessage, this);
    }

    function fadeMessage(){
        console.log("start FADE MESSAGE");
        var bubbleTween = game.add.tween(messageBack).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        var textTween = game.add.tween(messageCaption).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        bubbleTween.onComplete.add(destroyMessage, this);
        textTween.onComplete.add(destroyMessage, this);
    }

    function destroyMessage(){
        messageGroup.remove(messageBack);
        messageGroup.remove(messageCaption);
        messageBack.destroy();
        console.log("destroyed messageBack");
        messageCaption.destroy();
        console.log("destroyed caption");
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
            d.x = player.x + 353 * Math.cos(angle);
            d.y = player.y + 353 * Math.sin(angle);
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
        //game.world.moveDown(gravityGraphics);       Some combo of moveDown or moveToBack then a few moveUp's will put the gravityGraphics in the right place.
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
        objectGroup.add(startPadAnimations);
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
        enemyCollision = true;

        // helper.resetLevel();
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

    function movePlayer(x, y) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.body.x = x;
        player.body.y = y;
        game.world.swap(player,teleporter); //makes the player younger than the teleporter in every level, so it passes in front
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
        helper.addMessage(score + " / " + levelGoal, 0.7);
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
        var platformTween = game.add.tween(startPad).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        platformTween.onComplete.add(destroyStartPad, this);
    }

    function destroyStartPad(){
        objectGroup.remove(startPad);
        objectGroup.remove(startPadAnimations);
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
        if (levelComplete === false){
            console.log("overlap called");
            var teleporterBounds = teleporter.getBounds();
            var playerBounds = player.getBounds();
            if (Phaser.Rectangle.contains(teleporterBounds, playerBounds.centerX, playerBounds.centerY)){
                console.log('teleporter CONTACT');
                if(score < levelGoal) {
                    this.addMessage("This portal is broken.\nCollect gears to repair.", 3);
                } else {
                    levelComplete = true;
                    changeLevel();
                }
            }
        }
    };

    function changeLevel() {
        player.body.velocity.x -= 100;
        // player.body.velocity.y -= 100;
        game.input.enabled = false;

        //will be in deadByEnemy
        cursors.left.reset(true);
        cursors.right.reset(true);
        cursors.up.reset(true);
        cursors.down.reset(true);
        player.animations.play('stand');

        blackScreen = game.add.sprite(game.world.centerX, game.world.centerX, "blackScreen");
        blackScreen.scale.setTo(2, 2);
        blackScreen.anchor.set(0.5, 0.5);
        blackScreen.alpha = 0;
        var fade = game.add.tween(blackScreen).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
        fade.onComplete.add(helper.destroyGroups);
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

        messageGroup.destroy();
        messageGroup = game.add.group();

        enemyGroup.destroy();
        if (enemy1Present) {
            enemy1.destroySprite();
        }
        if (enemy2Present) {
            enemy2.destroySprite();
        }
        enemyGroup = game.add.group();

        gravityGraphics.destroy();
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        score = 0;

        game.input.enabled = true;
        blackScreen.destroy();
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
        game.world.rotation = 0;
        game.camera.reset();
        game.state.start("DeadState", true, false, 0);
    };
};