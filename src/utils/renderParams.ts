import { LightSource } from "../models/light";
import { Sphere } from "../models/Sphere";
import { Vector } from "../models/Vector";
import { concatBuffers } from "./buffers";

export interface RenderData {
    checkerboard: boolean;
    id: number;
    dimensions: [xStart: number, xEnd: number, yStart: number, yEnd: number];
    canvasSize: [x: number, y: number];
    cameraVector: Vector;
    viewPort: [h: number, v: number];
    spheres: Sphere[];
    lights: LightSource[];
}

export interface RenderDataSerialized {
    checkerboard: ArrayBuffer;
    id: ArrayBuffer;
    dimensions: ArrayBuffer;
    canvasSize: ArrayBuffer;
    cameraVector: ArrayBuffer;
    viewPort: ArrayBuffer;
    spheres: ArrayBuffer;
    lights: ArrayBuffer;
}

export const serializeParams = (data: RenderData): RenderDataSerialized => {
    return {
        checkerboard: Uint8Array.of(data.checkerboard ? 1 : 0).buffer,
        id: Uint8Array.of(data.id).buffer,
        dimensions: Float32Array.from(data.dimensions).buffer,
        canvasSize: Uint8Array.from(data.canvasSize).buffer,
        cameraVector: data.cameraVector.asBuffer(),
        viewPort: Float32Array.from(data.viewPort).buffer,
        spheres: concatBuffers(...data.spheres.map((sphere) => sphere.asBuffer())),
        lights: concatBuffers(...data.lights.map((light) => light.asBuffer())),
    }
}

export const deserializeParams = (data: RenderDataSerialized): RenderData => {
    return {
        checkerboard: (new Uint8Array(data.checkerboard))[0] !== 0,
        id: (new Uint8Array (data.id))[0],
        dimensions: [...new Float32Array(data.dimensions)] as [number, number, number, number],
        canvasSize: [...new Uint8Array(data.canvasSize)] as [number, number],
        cameraVector: Vector.fromBuffer(data.cameraVector),
        viewPort: [...new Float32Array(data.viewPort)] as [number, number],
        spheres: Sphere.fromBuffer(data.spheres),
        lights: LightSource.fromBuffer(data.lights),
    }
}