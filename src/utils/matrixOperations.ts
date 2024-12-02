import { Matrix, Vector, MatrixType, LUResult } from '../types/Matrix';
import { saveAs } from 'file-saver';
import { generalRes_LU } from './solvers/generalResolution';
import { resolution_LU_SUP } from './solvers/upperTriangulaire';
import { resolution_LU_INF } from './solvers/LowerTriangulaire';
import { resolutionLUSym } from './solvers/symetric';
import { resolution_bande_LU } from './solvers/bandeResolution';
import { isSymmetricPositiveDefinite } from '../components/MatrixInput';

export const generateRandomMatrix = (size: number, type: MatrixType, bandParameters?: {lowerWidth: number, upperWidth: number}): Matrix => {
  const matrix: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

  switch (type) {
    case 'triangulaire supérieure':
      for (let i = 0; i < size; i++) {
        for (let j = i; j < size; j++) {
          matrix[i][j] = Math.floor(Math.random() * 10);
        }
        matrix[i][i] = Math.floor(Math.random() * 10) + size;
      }
      break;

    case 'triangulaire inférieure':
      for (let i = 0; i < size; i++) {
        for (let j = 0; j <= i; j++) {
          matrix[i][j] = Math.floor(Math.random() * 10);
        }
        matrix[i][i] = Math.floor(Math.random() * 10) + size;
      }
      break;

    case 'symétrique':
    case 'symétrique définie positive':
      for (let i = 0; i < size; i++) {
        for (let j = 0; j <= i; j++) {
          const value = Math.floor(Math.random() * 10);
          matrix[i][j] = value;
          matrix[j][i] = value;
        }
        if (type === 'symétrique définie positive') {
          matrix[i][i] += size * 10;
        }
      }
      break;

      case 'bande':
        const { lowerWidth = 1, upperWidth = 1 } = bandParameters || {};
        for (let i = 0; i < size; i++) {
          const startCol = Math.max(0, i - lowerWidth);
          const endCol = Math.min(size - 1, i + upperWidth);
          
          // Fill zeros outside the band
          for (let j = 0; j < startCol; j++) {
            matrix[i][j] = 0;
          }
          
          // Fill random values within the band
          for (let j = startCol; j <= endCol; j++) {
            matrix[i][j] = Math.floor(Math.random() * 10);
          }
          
          // Fill zeros after the band
          for (let j = endCol + 1; j < size; j++) {
            matrix[i][j] = 0;
          }
          
          // Ensure diagonal dominance
          let rowSum = 0;
          for (let j = 0; j < size; j++) {
            if (j !== i) {
              rowSum += Math.abs(matrix[i][j]);
            }
          }
          matrix[i][i] = rowSum + Math.floor(Math.random() * 5) + 1;
        }
        return {
          values: matrix,
          type,
          size,
          bandParameters: { lowerWidth, upperWidth }
        };

    default:
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          matrix[i][j] = Math.floor(Math.random() * 10);
        }
        matrix[i][i] = Math.floor(Math.random() * 10) + size;
      }
  }
  return { values: matrix, type, size };
};

export const generateRandomVector = (size: number): Vector => {
  return {
    values: Array.from({ length: size }, () => Math.floor(Math.random() * 10)),
    size,
  };
};


export const solve = (matrix: Matrix, b: Vector): LUResult => {
  switch (matrix.type) {
    case 'triangulaire supérieure':
      return resolution_LU_SUP(matrix, b);
    case 'triangulaire inférieure':
      return resolution_LU_INF(matrix, b);
    case 'symétrique':
      return resolutionLUSym(matrix, b);
    case 'symétrique définie positive':
      if(isSymmetricPositiveDefinite(matrix.values))
        return resolutionLUSym(matrix, b);
      else
        return resolutionLUSym(matrix, b);
    case "bande":
      return resolution_bande_LU(matrix, b);
    default:
      return generalRes_LU(matrix, b);
  }
};

export const formatMatrix = (matrix: number[][]): string => {
  return matrix.map(row => 
    row.map(val => val.toFixed(2).padStart(10)).join('')
  ).join('\n');
};

export const formatUpperTriangulaireMatrix = (matrix: number[][]): string => {
  return matrix
    .map((row, rowIndex) => {
      return row
        .map((val, colIndex) => {
          return colIndex >= rowIndex ? val.toFixed(2).toString().padStart(10) : ''.padStart(10);
        })
        .join(''); 
    })
    .join('\n');
};

export const saveToFile = (matrix: Matrix, vector: Vector, result: LUResult) => {
  let matrixType = "";
  if(matrix.type === "symétrique définie positive"){
    if(isSymmetricPositiveDefinite(matrix.values))
      matrixType = "symétrique définie positive";
    else
      matrixType = "symétrique"
  }
  let content = `Type de matrice: ${matrixType}\n`;
  content += `Taille: ${matrix.size}\n\n`;
  content += "Matrice A:\n";
  content += formatMatrix(matrix.values);
  content += "\n\nMatrice L:\n";
  content += formatMatrix(result.L);
  content += "\n\nMatrice U:\n";
  content += formatUpperTriangulaireMatrix(result.U);
  content += "\n\nVecteur b:\n";
  content += vector.values.map(v => v.toFixed(0)).join('\n');
  content += "\n\nSolution x:\n";
  content += result.x.map((value, index) => `x${index + 1} = ${value.toFixed(1)}`).join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'solution_systeme.txt');
};