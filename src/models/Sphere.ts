import { concatBuffers, splitBuffer } from "../utils/buffers";
import { Color } from "./color"
import { Point } from "./Point"

export class Sphere {

    static readonly BYTES_PER_ELEMENT = 
        Point.BYTES_PER_ELEMENT + 4 + Color.BYTES_PER_ELEMENT + 2;

    constructor (
        public readonly center: Point, // 12
        public readonly radius: number, // 4
        public readonly color: Color, // 3
        public readonly specular: number = -1 // 2
    ) {}


    public asBuffer(): ArrayBuffer {
        const center = this.center.asBuffer();
        const radius = Float32Array.of(this.radius).buffer;
        const color = this.color.asBuffer();
        const specular = Int16Array.of(this.specular).buffer;

        return concatBuffers(center, radius, color, specular);
    }

    static fromBuffer(arrayBuffer: ArrayBuffer): Sphere[] {
        const buffers = splitBuffer(arrayBuffer, Sphere.BYTES_PER_ELEMENT);
        const spheres: Sphere[] = buffers.map((buffer) => {
            const center = Point.fromBuffer(buffer, 0);
            let offset = Point.BYTES_PER_ELEMENT;
            const radius = (new Float32Array(buffer, offset, 1))[0];
            offset += 4;
            const color = Color.fromBuffer(buffer, offset);
            offset += Color.BYTES_PER_ELEMENT;
            const dv = new DataView(buffer, offset);
            const specular = dv.getInt16(0, true);

            return new Sphere(center, radius, color, specular);
        });

        return spheres;
    }
}