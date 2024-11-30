import { Typography, Container, Button, Box, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import FunctionsIcon from '@mui/icons-material/Functions';
import CalculateIcon from '@mui/icons-material/Calculate';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';

const Home = () => {
    const items = [
        {
            icon: <CalculateIcon sx={{ fontSize: 40, color: "primary.main" }}/>,
            title: "Calcul Précis",
            description: 'Résolution exacte des systèmes linéaires avec la méthode de décomposition LU',
        },
        {
            icon: <TimelineIcon sx={{ fontSize: 40, color: "primary.main" }}/>,
            title: "Visualisation Clair",
            description: 'Interface intuitive pour la saisie et laffichage des résultats',
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40, color: "primary.main" }}/>,
            title: "Performance",
            description: 'Optimisé pour gérer efficacement les matrices de grande taille',
        }
    ]
    return(
        <Box sx={{ background: 'linear-gradient(135deg, #2563eb11 0%, #7c3aed11 100%)', pt: 8, pb: 12, minHeight: "92vh" }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 6 }}>
                            <Box sx={{ display: "flex", flexDirection: "Row" }}>
                                <FunctionsIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }}/>
                                <Typography variant="h2" component="h1" gutterBottom sx={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", mb:"3" }}>
                                    Matrix Solver
                                </Typography>
                            </Box>
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, lineHeight: 1.5 }}>
                                Résolution de systèmes linéaires par décomposition LU
                            </Typography>
                            <Button component={Link} to="/solver" variant="contained" size="large" sx={{ px: 4, py: 1.5, fontSize: "1.1rem", background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)','&:hover': {background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',} }}>
                                Commencer
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box component="img" src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb" alt="Mathematics" sx={{ width: "100%", borderRadius: 4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}/>
                    </Grid>
                </Grid>
                <Grid container spacing={4} sx={{ mt: 8 }}>
                    {
                        items.map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Paper
                                    sx={{
                                    p: 4,
                                    height: '100%',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                    },
                                    }}
                                >
                                    {feature.icon}
                                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                    {feature.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                    {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </Box>
    );
}

export default Home;