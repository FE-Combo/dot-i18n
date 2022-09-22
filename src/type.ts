export interface ASTContainer {
    callee: ASTContainer$Callee;
    arguments: ASTContainer$Argument[];
    body: ASTContainer$Body;
}

export interface ASTContainer$Callee {
    object: object;
    name: string;
}

export interface ASTContainer$Argument {
    type?: string;
    value?: string;
    name?: string;
}

export interface ASTContainer$Body {
    body: ASTContainer$Body$Body[];
}

export interface ASTContainer$Body$Body {
    type: string;
    argument: ASTContainer$Body$Body$Argument;
}

export interface ASTContainer$Body$Body$Argument {
    type: string;
}

export interface EXCELSheet {
    code: string;
    [countryCode: string]: React.ReactText | undefined;
}
