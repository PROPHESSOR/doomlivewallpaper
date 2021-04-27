"use strict";

class API {
  static letterize(cfrom, cto) {
    let from = cfrom.charCodeAt(0) - 97;
    let to = cto.charCodeAt(0) - 97;
    let array = [];
    for (let i = from; i <= to; i++) array.push(String.fromCharCode(97 + i));
    return array;
  }

  static turn(deg) {}

  static seek(actor) {}

  static move(actor, direction, speed) {
    switch (direction) {
      case 0: // up
        actor.y -= speed / 10;
        break;
      case 1: // right
        actor.x += speed / 10;
        break;
      case 2: // down
        actor.y += speed / 10;
        break;
      case 3: // left
        actor.x -= speed / 10;
        break;
      default:
        return console.warn("API.move() direction is not in [0,3]");
    }
  }
}

let demo = {
  idle(api) {
    api.move(this, 2, 50);
  },
};

class AI {
  constructor(states = {}) {
    this.states = states;
  }

  run(state) {
    this.states[state](API); // TODO: Сделать это в цикле...
  }
}

// module.exports = AI;
