export class Point {
	constructor(public x, public y, public z) {}
}

export class Vector {
	constructor(public x, public y, public z) {}
	
	static fromPoint(p): Vector {
		return new Vector(p.x, p.y, p.z);
	}
	
	add(o): Vector {
		return new Vector(this.x + o.x, this.y + o.y, this.z + o.z);
	}
	
	sub(o): Vector {
		return new Vector(this.x - o.x, this.y - o.y, this.z - o.z);
	}
	
	dot(o): number {
		return this.x * o.x + this.y * o.y + this.z * o.z
	}

	length(): number {
		return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
	}
}