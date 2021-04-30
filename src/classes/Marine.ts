import { Vec2 } from "../Utils";
import Actor from "./Actor";

export default class Marine extends Actor {
  constructor(spawn?: Vec2) {
    const spriteFolder = "marine";

    super(spriteFolder, {}, spawn);

    this.states = [
      "spawn:",
      (self: Marine) => self.sprite('play', 1, self.direction).duration(6),
      (self: Marine) => self.sprite('play', 2, self.direction).duration(6),
      (self: Marine) => self.sprite('play', 3, self.direction).duration(6),
      (self: Marine) => self.sprite('play', 4, self.direction).duration(6),
      "loop",

      "attack:",
      (self: Marine) => self.sprite('play', 5, self.direction).duration(6), // TODO: Projectile
      "stop",

      "death:",
      (self: Marine) => self.sprite('play', 6, self.direction).duration(-1).sound('DSPLDETH'),
      "stop",
    ];

    // this.offsets = {
    //   playa1: [0, 0],
    //   playb1: [0, 0],
    //   playc1: [0, 0],
    //   playd1: [0, 0],
    // };

    // this.currentHate = null;

    this.initStates();
  }

  attack(target) {
    // this.currentHate = target;
    // this.gotoState("attack");
  }
}
