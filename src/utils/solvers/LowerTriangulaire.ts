import { Matrix, Vector, LUResult } from '../../types/Matrix';

export const solveLowerTriangular = (matrix: Matrix, b: Vector): LUResult => {
  const n = matrix.size;
  const L: number[][] = matrix.values;
  const U: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const x: number[] = Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    U[i][i] = 1;
  }

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * x[j];
    }
    x[i] = (b.values[i] - sum) / L[i][i];
  }

  return { L, U, x };
};

const decomposition_LU_INF = (matrix: Matrix): [number[][], number[][]] => {
  const n = matrix.size;
  const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const U: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
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
  const n = matrix.size;
  const [L, U] = decomposition_LU_INF(matrix);

  const y: number[] = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const somme = L[i].slice(0, i).reduce((acc, Lij, j) => acc + Lij * y[j], 0);
    y[i] = b.values[i] - somme;
  }

  // Résolution de U*x = y (Substitution arrière)
  const x: number[] = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    x[i] = y[i] / U[i][i];
  }

  return { L, U, x };
}