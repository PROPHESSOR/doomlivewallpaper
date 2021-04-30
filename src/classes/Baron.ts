"use strict";

import { Vec2 } from '../Utils';
import Actor from './Actor';

export default class Baron extends Actor {
  constructor(spawn = new Vec2(0, 0)) {
    const spriteFolder = "baron";

    super(spriteFolder, {}, spawn);

    this.states = [
      'spawn:',
      (self: Baron) => self.sprite('boss', 1, 1).duration(6).sound('DSBRSSIT'),
      (self: Baron) => self.sprite('boss', 1, self.direction).duration(6).gotoState('walk'),
      'stop',
  
      'walk:',
      (self: Baron) => self.sprite('boss', 1, self.direction).duration(6), // TODO: Turn to target
      (self: Baron) => self.sprite('boss', 2, self.direction).duration(6),
      (self: Baron) => self.sprite('boss', 3, self.direction).duration(6).move(self.angle, 30),
      (self: Baron) => self.sprite('boss', 3, self.direction).duration(6).gotoState('fire'),
      'loop',
      
      'fire:',
      (self: Baron) => self.sprite('boss', 5, self.direction).duration(6),
      (self: Baron) => self.sprite('boss', 6, self.direction).duration(6),
      (self: Baron) => self.sprite('boss', 7, self.direction).duration(6).sound('DSFIRSHT'), // TODO: Projectile
      'stop',
    ];

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
