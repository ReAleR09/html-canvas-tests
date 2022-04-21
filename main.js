function draw() {
	let spheres = [
		{
			center: {X: 0, Y: -1, Z: 3},
			radius: 1,
			color: {R: 255, G: 0, B: 0}
		},
		{
			center: {X: 2, Y: 0, Z: 4},
			radius: 1,
			color: {R: 0, G: 0, B: 255}
		},
		{
			center: {X: -2, Y: 0, Z: 4},
			radius: 1,
			color: {R: 0, G: 255, B: 0}
		}
	]
	
	let O = {X: 0, Y: 0, Z: 0};
	
	for (let x=-canvas.width/2; x < canvas.width/2; ++x) {
		for (let y=-canvas.height/2; y < canvas.height/2; ++y) {
			let D = c2vp(x, y);
			let color = traceRay(spheres, O, D, 1, Infinity);
			putPixel(x, y, color);
		}
	}
	
	updateCanvas();
}
