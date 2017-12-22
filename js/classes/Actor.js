/*
 * Copyright (c) 2017 PROPHESSOR
*/

'use strict';

/**
 * @namespace Actor
 * @class
 */

class Actor {

	/**
	 * @constructor
	 * @memberof Actor
	 * @param  {string} spriteFolder='' - Название папки со спрайтами актора
	 * @param  {object} params={} - Параметры актора
	 * @param  {array} spawn=[] - Координаты спавна
	 * @param {number} spawn.0 - X-координата
	 * @param {number} spawn.1 - Y-координата
	 */
	constructor(spriteFolder = '', params = {}, spawn = []) {
		this.spriteFolder = spriteFolder;
		this._params = params;
		this._spawn = spawn;
		this.element = Actor.createActorElement();
		[this.x, this.y] = spawn;
		[this.width, this.height] = [this.element.width, this.element.height];
		this.direction = params.direction || 1;
		this._soundChannel = 1;

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
			this.findState = this.findState.bind(this);
			this.gotoState = this.gotoState.bind(this);
			this.updateState = this.updateState.bind(this);
			this.setSprite = this.setSprite.bind(this);
		}

		this.spawn();


		// this.setSprite('bossa1');
	}

	/** Инициализировать состояния и запустить цикл (spawn)
	 */
	initStates() {
		this.gotoState('spawn');
		this.isGoto = false;
		this.updateState(0);
	}

	/** Развернуть на 180°
	 * @returns {number} Id направления
	 */
	reverseDirection() {
		this.direction = Actor.reverseDirection(this.angle);

		return this.direction;
	}

	/** Повернуться к
	 * @param  {Actor} target - Цель
	 */
	turnTo(target) {
		const data = Actor.calculateDirection(this, target);

		this.direction = data.direction;
		this.angle = data.angle;
	}

	/** Отобразить элемент на экране (append)
	 */
	spawn() {
		this.element.style.position = 'absolute';
		$('#main').append(this.element);
	}

	/** Отрисовать элемент
	 * @param  {number} x=this.x - X-координата
	 * @param  {number} y=this.y - Y-координата
	 */
	render(x = this.x, y = this.y) {
		this.element.style.left = `${x}px`;
		this.element.style.top = `${y}px`;
	}

	/** Воспроизвести звук
	 * @param  {string} sound - Имя файла без расширения (.ogg)
	 * @param  {bool} loop=false - Циклично?
	 * @param {number} channel=0 - Канал звука (1-5);
	 * @returns {undefined} ...
	 */
	sound(sound, loop = false, channel = 0) { //TODO: Проверка на наличие кодека
		if (!sound) {
			return console.warn('Нет звука для воспроизвидения!');
		}
		if (!channel){
			channel = this._soundChannel;
			this._soundChannel++;
			if (this._soundChannel > 5) this._soundChannel = 1;
		}
		const name = this.sounds[sound] || sound;
		const [player] = $(`#player${channel}`);

		player.src = `res/sounds/${name}.ogg`;
		player.loop = loop;
		player.play();
	}

	/** Искать состояние
	 * @param  {string} name - Состояние
	 * @returns {number} ID состояния в массиве
	 */
	findState(name) {
		name += ':'; //eslint-disable-line
		for (const i in this.states) {
			if (this.states[i] === name) {
				return i;
			}
		}

		return null;
	}

	/** Перейти к состоянию
	 * @param  {string} name - Состояние
	 * @returns {undefined} ...
	 */
	gotoState(name) {
		this.statePtr = this.findState(name);
		if (!this.statePtr) {
			return console.warn(`Unknown state ${name}`);
		}
		this.prevStateName = this.stateName;
		this.stateName = name;
		this.isGoto = true;
	}

	/** Получить длительность состояния
	 * @returns {number} Длительность
	 */
	getStateTime() {
		const state = this.states[this.statePtr];

		if (Array.isArray(state)) {
			return state[1] / 35 * 1000;
		}

		return 0;
	}

	/** Обновить состояние актора
	 * @param  {number} time - Длительность состаяния
	 */
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

	/** Тик
	 * @private
	 * @returns {undefined} ...
	 */
	tick() {
		const state = this.states[this.statePtr];

		if (typeof state === 'string') {
			if (state === 'loop') {
				this.gotoState(this.stateName);
				this.updateState(0);
			} else if (state === 'stop'){
				this.gotoState(this.prevStateName);
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
		if (time < 0) {
			return;
		}
		this.updateState(time);
	}

	/** Задать спрайт
	 * @param  {sting} name - Имя спрайта без расширения (.png)
	 * @returns {undefined} ...
	 */
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

	/**
	 * Проверяет на столкновение
	 * @param {object} object - Объект
	 * @returns {bool} True/false
	 */
	detectCollision(/* object */){
		//Actor.calculateDistance();
		return this;
	}

	/** Передвигает актора в направлении direction со скоростью speed
	 * @param  {number} direction - Направление
	 * @param  {number} speed - Спид
	 */
	move(direction, speed) {
		let xofs = speed * Math.sin(direction * Math.PI / 180);
		let yofs = -(speed * Math.cos(direction * Math.PI / 180));

		this.x += xofs;
		this.y += yofs;
	}

	//region static
	/** Создает HTML img элемент
	 * @private
	 * @static
	 * @returns {Image} Элемент
	 */
	static createActorElement() {
		return document.createElement('img');
	}

	/** Развернуть направление на 180 градусов
	 * @static
	 * @param  {number} angle - Направление в градусах
	 * @returns {number} - id направления
	 */
	static reverseDirection(angle) {
		return this.angle2direction(180 - angle);
	}

	/** Перевести градусы в id
	 * @static
	 * @param  {number} angle - Направление в градусах
	 * @returns {number} - id направления
	 */
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

	/** Рассчитать направление в сторону актора
	 * @static
	 * @param  {Actor} actor - Актор, относительно которого расчитывается направление
	 * @param  {Actor} target - Актор, в сторону которого расчитывается
	 * @returns {object} {angle, direction} - Направление в градусах и id
	 */
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

	/** Рассчитать растояние до объекта
	 * @static
	 * @param  {Actor} actor - Актор, относительно которого расчитывается растояние
	 * @param  {Actor} target - Актор, до которого расчитывается растояние
	 * @returns {number} Растояние
	 */
	static calculateDistance(actor, target) {
		//Модуль вектора this -> actor
		return Math.sqrt(Math.pow(target.x - actor.x, 2) + Math.pow(target.y - actor.y, 2));
	}

	/** Получить имя спрайта по номеру анимации и направления
	 * @static
	 * @param  {string} name - Префикс спрайта (4 буквы)
	 * @param  {number} animation=1 - Номер анимации
	 * @param  {number} direction=1 - Номер направления
	 * @returns {string} Название спрайта без расширения
	 */
	static getSpriteName(name, animation = 1, direction = 1) {
		const letters = [null,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];

		return name + letters[animation] + direction;
	}
	//endregion static
}

Actor.IDLE = 'IDLE'; //TODO: Сделать объекты с разными свойствами
Actor.SHOOTING = 'SHOOTING';
Actor.WALKING = 'WALKING';
Actor.DIED = 'DIED';

// module.exports = Actor;