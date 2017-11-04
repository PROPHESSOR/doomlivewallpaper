'use strict';

const Main = require('./js/Main');
global.$ = $;

Main.run();

const Baron = new(require('./js/classes/Baron'));

Baron.sound('punch', false);