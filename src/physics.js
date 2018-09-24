var Physics = function(game){

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
            var maxPlayerRotationSpeed = 0.25;

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
     * (there's a possibility this needs to be updated - maybe it turns the same direction every time? im not sure)
    */
    function radiansDelta(fromAngle, toAngle){
        return normalizedRadians(fromAngle - toAngle + Math.PI) - Math.PI;
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
            gravObject.body.applyForce(p.gravityForce * Math.cos(angle) * forceReducer * (distanceFromPlanet - p.width / 2),
                p.gravityForce * Math.sin(angle) * forceReducer * (distanceFromPlanet - p.width / 2));
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
            // console.log('limited speed to: '+ maxVelocity);
        }
    };

};