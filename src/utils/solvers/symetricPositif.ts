import { Matrix, Vector, LUResult } from '../../types/Matrix';

export const solveSymmetricPositiveDefinite = (matrix: Matrix, b: Vector): LUResult => {
  const startTime = performance.now();
  const n = matrix.size;
  const L: number[][] = Array.from({ length: n }, (_, i) => 
    Array.from({ length: i + 1 }, () => 0.0)
  );
  const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));
  const x: number[] = Array(n).fill(0);
  const y: number[] = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    L[i][i] = 1;

    let sum = 0;
    for (let k = 0; k < i; k++) {
      sum += L[i][k] * U[k][i];
    }
    U[i][i] = matrix.values[i][i] - sum;
    if (U[i][i] <= 0) {
      throw new Error("Matrix is not positive definite");
    }

    for (let j = i + 1; j < n; j++) {
      let sumU = 0;
      let sumL = 0;
      for (let k = 0; k < i; k++) {
        sumU += L[i][k] * U[k][j];
        sumL += L[j][k] * U[k][i];
      }
      U[i][j] = matrix.values[i][j] - sumU;
      L[j][i] = (matrix.values[j][i] - sumL) / U[i][i];
    }
  }

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
    }
    y[i] = b.values[i] - sum;
  }

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (y[i] - sum) / U[i][i];
  }
  const endTime = performance.now();
  const complexity = endTime - startTime;
  console.log("complexity : ",complexity);

  return { L, U, x, complexity };
};