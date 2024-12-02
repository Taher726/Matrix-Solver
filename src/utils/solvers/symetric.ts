import { Matrix, Vector, LUResult } from '../../types/Matrix';

const decompositionLUSym = (matrix: Matrix): [number[][], number[][]] => {
  const n = matrix.size;
  const L: number[][] = Array.from({ length: n }, (_, i) => 
    Array.from({ length: i + 1 }, () => 0.0)
  );
  const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));

  for (let i = 0; i < n; i++) {
    L[i][i] = 1.0; 

    for (let j = i; j < n; j++) {
      U[i][j] = matrix.values[j][i];
      for (let k = 0; k < i; k++) {
        U[i][j] -= L[i][k] * U[k][j];
      }
    }

    for (let j = i + 1; j < n; j++) {
      L[j][i] = matrix.values[j][i]; 
      for (let k = 0; k < i; k++) {
        L[j][i] -= L[j][k] * U[k][i];
      }
      L[j][i] /= U[i][i];
    }
  }

  return [L, U];
}

export const resolutionLUSym = (matrix: Matrix, b: Vector): LUResult => {
  const startTime = performance.now();
  const n = matrix.size;
  const [L, U] = decompositionLUSym(matrix);

  const y: number[] = Array(n).fill(0);
  for(let i=0; i<n; i++){
    let sum=0;
    for(let j=0; j<i; j++)
      sum += L[i][j] * y[j];
    y[i] = b.values[i] - sum;
  }

  const x: number[] = Array(n).fill(0);
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
}