import { Camera } from "../models/camera";
import { LightSource } from "../models/light";
import { Point } from "../models/Point";
import { Sphere } from "../models/Sphere";
import { concatBuffers } from "./buffers";

export interface RenderData {
    id: number;
    dimensions: [xStart: number, xEnd: number, yStart: number, yEnd: number];
    canvasSize: [x: number, y: number];
    camera: Camera;
    viewPort: [h: number, v: number];
    spheres: Sphere[];
    lights: LightSource[];
}

export interface RenderDataSerialized {
    id: ArrayBuffer;
    dimensions: ArrayBuffer;
    canvasSize: ArrayBuffer;
    camera: ArrayBuffer;
    viewPort: ArrayBuffer;
    spheres: ArrayBuffer;
    lights: ArrayBuffer;
}

export const serializeParams = (data: RenderData): RenderDataSerialized => {
    return {
        id: Uint8Array.of(data.id).buffer,
        dimensions: Float32Array.from(data.dimensions).buffer,
        canvasSize: Uint8Array.from(data.canvasSize).buffer,
        camera: data.camera.asBuffer(),
        viewPort: Float32Array.from(data.viewPort).buffer,
        spheres: concatBuffers(...data.spheres.map((sphere) => sphere.asBuffer())),
        lights: concatBuffers(...data.lights.map((light) => light.asBuffer())),
    }
}

export const deserializeParams = (data: RenderDataSerialized): RenderData => {
    return {
        id: (new Uint8Array (data.id))[0],
        dimensions: [...new Float32Array(data.dimensions)] as [number, number, number, number],
        canvasSize: [...new Uint8Array(data.canvasSize)] as [number, number],
        camera: Camera.fromBuffer(data.camera),
        viewPort: [...new Float32Array(data.viewPort)] as [number, number],
        spheres: Sphere.fromBuffer(data.spheres),
        lights: LightSource.fromBuffer(data.lights),
    }
}