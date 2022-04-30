import { Vector } from "../models/Vector";

export const DEFAULT_X_CAMERA_VECTOR = new Vector(1, 0, 0);
export const DEFAULT_Y_CAMERA_VECTOR = new Vector(0, 1, 0);
/**
 * Z of this vector is responsible for distance between camera and viewport on the default Z axis
 * In other words, change third number to config Field Of View
 * Bigger number -> smaller FOV
 */
export const DEFAULT_Z_CAMERA_VECTOR = new Vector(0, 0, 2);

export const CAMERA_MOVE_SPEED = 0.1;
export const CAMERA_ROTATION_SPEED = 0.0025;