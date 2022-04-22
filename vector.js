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
}

function sum(v1, v2) {
	return {X: v1.X + v2.X, Y: v1.Y + v2.Y, Z: v1.Z + v2.Z};
}

function sub(v1, v2) {
	return {X: v1.X - v2.X, Y: v1.Y - v2.Y, Z: v1.Z - v2.Z};
}

function dot(v1, v2) {
	return v1.X * v2.X + v1.Y * v2.Y + v1.Z * v2.Z;
}
