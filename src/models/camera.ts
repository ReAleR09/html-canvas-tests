import { getRotationMatrix, multiplyMV } from "../renderers/calc/matrix";
import { Triplet } from "../types/tuples";
import { CAMERA_MOVE_SPEED } from "../utils/const";
import { Vector } from "./Vector";

export class Camera {
    constructor(
        public readonly pos: Triplet = [0, 0, -2],
        public readonly angles: Triplet = [0, 0, 0],
    ) { }

    updateCameraPosition(diffVector: Vector, angleDiffs: Triplet) {
        // directed diff vector
        const ddf = multiplyMV(getRotationMatrix(...this.angles), diffVector);
        
        this.pos[0] += ddf.x * CAMERA_MOVE_SPEED;
        this.pos[1] += ddf.y * CAMERA_MOVE_SPEED;
        this.pos[2] += ddf.z * CAMERA_MOVE_SPEED;

        const [dXaxis, dYaxis, dZaxis] = angleDiffs;
        this.angles[0] += dXaxis; this.angles[1] += dYaxis; this.angles[2] += dZaxis;
    }

    asBuffer(): ArrayBuffer {
        const arr = Float32Array.from([...this.pos, ...this.angles]);
        return arr.buffer;
    }

    static fromBuffer(arrayBuffer: ArrayBuffer): Camera {
        const arr = new Float32Array(arrayBuffer);
        const pos = [arr[0], arr[1], arr[2]] as Triplet;
        const angles = [arr[3], arr[4], arr[5]] as Triplet;
        return new Camera(pos, angles);
    }

}