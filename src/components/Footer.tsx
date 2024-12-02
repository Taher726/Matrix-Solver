import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
    return(
        <Box component="footer" sx={{ py: 3, px: 2, mt: "auto", backgroundColor: "white", boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)', }}>
            <Container maxWidth="lg">
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',}}>
                    <Box sx={{ textDecoration: "none", background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "18px" }}>
                            Developé par Taher Chaltout & Mariam Gargouri
                        </Typography>
                    </Box>
                    <Box sx={{ textDecoration: "none", background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "18px" }}>
                        Supervisé par Docteur Sirine Marrakchi
                    </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Footer;