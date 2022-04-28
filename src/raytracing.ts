import { BG_COLOR } from "./consts";
import { Sphere } from "./models/Sphere";
import { Vector } from "./models/Vector";

export function traceRay(spheres: Sphere[], COs: Vector[], viewportVector: Vector, t_min: number, t_max: number) {
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
	const color = isInside ? closest_sphere.color.invert() : closest_sphere.color;
	return color;

	// restore the 'O'
	// const O = COs[closestSphereIndex].add(closest_sphere.center)
	// const P = O.add(viewportVector.mul(closest_t));

	// let N = Vector.fromPoint(P.sub(closest_sphere.center));
	// N =  N.mul(1 / N.length());
	
	// return closest_sphere.color.mul(computeLightning(P, N, lights));
}

const bgPos = [Infinity, Infinity];

function intersectRaySphere(CO, D, r) {
	let a = D.length() * 2;
	let b = 2 * CO.dot(D);
	let c = CO.length() - r*r;
	
	let discr = b*b - 2 * a * c;
	if (discr < 0) {
		return bgPos;
	}
	
	const d = Math.sqrt(discr);
	let t1 = (-b + d) / (a);
	let t2 = (-b - d) / (a);
	return [t1, t2];
}
