"use strict";

const DLW = {
  run() {
    console.log("Run...");
    this.Background.render();
  },

  gameLoop() {
    //TODO: Научиться кодить игры
  },
};

DLW.Background = {
  _bg: "",
  render(name = "bg1") {
    this._bg = name;
    $("#main").css("background-image", `url(res/bg/${name}.jpg)`);
  },
  get() {
    return this._bg;
  },
};

DLW.Wave = {
  currentWave: 0,
  waveTime: [], //Time in ms for several waves
  waves: [
    //Demons in each wave
    [Baron],
  ],
  wave() {
    const w = DLW.Wave;
    const monsters = w.waves[w.currentWave];

    for (const Monster of monsters) {
      new Monster();
    }

    w.currentWave++;

    setTimeout(w.wave, w.waveTime[w.currentWave] || w.waveTime[0]);
  },
};

DLW.spam = function () {
  new Sergeant(Utils.random(1, innerWidth), Utils.random(1, innerHeight));
};

const interval = setInterval(DLW.spam, 10000);

const Main = DLW;

// DLW.Engine = new class DLWEngine {
// 	constructor() {}

// 	spawn(){}
// }

// DLW.spawn = (val)=>{
// 	if(!val) return console.warn("[DLW.Spawn] Nothing to spawn!");
// }

// module.exports = Main;
