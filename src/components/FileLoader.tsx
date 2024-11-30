import { Upload } from "@mui/icons-material";
import { Button } from "@mui/material";

const FileLoader = ({ onFileRead } : { onFileRead: (content: string) => void }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file){
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileRead(content);
            };
            reader.readAsText(file);
        }
    };
    return(
        <Button variant="outlined" startIcon={<Upload/>} sx={{ mr: 2 }} component="label">
            Importer un fichier <input type="file" hidden accept=".txt" onChange={handleFileChange}/>
        </Button>
    );
};

export default FileLoader;