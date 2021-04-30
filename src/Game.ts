import Actors from "./Actors";
import Baron from "./classes/Baron";
import { Vec2 } from "./Utils";

class Background {
  private bg = '';

  render(bg = 'bg1') {
    const el: HTMLElement = document.querySelector('#main');

    el.style.backgroundImage = `url(res/bg/${bg}.jpg)`;
  }

  get() {
    return this.bg;
  }
}

export class Game {
  public background = new Background();
  public actors = new Actors();
  private FPS: number;
  private timer: number;
  private tickno: number = 0;

  constructor({ FPS=35 } = {}) {
    this.FPS = FPS;
  }

  run() {
    this.background.render();
    console.log('run()');
    this.actors.add(new Baron(new Vec2(256, 256)));
    this.timer = setInterval(() => this.loop(), 1000 / this.FPS);
  }

  private loop() {
    this.tickno++;
    console.log('tick', this.tickno);
    this.actors.tick();
  }
}

export default new Game();

// DLW.Wave = {
//   currentWave: 0,
//   waveTime: [], //Time in ms for several waves
//   waves: [
//     //Demons in each wave
//     [Baron],
//   ],
//   wave() {
//     const w = DLW.Wave;
//     const monsters = w.waves[w.currentWave];

//     for (const Monster of monsters) {
//       new Monster();
//     }

//     w.currentWave++;

//     setTimeout(w.wave, w.waveTime[w.currentWave] || w.waveTime[0]);
//   },
// };

// DLW.spam = function () {
//   new Sergeant(Utils.random(1, innerWidth), Utils.random(1, innerHeight));
// };

// const interval = setInterval(DLW.spam, 10000);

// const Main = DLW;

// DLW.Engine = new class DLWEngine {
// 	constructor() {}

// 	spawn(){}
// }

// DLW.spawn = (val)=>{
// 	if(!val) return console.warn("[DLW.Spawn] Nothing to spawn!");
// }

// module.exports = Main;
