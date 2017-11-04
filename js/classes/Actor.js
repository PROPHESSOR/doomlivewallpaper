'use strict';

class Actor {
	constructor(sprite_folder = '', params = {}, spawn = []) {
		this.sprite_folder = sprite_folder;
		this._params = params;
		this._spawn = spawn;

		this.states = [
			[
				null, // Sprite name (null = no sprite)
				-1 // animation length (-1 = infinite)
			]
		];
	}

	render(x, y) {} //eslint-disable-line


}

module.exports = Actor;