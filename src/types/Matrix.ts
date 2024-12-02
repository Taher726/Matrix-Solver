export type MatrixType = "triangulaire supérieure" | "triangulaire inférieure" | "symétrique" | "dense" | "bande" | "symétrique définie positive" | "bande"

export interface Matrix {
    values: number[][],
    type: MatrixType,
    size: number,
    bandParameters?: {
        lowerWidth: number,
        upperWidth: number,
    }
}

export interface Vector{
    values: number[],
    size: number
}

export interface LUResult {
    L: number[][];
    U: number[][];
    x: number[];
    complexity:number;
}