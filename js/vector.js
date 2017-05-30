// vector.js
// 0.4
//
// Provides a Vector constructor (that works with or without the 'new'
// keyword) which takes a pair of cartesian values as an array, object
// or a pair of arguments, or a pair of polar values as an
// {d: number, a: number} object.
//
// Properties:
//
// x, y - cartesian coordinates
// d, a - polar coordinates
//
// Methods:
//
// add(vector)        - returns a new vector
// subtract(vector)   - returns a new vector
// equals(vector)     - tests one vector against another
// toCartesian()      - returns cartesian coordinates as an array [x, y]
// toPolar()          - returns polar coordinates as an array [d, a]
// toString()         - returns cartesian coordinates as string 'x,y'


(function(window){
	"use strict";

	var assign   = Object.assign;
	var privates = Symbol('privates');

	function setPolar(obj) {
		var x = obj.x,
		    y = obj.y;

		obj.a = Math.atan2(x, y);
		obj.d = x === 0 ?
				Math.abs(y) :
			y === 0 ?
				Math.abs(x) :
				Math.sqrt(x*x + y*y) ;
	};

	function setCartesian(obj) {
		var d = obj.d;
		var a = obj.a;

		obj.x = Math.sin(a) * d;
		obj.y = Math.cos(a) * d;
	};

	function clearCartesian(obj) {
		obj.x = undefined;
		obj.y = undefined;
	}

	function clearPolar(obj) {
		obj.a = undefined;
		obj.d = undefined;
	}

	function throwError(str) {
		throw new Error(str);
	}

	function makeVectorProperty(p1, p2, p3, p4, set, clear) {
		return {
			get: function() {
				var data = this[privates];

				if (typeof data[p1] !== "number" &&
				    typeof data[p3] === "number" &&
				    typeof data[p4] === "number") {
					set(data);
				}

				return data[p1];
			},

			set: function(n) {
				var data = this[privates];

				if (data[p1] === n) { return; }

				if (typeof data[p2] !== "number" &&
				    typeof data[p3] === "number" &&
				    typeof data[p4] === "number") {
					set(data);
				}

				if (typeof data[p2] === "number") {
					clear(data);
				}

				data[p1] = n;
			},

			enumerable: true
		};
	}

	function Vector(x, y) {
		// Accept input arguments in the form [x, y]. Passing no arguments, or
		// non-number arguments, will create the vector [0, 0].

		this[privates] = {
			x: typeof x === 'number' ? x || 0 : 0,
			y: typeof y === 'number' ? y || 0 : 0
		};
	}

	var xProp = makeVectorProperty('x', 'y', 'a', 'd', setCartesian, clearPolar);
	var yProp = makeVectorProperty('y', 'x', 'a', 'd', setCartesian, clearPolar);
	var aProp = makeVectorProperty('a', 'd', 'x', 'y', setPolar, clearCartesian);
	var dProp = makeVectorProperty('d', 'a', 'x', 'y', setPolar, clearCartesian);

	Object.defineProperties(Vector.prototype, {
		0: xProp,
		1: yProp,
		x: xProp,
		y: yProp,
		a: aProp,
		d: dProp,
		length: { value: 2 }
	});

	assign(Vector.prototype, {
		of: Vector,

		add: function(vector) {
			if (vector === undefined) {
				throw new Error('Vector: .add() called with undefined');
			}

			if (!(vector instanceof Vector)) {
				vector = new Vector(arguments[0], arguments[1]);
			}

			return new Vector(this[0] + vector[0], this[1] + vector[1]);
		},

		subtract: function(vector) {
			if (vector === undefined) {
				throw new Error('Vector: .subtract() called with undefined');
			}

			if (!(vector instanceof Vector)) {
				vector = new Vector(arguments[0], arguments[1]);
			}

			return new Vector(this[0] - vector[0], this[1] - vector[1]);
		},

		equals: function(vector) {
			if (vector === undefined) { return false; }

			if (!(vector instanceof Vector)) {
				vector = new Vector(arguments[0], arguments[1]);
			}

			return this[0] === vector[0] && this[1] === vector[1];
		},

		toCartesian: function() {
			return [this.x, this.y];
		},

		toPolar: function() {
			return [this.d, this.a];
		},

		toJSON: function() {
			return this.toCartesian();
		},

		toString: function() {
			return this.toCartesian() + '';
		},

		// Encourage vector to display as an array in Web Inspector
		splice: function(){},
	});

	Vector.of = function(x, y) {
		return new Vector(x, y);
	};

	Vector.from = function(object) {

		// Accept objects in any of the forms:
		//
		// {x: x, y: y}
		// {d: d, a: a}
		// {left: x, top: y}
		// [x, y]

		var vector;

		return typeof object.x === 'number' && typeof object.y === 'number' ?
			new Vector(object.x, object.y) :
		typeof object.left === 'number' && typeof object.top === 'number' ?
			new Vector(object.left, object.top) :
		typeof object[0] === 'number' && typeof object[1] === 'number' ?
			new Vector(object[0], object[1]) :
		typeof object.d === 'number' && typeof object.a === 'number' ?
			(vector = new Vector(), vector.a = object.a, vector.d = object.d, vector) :
		throwError('Object passed to Vector.from() has no vector properties') ;
	};

	window.Vector = Vector;
})(this);
