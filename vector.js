class Point {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Vector {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	static fromPoint(p) {
		return new Vector(p.x, p.y, p.z);
	}
	
	add(o) {
		return new Vector(this.x + o.x, this.y + o.y, this.z + o.z);
	}
	
	sub(o) {
		return new Vector(this.x - o.x, this.y - o.y, this.z - o.z);
	}
	
	dot(o) {
		return this.x * o.x + this.y * o.y + this.z * o.z
	}

	length() {
		return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
	}
}