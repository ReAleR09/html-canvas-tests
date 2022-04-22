var canvas, imD, ctx, viewport;

function init(canvasId) {
	canvas = document.getElementById(canvasId);
	ctx = canvas.getContext ('2d');
	imD = ctx.createImageData (canvas.width, canvas.height);
	viewport = {W: 1, H: 1}
	return canvas;
}

function transXY(x, y) {
	return [canvas.width/2+x, canvas.height/2-y];
}

function putPixel(xOrig, yOrig, c) {
	const [x, y] = transXY(xOrig, yOrig);
	const i = (y * imD.width + x) * 4;
	imD.data[i+0] = c.r;
	imD.data[i+1] = c.g;
	imD.data[i+2] = c.b;
	imD.data[i+3] = 255; // alpha
}

function getPixel(xOrig, yOrig) {
	const [x, y] = transXY(xOrig, yOrig);
	const i = (y * imD.width + x) * 4;
	return new Color(
		imD.data[i+0],
		imD.data[i+1],
		imD.data[i+2]
	);
}

function updateCanvas() {
	ctx.putImageData(imD, 0, 0);
}

// canvas coordinates to viewpoint coordinates
function c2vp(x, y) {
	return new Point(x * viewport.W / canvas.width, y * viewport.H / canvas.height, 1)
}
