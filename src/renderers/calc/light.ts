import { LightSource, LightSourceType } from "../../models/light";
import { Vector } from "../../models/Vector";

export const computeLightning = (P: Vector, N: Vector, lights: LightSource[]) => {
	let i = 0.0;
	for (let light of lights) {
		if (light.type === LightSourceType.ambient) {
			i += light.intensity;
		} else {
            const position = light.position as Vector;
			let L: Vector;
			if (light.type === LightSourceType.point) {
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