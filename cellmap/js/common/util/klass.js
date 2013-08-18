/*var klass = function(Parent, props) {
	var Child, F, i;
	Child = function() {
		if (Child.uber && Child.uber.hasOwnProperty('__construct')) {
			Child.uber.__construct.apply(this, arguments);
		}
		if(Child.prototype.hasOwnProperty('__construct')) {
			Child.prototype.__construct.apply(this, arguments);
		}
	};
	
	Parent = Parent || Object;
	F = function() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.uber = Parent.prototype;
	Child.prototype.constructor = Child;
	
	for (i in props) {
		if (props.hasOwnProperty(i)) {
			Child.prototype[i] = props[i];
		}
	}
	return Child;
	
}*/

var klass = (function () {
	var F = function () {};
	return function (Parent, props) {
		var Child, i;
	
		//1. 새로운 생성자
		Child = function() {
			if (Child.uber && Child.uber.hasOwnProperty('__construct')) {
				Child.uber.__construct.apply(this, arguments);
			}
			if(Child.prototype.hasOwnProperty('__construct')) {
				Child.prototype.__construct.apply(this, arguments);
			}
		};
	
		//2. 상속
		Parent = Parent || Object;
		
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.uber = Parent.prototype;
		Child.prototype.constructor = Child;
	
		//3. 구현 메서드를 추가한다.
		for (i in props) {
			if (props.hasOwnProperty(i)) {
				Child.prototype[i] = props[i];
			}
		}
	
		//'클래스'를 반환한다.
		return Child;
	};
}());