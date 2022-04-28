export class Color {

    static readonly BYTES_PER_ELEMENT = 3; // 3*1byte

	constructor(public r: number, public g: number, public b: number) { }

    asBuffer(): ArrayBuffer {
        return Uint8ClampedArray.of(this.r, this.g, this.b).buffer;
    }
    static fromBuffer(arrayBuffer: ArrayBuffer, OFFSET = 0): Color {
        const arr = new Uint8ClampedArray(arrayBuffer, OFFSET, 3);
        return new Color(arr[0], arr[1], arr[2]);
    }
	
	add(o: Color): Color {
		return new Color(this.r + o.r, this.g + o.g, this.b + o.b)
	}

	invert(): Color  {
		return new Color(255 - this.r, 255 - this.g, 255 - this.b)
	}

	mul(s: number) {
		return new Color(
			Math.round(this.r * s),
			Math.round(this.g * s),
			Math.round(this.b * s));
	}
}