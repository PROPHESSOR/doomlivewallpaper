'use strict';

const Sound = new class {
	constructor(channels){
		//TODO: Create players
		this._channels = channels;
		this._channel = 1;

		{
			this.play = this.play.bind(this);
		}
	}

	play(sound, loop = false, channel = 0){
		if (!sound) return console.error('Нет звука для воспроизведения');
		if (!channel){
			channel = this._channel;
			this._channel++;
			if (this._channel > this._channels) this._channel = 1;
		}
		const [player] = $(`#player${channel}`);

		player.src = sound;
		player.loop = loop;
		player.play();
	}
}(5);