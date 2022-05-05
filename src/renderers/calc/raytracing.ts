import { BG_COLOR } from "../../config";
import { LightSource } from "../../models/light";
import { Point } from "../../models/Point";
import { Sphere } from "../../models/Sphere";
import { Vector } from "../../models/Vector";
import { useMemo } from "../../utils/useMemo";
import { computeLightning } from "./light";

export function traceRay(
    spheres: Sphere[],
    lights: LightSource[],
    COs: Vector[],
    viewportVector: Vector,
    t_min: number,
    t_max: number
) {
	let closest_t = Infinity;
	let closestSphereIndex: number|null = null;
	let isInside = false;
	
	for (let i = 0; i < spheres.length; i++) {
		const sphere = spheres[i];
		const CO = COs[i];

		const [T1, T2] = intersectRaySphere(CO, viewportVector, sphere.radius);
		
		if (T2 > t_min && T2 < t_max && T2 < closest_t) {
			closest_t = T2;
			closestSphereIndex = i;
			isInside = false;
		} else if (T1 > t_min && T1 < t_max && T1 < closest_t) {
			closest_t = T1;
			closestSphereIndex = i;
			isInside = true;
		}
	}

	if (closestSphereIndex === null) {
		return BG_COLOR;
	}
	
	const closest_sphere = spheres[closestSphereIndex];

    const cameraPos = COs[closestSphereIndex].add(closest_sphere.center);

	const P = cameraPos.add(viewportVector.mul(closest_t));

	let Normal = P.sub(closest_sphere.center); // FIXME something's wrong with Normal
	Normal =  Normal.mul(1 / Normal.length());

    const totalIntensity = computeLightning(
        P as unknown as Point, // fix
        Normal,
        lights,
        viewportVector.mul(-1),
        closest_sphere.specular,
    );
    // const totalIntensity = 1;

    const color = closest_sphere.color.mul(totalIntensity);
	
	return color;
}

const bgPos = [Infinity, Infinity];

function intersectRaySphere(CO: Vector, D: Vector, r: number) {
	const a = D.dot(D);
	const b = 2 * CO.dot(D);
	const c = CO.dot(CO) - r*r;
	
	const discr = b*b - 4 * a * c;
	if (discr < 0) {
		return bgPos;
	}
	
	const d = Math.sqrt(discr);
	const t1 = (-b + d) / (2*a);
	const t2 = (-b - d) / (2*a);
	return [t1, t2];
}
