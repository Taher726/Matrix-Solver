import { Matrix, Vector, LUResult } from '../../types/Matrix';

const decomposition_LU_INF = (matrix: Matrix): [number[][], number[][]] => {
  const n = matrix.size;
  const L: number[][] = Array.from({ length: n }, (_, i) => 
    Array.from({ length: i + 1 }, () => 0.0)
  );
  const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));
  for(let i=0; i<n; i++){
    U[i][i] = matrix.values[i][i];
    L[i][i] = 1;
    for(let j=0; j<i; j++){
      L[i][j] = matrix.values[i][j]
      for(let k=0; k<j; k++)
        L[i][j] -= L[i][k] * U[k][j];
      L[i][j] /= U[j][j]
    }
  }
  return [L, U];
}

export const resolution_LU_INF = (matrix: Matrix, b: Vector): LUResult => {
  const startTime = performance.now();
  const n = matrix.size;
  const [L, U] = decomposition_LU_INF(matrix);

  const y: number[] = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let somme = 0;

    for (let j = 0; j < i; j++) {
      somme += L[i][j] * y[j];
    }

    y[i] = b.values[i] - somme;
  }

  const x: number[] = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    x[i] = y[i] / U[i][i];
  }

  const endTime = performance.now();
  const complexity = endTime - startTime;
  console.log("complexity :", complexity);

  return { L, U, x, complexity };
};