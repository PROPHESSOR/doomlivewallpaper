'use strict';

class Projectile extends Actor{
	constructor(spawnxy){
		const sprite_folder = 'balls';
		const params = {
			sounds:{
				'fire': null,
				'punch': null,
				'alert': 'DSSKEATK',
				'DSBAREXP': 'DSBRSDTH',
				'idle': null,
			}
		};
		const spawn = spawnxy || [0,0];
		super(sprite_folder, params, spawn);

		this.states = [
			'spawn:',
			[
				'bal7a1a5',
				4,//6,
				[[this.move, this.calculateDirection(DoomGuy), 100]]
			],
			// [
			// 	'bossb1',
			// 	6,
			// 	[[this.move, 2, 50]]
			// ],
			// [
			// 	'bossc1',
			// 	6,
			// 	[[this.move, 2, 50]]
			// ],
			// [
			// 	'bossd1',
			// 	6,
			// 	[[this.move, 2, 50]]
			// ],
			'loop'
		];
	
		this.offsets = {
			bal7a1a5:[0,0]
			// bossa1:[-19,-69],
			// bossb1:[-23,-72],
			// bossc1:[-20,-69],
			// bossd1:[-24,-72],
		};

		this.initStates();
	}
}

// module.exports = Projectile;