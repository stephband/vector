// vector.js
// 0.3
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

	var assign = Object.assign;

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
				var data = this.data;

				if (typeof data[p1] !== "number" &&
				    typeof data[p3] === "number" &&
				    typeof data[p4] === "number") {
					set(data);
				}

				return data[p1];
			},

			set: function(n) {
				var data = this.data;

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

	function Vector(arg0, arg1) {
		var data;

		// Don't require the 'new' keyword
		if (!(this instanceof Vector)) {
			return new Vector(arg0, arg1);
		}

		// Accept input arguments in any old form:
		//
		// x, y
		// { x: x, y: y }
		// { d: d, a: a }
		// { left: x, top: y }
		// [ x, y ]
		// { width: x, height: y }
		//
		// Passing no arguments will create the vector { X: 0, y: 0 }

		data = typeof arg0 === 'number' && typeof arg1 === 'number' ?
			{ x: arg0, y: arg1 } :
			arg0 === undefined && arg1 === undefined ?
			{ x: 0, y: 0 } :
			typeof arg0 === 'object' ?
				typeof arg0.x === 'number' && typeof arg0.y === 'number' ?
				{ x: arg0.x, y: arg0.y } :
				typeof arg0.d === 'number' && typeof arg0.a === 'number' ?
				{ d: arg0.d, a: arg0.a } :
				typeof arg0.left === 'number' && typeof arg0.top === 'number' ?
				{ x: arg0.left, y: arg0.top } :
				typeof arg0[0] === 'number' && typeof arg0[1] === 'number' ?
				{ x: arg0[0], y: arg0[1] } :
				typeof arg0.width === 'number' && typeof arg0.height === 'number' ?
				{ x: arg0.width, y: arg0.height } :
				throwError('Object passed to Vector() has no vector properties') :
			throwError('Invalid arguments passed to Vector()') ;

		Object.defineProperties(this, {
			data: { value: data }
		});
	}

	var xProp = makeVectorProperty('x', 'y', 'a', 'd', setCartesian, clearPolar);
	var yProp = makeVectorProperty('y', 'x', 'a', 'd', setCartesian, clearPolar);

	Object.defineProperties(Vector.prototype, {
		0: xProp,
		1: yProp,
		x: xProp,
		y: yProp,
		a: makeVectorProperty('a', 'd', 'x', 'y', setPolar, clearCartesian),
		d: makeVectorProperty('d', 'a', 'x', 'y', setPolar, clearCartesian),
		length: { value: 2 }
	});

	assign(Vector.prototype, {
		// Encourage vector to display as an array in Web Inspector
		splice: function(){},

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
		}
	});

	window.Vector = Vector;
})(this);
