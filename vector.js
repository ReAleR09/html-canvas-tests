function sum(v1, v2) {
	return {X: v1.X + v2.X, Y: v1.Y + v2.Y, Z: v1.Z + v2.Z};
}

function sub(v1, v2) {
	return {X: v1.X - v2.X, Y: v1.Y - v2.Y, Z: v1.Z - v2.Z};
}

function dot(v1, v2) {
	return v1.X * v2.X + v1.Y * v2.Y + v1.Z * v2.Z;
}
