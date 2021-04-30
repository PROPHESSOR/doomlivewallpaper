/*
 * Copyright (c) 2017-2021 PROPHESSOR
 */

"use strict";

import { Rect, Vec2, random } from "../Utils";

export interface iActorSpriteName {
  [0]: string; // Sprite name
  [1]: number; // Animation number
  [2]: number; // Direction number
}

export type tSpriteName = string | (() => string) | iActorSpriteName;

// export interface iActorState {
//   [0]: tSpriteName | null; // Sprite name
//   [1]: number; // ticks | -1
//   [2]: [function: ((...args: any[]) => void), ...args: any][] | ((...args: any[]) => void)[] | [];
// }

export type iActorState = (actor: any) => any;

export interface iActorBaseParams {
  direction?: number;
}

/**
 * @namespace Actor
 * @class
 */

export default abstract class Actor extends Rect {
  spriteFolder: string;
  private params: {};
  protected element: HTMLImageElement;
  direction: number;
  angle: number;
  private soundChannel: number;
  offsets: { [key: string]: Vec2 };
  
  protected states: ('loop' | 'stop' | string | iActorState)[];

  private isGoto: boolean;
  private statePtr: number;
  private stateName: string;
  private prevStateName: string;
  private delayTimer: number;

  /**
   * @constructor
   * @memberof Actor
   * @param spriteFolder='' - Название папки со спрайтами актора
   * @param params={} - Параметры актора
   * @param spawn - Координаты спавна
   */
  constructor(spriteFolder = "", params: iActorBaseParams = {}, spawn: Vec2 = new Vec2(0, 0)) {
    const element = Actor.createActorElement();
    
    super(spawn.x, spawn.y, element.width, element.height);
    
    this.element = element;
    this.spriteFolder = spriteFolder;
    this.params = params;
    this.direction = params.direction || 1;
    this.soundChannel = 1;

    this.states = [
      'spawn:',
      (self: Actor) => self.duration(-1),
      'loop'
    ]

    this.offsets = {};

    //This binders
    // Binder.bindAll(this);
    {
      this.tick = this.tick.bind(this);
      this.move = this.move.bind(this);
      this.sound = this.sound.bind(this);
      this.turnTo = this.turnTo.bind(this);
      this.findState = this.findState.bind(this);
      this.gotoState = this.gotoState.bind(this);
      this.duration = this.duration.bind(this);
      this.setSprite = this.setSprite.bind(this);
    }

    this.spawn();

    // this.setSprite('bossa1');
  }

  /** Инициализировать состояния и запустить цикл (spawn)
   */
  protected initStates() {
    this.gotoState("spawn");
    this.isGoto = false;
    this.duration(0);
  }

  /** Развернуть на 180°
   * @returns {number} Id направления
   */
  public reverseDirection() {
    this.direction = Actor.reverseDirection(this.angle);

    return this;
  }

  /** Повернуться к
   * @param  {Actor} target - Цель
   */
  public turnTo(target) {
    const data = Actor.calculateDirection(this, target);

    if (!data) return this;

    this.direction = data.direction;
    this.angle = data.angle;

    return this;
  }

  /** Отобразить элемент на экране (append)
   */
  private spawn() {
    this.element.style.position = "absolute";
    document.querySelector("#main").append(this.element);
    // $(this.element).on("contextmenu", () => {
    //   DoomGuy.attack(this);
    // });
  }

  /** Убить актора
   */
  public kill() {
    this.gotoState("death");

    return null;
    // setTimeout(() => {
    // 	console.log('remmove elllement');
    // 	$(this.element).remove();
    // }, 1000);
  }

  /** Отрисовать элемент
   * @param  {number} x=this.x - X-координата
   * @param  {number} y=this.y - Y-координата
   */
  private render(x = this.x, y = this.y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  /** Воспроизвести звук
   * @param  {string} sound - Имя файла без расширения (.ogg)
   * @param  {bool} loop=false - Циклично?
   * @param {number} channel=0 - Канал звука (1-5);
   * @returns {undefined} ...
   */
  public sound(sound: string, loop = false, channel = 0) {
    //TODO: Проверка на наличие кодека
    if (!sound) {
      return console.warn("Нет звука для воспроизвидения!");
    }
    // if (sound instanceof Array) { // TODO: SNDINFO alternative
    //   sound = sound[random(0, sound.length - 1)];
    // }

    console.info(`res/sounds/${sound}.ogg`, loop, channel); // TODO: Sound.play

    return this;
  }

  /** Искать состояние
   * @param  {string} name - Состояние
   * @returns {number} ID состояния в массиве
   */
  private findState(name) {
    name += ":"; //eslint-disable-line
    for (const i in this.states) {
      if (this.states[i] === name) {
        return Number(i);
      }
    }

    return null;
  }

  /** Перейти к состоянию
   * @param  {string} name - Состояние
   * @returns {undefined} ...
   */
  public gotoState(name) {
    this.statePtr = this.findState(name);
    if (!this.statePtr) {
      console.warn(`Unknown state ${name}`);
      return this;
    }
    this.prevStateName = this.stateName;
    this.stateName = name;
    this.isGoto = true;

    return this;
  }

  /** Получить длительность состояния (???)
   * @returns {number} Длительность
   */
  getStateTime() {
    const state = this.states[this.statePtr];

    if (Array.isArray(state)) {
      return (state[1] / 35) * 1000;
    }

    return 0;
  }

  /** Задержать актора в текущем состоянии
   * @param  time - Длительность состояния в тиках
   */
  public duration(time = 0) {
    this.delayTimer = time;

    return this;
  }

  private tick() {
    if (this.delayTimer) return this.delayTimer--;

    const state = this.states[this.statePtr];

    if (typeof state === "string") {
      if (state === "loop") {
        this.gotoState(this.stateName);
        this.duration(0);
      } else if (state === "stop") {
        this.gotoState(this.prevStateName);
        this.duration(0);
      } else if (state[0] === ":") {
        this.gotoState(state.slice(1));
        this.duration(0);
      } else if (state.slice(-1) === ":") {
        this.statePtr++;
        this.duration(0);

        return;
      }
    } else {
      if (typeof state[0] === "string") {
        this.setSprite(state[0]);
      } else if (typeof state[0] === "function") {
        this.setSprite(state[0]());
      } else if (state[0] instanceof Array) {
        this.setSprite(
          Actor.getSpriteName(state[0][0], state[0][1], state[0][2])
        );
      }

      if (state[2]) {
        for (const statement of state[2]) {
          if (typeof statement === 'function') {
            statement(this);
          } else {
            console.warn('Deprecated state call!', state, this);
            statement[0](...statement.slice(1));
          }
        }
      }
    }
    const time = this.getStateTime();

    !this.isGoto ? this.statePtr++ : (this.isGoto = false); // eslint-disable-line
    if (time < 0) {
      return;
    }
    this.duration(time);
  }

  public sprite(base: string, frame: number, direction: number) {
    this.setSprite(Actor.getSpriteName(base, frame, direction));

    return this;
  }

  /** Задать спрайт
   * @param  {sting} name - Имя спрайта без расширения (.png)
   * @returns {undefined} ...
   */
  public setSprite(name) {
    let el = this.element;

    if (!name) {
      return void (el.style.display = "none");
    }
    el.style.display = "";
    if (this.offsets[name]) {
      this.render(
        this.x + this.offsets[name][0],
        this.y + this.offsets[name][1]
      );
    } else {
      this.render(this.x, this.y);
    }
    el.src = `res/${this.spriteFolder}/${name}.png`;
  }

  /**
   * Проверяет на столкновение
   * @param {object} object - Объект
   * @returns {bool} True/false
   */
  detectCollision(/* object */) {
    //Actor.calculateDistance();
    console.warn('detectCollision: Not implemented yet');

    return false;
  }

  /** Передвигает актора в направлении direction со скоростью speed
   * @param  {number} direction - Направление
   * @param  {number} speed - Спид
   */
  move(direction, speed) {
    const xofs = speed * Math.sin((direction * Math.PI) / 180);
    const yofs = -(speed * Math.cos((direction * Math.PI) / 180));

    this.x += xofs;
    this.y += yofs;

    // FIXME: render?

    return this;
  }

  //region static
  /** Создает HTML img элемент
   * @private
   * @static
   * @returns {Image} Элемент
   */
  static createActorElement() {
    return document.createElement("img");
  }

  /** Развернуть направление на 180 градусов
   * @static
   * @param  {number} angle - Направление в градусах
   * @returns {number} - id направления
   */
  static reverseDirection(angle) {
    return this.angle2direction(180 - angle);
  }

  /** Перевести градусы в id
   * @static
   * @param  {number} angle - Направление в градусах
   * @returns {number} - id направления
   */
  static angle2direction(angle) {
    if (angle >= -22.5 && angle <= 22.5) {
      return 5;
    }
    if (angle >= 22.5 && angle <= 67.5) {
      return 6;
    }
    if (angle >= 67.5 && angle <= 112.5) {
      return 7;
    }
    if (angle >= 112.5 && angle <= 157.5) {
      return 8;
    }
    if (angle >= 157.5 && angle <= -157.5) {
      return 1;
    }
    if (angle >= -157.5 && angle <= -112.5) {
      return 2;
    }
    if (angle >= -112.5 && angle <= -67.5) {
      return 3;
    }
    if (angle >= -67.5 && angle <= -22.5) {
      return 4;
    }
    console.warn(`Bad angle ${angle}°`);

    return 1;
  }

  /** Рассчитать направление в сторону актора
   * @static
   * @param  {Actor} actor - Актор, относительно которого расчитывается направление
   * @param  {Actor} target - Актор, в сторону которого расчитывается
   * @returns {object} {angle, direction} - Направление в градусах и id
   */
  static calculateDirection(actor, target) {
    if (!actor || !target)
      return console.error(
        "У calculateDirection недостаточно аргументов для того, что бы делать свою работу"
      ); //eslint-disable-line

    let angle =
      (Math.atan2(target.x - actor.x, -(target.y - actor.y)) * 180.0) / Math.PI;
    let direction = this.angle2direction(angle);
    // if (target.state == Actor.WALKING || target.state == Actor.SHOOTING) { //x/yLoc

    // angle = Math.atan2(target.x - actor.x, -(target.y - actor.y));
    // }

    return {
      angle,
      direction,
    };
    // return angle;
  }

  /** Рассчитать растояние до объекта
   * @static
   * @param  {Actor} actor - Актор, относительно которого расчитывается растояние
   * @param  {Actor} target - Актор, до которого расчитывается растояние
   * @returns {number} Растояние
   */
  static calculateDistance(actor, target) {
    //Модуль вектора this -> actor
    return Math.sqrt(
      Math.pow(target.x - actor.x, 2) + Math.pow(target.y - actor.y, 2)
    );
  }

  /** Получить имя спрайта по номеру анимации и направления
   * @static
   * @param  {string} name - Префикс спрайта (4 буквы)
   * @param  {number} animation=1 - Номер анимации
   * @param  {number} direction=1 - Номер направления
   * @returns {string} Название спрайта без расширения
   */
  static getSpriteName(name, animation = 1, direction = 1) {
    const letters = [
      null,
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ];

    return name + letters[animation] + direction;
  }
  //endregion static
}
