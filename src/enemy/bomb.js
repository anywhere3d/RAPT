RAPT.BOMB_RADIUS = 0.15;

RAPT.Bomb = function (center, velocity) {
	RAPT.FreefallEnemy.call(this, RAPT.ENEMY_BOMB, center, RAPT.BOMB_RADIUS, 0);
	this.velocity = velocity;

	this.sprite =  new RAPT.SpriteGroup({
		name:'bombe',
		material:RAPT.MAT_ENEMY,
		size : 1,
		nuv:16,
		uvs:[[6,0]],
		list:['bombe']
	});
	this.sprite.moveto(center);
}

RAPT.Bomb.prototype = Object.create( RAPT.FreefallEnemy.prototype );

RAPT.Bomb.prototype.afterTick = function(seconds) {
	this.sprite.moveto(this.hitCircle.center);
};

// bomb particle effects
RAPT.Bomb.prototype.onDeath = function() {
	this.sprite.remove();
	var position = this.getShape().getCenter();

	// fire
	for (var i = 0; i < 50; ++i) {
		var direction = new RAPT.Vector().fromAngle(RAPT.randInRange(0, 2 * Math.PI)).mul(RAPT.randInRange(0.5, 7));
		RAPT.Particle().position(position).velocity(direction).radius(0.02, 0.15).bounces(0, 4).elasticity(0.05, 0.9).decay(0.00001, 0.0001).expand(1.0, 1.2).color(1, 0.5, 0, 1).mixColor(1, 1, 0, 1).triangle().fixangle();
	}

	// white center
	// collide should be false on this
	RAPT.Particle().position(position).radius(0.1).bounces(0).gravity(false).decay(0.000001).expand(10).color(1, 1, 1, 5).circle();
};