'use strict';

// const Main = require('./js/Main');
// global.$ = $;

Main.run();
global.module = {};

// const _Baron = require('./js/classes/Baron');
let baron = new Baron([innerWidth/2,innerHeight/2]);
// Baron.sound('punch', false);