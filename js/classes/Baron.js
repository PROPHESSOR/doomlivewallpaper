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
				'bosse1',
				6,
				[[()=>this.move(this.calculateDirection(DoomGuy), 30)]]
			],
			[
				'bossf1',
				6,
				[[() => this.move(this.calculateDirection(DoomGuy), 30)]],
			],
			[
				'bossg1',
				6,
				[
					[() => this.move(this.calculateDirection(DoomGuy), 30)],
					// [this.sound, 'idle']
					[()=>new Projectile([this.x,this.y])],
					[this.sound, 'fire']
				]
			],
			// [
			// 	'bossd1',
			// 	6,
			// 	// [[this.move, this.calculateDirection(DoomGuy), 30]]
			// ],
			// [
			// 	'bossd1',
			// 	6,
			// 	// [[this.move, this.calculateDirection(DoomGuy), 30]]
			// 	[()=>new Projectile([this.x,this.y])],
			// 	[this.sound, 'fire']
			// ],
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