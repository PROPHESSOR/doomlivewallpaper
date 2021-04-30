export class Vec2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  } 
}

export class Rect extends Vec2 {
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);

    this.width = width;
    this.height = height;
  }
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * max - min) + min;
}

class Binder {
  static allMethods(targetClass) {
    const propertys = Object.getOwnPropertyNames(
      Object.getPrototypeOf(targetClass)
    );
    propertys.splice(propertys.indexOf("constructor"), 1);
    return propertys;
  }

  static bindAll(targetClass, methodNames) {
    for (const name of !methodNames
      ? Binder.allMethods(targetClass)
      : methodNames) {
      targetClass[name] = targetClass[name].bind(targetClass);
    }
  }
}
