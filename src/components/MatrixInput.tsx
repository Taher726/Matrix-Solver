import { Matrix } from "../types/Matrix";
import { TextField, Grid } from "@mui/material";

const MatrixInput = ({ matrix, onChange } : { matrix: Matrix, onChange: (row: number, col: number, value: number) => void; }) => {

    const isEditable = (row: number, col: number): boolean => {
        switch (matrix.type){
            case "triangulaire supérieure":
                return row <= col;  
            case "triangulaire inférieure":
                return row >= col;
            case "symétrique":
            case "symétrique définie positive":
                return row <= col;
            case "bande":
              if(matrix.bandParameters){
                const { lowerWidth, upperWidth } = matrix.bandParameters;
                const distance = col - row;
                return distance <= upperWidth && distance >= -lowerWidth;
              }
              return false;
            default:
                return true;
        }
    }

    const getCellStyle = (row: number, col: number) => {
        const editable = isEditable(row, col);
        return {
          width: '80px',
          '& .MuiInputBase-root': {
            backgroundColor: editable ? 'rgba(144, 238, 144, 0.2)' : 'rgba(211, 211, 211, 0.3)',
          },
          '& .MuiInputBase-input': {
            color: editable ? 'inherit' : 'rgba(0, 0, 0, 0.38)',
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: 'rgba(0, 0, 0, 0.38)',
          }
        };
    };

    return (
        <Grid container spacing={1} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
          {matrix.values.map((row, i) => (
            <Grid item xs={12} key={i} container spacing={1}>
              {row.map((value, j) => (
                <Grid item key={`${i}-${j}`}>
                  <TextField
                    size="small"
                    type="number"
                    value={value || ''}
                    disabled={!isEditable(i, j)}
                    onChange={(e) => {
                      let newValue = parseInt(e.target.value) || 0;
                      onChange(i, j, newValue);
                      // Assurer la symétrie
                      if ((matrix.type === "symétrique" || matrix.type === "symétrique définie positive") && i !== j) {
                        onChange(j, i, newValue);
                      }
                    }}
                    sx={getCellStyle(i, j)}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
    );
}

export default MatrixInput;