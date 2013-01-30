test("Arguments", function() {
	throws(
		function() { Vector('hello'); },
		"Throws on passing a string as arguments"
	);
	
	throws(
		function() { Vector({ prop: 9 }); },
		"Throws on passing empty objects with incomplete properties as arguments"
	);

	ok(Vector(), "Accepts no arguments");
	ok(Vector(1,2), "Accepts Number arguments");
	ok(Vector([1,2]), "Accepts Array [x, y] argument");
	ok(Vector({x: 1, y: 2}), "Accepts Object {x, y} argument");
	ok(Vector({left: 1, top: 2}), "Accepts Object {left, top} argument");
	ok(Vector({width: 1, height: 2}), "Accepts Object {width, height} argument");
	ok(Vector({a: 1, d: 2}), "Accepts Object {a, d} argument");
});

test("Modification", function() {
	var v1 = Vector();
	
	function round(n) {
		return Math.round(n * 1000000000000) / 1000000000000;
	}
	
	strictEqual(v1.y, 0, 'Should get properties that are not defined');
	strictEqual(v1.x, 0, 'Should get properties that are not defined');
	strictEqual(v1.a, 0, 'Should get properties that are not defined');
	strictEqual(v1.d, 0, 'Should get properties that are not defined');
	
	v1.y = 1;
	
	strictEqual(v1.y, 1, 'Setting cartesian should redefine polar');
	strictEqual(v1.x, 0, 'Setting cartesian should redefine polar');
	strictEqual(v1.a, 0, 'Setting cartesian should redefine polar');
	strictEqual(v1.d, 1, 'Setting cartesian should redefine polar');

	v1.d = 2;

	strictEqual(v1.y, 2, 'Setting polar should redefine cartesian');
	strictEqual(v1.x, 0, 'Setting polar should redefine cartesian');
	strictEqual(v1.a, 0, 'Setting polar should redefine cartesian');
	strictEqual(v1.d, 2, 'Setting polar should redefine cartesian');

	v1.a = Math.PI/2;
	
	strictEqual(round(v1.y), 0, 'Setting polar should redefine cartesian');
	strictEqual(round(v1.x), 2, 'Setting polar should redefine cartesian');
	strictEqual(v1.a, Math.PI/2, 'Setting polar should redefine cartesian');
	strictEqual(v1.d, 2, 'Setting polar should redefine cartesian');
	
	v1.a = Math.PI;
	v1.x = 3;
	v1.y = -4;
	
	strictEqual(v1.x, 3, 'Setting polar should redefine cartesian');
	strictEqual(v1.y, -4, 'Setting polar should redefine cartesian');
	strictEqual(v1.a, Math.atan2(3, -4), 'Setting polar should redefine cartesian');
	strictEqual(v1.d, 5, 'Setting polar should redefine cartesian');
});

test("Manipulation", function() {
	throws(
		function() { Vector().add(); },
		"Throws on trying to .add() with no argument"
	);
	
	throws(
		function() { Vector().add('string'); },
		"Throws on trying to .add() with invalid argument"
	);

	throws(
		function() { Vector().subtract(); },
		"Throws on trying to .subtract() with no argument"
	);
	
	throws(
		function() { Vector().subtract('string'); },
		"Throws on trying to .subtract() with invalid argument"
	);
	
	var v1 = Vector(),
	    v2 = Vector(),
	    v3 = Vector(1, 1);
	
	strictEqual(true,  v1.equals(v2), '.equals() should return true when two vectors have the same values')
	strictEqual(false, v1.equals(v3), '.equals() should return false when two vectors have different values')
	
	notStrictEqual(v1, v1.add(v2),      '.add() should return a new vector');
	notStrictEqual(v1, v1.subtract(v2), '.subtract() should return a new vector');
});


(function(jQuery, undefined){
	var gra = jQuery('#graphic'),
	    dot = jQuery('#dot'),
	    vector = Vector(0, 50),
	    offset = Vector(100, 100);
	
	setInterval(function() {
		vector.a = vector.a + 0.08;
		
		var v = vector.add(offset);
		
		dot.css({
			left: v.x,
			bottom: v.y
		});
		
		gra.css({
			transform: 'rotate(' + vector.a + 'rad)'
		});
	}, 40);
})(jQuery);