import { Point } from "./Point";
import { Vector } from "./Vector";

export type LightType = 'ambient' | 'point' | 'directional';

class Light {
	constructor (
		public type: LightType,
		public intensity: number,
		public position: Point|Vector,
	) {
		
	}
}

const computeLightning = (P: Vector, N: Vector, lights: Light[]) => {
	let i = 0.0;
	for (let light of lights) {
		if (light.type === 'ambient') {
			i += light.intensity;
		} else {
			let L: Vector;
			if (light.type === 'point') {
				L = Vector.fromPoint(light.position.sub(P));
			} else {
				L = light.position as Vector;
			}
			let n_dot_l = N.dot(L);
			if (n_dot_l > 0) {
				i += light.intensity * n_dot_l / (N.length() * L.length());
			}
		}
	}
	
	return Math.min(1, i);
}