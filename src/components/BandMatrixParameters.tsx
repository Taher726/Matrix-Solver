import { Grid, TextField } from "@mui/material";

const BandMatrixParameters = ({ lowerWidth, upperWidth, onLowerWidthChange, onUpperWidthChange, matrixSize } : { lowerWidth: number, upperWidth: number, onLowerWidthChange: (width: number) => void, onUpperWidthChange: (width: number) => void, matrixSize: number }) => {
    return(
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField fullWidth type="number" label="Demi-largeur inférieure" value={lowerWidth} onChange={(e) => {const value = Math.max(0, Math.min(parseInt(e.target.value) || 0, matrixSize - 1)); onLowerWidthChange(value);}} inputProps={{ min: 0, max: matrixSize - 1 }}/>
            </Grid>
            <Grid item xs={6}>
                <TextField fullWidth type="number" label="Demi-largeur supérieure" value={upperWidth} onChange={(e) => {const value = Math.max(0, Math.min(parseInt(e.target.value) || 0, matrixSize - 1)); onUpperWidthChange(value);}} inputProps={{ min: 0, max: matrixSize - 1 }}/>
            </Grid>
        </Grid>
    );
}

export default BandMatrixParameters;