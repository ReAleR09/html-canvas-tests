import { Point } from "./Point";

export class Vector {
	protected arr: Float32Array;

	constructor(x: number, y: number, z: number) {
		const buf = new ArrayBuffer(3 * 4);
		const arr = new Float32Array(buf, 0, 3);
		arr[0] = x;
		arr[1] = y;
		arr[2] = z;
		this.arr = arr;
	}

	get x() {return this.arr[0];}
	get y() {return this.arr[1];}
	get z() {return this.arr[2];}

	toBuffer() {return this.arr.buffer.slice(0);}
	
	static fromPoint(p: Point|Vector): Vector {
		return new Vector(p.x, p.y, p.z);
	}
	
	add(o: Vector|Point): Vector {
		return new Vector(this.x + o.x, this.y + o.y, this.z + o.z);
	}
	
	sub(o: Vector|Point): Vector {
		return new Vector(this.x - o.x, this.y - o.y, this.z - o.z);
	}

	mul(s: number): Vector {
		return new Vector(this.x * s, this.y * s, this.z * s);
	}
	
	dot(o: Vector|Point): number {
		return this.x * o.x + this.y * o.y + this.z * o.z
	}

	length(): number {
		return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
	}

	asArray(): [number, number, number] {
		return [this.x, this.y, this.z];
	}
}