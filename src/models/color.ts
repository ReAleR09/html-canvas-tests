export class Color {

	private arr: Uint8ClampedArray;

	constructor(r: number, g: number, b: number) {
		const buf = new ArrayBuffer(3);
		const arr = new Uint8ClampedArray(buf);
		arr[0] = r;
		arr[1] = g;
		arr[2] = b;
		this.arr = arr;
	}

	get r() {return this.arr[0];}
	get g() {return this.arr[1];}
	get b() {return this.arr[2];}

	toBuffer() {
		return this.arr.buffer;
	}
	
	add(o: Color): Color {
		return new Color(this.r + o.r, this.g + o.g, this.b + o.b)
	}

	invert(): Color  {
		return new Color(255 - this.r, 255 - this.g, 255 - this.b)
	}

	asArray() {
		return [this.r, this.g, this.b];
	}

	mul(s: number) {
		return new Color(
			Math.round(this.r * s),
			Math.round(this.g * s),
			Math.round(this.b * s));
	}
}