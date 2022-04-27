import { Point } from "./Point";

export class Vector {
	constructor(public x: number, public y: number, public z: number) {}
	
	static fromPoint(p: Point): Vector {
		return new Vector(p.x, p.y, p.z);
	}
	
	add(o: Vector): Vector {
		return new Vector(this.x + o.x, this.y + o.y, this.z + o.z);
	}
	
	sub(o: Vector): Vector {
		return new Vector(this.x - o.x, this.y - o.y, this.z - o.z);
	}
	
	dot(o: Vector): number {
		return this.x * o.x + this.y * o.y + this.z * o.z
	}

	length(): number {
		return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
	}

	asArray(): [number, number, number] {
		return [this.x, this.y, this.z];
	}
}