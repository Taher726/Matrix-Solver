import { LUResult, Matrix, Vector } from "./Matrix";

export interface Resolution{
    id: string,
    timestamp: number,
    matrix: Matrix,
    vector: Vector,
    result: LUResult;
}

export interface HistoryState{
    resolutions: Resolution[];
}