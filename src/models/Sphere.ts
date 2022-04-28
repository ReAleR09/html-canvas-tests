import { Color } from "./color"
import { Point } from "./Point"

export class Sphere {
    constructor (
        public readonly center: Point,
        public readonly radius: number,
        public readonly color: Color,
    ) {}

    toBuffer() {
        const center = new Uint8Array(this.center.toBuffer());
        const radius = new Uint8Array(Float32Array.of(this.radius).buffer)
        const color = new Uint8Array(this.color.toBuffer());

        const main = new Uint8Array(center.byteLength + radius.byteLength + color.byteLength);
        main.set(center, 0);
        main.set(radius, center.byteLength)
        main.set(color, center.byteLength + radius.byteLength);
        
        return main;
    }
}