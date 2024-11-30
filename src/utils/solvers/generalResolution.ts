import { Matrix, Vector, LUResult } from '../../types/Matrix';

export const solveGeneral = (matrix: Matrix, b: Vector): LUResult => {
  const n = matrix.size;
  const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const U: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const x: number[] = Array(n).fill(0);
  const y: number[] = Array(n).fill(0);

  // Décomposition LU pour une matrice générale
  for (let i = 0; i < n; i++) {
    // Initialiser le diagonale de L avec 1
    L[i][i] = 1;
    
    // Calculer les elements de U
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[i][k] * U[k][j];
      }
      U[i][j] = matrix.values[i][j] - sum;
    }
    
    // Calculer les elements de L
    for (let j = i + 1; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[j][k] * U[k][i];
      }
      L[j][i] = (matrix.values[j][i] - sum) / U[i][i];
    }
  }

  // Ly=b
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
    }
    y[i] = b.values[i] - sum;
  }

  // Ux=y
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (y[i] - sum) / U[i][i];
  }

  return { L, U, x };
};

export const decomposition_LU = (matrix: Matrix): [number[][], number[][]] => {
  const n = matrix.size;
  const L: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    // Step 1: L_ii = 1
    L[i][i] = 1;

    // Step 2: Calculate elements of L (below diagonal)
    for (let j = 0; j < i; j++) {
      L[i][j] = matrix.values[i][j];
      for (let k = 0; k < j; k++) {
        L[i][j] -= L[i][k] * U[k][j];
      }
      L[i][j] /= U[j][j]; // Division by U[j][j] (should not be zero)
    }

    // Step 3: Calculate elements of U (above diagonal and diagonal)
    for (let j = i; j < n; j++) {
      U[i][j] = matrix.values[i][j];
      for (let k = 0; k < i; k++) {
        U[i][j] -= L[i][k] * U[k][j];
      }
    }
  }

  return [L, U];
};

export const generalRes_LU = (matrix: Matrix, b: Vector): LUResult => {
  const n = matrix.size;
  const [L, U] = decomposition_LU(matrix);

  //Résolution de L*y = b (Substitution avant)
  const y: number[] = Array(n).fill(0);
  for(let i=0; i<n; i++){
    let sum=0;
    for(let j=0; j<i; j++)
      sum += L[i][j] * y[j];
    y[i] = b.values[i] - sum;
  }

  //Résolution de U*x = y (Substitution arrière)
  const x: number[] = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (y[i] - sum) / U[i][i];
  }
  
  return { L, U, x };
}