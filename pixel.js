var canvas, imD, ctx;

function initCanvas(canvasId) {
	canvas = document.getElementById(canvasId);
	ctx = canvas.getContext ('2d');
	imD = ctx.createImageData (canvas.width, canvas.height);
}

function transXY(x, y) {
	return {x: canvas.width/2+x, y: canvas.height/2-y}
}

function putPixel(x, y, c) {
	({x, y} = transXY(x, y));
	let {R, G, B, A} = c;
	let i = (y * imD.width + x) * 4;
	imD.data[i+0] = R;
	imD.data[i+1] = G;
	imD.data[i+2] = B;
	imD.data[i+3] = A ? A : 255;
}

function getPixel(x, y) {
	({x, y} = transXY(x, y));
	let i = (y * imD.width + x) * 4;
	return {
		R: imD.data[i+0],
		G: imD.data[i+1],
		B: imD.data[i+2],
		A: imD.data[i+3]
	};
}

function updateCanvas() {
	ctx.putImageData(imD, 0, 0);
}
