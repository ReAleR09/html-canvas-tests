import { KEYS_PRESSED } from "./input";
import { Point } from "./Point";

// TODO think this through
export const CAMERA_ROTATION_MATRIX = [
    [0.7071, 0, -0.7071],
    [0, 1, 0],
    [0.7071,0, 0.7071]]
;

// left-right, up-down, close-far
const CAMERA_POS = new Point(0, 0, 2);
export const updateCamera = (): Point => {
  let [x, y, z] = [0, 0, 0];
  if (KEYS_PRESSED.KeyA) {
    x -= 0.02;
  }
  if (KEYS_PRESSED.KeyD) {
    x += 0.02;
  }
  if (KEYS_PRESSED.KeyW) {
    y += 0.02;
  }
  if (KEYS_PRESSED.KeyS) {
    y -= 0.02;
  }
  if (KEYS_PRESSED.ArrowUp) {
    z += 0.02;
  }
  if (KEYS_PRESSED.ArrowDown) {
    z -= 0.02;
  }
  CAMERA_POS.modify(x, y, z);

  return CAMERA_POS;
}