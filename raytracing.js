const bgColor = new Color(0, 0, 0);

function traceRay(spheres, COs, viewportVector, t_min, t_max) {
	let closest_t = Infinity;
	let closest_sphere = undefined;
	
	for (let i = 0; i < spheres.length; i++) {
		const sphere = spheres[i];
		const CO = COs[i];

		const T2 = intersectRaySphere(CO, viewportVector, sphere.radius);
		// if (T1 > t_min && T1 < t_max && T1 < closest_t) {
		// 	closest_t = T1;
		// 	closest_sphere = sphere;
		// }
		if (T2 > t_min && T2 < t_max && T2 < closest_t) {
			closest_t = T2;
			closest_sphere = sphere;
		}
	}
	
	if (closest_sphere === undefined) {
		return bgColor;
	}
	
	return closest_sphere.color;
}

// const bgPos = [Infinity, Infinity];

function intersectRaySphere(CO, D, r) {
	let a = D.length() * 2;
	let b = 2 * CO.dot(D);
	let c = CO.length() - r*r;
	
	let discr = b*b - 2 * a * c;
	if (discr < 0) {
		return Infinity;
	}
	
	// let t1 = (-b + Math.sqrt(discr)) / (a);
	let t2 = (-b - Math.sqrt(discr)) / (a);
	return t2;
}
