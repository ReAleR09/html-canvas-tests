export class Point {

	public static readonly BYTE_SIZE = 12; // 4 bytes per float, 3 floats

	constructor(public x: number, public y: number, public z: number) {}

	asArray() {
		return [this.x, this.y, this.z];
	}
}