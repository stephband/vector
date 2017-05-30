group('Vector()', function(test) {
	test("Creation", function($) {	
		$.equals('0,0', '' + new Vector(), "Accepts no arguments");
		$.equals('1,2', '' + new Vector(1, 2), "Accepts Number arguments");
		$.equals('1,2', '' + Vector.from([1,2]), "Accepts Array [x, y] argument");
		$.equals('1,2', '' + Vector.from({x: 1, y: 2}), "Accepts Object {x, y} argument");
		$.equals('1,2', '' + Vector.from({left: 1, top: 2}), "Accepts Object {left, top} argument");
		$.equals('1.682941969615793,1.0806046117362795', '' + Vector.from({a: 1, d: 2}), "Accepts Object {a, d} argument");
	});

	test("Mutations", function($) {
		var v1 = new Vector();

		function round(n) {
			return Math.round(n * 1000000000000) / 1000000000000;
		}

		$.equals(v1.y, 0, 'Should get properties that are not defined');
		$.equals(v1.x, 0, 'Should get properties that are not defined');
		$.equals(v1.a, 0, 'Should get properties that are not defined');
		$.equals(v1.d, 0, 'Should get properties that are not defined');
		
		v1.y = 1;
		
		$.equals(v1.y, 1, 'Setting cartesian should redefine polar');
		$.equals(v1.x, 0, 'Setting cartesian should redefine polar');
		$.equals(v1.a, 0, 'Setting cartesian should redefine polar');
		$.equals(v1.d, 1, 'Setting cartesian should redefine polar');
	
		v1.d = 2;
	
		$.equals(v1.y, 2, 'Setting polar should redefine cartesian');
		$.equals(v1.x, 0, 'Setting polar should redefine cartesian');
		$.equals(v1.a, 0, 'Setting polar should redefine cartesian');
		$.equals(v1.d, 2, 'Setting polar should redefine cartesian');
	
		v1.a = Math.PI/2;
		
		$.equals(round(v1.y), 0, 'Setting polar should redefine cartesian');
		$.equals(round(v1.x), 2, 'Setting polar should redefine cartesian');
		$.equals(v1.a, Math.PI/2, 'Setting polar should redefine cartesian');
		$.equals(v1.d, 2, 'Setting polar should redefine cartesian');
		
		v1.a = Math.PI;
		v1.x = 3;
		v1.y = -4;
		
		$.equals(v1.x, 3, 'Setting polar should redefine cartesian');
		$.equals(v1.y, -4, 'Setting polar should redefine cartesian');
		$.equals(v1.a, Math.atan2(3, -4), 'Setting polar should redefine cartesian');
		$.equals(v1.d, 5, 'Setting polar should redefine cartesian');
	});

	test("Operations", function($) {
		//throws(
		//	function() { Vector().add(); },
		//	"Throws on trying to .add() with no argument"
		//);
		//
		//throws(
		//	function() { Vector().add('string'); },
		//	"Throws on trying to .add() with invalid argument"
		//);
		//
		//throws(
		//	function() { Vector().subtract(); },
		//	"Throws on trying to .subtract() with no argument"
		//);
		//
		//throws(
		//	function() { Vector().subtract('string'); },
		//	"Throws on trying to .subtract() with invalid argument"
		//);

		var v1 = new Vector();
		var v2 = new Vector();
		var v3 = new Vector(1, 1);

		$.equals(true,  v1.equals(v2), '.equals() should return true when two vectors have the same values');
		$.equals(false, v1.equals(v3), '.equals() should return false when two vectors have different values');

		$.not(v1, v1.add(v2),      '.add() should return a new vector');
		$.not(v1, v1.subtract(v2), '.subtract() should return a new vector');
	});
});

(function(window){
	var gra = document.getElementById('graphic');
	var dot = document.getElementById('dot');
	var vector = new Vector(0, 50);
	var offset = new Vector(100, 100);

	setInterval(function() {
		vector.a = vector.a + 0.04;
		
		var v = vector.add(offset);

		dot.style.left = v.x;
		dot.style.bottom = v.y;
		gra.style.transform = 'rotate(' + vector.a + 'rad)';
	}, 20);
})(this);
