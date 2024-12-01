import { Dialog, DialogContent, DialogTitle, Typography, Box, Paper, Button } from "@mui/material";

const SolutionPopup = ({ isOpen, onClose, L, U , solution, save} : { isOpen: boolean, onClose: () => void, L: number[][] | null, U: number[][] | null, solution: number[] | null, save: () => void }) => {    
    return(
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle textAlign="center" variant="h5">Solution du système</DialogTitle>
            <DialogContent>
                {
                    L && U && solution ? (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Le vecteur L est :
                            </Typography>
                            <Paper elevation={1} sx={{ p:2, bgcolor: "grey.50" }}>
                                {
                                    L.map((value, index) => (
                                        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                            <Typography fontWeight="medium" key={index} variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'monospace' }}>
                                                {value.map(val => val.toFixed(2).toString().padStart(7)).join('')}
                                            </Typography>
                                        </Box>
                                    ))
                                }
                            </Paper>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                    Le vecteur U est :
                                </Typography>
                                <Paper elevation={1} sx={{ p:2, bgcolor: "grey.50" }}>
                                    {
                                        U.map((value, rowIndex) => (
                                            <Box key={rowIndex} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <Typography fontWeight="medium" variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'monospace' }}>
                                                    {value.map((val, colIndex) => {
                                                        return colIndex >= rowIndex ? val.toFixed(2).toString().padStart(7) : '       ';
                                                    }).join('')}
                                                </Typography>
                                            </Box>
                                        ))
                                    }
                                </Paper>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Le vecteur solution x est :
                                </Typography>
                                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                {solution.map((value, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Typography variant="body1" fontWeight="medium">
                                        x{index + 1} =
                                    </Typography>
                                    <Typography variant="body1" color="primary">
                                        {value.toFixed(2)}
                                    </Typography>
                                    </Box>
                                ))}
                                </Paper>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button variant="contained" size="large" sx={{ mt: 2, background:'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', "&:hover": 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)' }} onClick={save}>
                                    Save To File
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography color="error" sx={{ mt: 2 }}>
                            Aucune solution trouvée ou le système est incompatible.
                        </Typography>
                    )
                }
            </DialogContent>
        </Dialog>
    );
} 

export default SolutionPopup;