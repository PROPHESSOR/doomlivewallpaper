'use strict';

// const Main = require('./js/Main');
// global.$ = $;

Main.run();
global.module = {};

let DoomGuy = new Marine([125,25]);

// const _Baron = require('./js/classes/Baron');
let baron = new Baron([innerWidth/2,innerHeight/2]);
// Baron.sound('punch', false);

document.addEventListener('click', function(e){
	DoomGuy.x = e.pageX;
	DoomGuy.y = e.pageY;
	DoomGuy.render();//e.pageX,e.pageY);
}, false);

document.addEventListener('contextmenu', function(e){
	e.preventDefault();
	new Sergeant([innerWidth/4,innerHeight/4]);
}, false);