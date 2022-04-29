import { Vector } from "../../models/Vector";

export type RotationMatrix = [
    [number, number, number],
    [number, number, number],
    [number, number, number],
];

export const multiplyMV = (mat: RotationMatrix, camDir: Vector) => {
    const vec = [camDir.x, camDir.y, camDir.z];
    const result: [number, number, number] = [0, 0, 0];
  
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        result[i] += vec[j]*mat[i][j];
      }
    }
  
    return new Vector(...result);
}

// Multiplies matricies
export const multiplyMatrices = (m1: number[][], m2: number[][]): number[][] => {
    const result: number[][] = [];
    for (var i = 0; i < m1.length; i++) {
        result[i] = [];
        for (let j = 0; j < m2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < m1[0].length; k++) {
                sum += m1[i][k] * m2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

export const getRotationMatrix = (xAxis, yAxis, zAxis): RotationMatrix => {
    const xAxisMx = [
      [1,                 0,                0              ],
      [0,                 Math.cos(xAxis), -Math.sin(xAxis)],
      [0,                 Math.sin(xAxis),  Math.cos(xAxis)]
    ];
    const yAxisMx = [
      [Math.cos(yAxis),   0,                Math.sin(yAxis)],
      [0,                 1,                0              ],
      [-Math.sin(yAxis),  0,                Math.cos(yAxis)]
    ];
    const zAxisMx = [
      [Math.cos(zAxis),   -Math.sin(zAxis), 0             ],
      [Math.sin(zAxis),   Math.cos(zAxis),  0             ],
      [0,                 0,                1             ],
    ];

    const rotationMatrix = multiplyMatrices(
        multiplyMatrices(xAxisMx, yAxisMx),
        zAxisMx
    ) as RotationMatrix;

    return rotationMatrix;
  }