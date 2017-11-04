'use strict';

class Actor {
	constructor(sprite_folder = '', params = {}, spawn = []) {
		this.sprite_folder = sprite_folder;
		this._params = params;
		this._spawn = spawn;

		this.sounds = params.sounds || {
			'fire': null,
			'punch': null,
			'alert': null,
			'death': null,
			'idle': null,
		};
	}

	spawn(x,y){
		this.render(x,y);

	}

	render(x, y) {} //eslint-disable-line

	sound(name){
		//TODO:
	}
}

module.exports = Actor;