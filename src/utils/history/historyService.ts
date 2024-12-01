import { Resolution } from "../../types/History";

const HISTORY_KEY = "matrix_solver_history";

export const saveResolution = (resolution: Omit<Resolution, "id" | "timestamp">): Resolution => {
    const newResolution: Resolution = {
        ...resolution,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };

    const history = getHistory();
    history.unshift(newResolution);

    //Keep only the last 10 resolutions
    if(history.length > 10)
        history.pop();

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return newResolution;
}

export const getHistory = () : Resolution[] => {
    const historyString = localStorage.getItem(HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : [];
}

export const clearHistory = (): void => {
    localStorage.removeItem(HISTORY_KEY);
}

export const deleteResolution = (id: string): void => {
    const history = getHistory();
    const updatedHistory = history.filter(resolution => resolution.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
}