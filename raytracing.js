function traceRay(spheres, O, D, t_min, t_max) {
	let closest_t = Infinity;
	let closest_sphere = undefined;
	
	for (const sphere of spheres) {
		let {T1, T2} = intersectRaySphere(O, D, sphere);
		if (T1 > t_min && T1 < t_max && T1 < closest_t) {
			closest_t = T1;
			closest_sphere = sphere;
		}
		if (T2 > t_min && T2 < t_max && T2 < closest_t) {
			closest_t = T2;
			closest_sphere = sphere;
		}
	}
	
	if (closest_sphere === undefined) {
		return {R: 0, G: 0, B: 0}
	}
	
	return closest_sphere.color;
}

function intersectRaySphere(O, D, sphere) {
	let r = sphere.radius;
	let CO = sub(O, sphere.center);
	
	let a = dot(D, D);
	let b = 2 * dot(CO, D);
	let c = dot(CO, CO) - r*r;
	
	let discr = b*b - 4 * a * c;
	if (discr < 0) {
		return {T1: Infinity, T2: Infinity}
	}
	
	let t1 = (-b + Math.sqrt(discr)) / (2 * a);
	let t2 = (-b - Math.sqrt(discr)) / (2 * a);
	return {T1: t1, T2: t2};
}
