'use strict';

// const Actor = require('./Actor');

class Baron extends Actor{
	constructor(spawnxy){
		const sprite_folder = 'baron';
		const params = {
			sounds:{
				'fire': 'DSFIRSHT',
				'punch': 'DSCLAW',
				'alert': 'DSBRSSIT',
				'death': 'DSBRSDTH',
				'idle': 'DSDMACT',
			}
		};
		const spawn = spawnxy || [0,0];
		super(sprite_folder, params, spawn);

		this.states = [
			'spawn:',
			[
				'bossa1',
				6,
				[[this.move, 2, 50]]
			],
			[
				'bossb1',
				6,
				[[this.move, 2, 50]]
			],
			[
				'bossc1',
				6,
				[[this.move, 2, 50]]
			],
			[
				'bossd1',
				6,
				[[this.move, 2, 50]]
			],
			'loop'
		];
	
		this.offsets = {
			bossa1:[-19,-69],
			bossb1:[-23,-72],
			bossc1:[-20,-69],
			bossd1:[-24,-72],
		};

		this.initStates();
	}
}

// module.exports = Baron;