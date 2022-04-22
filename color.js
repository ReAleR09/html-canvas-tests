class Color {
	constructor(r, g, b) {
		this.r = Math.max(0, Math.min(r, 255));
		this.g = Math.max(0, Math.min(g, 255));
		this.b = Math.max(0, Math.min(b, 255));
	}
	
	add(o) {
		return new Color(this.r + o.r, this.g + o.g, this.b + o.b)
	}

	invert() {
		return new Color(255 - this.r, 255 - this.g, 255 - this.b)
	}
}