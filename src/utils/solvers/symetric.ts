import { Matrix, Vector, LUResult } from '../../types/Matrix';

export const solveSymmetric = (matrix: Matrix, b: Vector): LUResult => {
  const n = matrix.size;
  const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const U: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const x: number[] = Array(n).fill(0);
  const y: number[] = Array(n).fill(0);

  // LU decomposition for symmetric matrix
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;

    // Calculate U's row i
    for (let j = i; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[i][k] * U[k][j];
      }
      U[i][j] = matrix.values[i][j] - sum;
    }

    // Calculate L's column i
    for (let j = i + 1; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[j][k] * U[k][i];
      }
      L[j][i] = (matrix.values[j][i] - sum) / U[i][i];
    }
  }

  // Forward substitution (Ly = b)
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) {
      sum += L[i][j] * y[j];
    }
    y[i] = b.values[i] - sum;
  }

  // Backward substitution (Ux = y)
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += U[i][j] * x[j];
    }
    x[i] = (y[i] - sum) / U[i][i];
  }

  return { L, U, x };
};

const decompositionLUSym = (matrix: Matrix): [number[][], number[][]] => {
  const n = matrix.size;
  const L: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));
  const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));

  for (let i = 0; i < n; i++) {
    L[i][i] = 1.0; // Diagonal elements of L are 1

    // Calculate the elements of U (row starting from the diagonal)
    for (let j = i; j < n; j++) {
      U[i][j] = matrix.values[j][i]; // Use A[j][i] due to symmetry
      for (let k = 0; k < i; k++) {
        U[i][j] -= L[i][k] * U[k][j]; // Subtract L_ik * U_kj
      }
    }

    // Calculate the elements of L (column below the diagonal)
    for (let j = i + 1; j < n; j++) {
      L[j][i] = matrix.values[j][i]; // Use the lower half of A
      for (let k = 0; k < i; k++) {
        L[j][i] -= L[j][k] * U[k][i]; // Subtract L_jk * U_ki
      }
      L[j][i] /= U[i][i]; // Divide by U_ii
    }
  }

  return [L, U];
}

export const resolutionLUSym = (matrix: Matrix, b: Vector): LUResult => {
  const n = matrix.size;
  const [L, U] = decompositionLUSym(matrix);

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