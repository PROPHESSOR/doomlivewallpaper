'use strict';

class Actor {
	constructor(sprite_folder = '', params = {}, spawn = []) {
		this.sprite_folder = sprite_folder;
		this._params = params;
		this._spawn = spawn;
		this.element = Actor.createActorElement();
		this.x = spawn[0];
		this.y = spawn[1];
		this.direction = params.direction || 1;

		this.sounds = params.sounds || {
			'fire': null,
			'punch': null,
			'alert': null,
			'death': null,
			'idle': null,
		};

		this.sprites = params.sprite || {

		};

		this.timer = null;
		this.states = [
			'spawn:', // State label
			[
				null, // Sprite name (null = no sprite)
				-1, // animation length (-1 = infinite)
				[], // code pointers
			],
			'loop',
		];

		this.offsets = {};

		//This binders
		// Binder.bindAll(this);
		{
			this.tick = this.tick.bind(this);
			this.move = this.move.bind(this);
			this.sound = this.sound.bind(this);
		}

		this.spawn();



		// this.setSprite('bossa1');
	}

	initStates() {
		this.gotoState('spawn');
		this.isGoto = false;
		this.updateState(0);
	}
	//region static
	static createActorElement() {
		return document.createElement('img');
	}

	static reverseDirection(direction){
		/* 
			case 5: //up
			case 6: //up-right
			case 7: //right
			case 8: //down-right
			case 1: //down
			case 2: //down-left
			case 3: //left
			case 4: //up-left
		*/
		switch (direction) {
		case 1:
			return 5;
		case 2:
			return 6;
		case 3:
			return 7;
		case 4:
			return 8;
		case 5:
			return 1;
		case 6:
			return 2;
		case 7:
			return 3;
		case 8:
			return 4;
		default:
			console.warn('Actor.reverseDirection() => Direction isn\'t in [1,8]');
		}
	}

	static calculateDirection(actor, target) {
		//На опережение
		let angle; // = Math.atan2(this.xSpeed, -this.ySpeed) * 180. / Math.PI;
		let direction;
		// if (target.state == Actor.WALKING || target.state == Actor.SHOOTING) { //x/yLoc
		angle = Math.atan2(target.x - actor.x, -(target.y - actor.y)) * 180. / Math.PI;
		// }

		if (angle >= -22.5 && angle <= 22.5) {
			direction = 5;
			return direction;
		}
		if (angle >= 22.5 && angle <= 67.5) {
			direction = 6;
			return direction;
		}
		if (angle >= 67.5 && angle <= 112.5) {
			direction = 7;
			return direction;
		}
		if (angle >= 112.5 && angle <= 157.5) {
			direction = 8;
			return direction;
		}
		if (angle >= 157.5 || angle <= -157.5) {
			direction = 1;
			return direction;
		}
		if (angle >= -157.5 && angle <= -112.5) {
			direction = 2;
			return direction;
		}
		if (angle >= -112.5 && angle <= -67.5) {
			direction = 3;
			return direction;
		}
		if (angle >= -67.5 && angle <= -22.5) {
			direction = 4;
			return direction;
		}
		direction = 1;
		return direction;
	}

	static calculateDistance(actor, target) {
		//Модуль вектора this -> actor
		return Math.sqrt(Math.pow(target.x - actor.x, 2) + Math.pow(target.y - actor.y, 2));
	}
	//endregion static

	reverseDirection(){
		this.direction = Actor.reverseDirection(this.direction);
		return this.direction;
	}

	calculateDirection(target) {
		//На опережение
		let angle; // = Math.atan2(this.xSpeed, -this.ySpeed) * 180. / Math.PI;

		// if (target.state == Actor.WALKING || target.state == Actor.SHOOTING) { //x/yLoc
		angle = Math.atan2(target.x - this.x, -(target.y - this.y)) * 180. / Math.PI;
		// }

		if (angle >= -22.5 && angle <= 22.5) {
			this.direction = 5;
			return this.direction;
		}
		if (angle >= 22.5 && angle <= 67.5) {
			this.direction = 6;
			return this.direction;
		}
		if (angle >= 67.5 && angle <= 112.5) {
			this.direction = 7;
			return this.direction;
		}
		if (angle >= 112.5 && angle <= 157.5) {
			this.direction = 8;
			return this.direction;
		}
		if (angle >= 157.5 || angle <= -157.5) {
			this.direction = 1;
			return this.direction;
		}
		if (angle >= -157.5 && angle <= -112.5) {
			this.direction = 2;
			return this.direction;
		}
		if (angle >= -112.5 && angle <= -67.5) {
			this.direction = 3;
			return this.direction;
		}
		if (angle >= -67.5 && angle <= -22.5) {
			this.direction = 4;
			return this.direction;
		}
		this.direction = 1;
		return this.direction;
	}

	calculateDistance(actor) {
		//Модуль вектора this -> actor
		return Math.sqrt(Math.pow(actor.x - this.x, 2) + Math.pow(actor.y - this.y, 2));
	}

	spawn() {
		this.element.style.position = 'absolute';
		$('#main').append(this.element);
	}

	render(x = this.x, y = this.y) {
		this.element.style.left = `${x}px`;
		this.element.style.top = `${y}px`;
	}

	sound(sound, loop = false) { //TODO: Проверка на наличие кодека
		if (!sound) return console.warn('Нет звука для воспроизвидения!');
		const name = this.sounds[sound] || sound;
		const player = $('#player')[0];
		player.src = `res/sounds/${name}.ogg`;
		player.loop = loop;
		player.play();
	}

	findState(name) {
		name += ':';//eslint-disable-line
		for (const i in this.states) {
			if (this.states[i] == name) return i;
		}
		return null;
	}

	gotoState(name) {
		this.statePtr = this.findState(name);
		if (!this.statePtr) return console.warn('Unknown state ' + name);
		this.stateName = name;
		this.isGoto = true;
	}

	getStateTime() {
		const state = this.states[this.statePtr];
		if (Array.isArray(state)) {
			return state[1] / 35 * 1000;
		}
		return 0;
	}

	updateState(time) {
		if (this.timer) {
			try {
				clearTimeout(this.timer);
			} catch (e) {
				// ignore
			}
		}
		if (!time || time < 0) {
			this.tick();
		} else {
			this.timer = setTimeout(/*()=>*/this.tick/* () */, time);
		}
	}

	tick() {
		console.log(this.statePtr);
		const state = this.states[this.statePtr];
		if (typeof state == 'string') {
			if (state == 'loop') {
				this.gotoState(this.stateName);
				this.updateState(0);
			} else if (state[0] == ':') {
				this.gotoState(state.slice(1));
				this.updateState(0);
			} else if (state.slice(-1) == ':') {
				this.statePtr++;
				this.updateState(0);
				return;
			}
		} else {
			this.setSprite(state[0]);
			if (state[2])
				for (let i = 0; i < state[2].length; i++) {
					/*()=>*/state[2][i][0](...(state[2][i].slice(1)));
				}
		}
		const time = this.getStateTime();
		!this.isGoto ? this.statePtr++ : this.isGoto = false;
		if (time < 0) return;
		this.updateState(time);
	}

	setSprite(name) {
		let el = this.element;
		if (!name) return void(el.style.display = 'none');
		el.style.display = '';
		if (this.offsets[name]) {
			this.render(this.x + this.offsets[name][0], this.y + this.offsets[name][1]);
		} else {
			this.render(this.x, this.y);
		}
		el.src = `res/${this.sprite_folder}/${name}.png`;
	}

	move(direction, speed) {
		switch (direction) {
		case 5: //up
			this.y -= speed / 10;
			break;
		case 6: //up-right
			this.x += speed / 10;
			this.y -= speed / 10;
			break;
		case 7: //right
			this.x += speed / 10;
			break;
		case 8: //down-right
			this.x += speed / 10;
			this.y += speed / 10;
			break;
		case 1: //down
			this.y += speed / 10;
			break;
		case 2: //down-left
			this.x -= speed / 10;
			this.y += speed / 10;
			break;
		case 3: //left
			this.x -= speed / 10;
			break;
		case 4: //up-left
			this.x -= speed / 10;
			this.y -= speed / 10;
			break;
		default:
			return console.warn('API.move() direction is not in [1,8]');
		}
	}
}

// module.exports = Actor;