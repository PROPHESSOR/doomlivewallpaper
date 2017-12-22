'use strict';

class Projectile extends Actor{
	constructor(spawnxy, target){
		const spriteFolder = 'balls';
		const params = {
			'sounds': {
				'fire': null,
				'punch': null,
				'alert': 'DSSKEATK',
				//'DSBAREXP'
				'death': 'DSBRSDTH',
				'idle': null
			}
		};
		const spawn = spawnxy || [0,0];

		super(spriteFolder, params, spawn);

		this.states = [
			'spawn:',
			[
				'bal7a1a5',
				4,
				[
					[this.move, Actor.calculateDirection(this, target).angle, 45],
					[
						() => {
							// target.kill(); //FIXME: Это не так должно работать
						}
					]
				]
			],
			'loop'
		];

		this.offsets = {'bal7a1a5': [0,0]};

		this.initStates();
	}
}