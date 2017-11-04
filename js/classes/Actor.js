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

	sound(sound, loop = false){ //TODO: Проверка на наличие кодека
		if(!sound) return console.warn('Нет звука для воспроизвидения!');
		const name = this.sounds[sound] || sound;
		const player = $('#player')[0];
		player.src = `res/sounds/${name}.ogg`;
		player.loop = loop;
		player.play();
	}
}

module.exports = Actor;