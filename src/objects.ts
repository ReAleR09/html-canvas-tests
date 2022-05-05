import { Color } from "./models/color";
import { LightSource, LightSourceType } from "./models/light";
import { Point } from "./models/Point";
import { Sphere } from "./models/Sphere";
import { Vector } from "./models/Vector";

export const SPHERES = [
	new Sphere(new Point(0, -1, 3), 1, new Color(255, 0, 0), 10),
	new Sphere(new Point(2, 0, 4), 1, new Color(0, 0, 255), 100),
	new Sphere(new Point(-2, 0, 4), 1, new Color(0, 255, 0), 1000),
	new Sphere(new Point(0, -5004, 0), 5000, new Color(255, 255, 0), -1),
];

export const LIGHTS = [
    new LightSource(LightSourceType.ambient, 0.2),
    new LightSource(LightSourceType.point, 0.6, new Point(2, 1, 0)),
    new LightSource(LightSourceType.directional, 0.2, new Vector(1, 4, 4)),
    // new LightSource(LightSourceType.point, 10, new Point(2, 2, 1))
];

export const getLightPoint = (index: number) => LIGHTS[index].position as Point;