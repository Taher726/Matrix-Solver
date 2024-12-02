import { Card, CardContent, Typography, Grid, Box, CardActions, Button } from "@mui/material";
import { Resolution } from "../types/History"

const ResolutionCard = ({ resolution, onDelete, onReuse }: { resolution: Resolution, onDelete: (id: string)=>void, onReuse: (resolution: Resolution)=>void }) => {
    const formatDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleString();
    };

    const formatSolution = (vector: number[]): string => {
        if (!vector || !vector.length) return '';
        return vector.map((value, index) => 
          `x${index + 1} = ${value?.toFixed(2) ?? '0.00'}`
        ).join('\n');
      };
    return(
        <Card sx={{ mb: 3}}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Résolution du {formatDate(resolution.timestamp)}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            Type de matrice: {resolution.matrix.type}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Taille de matrice: {resolution.matrix.size}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Solution x:
                            </Typography>
                            <Typography variant="body2" component="pre" sx={{ 
                                backgroundColor: '#f5f5f5',
                                p: 1,
                                borderRadius: 1,
                                overflowX: 'auto'
                            }}>
                                {formatSolution(resolution.result.x)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button color="primary" onClick={() => onReuse(resolution)}>
                    Réutiliser
                </Button>
                <Button color="error" onClick={() => onDelete(resolution.id)}>
                    Supprimer
                </Button>
            </CardActions>
        </Card>
    );
}

export default ResolutionCard;