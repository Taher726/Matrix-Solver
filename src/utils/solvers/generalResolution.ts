import { Matrix, Vector, LUResult } from '../../types/Matrix';
import { determinant } from '../fileParser';

export const decomposition_LU = (matrix: Matrix): [number[][], number[][]] => {
  const n = matrix.size;
  const L: number[][] = Array.from({ length: n }, (_, i) => 
    Array.from({ length: i + 1 }, () => 0.0)
  );
  const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));

  for (let i = 0; i < n; i++) {
    L[i][i] = 1;

    for (let j = 0; j < i; j++) {
      L[i][j] = matrix.values[i][j];
      for (let k = 0; k < j; k++) {
        L[i][j] -= L[i][k] * U[k][j];
      }
      L[i][j] /= U[j][j];
    }

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
  const startTime = performance.now();
  const n = matrix.size;
  if(!verifierMineursFondamentaux(matrix.values)){
    console.log("La matrice admet des mineurs nuls");
    [matrix, b] = pivotagePartiel(matrix, b);
  }

  const [L, U] = decomposition_LU(matrix);

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
  console.log("Complexity : ", endTime - startTime);
  
  return { L, U, x, complexity };
}

export const verifierMineursFondamentaux = (A: number[][]): boolean => {
  const n = A.length;
  const mineurs: number[] = [];
  for (let k = 0; k < n; k++) { 
    // Extraire la sous-matrice k x k
    const sousMatrice: number[][] = A.slice(0, k).map(row => row.slice(0, k));
    // Calculer le déterminant de la sous-matrice
    const det: number = determinant(sousMatrice);
    mineurs.push(det);
    if (det === 0) {
      return false;
    }
  }
  return true;
};

export const pivotagePartiel = (matrix: Matrix, b: Vector): [Matrix, Vector] => {
  const n = matrix.size;

  for (let k = 0; k < n - 1; k++) {
    // Find the row with the maximum pivot (in absolute value) in column k
    let maxVal = Math.abs(matrix.values[k][k]);
    let maxRow = k;

    for (let i = k + 1; i < n; i++) {
      if (Math.abs(matrix.values[i][k]) > maxVal) {
        maxVal = Math.abs(matrix.values[i][k]);
        maxRow = i;
      }
    }

    // Swap rows if necessary
    if (maxRow !== k) {
      // Swap rows in A
      [matrix.values[k], matrix.values[maxRow]] = [matrix.values[maxRow], matrix.values[k]];
      // Swap corresponding values in b
      [b.values[k], b.values[maxRow]] = [b.values[maxRow], b.values[k]];
    }
  }

  return [matrix, b];
};