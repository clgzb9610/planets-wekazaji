/*
    *Creates and sets up enemy sprite based on the parameters passed by the levels and adds it to the game
 */

var Enemy = function (game, x, y, enemyVel) {
    this.sprite = game.add.sprite(x, y, 'enemy');

    this.enemyVel = enemyVel;
    this.maxEnemyVel = 200;

    if (this.maxEnemyVel < this.enemyVel) {
        this.enemyVel = this.maxEnemyVel; //incase enemyVel > 200
    }

    game.physics.box2d.enable(this.sprite);
    this.sprite.body.static = false;
    this.sprite.body.setRectangle(20,43);
    this.sprite.body.setCollisionCategory(1);
    this.sprite.body.setCollisionMask(1);
    player.body.setBodyContactCallback(this.sprite, helper.enemyContactCallback, this); //sets up function called if player collides with enemy
    this.sprite.animations.add('moveR', [0, 1, 2], 7, true);
    this.sprite.animations.add('moveL', [3, 4, 5], 7, true);

    enemyGroup.add(this.sprite);

    game.add.existing(this.sprite);



};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.create = function() {
};

Enemy.prototype.update = function() {
    this.enemyAngle = this.handleEnemyRotation(this.sprite);

    // Keep the enemy moving
    this.sprite.body.velocity.x += this.enemyVel * Math.cos(this.enemyAngle - (Math.PI / 2)) ;
    this.sprite.body.velocity.y += this.enemyVel * Math.sin(this.enemyAngle - (Math.PI / 2)) ;
    this.sprite.animations.play('moveL');


    // This is code if we desire the enemy to move counter clockwise after impact!
    // if (enemyCounterClockwise === -1) {
    //     this.sprite.body.velocity.x += this.enemyVel * Math.cos(this.enemyAngle - (Math.PI / 2)) ;
    //     this.sprite.body.velocity.y += this.enemyVel * Math.sin(this.enemyAngle - (Math.PI / 2)) ;
    //     this.sprite.animations.play('moveL');
    // } else {
    //     this.sprite.body.velocity.x += this.enemyVel * Math.cos(this.enemyAngle + (Math.PI / 2)) ;
    //     this.sprite.body.velocity.y += this.enemyVel * Math.sin(this.enemyAngle + (Math.PI / 2)) ;
    //     this.sprite.animations.play('moveR');
    // }

    gamePhysics.constrainVelocity(this.sprite,this.maxEnemyVel);

    this.sprite.update();
};

// ---


/* calculates angle between the enemy and the planet it is gravitationally attracted to.
 * Orients the enemy's feet to the ground.
*/
Enemy.prototype.handleEnemyRotation = function(sprite) {
    var angle = this.enemyGravityToPlanets(sprite);
    if (angle > -361) { // angle == -361 if the player is not in any gravity field.
        // orients players feet toward the ground. Uses var angle as degrees offset by -90
        sprite.body.angle = angle * 180 / Math.PI - 90;
        this.enemyLastAngle = angle;
    } else {
        angle = this.enemyLastAngle;
    }
    return angle;
};


/*
 * Similar to the physics.js/gravityToPlanets(), which has the necessary documentation
 */
Enemy.prototype.enemyGravityToPlanets = function(gravObject) {
    var p = gamePhysics.findClosestPlanet(gravObject);
    var distanceFromPlanet = Phaser.Math.distance(gravObject.x,gravObject.y,p.x,p.y);
    var angle = Phaser.Math.angleBetween(gravObject.x,gravObject.y,p.x,p.y);

    this.sprite.body.applyForce(p.gravityForce * Math.cos(angle) * forceReducer * (distanceFromPlanet - p.width / 2),
        p.gravityForce * Math.sin(angle) * forceReducer * (distanceFromPlanet - p.width / 2));
    this.sprite.body.angle = angle;

    return angle;
};


/*
  * Destroys the sprite for levelChange
 */
Enemy.prototype.destroySprite = function() {
    this.sprite.destroy();
};