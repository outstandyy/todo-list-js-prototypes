'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ('value' in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}

	return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
}();

var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
	return typeof obj;
} : function (obj) {
	return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
};

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError('Cannot call a class as a function');
	}
}

function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) {
		Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	} else {
		obj[key] = value;
	}
	return obj;
}

function _toPropertyKey(arg) {
	var key = _toPrimitive(arg, 'string');
	return (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' ? key : String(key);
}

function _toPrimitive(input, hint) {
	if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object' || input === null) return input;
	var prim = input[Symbol.toPrimitive];
	if (prim !== undefined) {
		var res = prim.call(input, hint || 'default');
		if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) !== 'object') return res;
		throw new TypeError('@@toPrimitive must return a primitive value.');
	}
	return (hint === 'string' ? String : Number)(input);
}

var MyClass = function () {
	function MyClass() {
		_classCallCheck(this, MyClass);
	}

	_createClass(MyClass, null, [{
		key: 'func',
		value: function func() {
			return 'I\'m func';
		}
	}]);

	return MyClass;
}();

_defineProperty(MyClass, 'field', 1);
