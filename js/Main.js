'use strict';

const Main = {
	run(){
		console.log('Run...');
		this.Background.render();
	},

	Background:{
		render(name = 'bg1'){
			$('#main').css('background-image', `url(res/bg/${name}.jpg)`);
		}
	},

	gameLoop(){
		//TODO: Научиться кодить игры
	}
};

// module.exports = Main;