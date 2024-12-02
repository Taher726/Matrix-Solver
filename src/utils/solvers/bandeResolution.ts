import { LUResult, Matrix, Vector } from "../../types/Matrix";

const decomposition_LU_bande = (matrix: Matrix) : [number[][], number[][]] => {
    const n = matrix.size;
    const L: number[][] = Array.from({ length: n }, (_, i) => 
        Array.from({ length: i + 1 }, () => 0.0)
    );
    const U: number[][] = Array.from({ length: n }, () => Array(n).fill(0.0));

    for (let i = 0; i < n; i++) {
        L[i][i] = 1.0;

        for (let j = i; j < Math.min(i + matrix.bandParameters!.upperWidth + 1, n); j++) {
        U[i][j] = matrix.values[i][j];
        for (let k = Math.max(0, i - matrix.bandParameters!.lowerWidth); k < i; k++) {
            U[i][j] -= L[i][k] * U[k][j];
        }
        }

        for (let j = i + 1; j < Math.min(i + matrix.bandParameters!.lowerWidth + 1, n); j++) {
        L[j][i] = matrix.values[j][i];
        for (let k = Math.max(0, i - matrix.bandParameters!.lowerWidth); k < i; k++) {
            L[j][i] -= L[j][k] * U[k][i];
        }
        L[j][i] /= U[i][i];
        }
    }

    return [L, U];
}

export const resolution_bande_LU = (matrix: Matrix, vector: Vector): LUResult => {
    const startTime = performance.now();
    const n = matrix.size;
    const [L, U] = decomposition_LU_bande(matrix);
  
    // Résolution de L * y = b
    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let somme = 0;
  
      for (let j = 0; j < i; j++) {
        somme += L[i][j] * y[j];
      }
  
      y[i] = vector.values[i] - somme;
    }
  
    // Résolution de U * x = y
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let somme = 0;

      for (let j = i + 1; j < n; j++) {
        somme += U[i][j] * x[j];
      }
  
      x[i] = (y[i] - somme) / U[i][i];
    }
  
    const endTime = performance.now();
    const complexity = endTime - startTime;
    console.log("complexity: ", complexity);
  
    return { L, U, x, complexity };
};  