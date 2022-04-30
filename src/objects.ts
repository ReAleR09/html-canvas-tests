import { Color } from "./models/color";
import { LightSource, LightSourceType } from "./models/light";
import { Point } from "./models/Point";
import { Sphere } from "./models/Sphere";
import { Vector } from "./models/Vector";

export const SPHERES = [
	new Sphere(new Point(0, 0, 3), 1, new Color(255, 0, 0)),
	new Sphere(new Point(2, 0, 4), 1, new Color(0, 0, 255)),
	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0)),
];

export const LIGHTS = [
    // new LightSource(LightSourceType.point, 1, new Point(0, 0, 0)),
    new LightSource(LightSourceType.ambient, 0.05),
    // new LightSource(LightSourceType.directional, 100, new Vector(100, 100, 0)),
    new LightSource(LightSourceType.point, 10, new Point(2, 2, 1))
];

export const getLightPoint = (index: number) => LIGHTS[index].position as Point;