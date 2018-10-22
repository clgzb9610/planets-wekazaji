var LevelChanger = function(game){


    this.createLevel= function(){
        playingNow = true;
        score = 0;
        
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
        if (currentLevel === 9) {
        var unlock10 = localStorage.setItem("Level10","true");
        }
        if (currentLevel === 10) {
        var unlock11 = localStorage.setItem("Level11","true");
        }
        if (currentLevel === 11) {
        var unlock12 = localStorage.setItem("Level12","true");
        }
        if (currentLevel === 12) {
        var unlock13 = localStorage.setItem("Level13","true");
        }
        if (currentLevel === 13) {
        var unlock14 = localStorage.setItem("Level14","true");
        }
        
        if(!level[currentLevel]) {          //go to ending state if you pass the last level
            bgm.destroy();
            player.destroy();
            game.physics.clear();
            game.world.pivot.x = 0;
            game.world.pivot.y = 0;
            game.world.rotation = 0;
            game.camera.reset();
            game.state.start("Ending", true, false, 0);
            return;
        }
        for (var i = 0; i < level[currentLevel].length; i++) {      //create level objects
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
                enemy1 = new Enemy(game, addition.x, addition.y, addition.enemyVel);
            }
            if(addition.objectType === 'enemy2'){
                enemy2Present = true;
                enemy2 = new Enemy(game, addition.x, addition.y, addition.enemyVel);
            }
            if(addition.objectType === 'player'){
                movePlayer(addition.x,addition.y);
            }
            if (addition.objectType === 'levelBoundary') {
                levelCenterX = addition.x;
                levelCenterY = addition.y;
                levelBoundaryRadius = addition.radius;
            }
        }
        levelBoundary.drawCircle(levelCenterX, levelCenterY, levelBoundaryRadius*2);
        addUI();
    };


    function addPlanet(posX, posY, gravityRadius, gravityForce, asset) {
        var planet = game.add.sprite(posX, posY, asset);

        if (currentLevel === 10){
            planet.scale.setTo(1.2);
        } else {
            planet.scale.setTo(1.5, 1.5);
        }

        planet.animations.add('beaming',[0,1,2,3],5, true);
        planet.animations.play('beaming');

        planet.gravityRadius = gravityRadius;
        planet.gravityForce = gravityForce;
        planetGroup.add(planet);
        game.physics.box2d.enable(planet);
        planet.body.static = true;
        planet.body.friction = 1;

        planet.body.setCircle(planet.width / 2);
        gravityGraphics.drawCircle(planet.x, planet.y, planet.width + planet.gravityRadius);
        planet.body.setCollisionCategory(1);
    }

    function addTeleporter(x, y, radians, goal) {
        teleporter = game.add.sprite(x, y, "teleporter", 6);
        game.physics.box2d.enable(teleporter);
        teleporter.animations.add('swirl', [0, 1, 2, 3, 4, 5], 25, true);
        teleporter.body.setRectangle(38, 55);
        teleporter.body.rotation += radians;
        teleporter.body.static = true;
        teleporter.body.setCollisionMask(0);
        levelGoal = goal;
    }

    function addStartPad(x, y, radians) {
        startPad = game.add.sprite(x, y, "startPad", 6);
        objectGroup.add(startPad);
        game.physics.box2d.enable(startPad);
        startPad.body.setRectangle(50, 5);
        startPad.body.rotation += radians;
        startPad.body.static = true;
        startPad.body.setCollisionCategory(3);

        //electricity animation when you come into the level
        startPadAnimations = game.add.sprite(x,y,"startPadAnimations");
        objectGroup.add(startPadAnimations);
        game.physics.box2d.enable(startPadAnimations);
        startPadAnimations.body.setRectangle(30,17);
        startPadAnimations.body.static = true;
        startPadAnimations.body.rotation += radians;
        startPadAnimations.body.setCollisionMask(0);
        //sound effect when you come into the level
        var teleportToPad = game.add.audio("teleportToPad");
        teleportToPad.play();
        //play the electricity animation
        startPadActive = startPadAnimations.animations.add('active',[1,2,3,4,0],15,true); //it ends on the blank part of the spritesheet
        startPadAnimations.animations.play('active');
        startPadActive.onLoop.add(startPadAnimationLooped,this);
    }

    //the startPadAnimation loops twice before the parameter controlling it is set to false
    function startPadAnimationLooped(){
        if(startPadActive.loopCount > 1){
            startPadActive.loop = false;
        }
    }

    this.fadeStartPad = function(){
        var platformTween = game.add.tween(startPad).to( { alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
        platformTween.onComplete.add(destroyStartPad, this);
    };

    this.finishLevel = function () {
        transitioning = true;
        game.physics.box2d.paused = true;
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        let scaleTween = game.add.tween(player.scale).to({x: 0, y: 0}, 750, Phaser.Easing.Back.In),
            positionTween = game.add.tween(player.body).to({x: teleporter.x, y: teleporter.y, angle: player.angle + 600}, 750, Phaser.Easing.Back.In);

        scaleTween.start();
        positionTween.start();
        
        vortexAudio.play();
        
        positionTween.onComplete.add(this.changeLevel);
    };

    function destroyStartPad(){
        objectGroup.remove(startPad);
        objectGroup.remove(startPadAnimations);
        startPad.destroy();
        startPadAnimations.destroy();
    }

    function addGear(x, y, sprite) {
        var gear = game.add.sprite(x, y, sprite);
        objectGroup.add(gear);
        game.physics.box2d.enable(gear);
        gear.body.setRectangle(25,30);
        gear.body.setCollisionCategory(2);
        gear.body.static = false;
        spin = gear.animations.add('spin', [0, 1, 2, 3]);
        gear.animations.play('spin', 15, true);
    }

    //move the one player sprite to a fresh location at the start of each level.
    function movePlayer(x, y) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.body.x = x;
        player.body.y = y;
        game.world.swap(player,teleporter); //makes the player 'younger' than the teleporter in every level, so it passes in front
    }


    function addUI(){
        //pause button in game
        newPause = game.add.button(304, 334, "newPause");
        newPause.anchor.set(0.5);
        newPause.scale.setTo(0.3, 0.3);
        userInterface.add(newPause);
        newPause.inputEnabled = true;
        newPause.events.onInputUp.add(helper.pauseClicked, self);
        newPause.onInputOver.add(helper.pauseOver, this);
        newPause.onInputOut.add(helper.pauseOut, this);

        //Popup when pausebutton is clicked
        pausePop = game.add.sprite(0, 30, 'pausePage');
        pausePop.anchor.set(0.5);
        userInterface.add(pausePop);
        pausePop.inputEnabled = true;
        pausePop.visible = false;

        // close button for popup
        closeButton = game.add.button(310, 30 - 110, 'closeButton');
        userInterface.add(closeButton);
        closeButton.scale.set(0.2);
        closeButton.anchor.set(0.5);
        closeButton.inputEnabled = true;
        closeButton.input.priorityID = 1;
        closeButton.input.useHandCursor = true;
        closeButton.visible = false;
        closeButton.events.onInputUp.add(helper.closePause, self);
        closeButton.events.onInputOver.add(helper.closeOver, this);
        closeButton.events.onInputOut.add(helper.closeOut, this);

        // resume button
        resumeButton = game.add.button(0, -25, "resumeButton");
        userInterface.add(resumeButton);
        resumeButton.anchor.set(0.5);
        resumeButton.inputEnabled = true;
        resumeButton.input.priorityID = 1;
        resumeButton.input.useHandCursor = true;
        resumeButton.visible = false;
        resumeButton.events.onInputOver.add(helper.resumeOver, this);
        resumeButton.events.onInputOut.add(helper.resumeOut, this);

        // mute button
        muteButton = game.add.button(0, 45, "muteButton");
        userInterface.add(muteButton);
        muteButton.anchor.set(0.5);
        muteButton.inputEnabled = true;
        muteButton.input.priorityID = 1;
        muteButton.input.useHandCursor = true;
        muteButton.visible = false;
        muteButton.events.onInputOver.removeAll();
        muteButton.events.onInputOut.removeAll();
        if(game.sound.mute===false) { //when sound is on
            muteButton.loadTexture('muteButton', 0);
            muteButton.events.onInputOver.add(helper.muteSoundOver, this);
            muteButton.events.onInputOut.add(helper.muteSoundOut, this);
        } else { // when sound is off
            muteButton.loadTexture('playSoundButton', 0);
            muteButton.events.onInputOver.add(helper.playSoundOver, this);
            muteButton.events.onInputOut.add(helper.playSoundOut, this);
        }

        // go to main button
        gotoMainButton = game.add.button(0, 115, "toMainButton");
        userInterface.add(gotoMainButton);
        gotoMainButton.anchor.set(0.5);
        gotoMainButton.inputEnabled = true;
        gotoMainButton.input.priorityID = 1;
        gotoMainButton.input.useHandCursor = true;
        gotoMainButton.visible = false;
        gotoMainButton.events.onInputOver.add(helper.gotoMainOver, this);
        gotoMainButton.events.onInputOut.add(helper.gotoMainOut, this);

        game.input.onDown.add(helper.unPauseGame, self);

        progressBar = game.add.image(0, -310, "progressBar");
        progressBar.anchor.set(0.5, 0);
        userInterface.add(progressBar);
        progressBar.scale.setTo(0.8);
        progressBarteleporter = game.add.sprite(240, -300, "teleporter", 6);
        userInterface.add(progressBarteleporter);
        progressBarteleporter.scale.setTo(0.8);
        progressBarteleporter.animations.add('progressBarSwirl', [0, 1, 2, 3, 4, 5], 25, true);

        addGearOutlines();
    }

    function addGearOutlines () {
        for (var i = 0; i < levelGoal; i++) {
            let gearOutline = game.add.image(0, 0, "gearOutline"),s
                gearOutlineWidth = gearOutline.width * gearUIScale,
                gearOutlineHeight = gearOutline.height * gearUIScale,
                gearsPerRow = Math.floor(450 / (gearOutlineWidth + 2));

            gearOutline.setScaleMinMax(gearUIScale);
            // gearOutline.anchor.set(1, 0);
            gearOutline.anchor.set(0.5,0);
            userInterface.add(gearOutline);

            var gearOutlineStartx = ((gearOutlineWidth + 2)/2) - (((gearOutlineWidth + 2) * (levelGoal))/2);
            gearOutline.x = gearOutlineStartx - 2 + (gearOutlineWidth + 2) * (i % gearsPerRow);
            // gearOutline.x = 350 - 2 - (gearOutlineWidth + 2) * (i % gearsPerRow);
            gearOutline.y = -285 + 2 + (gearOutlineHeight + 2) * Math.floor(i / gearsPerRow);
        }
    }

    // a couple of housekeeping things to prepare to change between levels.
    // stop taking in user input, reset all the buttons currently being pressed, make the player character stand,
    // fade a black sprite over the screen to mark level change.
    this.changeLevel = function(){
        player.body.velocity.x -= 110;
        game.input.enabled = false;

        //will be in deadByi      
        cursors.left.reset(true);
        cursors.right.reset(true);
        cursors.up.reset(true);
        cursors.down.reset(true);
        player.animations.play('stand');

        blackScreen = game.add.sprite(game.world.centerX, game.world.centerX, "blackScreen");
        blackScreen.scale.setTo(2, 2);
        blackScreen.anchor.set(0.5, 0.5);
        blackScreen.alpha = 0;
        game.add.tween(blackScreen).to( { alpha: 1 }, 200, Phaser.Easing.Linear.None, true).onComplete.add(function () {
            game.add.tween(player.scale).to( {x: 1, y: 1}, 10, Phaser.Easing.Linear.None, true);
            transitioning = false;
            game.physics.box2d.paused = false;
            levelChanger.destroyGroups();
            addGroups();
            blackScreen.bringToTop();
            game.time.events.add(100, function () {
                game.add.tween(blackScreen).to(
                    {alpha: 0},
                    150,
                    Phaser.Easing.Linear.None,
                    true
                ).onComplete.add(function () {
                    pauseEnabled = true;
                });
            });
        });
    };

    // destroy all the groups of objects
    this.destroyGroups = function(){
        planetGroup.destroy();

        objectGroup.destroy();
        teleporter.destroy();

        userInterface.destroy();

        enemyGroup.destroy();
        if (enemy1Present) {
            enemy1.destroySprite();
            enemy1Present = false;
        }
        if (enemy2Present) {
            enemy2.destroySprite();
            enemy2Present = false;
        }

        gravityGraphics.destroy();
        levelBoundary.destroy();
    };

    //add all the groups back in to put the level objects in for a new level.
    function addGroups(){
        enemyGroup = game.add.group();
        planetGroup = game.add.group();
        objectGroup = game.add.group();
        userInterface = game.add.group();
        gravityGraphics = game.add.graphics(0, 0);
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);
        levelBoundary = game.add.graphics(0, 0);
        levelBoundary.lineStyle(12, 0xADD8E6, 0.35);
        levelCenterX = 0;
        levelCenterY = 0;
        levelBoundaryRadius = 2000;

        currentLevel++;

        game.input.enabled = true;
        levelChanger.createLevel();
    }

    // reset the level without messing with states.
    this.resetLevel = function() {
        if(playingNow === true){
            currentLevel -= 1;
            playingNow = false;

            player.body.velocity.x -= 110;
            game.input.enabled = false;

            cursors.left.reset(true);
            cursors.right.reset(true);
            cursors.up.reset(true);
            cursors.down.reset(true);
            player.animations.play('stand');

            levelChanger.destroyGroups();
            addGroups();
        }
    };

};