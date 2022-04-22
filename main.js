function draw() {
	let spheres = [
		{
			center: new Point(0, -1, 3),
			radius: 1,
			color: new Color(255, 0, 0)
		},
		{
			center: new Point(2, 0, 4),
			radius: 1,
			color: new Color(0, 0, 255)
		},
		{
			center: new Point(-2, 0, 4),
			radius: 1,
			color: new Color(0, 255, 0)
		}
	]
	
	let O = new Point(0, 0, 0);
	
	for (let x=-canvas.width/2; x < canvas.width/2; ++x) {
		for (let y=-canvas.height/2; y < canvas.height/2; ++y) {
			let D = c2vp(x, y);
			let color = traceRay(spheres, O, D, 1, Infinity);
			putPixel(x, y, color);
		}
	}
	
	updateCanvas();
}
