import { Matrix, Vector, LUResult } from '../../types/Matrix';

export const solveUpperTriangular = (matrix: Matrix, b: Vector): LUResult => {
  const n = matrix.size;
  const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const U: number[][] = matrix.values;
  const x: number[] = Array(n).fill(0);

  // For upper triangular, L is identity matrix
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;
  }

  // Direct backward substitution (Ux = b)
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (b.values[i] - sum) / U[i][i];
  }

  return { L, U, x };
};

const decompositionLU_SUP = (matrix: Matrix): [number[][], number[][]] => {
  const n = matrix.size;
  const L: number[][] = Array.from({ length: n }, (_, i) => 
    Array.from({ length: i + 1 }, () => 0.0)
  );
  const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));
  

  for(let i=0; i<n; i++){
    L[i][i] = 1;
    for(let j=i; j<n; j++)
      U[i][j] = matrix.values[i][j];
  }
  
  return [L, U];
}

export const resolution_LU_SUP = (matrix: Matrix, b: Vector): LUResult => {
  const n = matrix.size;
  const [L, U] = decompositionLU_SUP(matrix);
  const y = [...b.values];

  // Résolution de U*x = y (Substitution arrière)
  const x: number[] = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const somme = U[i].slice(i + 1, n).reduce((acc, Uij, j) => acc + Uij * x[j + i + 1], 0);
    x[i] = (y[i] - somme) / U[i][i];
  }

  return { L, U, x }; 
}