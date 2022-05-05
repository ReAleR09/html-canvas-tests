import { LightSource, LightSourceType } from "../../models/light";
import { Point } from "../../models/Point";
import { Vector } from "../../models/Vector";

export const computeLightning = (
    P: Point,
    Normal: Vector, // a normal to surface
    lights: LightSource[],
    V: Vector, // from point to camera
    s: number, // specular of the object
) => {
	let i = 0.0;
	for (let light of lights) {
		if (light.type === LightSourceType.ambient) {
			i += light.intensity;
		} else {
			let L: Vector;
			if (light.type === LightSourceType.point) {
				L = (light.position as Point).sub(P);
			} else {
				L = light.position as Vector;
			}
            // diffuse reflection
			const n_dot_l = Normal.dot(L);
			if (n_dot_l > 0) {
				i += light.intensity * n_dot_l / (Normal.length() * L.length());
			}
            // specular reflection
            if (s !== -1) {
                const R = Normal.mul(2 * Normal.dot(L)).sub(L); // R is main reflection vector of the light
                const r_dot_v = R.dot(V);
                if (r_dot_v > 0) {
                    i += light.intensity * Math.pow(r_dot_v / (R.length() * V.length()), s);
                }
            }
		}
	}
	
	return i;
}