'use strict';

// const Actor = require('./Actor');

class Sergeant extends Actor {
	constructor(spawnxy) {
		const spriteFolder = 'sgt';
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

		/* eslint-disable indent */
		this.states = [
			'spawn:',
				[
					() => Actor.getSpriteName('spos',1,1),
					6,
					[[this.sound, 'DSPOSIT1']]
				],
				[
					() => Actor.getSpriteName('spos',1,this.direction),
					6,
					[[this.gotoState, 'walk']]
				],
			'stop',

			'walk:',
				[
					() => Actor.getSpriteName('spos',1,this.direction),
					6,
					[[this.turnTo, DoomGuy]]
				],
				[
					() => Actor.getSpriteName('spos',2,this.direction),
					6,
					[]
				],
				[
					() => Actor.getSpriteName('spos',3,this.direction),
					6,
					[[() => this.move(this.angle, 30)]]
				],
				[
					() => Actor.getSpriteName('spos',3,this.direction),
					12,
					[[this.gotoState, 'fire']]
				],
			'loop',

			'fire:',
				[
					() => Actor.getSpriteName('spos',5,this.direction),//'bosse1',
					6
				],
				[
					() => Actor.getSpriteName('spos',6,this.direction),//'bossf1',
					6
				],
				[
					() => Actor.getSpriteName('spos',7,this.direction),//'bossg1',
					6,
					[
						// [this.move, Actor.calculateDirection(this, DoomGuy).angle, 30],
						//[this.sound, 'idle']
						// [() => new Projectile([this.x, this.y], DoomGuy)],
						[this.sound, 'DSDSHTGN', false]
					]
				],
			'stop'
		];
		/* eslint-enable indent */

		/*this.offsets = {
			'bossa1': [-19, -69],
			'bossb1': [-23, -72],
			'bossc1': [-20, -69],
			'bossd1': [-24, -72]
		};*/

		this.initStates();
	}
}

// module.exports = Sergeant;