'use strict';

// const Actor = require('./Actor');

class Baron extends Actor {
	constructor(spawnxy) {
		const spriteFolder = 'baron';
		const params = {
			'sounds': {
				'fire': 'DSFIRSHT',
				'punch': 'DSCLAW',
				'alert': 'DSBRSSIT',
				'death': 'DSBRSDTH',
				'idle': 'DSDMACT'
			}
		};
		const spawn = spawnxy || [0, 0];

		super(spriteFolder, params, spawn);

		this.states = [
			'spawn:',
			[
				() => Actor.getSpriteName('boss',1,this.direction),
				6,
				[[this.turnTo, DoomGuy]]
			],
			[
				() => Actor.getSpriteName('boss',2,this.direction),
				6,
				[]
			],
			[
				() => Actor.getSpriteName('boss',3,this.direction),
				6,
				[[() => this.move(this.angle, 30)]]
			],
			'loop',
			'fire:',
			[
				'bosse1',
				6, []
			],
			[
				'bossf1',
				6
			],
			[
				'bossg1',
				6, [
					[this.move, Actor.calculateDirection(this, DoomGuy).angle, 30],
					//[this.sound, 'idle']
					[() => new Projectile([this.x, this.y], DoomGuy)]
				]
			],
			'loop'
		];

		/*this.offsets = {
			'bossa1': [-19, -69],
			'bossb1': [-23, -72],
			'bossc1': [-20, -69],
			'bossd1': [-24, -72]
		};*/

		this.initStates();
	}
}

// module.exports = Baron;