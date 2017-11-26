'use strict';

class Actor {
	constructor(spriteFolder = '', params = {}, spawn = []) {
		this.spriteFolder = spriteFolder;
		this._params = params;
		this._spawn = spawn;
		this.element = Actor.createActorElement();
		[this.x, this.y] = spawn;
		this.direction = params.direction || 1;

		this.sounds = params.sounds || {
			'alert': null,
			'death': null,
			'fire': null,
			'punch': null,
			'idle': null
		};

		this.sprites = params.sprite || {};

		this.timer = null;
		this.states = [
			'spawn:', // State label
			[
				null, // Sprite name (null = no sprite)
				-1, // animation length (-1 = infinite)
				[] // code pointers
			],
			'loop'
		];

		this.offsets = {};

		//This binders
		// Binder.bindAll(this);
		{
			this.tick = this.tick.bind(this);
			this.move = this.move.bind(this);
			this.sound = this.sound.bind(this);
			this.turnTo = this.turnTo.bind(this);
		}

		this.spawn();


		// this.setSprite('bossa1');
	}

	initStates() {
		this.gotoState('spawn');
		this.isGoto = false;
		this.updateState(0);
	}

	reverseDirection() {
		this.direction = Actor.reverseDirection(this.angle);

		return this.direction;
	}

	turnTo(target) {
		const data = Actor.calculateDirection(this, target);

		this.direction = data.direction;
		this.angle = data.angle;
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
		if (!sound) {
			return console.warn('Нет звука для воспроизвидения!');
		}
		const name = this.sounds[sound] || sound;
		const [player] = $('#player');

		player.src = `res/sounds/${name}.ogg`;
		player.loop = loop;
		player.play();
	}

	findState(name) {
		name += ':'; //eslint-disable-line
		for (const i in this.states) {
			if (this.states[i] === name) {
				return i;
			}
		}

		return null;
	}

	gotoState(name) {
		this.statePtr = this.findState(name);
		if (!this.statePtr) {
			return console.warn(`Unknown state ${name}`);
		}
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
			this.timer = setTimeout(this.tick, time);
		}
	}

	tick() {
		const state = this.states[this.statePtr];

		if (typeof state === 'string') {
			if (state === 'loop') {
				this.gotoState(this.stateName);
				this.updateState(0);
			} else if (state[0] === ':') {
				this.gotoState(state.slice(1));
				this.updateState(0);
			} else if (state.slice(-1) === ':') {
				this.statePtr++;
				this.updateState(0);

				return;
			}
		} else {
			if (typeof state[0] === 'string') {
				this.setSprite(state[0]);
			} else if (typeof state[0] === 'function') {
				this.setSprite(state[0]());
			} else if (state[0] instanceof Array) {
				this.setSprite(Actor.getSpriteName(state[0][0], state[0][1], state[0][2]));
			}
			if (state[2]) {
				for (let i = 0; i < state[2].length; i++) {

					/*()=>*/
					state[2][i][0](...state[2][i].slice(1));
				}
			}
		}
		const time = this.getStateTime();

		!this.isGoto ? this.statePtr++ : this.isGoto = false; // eslint-disable-line
		//TODO: eslint
		if (time < 0) {
			return;
		}
		this.updateState(time);
	}

	setSprite(name) {
		let el = this.element;

		if (!name) {
			return void(el.style.display = 'none');
		}
		el.style.display = '';
		if (this.offsets[name]) {
			this.render(this.x + this.offsets[name][0], this.y + this.offsets[name][1]);
		} else {
			this.render(this.x, this.y);
		}
		el.src = `res/${this.spriteFolder}/${name}.png`;
	}

	move(direction, speed) {
		let xofs = speed * Math.sin(direction * Math.PI / 180);
		let yofs = -(speed * Math.cos(direction * Math.PI / 180));

		this.x += xofs;
		this.y += yofs;
	}

	//region static
	static createActorElement() {
		return document.createElement('img');
	}

	static reverseDirection(angle) {
		return this.angle2direction(180 - angle);
	}

	static angle2direction(angle) {
		if (angle >= -22.5 && angle <= 22.5) {
			return 5;
		}
		if (angle >= 22.5 && angle <= 67.5) {
			return 6;
		}
		if (angle >= 67.5 && angle <= 112.5) {
			return 7;
		}
		if (angle >= 112.5 && angle <= 157.5) {
			return 8;
		}
		if (angle >= 157.5 && angle <= -157.5) {
			return 1;
		}
		if (angle >= -157.5 && angle <= -112.5) {
			return 2;
		}
		if (angle >= -112.5 && angle <= -67.5) {
			return 3;
		}
		if (angle >= -67.5 && angle <= -22.5) {
			return 4;
		}
		console.warn(`Bad angle ${angle}°`);

		return 1;
	}

	static calculateDirection(actor, target) {
		//На опережение
		let angle = Math.atan2(target.x - actor.x, -(target.y - actor.y)) * 180.0 / Math.PI;
		let direction = this.angle2direction(angle);
		// if (target.state == Actor.WALKING || target.state == Actor.SHOOTING) { //x/yLoc

		// angle = Math.atan2(target.x - actor.x, -(target.y - actor.y));
		// }

		return {
			angle,
			direction
		};
		// return angle;
	}

	static calculateDistance(actor, target) {
		//Модуль вектора this -> actor
		return Math.sqrt(Math.pow(target.x - actor.x, 2) + Math.pow(target.y - actor.y, 2));
	}

	static getSpriteName(name, animation = 1, direction = 1) {
		const letters = [null,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];

		return name + letters[animation] + direction;
	}

	static get IDLE(){
		return 'IDLE'; //TODO: Сделать объекты с разными свойствами
	}

	static get SHOOTING(){
		return 'SHOOTING';
	}

	static get WALKING(){
		return 'WALKING';
	}

	static get DIED(){
		return 'DIED';
	}
	//endregion static
}

// module.exports = Actor;