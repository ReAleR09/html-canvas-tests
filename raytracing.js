function traceRay(spheres, O, D, t_min, t_max) {
	let closest_t = Infinity;
	let closest_sphere = undefined;
	
	for (const sphere of spheres) {
		let {T1, T2} = intersectRaySphere(Vector.fromPoint(O), Vector.fromPoint(D), sphere);
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
		return new Color(0, 0, 0);
	}
	
	return closest_sphere.color;
}

function intersectRaySphere(O, D, sphere) {
	let r = sphere.radius;
	let CO = O.sub(Vector.fromPoint(sphere.center));
	
	let a = D.dot(D);
	let b = 2 * CO.dot(D);
	let c = CO.dot(CO) - r*r;
	
	let discr = b*b - 4 * a * c;
	if (discr < 0) {
		return {T1: Infinity, T2: Infinity}
	}
	
	let t1 = (-b + Math.sqrt(discr)) / (2 * a);
	let t2 = (-b - Math.sqrt(discr)) / (2 * a);
	return {T1: t1, T2: t2};
}
