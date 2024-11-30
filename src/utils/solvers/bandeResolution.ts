import { LUResult, Matrix, Vector } from "../../types/Matrix";

const decomposition_LU_bande = (matrix: Matrix) : [number[][], number[][]] => {
    const n = matrix.size;
    const L = Array.from({ length: n }, () => Array(n).fill(0.0)); // Initialise L avec des zéros
    const U = Array.from({ length: n }, () => Array(n).fill(0.0)); // Initialise U avec des zéros

    for (let i = 0; i < n; i++) {
        // Étape 1: L_ii = 1
        L[i][i] = 1.0;

        // Étape 2: Calcul des éléments de U (ligne à partir de la diagonale)
        for (let j = i; j < Math.min(i + matrix.bandParameters!.upperWidth + 1, n); j++) {
        U[i][j] = matrix.values[i][j];
        for (let k = Math.max(0, i - matrix.bandParameters!.lowerWidth); k < i; k++) {
            U[i][j] -= L[i][k] * U[k][j];
        }
        }

        // Étape 3: Calcul des éléments de L (colonne avant la diagonale)
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
    const n = matrix.size;
    const [L,U] = decomposition_LU_bande(matrix);
    // Résolution de L*y = b (Substitution avant)
    const y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        const somme = L[i].slice(0, i).reduce((acc, Lij, j) => acc + Lij * y[j], 0);
        y[i] = vector.values[i] - somme;
    }

    // Résolution de U*x = y (Substitution arrière)
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        const somme = U[i]
        .slice(i + 1)
        .reduce((acc, Uij, j) => acc + Uij * x[j + i + 1], 0);
        x[i] = (y[i] - somme) / U[i][i];
    }

    return {L,U,x};
}