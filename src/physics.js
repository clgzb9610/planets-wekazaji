var Physics = function(game){

    /* calculates angle between the player and the planet it is gravitationally attracted to.
    * Orients the player's feet to the ground & handles all the world rotation.
    */
    this.handlePlayerRotation = function(player){
        // These parameters control how fast the player rotates to keep their feet pointing
        // down as they move through gravity fields, and how fast the camera rotates to keep
        // up with the player.
        //
        // The two *MaxRotationRate values limit how fast each rotation can happen in radians/sec.
        //
        // The two *RotationEagerness values control how quickly each rotation works toward
        // its goal when the current and target angles are close. Lower values cause the
        // player/camera to drift gently to rest; higher values cause it to stop abruptly.
        //
        // Note that the keyboard control work relative to the camera angle, so low camera
        // rotate parameters can make the player launch off the ground even when pressing
        // only left/right.
        //
        const playerMaxRotationRate = 8;
        const playerRotationEagerness = 7;
        const cameraMaxRotationRate = 4.2;
        const cameraRotationEagerness = 10;

        var angleToPlanet = gravityToPlanets(player);
        var playerAngle = Phaser.Math.degToRad(player.body.angle + 90);
        var cameraAngle = -game.world.rotation + Math.PI / 2;

        if (angleToPlanet != -361) { // angle == -361 if the player is not in any gravity field.
            player.body.angularVelocity = radiansRotation(
                playerAngle, angleToPlanet,
                playerRotationEagerness,
                playerMaxRotationRate);

            cameraAngle += radiansRotation(
                cameraAngle, playerAngle,
                cameraRotationEagerness * game.time.physicsElapsed, // multiply by physics dt because we're doing
                cameraMaxRotationRate * game.time.physicsElapsed);  // absolute addition, not setting velocity
        }

        game.world.pivot.x = player.x;          //these two rotate the world around the player
        game.world.pivot.y = player.y;
        game.world.rotation = -cameraAngle + Math.PI / 2;     //rotates the world so the controls aren't global

        return cameraAngle;
    };

    /**
     * A rotation from fromAngle in the direction of toAngle, multiplied by rate,
     * then pinned to the range [-maxStep, maxStep].
     */
    function radiansRotation(fromAngle, toAngle, rate, maxStep) {
        return Math.min(maxStep,
            Math.max(-maxStep,
                radiansDelta(fromAngle, toAngle) * rate));
    };

    /* Shortest distance between two angles in range -pi to pi.
     * (there's a possibility this needs to be updated - maybe it turns the same direction every time? im not sure)
    */
    function radiansDelta(fromAngle, toAngle){
        return normalizedRadians(toAngle - fromAngle + Math.PI) - Math.PI;
    }

    /* normalizes a angle to the range 0 to 2 pi.
    */
    function normalizedRadians(rawAngle){
        var TAU = Math.PI * 2;
        return ((rawAngle % TAU) + TAU) % TAU;
    }

    /*
    This is the code that calculates gravity fields for the player, if they are in the radius.
    function returns -361, which is impossible in radian angles,
    if the player is not in any gravity radius.
    */
    function gravityToPlanets(gravObject){
        var angle = -361;
        // looping through all planets
        var p = gamePhysics.findClosestPlanet(gravObject);

        if(p !== undefined) {
            var distanceFromPlanet = Phaser.Math.distance(gravObject.x, gravObject.y, p.x, p.y);

            // calculating angle between the planet and the crate
            angle = Phaser.Math.angleBetween(gravObject.x, gravObject.y, p.x, p.y);

            // add gravity force to the gravObject in the direction of planet center
            gravObject.body.applyForce(
                p.gravityForce * Math.cos(angle) * forceReducer * (distanceFromPlanet),
                p.gravityForce * Math.sin(angle) * forceReducer * (distanceFromPlanet));
        }
        return angle;
    }

    /* finds which planet the gravityObject is closest to, if it is within a gravity field.
    * returns undefined if the object is outside all gravity fields.
    */
    this.findClosestPlanet = function(gravObject){
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
    };

    /* apply gravity to the things in the objectGroup
     *
     */
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
        }
    };

};