'use strict';

class Marine extends Actor{
	constructor(spawnxy){
		const sprite_folder = 'marine';
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

		super(sprite_folder, params, spawn);

		this.states = [
			'spawn:',
			[
				'playa1',
				6,
				[
					// [this.move, 2, 50]
				]
			],
			[
				'playb1',
				6
				// [[this.move, 2, 50]]
			],
			[
				'playc1',
				6,
				[
					// [this.move, 2, 50],
					// [this.sound, 'idle']
				]
			],
			[
				'playd1',
				6
				// [[this.move, 2, 50]]
			],
			'loop'
		];

		this.offsets = {
			'playa1': [0,0],
			'playb1': [0,0],
			'playc1': [0,0],
			'playd1': [0,0]
		};

		this.initStates();
	}
}

// module.exports = Baron;