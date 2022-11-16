export interface GeneralStateInterface {
    lexemes: Array<Lexeme>;
    currentValue: string;
    splitLines: Array<string>;
    splitBlocks: Array<string>;
}

export interface Lexeme {
    nombre: string;
    tipo: string;
    codigo: string;
    semantico: number;
}