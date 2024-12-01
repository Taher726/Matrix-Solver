import { useEffect, useState } from "react"
import { Resolution } from "../types/History"
import { clearHistory, deleteResolution, getHistory } from "../utils/history/historyService";
import { Container, Paper, Box, Typography, Button, Alert } from "@mui/material";
import ResolutionCard from "../components/ResolutionCard";
import { useNavigate } from "react-router-dom";

const History = () => {
    const [resolutions, setResoltions] = useState<Resolution[]>([]);
    const navigate = useNavigate();

    const handleClearHistory = () => {
        clearHistory();
        setResoltions([]);
    }

    const handleDelete = (id: string) => {
        deleteResolution(id);
        setResoltions(getHistory());
    }

    const handleReuse = (resolution: Resolution) => {
        navigate("/solver", { state: {resolution} });
    }

    useEffect(() => {
        setResoltions(getHistory());
    }, [])

    return(
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexDirection: "row" }}>
                    <Typography variant="h4" component="h1">
                        Historique des résolutions
                    </Typography>
                    {resolutions.length > 0 && (
                        <Button 
                        variant="outlined" 
                        color="error"
                        onClick={handleClearHistory}
                        >
                        Effacer l'historique
                        </Button>
                    )}
                </Box>
                {
                    resolutions.length === 0 ?
                    (
                        <Alert severity="info">
                            Aucune résolution dans l'historique
                        </Alert> 
                    ) : (
                        resolutions.map(resolution => (
                            <ResolutionCard key={resolution.id} resolution={resolution} onDelete={handleDelete} onReuse={handleReuse}/>
                        ))
                    )
                }
            </Paper>
        </Container>
    );
}

export default History;