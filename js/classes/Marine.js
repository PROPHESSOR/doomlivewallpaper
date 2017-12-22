'use strict';

class Marine extends Actor{
	constructor(spawnxy){
		const spriteFolder = 'marine';
		const params = {
			'sounds': {
				'fire': 'DSFIRSHT',
				'punch': 'DSCLAW',
				'alert': 'DSBRSSIT',
				'death': 'DSBRSDTH',
				'idle': 'DSDMACT'
			}
		};
		const spawn = spawnxy || [0,0];

		super(spriteFolder, params, spawn);

		this.states = [
			'spawn:',
			[
				'playa1',
				6
			],
			[
				'playb1',
				6
			],
			[
				'playc1',
				6
			],
			[
				'playd1',
				6
			],
			'loop',

			'attack:',
			[
				'playe1',
				6,
				[[() => new Projectile([this.x, this.y], this.currentHate)]]
			],
			'stop',

			'death:',
			[
				'playf1',
				6,
				[[this.sound, 'DSPLDETH']]
			],
			[
				'tnta0',
				6,
				[
					[() => $(this.element).remove()]
					//TODO: Remove object
				]
			],
			'stop'
		];

		this.offsets = {
			'playa1': [0,0],
			'playb1': [0,0],
			'playc1': [0,0],
			'playd1': [0,0]
		};

		this.currentHate = null;

		this.initStates();
	}

	attack(target){
		this.currentHate = target;
		this.gotoState('attack');
	}
}