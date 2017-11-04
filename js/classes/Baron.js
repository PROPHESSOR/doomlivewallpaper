'use strict';

const Actor = require('./Actor');

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
	}
}

module.exports = Baron;