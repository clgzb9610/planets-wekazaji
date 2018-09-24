var LevelChanger = function(game){


    this.createLevel= function(){
        playingNow = true;
        score = 0;
        if(!level[currentLevel]) {          //go to ending state if you pass the last level
            bgm.destroy();
             console.log("bgm paused");
            player.destroy();
            game.physics.clear();
            // console.log("destroyed the physics");
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
            if(addition.objectType === 'hint'){
                helper.addMessage(addition.text,3);
            }
        }
        addDashboard();
    };


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
       // objectGroup.add(teleporter);
        teleporter.animations.add('swirl', [0, 1, 2, 3, 4, 5], 15, true);
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
        startPad.body.setRectangle(48, 2);
        startPad.body.rotation += radians;
        startPad.body.static = true;
        startPad.body.setCollisionCategory(3);

        //electricity animation when you come into the level
        startPadAnimations = game.add.sprite(x,y,"startPadAnimations");
        objectGroup.add(startPadAnimations);
        game.physics.box2d.enable(startPadAnimations);
        startPadAnimations.body.setRectangle(50,17);
        startPadAnimations.body.static = true;
        startPadAnimations.body.rotation += radians;
        startPadAnimations.body.setCollisionMask(0);
        //sound effect when you come into the level
        var teleportToPad = game.add.audio("teleportToPad");
        teleportToPad.play();
        //play the electricity animation
        startPadActive = startPadAnimations.animations.add('active',[1,2,3,4,0],12,true); //it ends on the blank part of the spritesheet
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
        var platformTween = game.add.tween(startPad).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        platformTween.onComplete.add(destroyStartPad, this);
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
        gear.animations.play('spin', 10, true);
    }

    //move the one player sprite to a fresh location at the start of each level.
    function movePlayer(x, y) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.body.x = x;
        player.body.y = y;
        game.world.swap(player,teleporter); //makes the player 'younger' than the teleporter in every level, so it passes in front
    }


    function addDashboard(){
        dashboard = game.add.sprite(-100,-600,"dashboard");
        dashboard.anchor.set(0.5);
        dashboardGroup.add(dashboard);
        mute = game.add.button(-100,-600,"mute", helper.muteSound,this);
        mute.inputEnabled = true;
        if(game.sound.mute){
            mute.loadTexture("mute",0);
        }else{
            mute.loadTexture("unMute",0);
        }
        mute.anchor.set(-0.9,0.5);
        dashboardGroup.add(mute);
        pause = game.add.sprite(-100,-600,"pause");
        pause.frame = 0;
        pause.anchor.set(0.5, 0.55);
        dashboardGroup.add(pause);
        restart = game.add.sprite(-100,-600,"restart");
        restart.anchor.set(1.9,0.55);
        dashboardGroup.add(restart);
        // console.log('adding dashboard');

        // make the buttons work
        pause.inputEnabled = true;
        pause.events.onInputUp.add(helper.pauseGame, self);
        restart.inputEnabled = true;
        restart.events.onInputUp.add(levelChanger.resetLevel,self);

        game.input.onDown.add(helper.unPauseGame, self);
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
        //does the blackscreen need to be so large? since its a solid color i think it could be tiny & scaled to fit the screen?
        blackScreen.scale.setTo(2, 2); //if the blackscreen sprite is teensy you could scale at like 200x200?
        blackScreen.anchor.set(0.5, 0.5);
        blackScreen.alpha = 0;
        // var fade = game.add.tween(blackScreen).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
        game.time.events.add(500,levelChanger.destroyGroups,this);
        game.time.events.add(501,addGroups,this);
    };

    // destroy all the groups of objects
    this.destroyGroups = function(){
        console.log("destroy groups");
        planetGroup.destroy();

        objectGroup.destroy();
        teleporter.destroy();

        dashboardGroup.destroy();

        messageGroup.destroy();

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
        gravityGraphics = game.add.graphics(0, 0);
    };

    //add all the groups back in to put the level objects in for a new level.
    function addGroups(){
        console.log("add groups");
        enemyGroup = game.add.group();
        planetGroup = game.add.group();
        objectGroup = game.add.group();
        dashboardGroup = game.add.group();
        messageGroup = game.add.group();
        gravityGraphics.lineStyle(2, 0xffffff, 0.5);

        currentLevel++;

        game.input.enabled = true;
        blackScreen.destroy();
        levelChanger.createLevel();
    }

    // reset the level without messing with states.
    this.resetLevel = function() {
        if(playingNow === true){
            currentLevel -= 1;
            playingNow = false;
            levelChanger.changeLevel();
        }
    };

};