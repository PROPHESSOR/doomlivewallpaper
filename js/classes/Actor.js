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
		this.gotoState('spawn');
		this.isGoto = false;
		this.updateState(0);
	}

	spawn(x,y){
		this.render(x,y);

	}

	render(x, y) {} //eslint-disable-line

	sound (name){
		// TODO:
	}
	
	findState(name) {
		name += ':';
		for(let i = 0; i < this.states; i++) {
			if(this.states[i] == name) return i;
		}
		return null;
	}

	gotoState(name) {
		this.statePtr = this.findState(name);
		if(!this.statePtr) return console.warn('Unknown state ' + name);
		this.stateName = name;
		this.isGoto = true;
	}

	getStateTime() {
		const state = this.states[this.statePtr];
		if(Array.isArray(state)) {
			return state[1];
		}
		return 0;
	}

	updateState(time) {
		if(this.timer) {
			try {
				clearTimeout(this.timer);
			} catch(e) {
				// ignore
			}
		}
		if(time < 0) {
			// do nothing
		} else if(!time) {
			this.tick();
		} else {
			this.timer = setTimeout(this.tick, this.getStateTime());
		}
	}

	tick() {
		const state = this.states[this.statePtr];
		if(typeof state == 'string') {
			if(state == 'loop') {
				this.gotoState(this.stateName);
				this.updateState(0);
			} else if(state[0] == ':') {
				this.gotoState(state.slice(1));
				this.updateState(0);
			} else if(state.slice(-1) == ':') {
				this.statePtr++;
				this.updateState(0);
				return;
			}
		} else {
			this.setSprite(state[0]);
			for(let i = 0; i < state[2].length; i++) {
				state[2][i][0](...(state[2][i].slice(1)));
			}
		}
		const time = state[1];
		if(!this.isGoto) {
			this.statePtr++;
		}
		this.updateState(time);
	}

	setSprite(name) {
		// TODO: implement
	}

	render(x, y) {} //eslint-disable-line=
}

module.exports = Actor;