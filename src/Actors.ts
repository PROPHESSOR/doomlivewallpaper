import Actor from "./classes/Actor";

export default class Actors {
  private _actors: Actor[] = [];

  add(actor: Actor) {
    this._actors.push(actor);
  }

  remove(actor: Actor) {
    const index = this._actors.indexOf(actor);

    if (index === -1) return;

    this._actors.splice(index, 1);
  }

  tick() {
    this._actors.forEach(actor => actor.tick());
  }
}