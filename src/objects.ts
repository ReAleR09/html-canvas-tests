import { Color } from "./models/color";
import { Point } from "./models/Point";
import { Sphere } from "./models/Sphere";
import { Vector } from "./models/Vector";

export const SPHERES = [
	new Sphere(new Point(0, -1, 3), 1, new Color(255, 0, 0)),
	new Sphere(new Point(2, 0, 4), 1, new Color(0, 0, 255)),
	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0)),
];

// export const lights = [
//     new Light(Light.Type.Ambient, 0.2),
//     new Light(Light.Type.Point, 0.6, new Point(2, 1, 0)),
//     new Light(Light.Type.Directional, 0.2, new Vector(1, 4, 4))
// ]