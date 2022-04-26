import { Color } from "../color"
import { Point } from "./Point"

export class Sphere {

    static readonly BYTE_SIZE = 19;

    constructor (
        public center: Point, // 3 4-byte floats = 12
        public radius: number, // 1 4-byte float = 4
        public color: Color,// 3 1-byte clamped int = 3
    ) {}

    // TODO i don't like arrayBuffer being passed directly, refactor!
    writeToArrayBuffer(arrayBuffer, offset): number {
        let OFFSET = offset;

        const float32array = new Float32Array(arrayBuffer, OFFSET, 4); // 16 bytes
        float32array[0] = this.center.x;
        float32array[1] = this.center.y;
        float32array[2] = this.center.z;
        float32array[3] = this.radius;
        OFFSET += float32array.byteLength;

        const clampedIntArray = new Uint8ClampedArray(arrayBuffer, OFFSET, 3);

        clampedIntArray[0] = this.color.r;
        clampedIntArray[1] = this.color.g;
        clampedIntArray[2] = this.color.b;
        OFFSET += clampedIntArray.byteLength;

        return OFFSET - offset;
    }

    static readFromArrayBuffer(arrayBuffer, offset) {
        const float32array = new Float32Array(arrayBuffer, offset, 4); // 16 bytes
        const clampedIntArray = new Uint8ClampedArray(arrayBuffer, offset + float32array.byteLength, 3);

        return new Sphere(
            new Point(float32array[0] , float32array[1] , float32array[2]),
            float32array[3],
            new Color(clampedIntArray[0] , clampedIntArray[1] , clampedIntArray[2])
        );
    }
}