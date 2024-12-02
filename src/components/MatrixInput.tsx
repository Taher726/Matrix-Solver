import { Matrix } from "../types/Matrix";
import { TextField, Grid, Typography } from "@mui/material";
import { useState } from "react";

// Fonction pour vérifier si la matrice est définie positive
export const isSymmetricPositiveDefinite = (matrix: number[][]): boolean => {
  const n = matrix.length;

  // Vérification des mineurs principaux
  for (let k = 1; k <= n; k++) {
    const subMatrix = matrix.slice(0, k).map(row => row.slice(0, k));
    const det = determinant(subMatrix);

    if (det <= 0) {
      return false;
    }
  }
  return true;
};

// Fonction de calcul du déterminant
const determinant = (matrix: number[][]): number => {
  const n = matrix.length;

  if (n === 1) {
    return matrix[0][0];
  }
  if (n === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let det = 0;
  for (let i = 0; i < n; i++) {
    const subMatrix = matrix
      .slice(1)
      .map(row => row.filter((_, j) => j !== i));
    det += matrix[0][i] * determinant(subMatrix) * (i % 2 === 0 ? 1 : -1);
  }
  return det;
};

const MatrixInput = ({matrix,onChange,}: {matrix: Matrix;onChange: (row: number, col: number, value: number) => void;}) => {
  const [isPositiveDefinite, setIsPositiveDefinite] = useState(true);

  const isEditable = (row: number, col: number): boolean => {
    switch (matrix.type) {
      case "triangulaire supérieure":
        return row <= col;
      case "triangulaire inférieure":
        return row >= col;
      case "symétrique":
      case "symétrique définie positive":
        return row <= col;
      case "bande":
        if (matrix.bandParameters) {
          const { lowerWidth, upperWidth } = matrix.bandParameters;
          const distance = col - row;
          return distance <= upperWidth && distance >= -lowerWidth;
        }
        return false;
      default:
        return true;
    }
  };

  const handleChange = (i: number, j: number, newValue: number) => {
    onChange(i, j, newValue);

    // Assurer la symétrie
    if (
      (matrix.type === "symétrique" ||
        matrix.type === "symétrique définie positive") &&
      i !== j
    ) {
      onChange(j, i, newValue);
    }

    // Vérifier la positivité définie
    setIsPositiveDefinite(isSymmetricPositiveDefinite(matrix.values));
  };

  const getCellStyle = (row: number, col: number) => {
    const editable = isEditable(row, col);
    return {
      width: "80px",
      "& .MuiInputBase-root": {
        backgroundColor: editable
          ? "rgba(144, 238, 144, 0.2)"
          : "rgba(211, 211, 211, 0.3)",
      },
      "& .MuiInputBase-input": {
        color: editable ? "inherit" : "rgba(0, 0, 0, 0.38)",
      },
      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: "rgba(0, 0, 0, 0.38)",
      },
    };
  };

  return (
    <>
      <Grid container spacing={1} sx={{ maxWidth: "100%", overflowX: "auto" }}>
        {matrix.values.map((row, i) => (
          <Grid item xs={12} key={i} container spacing={1}>
            {row.map((value, j) => (
              <Grid item key={`${i}-${j}`}>
                <TextField
                  size="small"
                  type="number"
                  value={value || ""}
                  disabled={!isEditable(i, j)}
                  onChange={(e) => {
                    let newValue = parseFloat(e.target.value) || 0;
                    handleChange(i, j, newValue);
                  }}
                  sx={getCellStyle(i, j)}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
      {matrix.type === "symétrique définie positive" && !isPositiveDefinite && (
        <Typography color="error" sx={{ mt: 2 }}>
          La matrice n'est pas définie positive !
        </Typography>
      )}
    </>
  );
};

export default MatrixInput;
