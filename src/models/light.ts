import { concatBuffers, splitBuffer } from "../utils/buffers";
import { Point } from "./Point";
import { Vector } from "./Vector";

export enum LightType {
    ambient = 1,
    point,
    directional
}

type Params =
    [LightType.ambient, number] | [LightType.point, number, Point] | [LightType.directional, number, Vector];

export class Light {

    static readonly BYTES_PER_ELEMENT = 
        1 + 4 + Point.BYTES_PER_ELEMENT;

    public type: LightType;
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

    static fromBuffer(buffer: ArrayBuffer): Light[] {
        const buffers = splitBuffer(buffer, Light.BYTES_PER_ELEMENT);
        const lights: Light[] = buffers.map((buffer) => {
            const dataView = new DataView(buffer);
            const type = dataView.getUint8(0) as LightType;
            const intensity = dataView.getFloat32(1, true);
            let position: Point|Vector|undefined;
            const offset = 5;
            const x = dataView.getFloat32(offset, true);
            const y = dataView.getFloat32(offset+4, true);
            const z = dataView.getFloat32(offset+8, true);
            switch(type) {
                case LightType.ambient:
                    position = undefined; break;
                case LightType.point:
                    position = new Point(x, y, z); break;
                case LightType.directional:
                    position = new Vector(x, y, z); break;
            }
            return new Light(type as any, intensity, position as any);
        });

        return lights;
    }
}

export const computeLightning = (P: Vector, N: Vector, lights: Light[]) => {
	let i = 0.0;
	for (let light of lights) {
		if (light.type === LightType.ambient) {
			i += light.intensity;
		} else {
            const position = light.position as Vector;
			let L: Vector;
			if (light.type === LightType.point) {
				L = Vector.fromPoint(position.sub(P));
			} else {
				L = position as Vector;
			}
			let n_dot_l = N.dot(L);
			if (n_dot_l > 0) {
				i += light.intensity * n_dot_l / (N.length() * L.length());
			}
		}
	}
	
	return Math.min(1, i);
}