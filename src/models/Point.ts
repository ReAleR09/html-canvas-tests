import { Vector } from "./Vector";

export class Point {

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
	toBuffer() {return this.arr.buffer;}

	add(o: Point): Vector {
		return new Vector(this.x + o.x, this.y + o.y, this.z + o.z);
	}
	
	sub(o: Point|Vector): Vector {
		return new Vector(this.x - o.x, this.y - o.y, this.z - o.z);
	}

	mul(s: number): Point {
		return new Point(this.x * s, this.y * s, this.z * s);
	}

	modify(diffX: number, diffY: number, diffZ: number): void {
		this.arr[0] += diffX;
		this.arr[1] += diffY;
		this.arr[2] += diffZ;
	}
}