var Helper = function(game){

    var messageBack;
    var messageCaption;

//=======Messages================================================================================================
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
            messageGroup.z = 200;
            lastCaption = text;
           // console.log("add message with delay:,", delay);
            if (delay > 0) {
                messageTimer(delay); //fades message
            }
        }
    };

    //will start to fade the message after a delay
    function messageTimer(delay){
        game.time.events.add(Phaser.Timer.SECOND * delay, fadeMessage, this);
    }

    function fadeMessage(){
     //  adds a tween to fade the message out
        var bubbleTween = game.add.tween(messageBack).to( { alpha: 0 }, 400, Phaser.Easing.Linear.None, true); //100 -> 400
        var textTween = game.add.tween(messageCaption).to( { alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
        bubbleTween.onComplete.add(destroyMessage, this);
        textTween.onComplete.add(destroyMessage, this);
    }

    //remove message objects after the tween fade is complete, and remove them from the group
    function destroyMessage(){
        messageGroup.remove(messageBack);
        messageGroup.remove(messageCaption);
        messageBack.destroy();
       // console.log("destroyed messageBack");
        messageCaption.destroy();
       // console.log("destroyed caption");
    }

    //move the message relative to the player
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

//=======================================================================================================
//  ========== CONTACT CALLBACKS ========================================

// resets the level when player makes contact with an enemy
    this.enemyContactCallback = function(body1, body2, fixture1, fixture2, begin) {
        if (!begin) {
            return;
        }
        // if (enemyCounterClockwise === -1) { //switches the enemyCounterClockwise boolean so enemy can move the other way
        //     enemyCounterClockwise = 0;
        // } else {
        //     enemyCounterClockwise = -1;
        // }
        levelChanger.resetLevel();
        playingNow = false;

        //helper.deadByEnemy();
    };


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

    //will start event to fade startPad a certain amount of time after it register the player's contact.
    this.startPadContactCallback = function(body1,body2,fixture1,fixture2,begin){
        if (!begin){
            return;
        }
        game.time.events.add(Phaser.Timer.SECOND* 0.6, levelChanger.fadeStartPad, this);
    };


    // a custom function to check player contact with the teleporter.
    this.checkTeleporterOverlap = function(teleporter) {
            //console.log("overlap called");
            var teleporterBounds = teleporter.getBounds();
            var playerBounds = player.getBounds();
            if (Phaser.Rectangle.contains(teleporterBounds, playerBounds.centerX, playerBounds.centerY)){
              //  console.log('teleporter CONTACT');
                if(score < levelGoal) {
                    this.addMessage("This portal is broken.\nCollect gears to repair.", 3);
                } else {
                    playingNow = false;
                    console.log("level beaten");
                    levelChanger.changeLevel();
                }
            }

    };

//==============================================================================================================
    // ==================== OTHER HELPER FUNCTIONS ==============================

    //changes the x & y velocty of the player for every arrow key press, and changes the animation
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

    //moves the dashboard relative to the player
    this.moveDashboard = function(angle){
        for(var i = 0; i < dashboardGroup.total; i ++) {
            var d = dashboardGroup.getChildAt(i);
            d.x = player.x + 353 * Math.cos(angle);
            d.y = player.y + 353 * Math.sin(angle);
            d.angle = angle * 180 / Math.PI - 90;
        }
    };

    this.pauseGame = function(){
        pause.frame = 1;
        game.paused = true;
    };

    this.unPauseGame = function(event){
        var pauseButton = pause.getBounds();
        if(Phaser.Rectangle.contains(pauseButton,event.x,event.y)) {
            game.paused = false;
            pause.frame = 0;
        }
    };

    this.muteSound = function(){
        if(game.sound.mute===false){
            game.sound.mute = true;
            mute.loadTexture('mute', 0);
        } else {
            game.sound.mute = false;
            mute.loadTexture('unMute', 0);
        }
    };
};