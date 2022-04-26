import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { CanvasDimensions } from "./CanvasDivensions";

type Dimensions = [number, number, number, number];

type SphereArr = [
    dimensions: [x: number, y: number, z: number], // x, y, z
    radius: number, // radius
    color: [r: number, g: number, b: number], // Color r, g, b
];

type CameraPos = [number, number, number];

export interface RenderDataUnpacked {
    dimensions: Dimensions,
    checkerboard: boolean,
    spheres: Array<SphereArr>,
    cameraPos: CameraPos,
};

export interface RenderData {
    dimensions: CanvasDimensions,
    checkerboard: boolean,
    spheres: Array<Sphere>,
    cameraPos: Point,
}