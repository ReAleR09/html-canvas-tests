import { Color } from "../color"
import { Point } from "./Point"

export class Sphere {

    // seven 4-bytes floats
    static readonly BYTE_SIZE = 28;

    constructor (
        public center: Point,
        public radius: number,
        public color: Color,
    ) {}

    writeToFloat32Array(float32array: Float32Array) {
        if (float32array.byteLength !== Sphere.BYTE_SIZE) {
            throw new Error(`Float32Array must be length of ${Sphere.BYTE_SIZE}, ${float32array.byteLength} given`);
        }
        float32array[0] = this.center.x;
        float32array[1] = this.center.y;
        float32array[2] = this.center.z;

        float32array[3] = this.radius;

        float32array[4] = this.color.r;
        float32array[5] = this.color.g;
        float32array[6] = this.color.b;
    }

    static fromFloat32Array(float32array: Float32Array) {
        if (float32array.byteLength !== Sphere.BYTE_SIZE) {
            throw new Error(`Float32Array must be length of ${Sphere.BYTE_SIZE}, ${float32array.byteLength} given`);
        }

        return new Sphere(
            new Point(float32array[0] , float32array[1] , float32array[2]),
            float32array[3],
            new Color(float32array[4] , float32array[5] , float32array[6])
        );
    }
}