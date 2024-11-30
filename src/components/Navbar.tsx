import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import FunctionsIcon from '@mui/icons-material/Functions';
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
    const navItems = [
        { path: "/", label: "Home" },
        { path: "/solver", label: "Résoudre" },
        { path: "/history", label: "Historique"}
    ];
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;
    return(
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "rgba(0, 0, 0, 0.05)" }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ height: 70 }}>
                    <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
                        <FunctionsIcon sx={{ mr: 1, fontSize: 32, color: "primary.main" }}/>
                        <Typography variant="h5" sx={{ letterSpacing: "-0.5px", fontWeight: 800 }}>
                            Matrix Solver
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                        {navItems.map((item) => (
                        <Button
                            key={item.path}
                            component={Link}
                            to={item.path}
                            sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            color: isActive(item.path) ? 'white' : 'text.primary',
                            background: isActive(item.path)
                                ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                                : 'transparent',
                            '&:hover': {
                                background: isActive(item.path)
                                ? 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)'
                                : 'rgba(0, 0, 0, 0.04)',
                            },
                            }}
                        >
                            {item.label}
                        </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;