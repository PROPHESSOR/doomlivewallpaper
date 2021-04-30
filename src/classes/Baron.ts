"use strict";

import { Vec2 } from '../Utils';
import Actor from './Actor';

export default class Baron extends Actor {
  constructor(spawn = new Vec2(0, 0)) {
    const spriteFolder = "baron";

    super(spriteFolder, {}, spawn);

    /* eslint-disable indent */
    this.states = [
      "spawn:",
      [() => Actor.getSpriteName("boss", 1, 1), 6, [[this.sound, "DSBRSSIT"]]],
      [
        () => Actor.getSpriteName("boss", 1, this.direction),
        6,
        [[this.gotoState, "walk"]],
      ],
      "stop",

      "walk:",
      [
        () => Actor.getSpriteName("boss", 1, this.direction),
        6,
        [/* [this.turnTo, DoomGuy] */],
      ],
      [() => Actor.getSpriteName("boss", 2, this.direction), 6, []],
      [
        () => Actor.getSpriteName("boss", 3, this.direction),
        6,
        [[() => this.move(this.angle, 30)]],
      ],
      [
        () => Actor.getSpriteName("boss", 3, this.direction),
        12,
        [[this.gotoState, "fire"]],
      ],
      "loop",

      "fire:",
      [
        () => Actor.getSpriteName("boss", 5, this.direction), // 'bosse1',
        6,
        [],
      ],
      [
        () => Actor.getSpriteName("boss", 6, this.direction), // 'bossf1',
        6,
        [],
      ],
      [
        () => Actor.getSpriteName("boss", 7, this.direction), // 'bossg1',
        6,
        [
          // [this.move, Actor.calculateDirection(this, DoomGuy).angle, 30],
          //[this.sound, 'idle']
          // [() => new Projectile([this.x, this.y], DoomGuy)],
          [this.sound, "DSFIRSHT", false],
        ],
      ],
      "stop",
    ];
    /* eslint-enable indent */

    /*this.offsets = {
			'bossa1': [-19, -69],
			'bossb1': [-23, -72],
			'bossc1': [-20, -69],
			'bossd1': [-24, -72]
		};*/

    this.initStates();
  }
}

// module.exports = Baron;
