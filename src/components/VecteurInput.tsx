import { Vector } from "../types/Matrix"
import { TextField, Grid } from "@mui/material";

const VecteurInput = ({ vecteur, onChange } : { vecteur: Vector, onChange: (index: number, value: number) => void; }) => {
    return(
        <Grid container spacing={1} direction="column" sx={{ maxWidth: 100 }}>
            {vecteur.values.map((value, index) => (
                <Grid item key={index}>
                <TextField
                    size="small"
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(index, parseFloat(e.target.value) || 0)}
                    sx={{ width: '80px' }}
                />
                </Grid>
            ))}
        </Grid>
    );
}

export default VecteurInput;