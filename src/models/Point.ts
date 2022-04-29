import { Vector } from "./Vector";

export class Point {

    static readonly BYTES_PER_ELEMENT = 12; // 3*4byte

	constructor(public x: number, public y: number, public z: number) {}

	asBuffer(): ArrayBuffer {
        return Float32Array.of(this.x, this.y, this.z).buffer;
    }
    static fromBuffer(arrayBuffer: ArrayBuffer, OFFSET = 0): Point {
        const arr = new Float32Array(arrayBuffer, OFFSET, 3);
        return new Point(arr[0], arr[1], arr[2]);
    }

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
		this.x += diffX;
		this.y += diffY;
		this.z += diffZ;
	}
}