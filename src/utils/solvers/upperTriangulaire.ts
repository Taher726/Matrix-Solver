import { Matrix, Vector, LUResult } from '../../types/Matrix';

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
  const startTime = performance.now();
  const n = matrix.size;
  const [L, U] = decompositionLU_SUP(matrix);
  const y = [...b.values];

  const x: number[] = Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    let somme = 0;

    for (let j = i + 1; j < n; j++) {
      somme += U[i][j] * x[j];
    }

    x[i] = (y[i] - somme) / U[i][i];
  }

  const endTime = performance.now();
  const complexity = endTime - startTime;
  console.log("complexity : ", complexity);

  return { L, U, x, complexity };
};