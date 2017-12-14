var LevelChanger = function(game){


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
        restart.events.onInputUp.add(levelChanger.resetLevel,self);
        game.input.onDown.add(helper.unpauseGame, self);
    }

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

    this.fadeStartPad = function(){
        var platformTween = game.add.tween(startPad).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        platformTween.onComplete.add(destroyStartPad, this);
    };

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

    this.changeLevel = function(){
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
        fade.onComplete.add(levelChanger.destroyGroups);
    };

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
        levelChanger.createLevel();
    };


    this.resetLevel = function() {
        currentLevel -= 1;
        // enemyCollision = false;
        levelChanger.changeLevel();
    };


};