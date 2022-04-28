import { Color } from "./models/color";
import { Light, LightType } from "./models/light";
import { Point } from "./models/Point";
import { Sphere } from "./models/Sphere";

export const SPHERES = [
	new Sphere(new Point(0, 0, 3), 1, new Color(255, 0, 0)),
	new Sphere(new Point(2, 0, 4), 1, new Color(0, 0, 255)),
	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0)),
];

export const LIGHTS = [
    new Light(LightType.point, 5, new Point(0, 0, 0)),
    new Light(LightType.ambient, 0.08),
    // new Light(LightType.directional, 5, new Vector(-5, 5, -10))
];

export const getLightPoint = (index: number) => LIGHTS[index].position as Point;