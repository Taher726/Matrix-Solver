import { Matrix, MatrixType, Vector } from "../types/Matrix";

const detectMatrixType = (matrix: number[][]): { type: MatrixType; bandParameters?: { lowerWidth: number; upperWidth: number } } => {
    const n = matrix.length;

    if (is_triangulaire_low(matrix, n)) {
        return { type: 'triangulaire inférieure' };
    }

    if (is_triangulaire_up(matrix, n)) {
        return { type: 'triangulaire supérieure' };
    }

    if (isSymmetricPositiveDefinite(matrix, n)) {
        return { type: 'symétrique définie positive' };
    }

    if (is_symetric(matrix, n)) {
        return { type: 'symétrique' };
    }

    // Vérifier si la matrice est bande d'abord
    const bandParams = detectBandParameters(matrix);
    if (bandParams) {
        console.log(bandParams);
        if(bandParams.lowerWidth+bandParams.upperWidth+1 >= n)
            return { type: 'dense' };
        return { type: 'bande', bandParameters: bandParams };
    }

    return { type: 'dense' };
}

export const parseMatrixFile = (content: string) : { matrix: Matrix, vector: Vector } => {
    const lines = content.trim().split("\n");
    let currentLine = 0;
    let matrixType: MatrixType = "dense";
    let size = 0;
    let bandParameters;

    //Analyser le type de matrice s'il est present
    if(lines[currentLine].startsWith("Type de matrice:")){
        matrixType = lines[currentLine].split(":")[1].trim() as MatrixType;
        currentLine++;
    }

    //Analyser la taille de matrice s'elle est presnet
    if(lines[currentLine].startsWith("Taille:")){
        size = parseInt(lines[currentLine].split(":")[1].trim());
        currentLine++;
    }

    //Passer les lignes vides
    while (currentLine < lines.length && (lines[currentLine].trim() === '' || lines[currentLine].includes('Matrice A:'))) {
        currentLine++;
    }

    //Analyser les elements de matrice
    const matrixValues: number[][] = [];
    for(let i=0; i<size; i++){
        const row = lines[currentLine].trim().split(/\s+/).map(val => parseInt(val));
        if(row.length !== size)
            console.log("Lignes incorrectes");
        matrixValues.push(row);
        currentLine++;
    }

    if(matrixType === "bande"){
        bandParameters = detectBandParameters(matrixValues);
    }

    //Passer les lignes vides
    while (currentLine < lines.length && (lines[currentLine].trim() === '' || lines[currentLine].includes('Vecteur b:'))) {
        currentLine++;
    }

    //Analyser les valeurs de vecteur
    const vecteurValues: number[] = [];
    for(let i=0; i<size; i++){
        const value = parseInt(lines[currentLine].trim());
        vecteurValues.push(value);
        currentLine++;
    }

    //Si le type de matrice n'est pas donné
    if (!lines[0].startsWith('Type de matrice:')) {
        const detected = detectMatrixType(matrixValues);
        matrixType = detected.type;
        bandParameters = detected.bandParameters;
    }

    return {
        matrix: {
            values: matrixValues,
            type: matrixType,
            size,
            ...(bandParameters && { bandParameters })
        },
        vector: {
            values: vecteurValues,
            size
        }
    };
}

const is_symetric = (matrix: number[][], n: number): boolean => {
    for(let i=0; i<n; i++)
        for(let j=0; j<n; j++)
            if(matrix[i][j] !== matrix[j][i])
                return false;
    return true;
}

const is_triangulaire_up = (matrix: number[][], n: number): boolean => {
    for(let i=0; i<n; i++)
        for(let j=0; j<i; j++)
            if(matrix[i][j] !== 0)
                return false;
    return true;
}

const is_triangulaire_low = (matrix: number[][], n: number): boolean => {
    for(let i=0; i<n; i++)
        for(let j=i+1; j<n; j++)
            if(matrix[i][j] !== 0)
                return false;
    return true;
}

export const determinant = (matrix: number[][]): number => {
    const n = matrix.length;
  
    if (n === 1) {
      return matrix[0][0];
    } else if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
  
    let det = 0;
    for (let c = 0; c < n; c++) {
      const minor: number[][] = matrix.slice(1).map(row => row.slice(0, c).concat(row.slice(c + 1)));
      det += ((-1) ** c) * matrix[0][c] * determinant(minor);
    }
  
    return det;
}
    
const isPositiveDefinite = (matrix: number[][]): boolean => {
    const n = matrix.length;
  
    for (let i = 1; i <= n; i++) {
      // Get the leading principal minor (first i rows and i columns)
      const minor: number[][] = matrix.slice(0, i).map(row => row.slice(0, i));
      if (determinant(minor) <= 0) {
        return false;
      }
    }
  
    return true;
}
  
export const  isSymmetricPositiveDefinite = (matrix: number[][], n: number): boolean => {
    return is_symetric(matrix, n) && isPositiveDefinite(matrix);
}

const detectBandParameters = (matrix: number[][]): { lowerWidth: number; upperWidth: number } | null => {
    console.log(matrix);
    
    const n = matrix.length;
    let lowerWidth = 0;
    let upperWidth = 0;

    // Détermination des largeurs des bandes
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] !== 0) {
                if (i < j) {
                    upperWidth = Math.max(upperWidth, j - i);
                } else if (i > j) {
                    lowerWidth = Math.max(lowerWidth, i - j);
                }
            }
        }
    }

    // Vérification que les éléments en dehors des bandes sont nuls
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if ((i > j + lowerWidth) || (i < j - upperWidth)) {
                if (matrix[i][j] !== 0) {
                    return null; // Ce n'est pas une matrice bande
                }
            }
        }
    }
    console.log("lower width:"+lowerWidth);
    console.log("upper width:"+upperWidth);
    
    return { lowerWidth, upperWidth };
}