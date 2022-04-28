// TODO rewrite to typescript

import { Vector } from "../../models/Vector";


// Multiplies a matrix and a vector.
export const multiplyMV = (mat, camDir: Vector) => {
    const vec = [camDir.x, camDir.y, camDir.z];
    const result: [number, number, number] = [0, 0, 0];
  
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        result[i] += vec[j]*mat[i][j];
      }
    }
  
    return new Vector(...result);
}