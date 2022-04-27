export class Color {

    public static readonly BYTE_SIZE = 3; // 3 1-byte 0-255 ints

	constructor(public r: number, public g: number, public b: number) {
		this.r = Math.max(0, Math.min(r, 255));
		this.g = Math.max(0, Math.min(g, 255));
		this.b = Math.max(0, Math.min(b, 255));
	}
	
	add(o): Color {
		return new Color(this.r + o.r, this.g + o.g, this.b + o.b)
	}

	invert(): Color  {
		return new Color(255 - this.r, 255 - this.g, 255 - this.b)
	}

	asArray() {
		return [this.r, this.g, this.b];
	}
}