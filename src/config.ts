import { Color } from "./models/color";

export const BG_COLOR = new Color(15, 15, 15);

export const IS_CHECKERBOARD_ENABLED = false;
export const WEB_WORKERS = 4;

export const FPS_MEASURE_COUNTER = 5;

// TODO think this through
export const CAMERA_ROTATION_MATRIX = [
    [0.7071, 0, -0.7071],
    [0, 1, 0],
    [0.7071,0, 0.7071]]
;