var Helper = function(game){
    var particleFrequency = 4;
    var frameCounter = 0;

//=======================================================================================================
//  ========== CONTACT CALLBACKS ========================================

// resets the level when player makes contact with an enemy
    this.enemyContactCallback = function(body1, body2, fixture1, fixture2, begin) {
        if (!begin) {
            return;
        }

        pauseEnabled = false;

        // Freezes all entity movement on the screen
        transitioning = true;
        game.physics.box2d.paused = true;
        emitter.exists = false;
        objectGroup.exists = false;
        emitter.forEachAlive(function (particle) {
            if (particle.scaleData === null || particle._s === null) { return; }
            
            let currentScaleIndex = particle._s,
                currentScaleX = particle.scaleData[currentScaleIndex].x,
                currentScaleY = particle.scaleData[currentScaleIndex].y;
            
            particle.scaleData = particle.scaleData.map(function (obj) {
                 return { x: currentScaleX, y: currentScaleY };
             }); 
        });


        if (jetpackAudio.volume > 0) {
            jetpackAudio.fadeTo(50, 0);
        }

        // Causes the screen to flash white
        var whiteScreen = game.add.sprite(player.x, player.y, "whiteScreen");
        whiteScreen.bringToTop();
        whiteScreen.anchor.set(0.5);
        whiteScreen.angle = player.angle;
        whiteScreen.alpha = 0;
        whiteScreen.setScaleMinMax(2, 2);
        let screenTween = game.add.tween(whiteScreen).to({ alpha: 1 }, 200);
        screenTween.start();
        screenTween.onComplete.add(function () {
            game.time.events.add(150, function () { // Waits for 150ms to pass before running events
                game.time.slowMotion = 1;
                levelChanger.resetLevel();
                whiteScreen.bringToTop();

                // Allows entity movement / animation to run again
                transitioning = false;
                game.physics.box2d.paused = false;
                emitter.exists = true;
                objectGroup.exists = true;

                screenTween = game.add.tween(whiteScreen).to({ alpha: 0 }, 200);
                screenTween.start();
                screenTween.onComplete.add(function () {
                    pauseEnabled = true;
                });
            });
        });
    };


// kills the gear when touched
    this.gearCallback = function(playerBody, gearBody, playerFixture, gearFixture, beginContact) {
        // body1 is the player because it's the body that owns the callback
        // body2 is the body it impacted with, in this case the gear
        // fixture1 is the fixture of body1 that was touched
        // fixture2 is the fixture of body2 that was touched

        // This callback is also called for EndContact events, which we are not interested in.
        if (!beginContact) {
            return;
        }

        let filledInGear = game.add.image(0, 0, "filledInGear"),
            imageWidth = filledInGear.width * gearUIScale,
            imageHeight = filledInGear.height * gearUIScale,
            gearsPerRow = Math.floor(450 / (imageWidth + 2));

        // filledInGear.anchor.set(1, 0);
        filledInGear.anchor.set(0.5, 0);
        filledInGear.setScaleMinMax(gearUIScale);
        userInterface.add(filledInGear);

        var filledInGearStartx = ((imageWidth + 2)/2) - (((imageWidth + 2) * (levelGoal))/2);
        filledInGear.x = filledInGearStartx - 2 + (imageWidth + 2) * (score % gearsPerRow);
        filledInGear.y = -285 + 2 + (imageHeight + 2) * Math.floor(score / gearsPerRow);

        gearTing.play();

        gearBody.removeFromWorld(); // Stops gear from colliding physically with player

        score += 1;
        if (score >= levelGoal) {
            teleporter.animations.play('swirl');
            progressBarteleporter.animations.play('progressBarSwirl');
            var teleporterOpenSound = game.add.audio("teleporterOpen");
            teleporterOpenSound.play();
        }

        game.add.tween(gearBody).to(
            {x: playerBody.x, y: playerBody.y},
            150,
            Phaser.Easing.Linear.None,
            true
        );
        game.add.tween(gearBody.sprite.scale).to(
            {x: 0, y: 0},
            150,
            Phaser.Easing.Linear.None,
            true
        ).onComplete.add(function () {
            gearBody.sprite.destroy();
        });
    };

    //will start event to fade startPad a certain amount of time after it register the player's contact.
    this.startPadContactCallback = function(body1,body2,fixture1,fixture2,begin){
        if (!begin){
            return;
        }
        game.time.events.add(400, levelChanger.fadeStartPad, this);
    };


    // a custom function to check player contact with the teleporter.
    this.checkTeleporterOverlap = function(teleporter) {
        var teleporterBounds = teleporter.getBounds();
        var playerBounds = player.getBounds();
        if (Phaser.Rectangle.contains(teleporterBounds, playerBounds.centerX, playerBounds.centerY)){
            if(score < levelGoal) {
                // Portal is not yet active
            } else {
                playingNow = false;
                pauseEnabled = false;
                levelChanger.finishLevel();
            }
        }
    };

//==============================================================================================================
    // ==================== OTHER HELPER FUNCTIONS ==============================

    // Calculates thew new speeds for the emitter particles
    this.calculateParticleVelocities = function (xSpeed, ySpeed) {
        let speedSpread = 17;

        emitter.setXSpeed(-xSpeed - speedSpread, -xSpeed + speedSpread);
        emitter.setYSpeed(-ySpeed - speedSpread, -ySpeed + speedSpread);
    };

    //changes the x & y velocty of the player for every arrow key press, and changes the animation
    this.handleKeyboardInput = function(angle) {
        var keyDown = false;

        var xSpeedAdjustment = 0,
            ySpeedAdjustment = 0;

        if (cursors.left.isDown) {
            xSpeedAdjustment += playerVel * Math.cos(angle + (Math.PI / 2));
            ySpeedAdjustment += playerVel * Math.sin(angle + (Math.PI / 2));
            player.animations.play('walkL');
            keyDown = true;
        }
        else if (cursors.right.isDown) {
            xSpeedAdjustment += playerVel * Math.cos(angle - (Math.PI / 2));
            ySpeedAdjustment += playerVel * Math.sin(angle - (Math.PI / 2));
            player.animations.play('walkR');
            keyDown = true;
        }
        if (cursors.up.isDown) {
            xSpeedAdjustment += -playerVel * Math.cos(angle);
            ySpeedAdjustment += -playerVel * Math.sin(angle);
            player.animations.play('fall');
            keyDown = true;
        }
        if (cursors.down.isDown) {
            xSpeedAdjustment += playerVel * Math.cos(angle);
            ySpeedAdjustment += playerVel * Math.sin(angle);
            player.animations.play('stand');
            keyDown = true;
        }
        if (cursors.left.justUp || cursors.right.justUp) {
            player.animations.play('stand');
        }

        player.body.velocity.x += xSpeedAdjustment;
        player.body.velocity.y += ySpeedAdjustment;

        var distanceToSurface = 10;
        var closestPlanet = gamePhysics.findClosestPlanet(player);

        if(closestPlanet !== undefined) {
            var distanceToPlanet;

            distanceToPlanet = Phaser.Math.distance(player.x, player.y, closestPlanet.x, closestPlanet.y) - player.height / 2;

            distanceToSurface = distanceToPlanet - closestPlanet.width / 2;
        }
        
        if ((keyDown && distanceToSurface > 2) || cursors.down.isDown || cursors.up.isDown) {
            if (frameCounter === 0) {
                this.calculateParticleVelocities(xSpeedAdjustment, ySpeedAdjustment);
                emitter.x = player.x;
                emitter.y = player.y;
                emitter.start(true, 1000, null, 1);
            }
            if (jetpackAudio.volume === 0) { 
                jetpackAudio.play();
                jetpackAudio.fadeTo(100, 0.65);
            }
        }
        else {
            if (jetpackAudio.volume > 0) {
                jetpackAudio.fadeTo(50, 0);
            }
        }
        frameCounter += 1;
        if (frameCounter >= particleFrequency) {
            frameCounter = 0;
        }
    };

    //moves the user interface relative to the player
    this.moveUI = function(angle){
        userInterface.x = player.x;
        userInterface.y = player.y;
        userInterface.angle = angle * 180 / Math.PI - 90;
    };

    this.pauseClicked = function(){
        if (pauseEnabled) {
            helper.showPausePop();
            helper.showCloseButton();
            helper.showResumeButton();
            helper.showMuteButton();
            helper.showMainButton();
            let musicPaused = game.sound.mute;
            game.paused = true;
            if (!musicPaused) {
                game.sound.mute = false;
            }
        }
    };

    this.unPauseGame = function(event){
        var closeButtonOnPop = closeButton.getBounds();
        if(Phaser.Rectangle.contains(closeButtonOnPop,event.x,event.y)) {
            game.paused = false;
            helper.closePause();
            newPause.loadTexture("newPause", 0);
            closeButton.loadTexture("closeButton", 0);
        }
        var pauseButtonOnPop = resumeButton.getBounds();
        if(Phaser.Rectangle.contains(pauseButtonOnPop,event.x,event.y)) {
            game.paused = false;
            helper.closePause();
            newPause.loadTexture("newPause", 0);
            resumeButton.loadTexture("resumeButton");
        }
        var mainButtonOnPop = gotoMainButton.getBounds();
        if(Phaser.Rectangle.contains(mainButtonOnPop,event.x,event.y)) {
            game.paused = false;
            helper.gotoMain();
            newPause.loadTexture("newPause", 0);
            gotoMainButton.loadTexture("toMainButton");
        }
        var muteSoundOnPop = muteButton.getBounds();
        if(Phaser.Rectangle.contains(muteSoundOnPop,event.x,event.y)) {
            helper.muteSound();
            newPause.loadTexture("newPause", 0);
        }
    };

    this.muteSound = function(){

        muteButton.events.onInputOver.removeAll();
        muteButton.events.onInputOut.removeAll();
        if(game.sound.mute===false) { //when sound is on
            game.sound.mute = true;
            muteButton.loadTexture('playSoundButton_hover', 0);
            muteButton.events.onInputOver.add(helper.playSoundOver, this);
            muteButton.events.onInputOut.add(helper.playSoundOut, this);
        } else { // when sound is off
            game.sound.mute = false;
            muteButton.loadTexture('muteButton_hover', 0);
            muteButton.events.onInputOver.add(helper.muteSoundOver, this);
            muteButton.events.onInputOut.add(helper.muteSoundOut, this);
        }
    };

    this.closePause = function(){
        pausePop.visible = false;
        closeButton.visible = false;
        resumeButton.visible = false;
        muteButton.visible = false;
        gotoMainButton.visible = false;
    };

    this.gotoMain = function(){
        game.input.keyboard.enabled = true;
        bgm.destroy();
        player.destroy();
        game.physics.clear();
        game.world.pivot.x = 0;
        game.world.pivot.y = 0;
        game.world.rotation = 0;
        game.camera.reset();
        game.state.start("MainMenu", true, false, 0);
    };

    this.pauseOver = function(){
        if (!game.paused) {
            newPause.loadTexture('newPause_hover', 0);
        }
    };

    this.pauseOut = function(){
        if (!game.paused) {
            newPause.loadTexture("newPause", 0);
        }
    };

    this.showPausePop = function(){
        pausePop.visible = true;
    };

    this.showCloseButton = function(){
        closeButton.visible = true;
    };

    this.closeOver = function(){
        closeButton.loadTexture("closeButton_hover", 0);
    };

    this.closeOut = function(){
        closeButton.loadTexture("closeButton", 0);
    };

    this.showResumeButton = function(){
        resumeButton.visible = true;
    };

    this.resumeOver = function(){
        resumeButton.loadTexture("resumeButton_hover");
    };

    this.resumeOut = function(){
        resumeButton.loadTexture("resumeButton");
    };

    this.showMuteButton = function(){
        muteButton.visible = true;
    };

    this.muteSoundOver = function(){
        muteButton.loadTexture("muteButton_hover");
    };

    this.muteSoundOut = function(){
        muteButton.loadTexture("muteButton");
    };

    this.playSoundOver = function(){
        muteButton.loadTexture("playSoundButton_hover");
    };

    this.playSoundOut = function(){
        muteButton.loadTexture("playSoundButton");
    };

    this.showMainButton = function(){
        gotoMainButton.visible = true;
    };

    this.gotoMainOver = function(){
        gotoMainButton.loadTexture("toMainButton_hover");
    };

    this.gotoMainOut = function(){
        gotoMainButton.loadTexture("toMainButton");
    };

    this.playerDistanceFromLevelCenter = function () {
        let a = player.x - levelCenterX,
            b = player.y - levelCenterY;

        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    };

};