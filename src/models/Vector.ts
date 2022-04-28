import { Point } from "./Point";

export class Vector {

	constructor(public x: number, public y: number, public z: number) {}

	asBuffer(): ArrayBuffer {
        return Float32Array.of(this.x, this.y, this.z).buffer;
    }
    static fromBuffer(arrayBuffer: ArrayBuffer, OFFSET = 0): Vector {
        const arr = new Float32Array(arrayBuffer, OFFSET, 3);
        return new Vector(arr[0], arr[1], arr[2]);
    }
	
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
}