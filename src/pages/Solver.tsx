import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MatrixInput from "../components/MatrixInput";
import { Matrix, MatrixType, Vector } from "../types/Matrix";
import VecteurInput from "../components/VecteurInput";
import { generateRandomVector, generateRandomMatrix, saveToFile, solve } from "../utils/matrixOperations";
import SolutionPopup from "../components/SolutionPopup";
import FileLoader from "../components/FileLoader";
import { parseMatrixFile } from "../utils/fileParser";
import BandMatrixParameters from "../components/BandMatrixParameters";
import { useLocation } from "react-router-dom";
import { Resolution } from "../types/History";
import { saveResolution } from "../utils/history/historyService";

const Solver = () => {
    const location = useLocation();
    const [size, setSize] = useState<number>(2);
    const [matrixType, setMatrixType] = useState<MatrixType>('dense');
    const [matrix, setMatrix] = useState<Matrix>({
        values: Array(2).fill(0).map(() => Array(2).fill(0)),
        type: 'dense',
        size: 2
    });
    const [vecteur, setVecteur] = useState<Vector>({
        values: Array(2).fill(0),
        size: 2
    });
    const [showSolution, setShowSolution] = useState(false);
    const [vecteurL, setVecteurL] = useState<number[][]>([[]]);
    const [vecteurU, setVecteurU] = useState<number[][]>([[]]);
    const [solution, setSolution] = useState<number[]>([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [bandParameters, setBandParameters] = useState({lowerWidth: 1, upperWidth: 1});
    const [result, setResult] = useState<Resolution | null>(null);

    const handleMatrixChange = (row: number, col: number, value: number) => {
        const newMatrix = { ...matrix };
        newMatrix.values[row][col] = value;
        setMatrix(newMatrix);
    }; 

    const handleVectorChange = (index: number, value: number) => {
        const newVector = { ...vecteur };
        newVector.values[index] = value;
        setVecteur(newVector);
    };
    const handleSolve = () => {
       if(size < 10){
        const result = solve(matrix, vecteur);
        setVecteurL(result.L);
        setVecteurU(result.U);
        setSolution(result.x);
        setShowSolution(true);
        const resolution = saveResolution({
            matrix: matrix,
            vector: vecteur,
            result
        });
        setResult(resolution);
       }
       else{
        const randomMatrix = generateRandomMatrix(size, matrixType, matrixType === "bande" ? bandParameters : undefined);
        const randomVector = generateRandomVector(size);
        const result = solve(randomMatrix, randomVector);
        saveToFile(randomMatrix, randomVector, result);
       }
    }

    const handleFileRead = (content: string) => {
        const { matrix: newMatrix, vector: newVector } = parseMatrixFile(content);
        setSize(newMatrix.size);
        setMatrixType(newMatrix.type);
        if (newMatrix.type === 'bande' && newMatrix.bandParameters) {
            setBandParameters(newMatrix.bandParameters);
        }
        setMatrix(newMatrix);
        setVecteur(newVector);
        setIsFileUploaded(true);
    }

    useEffect(() =>{
        const state = location.state as { resolution?: Resolution };
        if(state?.resolution){
            const { matrix: savedMatrix, vector: savedVector } = state.resolution;
            setSize(savedMatrix.size);
            setMatrixType(savedMatrix.type);
            setMatrix(savedMatrix);
            setVecteur(savedVector);
            setResult(state.resolution);
        }
        else if(!isFileUploaded){
            const newMatrix = {
                values: Array(size).fill(0).map(() => Array(size).fill(0)),
                type: matrixType,
                size,
                ...(matrixType === 'bande' && { bandParameters })
            };
            const newVecteur = {
                values: Array(size).fill(0),
                size
            }
            setMatrix(newMatrix);
            setVecteur(newVecteur);
        }
        else{
            setIsFileUploaded(false);
        }
    }, [size, matrixType, bandParameters, location])

    return(
        <Container sx={{ py:4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                Résolution de Système Ax=b
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid spacing={3} container>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth type="number" label="Taille de la matrice (n)" value={size} onChange={(e) => setSize(Math.max(2, parseInt(e.target.value) || 2))}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Type de Matrice</InputLabel>
                            <Select value={matrixType} label="Type de Matrice" onChange={(e) => setMatrixType(e.target.value as MatrixType)}>
                                <MenuItem value="dense">Dense</MenuItem>
                                <MenuItem value="triangulaire supérieure">Triangulaire Supérieure</MenuItem>
                                <MenuItem value="triangulaire inférieure">Triangulaire Inférieure</MenuItem>
                                <MenuItem value="symétrique">Syémtrique</MenuItem>
                                <MenuItem value="symétrique définie positive">Symétrique Définie Positive</MenuItem>
                                <MenuItem value="bande">Bande</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {
                        matrix.type === "bande" && (
                            <Grid item xs={12}>
                                <BandMatrixParameters lowerWidth={bandParameters.lowerWidth} upperWidth={bandParameters.upperWidth} onLowerWidthChange={(width) => setBandParameters(prev => ({ ...prev, lowerWidth: width }))} onUpperWidthChange={(width) => setBandParameters(prev => ({ ...prev, upperWidth: width }))} matrixSize={size}/>
                            </Grid>
                        )
                    }
                </Grid>
            </Paper>
            <Box>

            </Box>
            {size <= 10 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={10}>
                            <Typography variant="h6" gutterBottom>Matrice A</Typography>
                            <Box sx={{ display: "inline-block", minWidth: `${size * 80}px`, overflowX: "auto",}}>
                                <MatrixInput matrix={matrix} onChange={handleMatrixChange}/>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Typography variant="h6" gutterBottom>Vecteur B</Typography>
                            <Box>
                                <VecteurInput vecteur={vecteur} onChange={handleVectorChange}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            )}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexDirection: "row", alignItems: "center" }}>
                <FileLoader onFileRead={handleFileRead}/>
                <Button variant="contained" color="primary" size="large" onClick={handleSolve}>
                    Résoudre
                </Button>
            </Box>
            {size > 10 && (
                <Typography color="text.secondary">
                Pour n &gt; 10, la matrice sera générée aléatoirement et la solution sera sauvegardée dans un fichier.
                </Typography>
            )}
            <SolutionPopup isOpen={showSolution} onClose={() => setShowSolution(false)} L={vecteurL} U={vecteurU} solution={solution} save={() => saveToFile(matrix, vecteur, { L: vecteurL, U: vecteurU, x: solution })} />
        </Container>
    )
}

export default Solver;