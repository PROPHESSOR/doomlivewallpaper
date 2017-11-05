'use strict';

class Utils {
	static random(a, b) {
		return Math.floor(Math.random() * b - a) + a;
	}
}

class Binder {
	static allMethods(targetClass) {
		const propertys = Object.getOwnPropertyNames(Object.getPrototypeOf(targetClass));
		propertys.splice(propertys.indexOf('constructor'), 1);
		return propertys;
	}

	static bindAll (targetClass, methodNames) {
		for (const name of !methodNames ? Binder.allMethods(targetClass) : methodNames) {
			targetClass[name] = targetClass[name].bind(targetClass);
		}
	}
}