import { concatBuffers, splitBuffer } from "../utils/buffers";
import { Point } from "./Point";
import { Vector } from "./Vector";

export enum LightSourceType {
    ambient = 1,
    point,
    directional
}

type Params =
    [LightSourceType.ambient, number] | [LightSourceType.point, number, Point] | [LightSourceType.directional, number, Vector];

export class LightSource {

    static readonly BYTES_PER_ELEMENT = 
        1 + 4 + Point.BYTES_PER_ELEMENT;

    public type: LightSourceType;
    public intensity: number;
    public position?: Point|Vector;
    
	constructor (...args: Params) {
        const [type, intensity, position] = args;
        this.type = type;
        this.intensity = intensity;
        this.position = position;
    }

    public asBuffer() {
        const type = Uint8Array.of(this.type).buffer;
        const intensity = Float32Array.of(this.intensity).buffer;
        let position = this.position?.asBuffer();
        if (position === undefined) {
            position = new ArrayBuffer(12);
        }
        return concatBuffers(type, intensity, position);
    }

    static fromBuffer(buffer: ArrayBuffer): LightSource[] {
        const buffers = splitBuffer(buffer, LightSource.BYTES_PER_ELEMENT);
        const lights: LightSource[] = buffers.map((buffer) => {
            const dataView = new DataView(buffer);
            const type = dataView.getUint8(0) as LightSourceType;
            const intensity = dataView.getFloat32(1, true);
            let position: Point|Vector|undefined;
            const offset = 5;
            const x = dataView.getFloat32(offset, true);
            const y = dataView.getFloat32(offset+4, true);
            const z = dataView.getFloat32(offset+8, true);
            switch(type) {
                case LightSourceType.ambient:
                    position = undefined; break;
                case LightSourceType.point:
                    position = new Point(x, y, z); break;
                case LightSourceType.directional:
                    position = new Vector(x, y, z); break;
            }
            return new LightSource(type as any, intensity, position as any);
        });

        return lights;
    }
}