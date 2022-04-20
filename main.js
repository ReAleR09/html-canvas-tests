function draw() {
	for (let i=-100; i<100; ++i) {
		putPixel(-100, i, {R: 255, G: 0, B: 0});
	}
	for (let i=-100; i<100; ++i) {
		putPixel(100, i, {R: 0, G: 255, B: 0});
	}
	for (let i=-100; i<100; ++i) {
		putPixel(i, -100, {R: 0, G: 0, B: 255});
	}
	for (let i=-100; i<100; ++i) {
		putPixel(i, 100, {R: 255, G: 255, B: 0});
	}

	for (let i=-100; i<100; ++i) {
		putPixel(i, i, {R: 0, G: 255, B: 255});
	}
	for (let i=-100; i<100; ++i) {
		putPixel(i, -i, {R: 255, G: 0, B: 255});
	}

	for (const x of Array(20).keys()) {
		for (const y of Array(20).keys()) {
			putPixel(x-10, y-10, {R: 128, G: 128, B: 128});
		}
	}
	
	updateCanvas();
}