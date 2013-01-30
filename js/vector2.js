// vector.js
//
// Provides a Vector constructor (that works with or without the 'new'
// keyword) which takes a pair of cartesian values as an array, object
// or a pair of arguments, or a pair of polar values as an {a, d} object.
// 
// Properties:
// 
// x, y - cartesian coordinates
// a, d - polar coordinates
// 
// Methods:
// 
// add(vector)        - returns a new vector
// subtract(vector)   - returns a new vector
// equals(vector)     - tests one vector against another
// toCartesianArray()
// toPolarArray()
// toString()


(function(ns, undefined){
	"use strict";
	
	function addPolar(obj) {
		var x = obj.x,
		    y = obj.y;
		
		obj.a = Math.atan2(x, y);
		obj.d = x === 0 ?
				Math.abs(y) :
			y === 0 ?
				Math.abs(x) :
				Math.sqrt(x*x + y*y) ;
	};
	
	function addCartesian(obj) {
		var d = obj.d,
		    a = obj.a;
		
		obj.x = Math.sin(a) * d;
		obj.y = Math.cos(a) * d;
	};
	
	function deleteCartesian(obj) {
		delete obj.x;
		delete obj.y;
	}
	
	function deletePolar(obj) {
		delete obj.a;
		delete obj.d;
	}
	
	function makeProperty(x, y, data, set, get) {
		return {
			set: function(n) {
				if (data[y] === undefined) { get(data); }
				set(data);
				data[x] = n;
			},
			
			get: function() {
				if (data[x] !== undefined) { return data[x]; }
				get(data);
				return data[x];
			},
			
			enumerable: true,
			configurable: false
		};
	}

	function throwError(str) {
		throw new Error(str);
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
			x: makeProperty('x', 'y', data, deletePolar, addCartesian),
			y: makeProperty('y', 'x', data, deletePolar, addCartesian),
			a: makeProperty('a', 'd', data, deleteCartesian, addPolar),
			d: makeProperty('d', 'a', data, deleteCartesian, addPolar)
		});
	}
	
	Vector.prototype = {
		add: function(vector) {
			if (vector === undefined) {
				throw new Error('Vector#add() called with undefined argument');
			}
			
			if (!(vector instanceof Vector)) {
				vector = new Vector(arguments[0], arguments[1]);
			}
			
			return new Vector(this.x + vector.x, this.y + vector.y);
		},
		
		subtract: function(vector) {
			if (vector === undefined) {
				throw new Error('Vector#subtract() called with undefined argument');
			}
			
			if (!(vector instanceof Vector)) {
				vector = new Vector(arguments[0], arguments[1]);
			}
			
			return new Vector(this.x - vector.x, this.y - vector.y);
		},
		
		equals: function(vector) {
			if (vector === undefined) {
				throw new Error('Vector#subtract() called with undefined argument');
			}
			
			if (!(vector instanceof Vector)) {
				vector = new Vector(arguments[0], arguments[1]);
			}
			
			return this.x === vector.x && this.y === vector.y;
		},
		
		toString: function() {
			return this.toCartesianArray.join(', ');
		},
		
		toCartesianArray: function() {
			return [this.x, this.y];
		},
		
		toPolarArray: function() {
			return [this.d, this.a];
		}
	};
	
	ns.Vector = Vector;
})(window);