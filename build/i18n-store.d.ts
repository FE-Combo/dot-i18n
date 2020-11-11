import React from "react";
export declare type I18NOptions = {
    namespace?: string;
    language?: string;
    replace?: object;
} | string;
export interface Config {
    source: string;
    localePath: string;
    exportExcelPath: string;
    importExcelPath: string;
    languages: string[];
    prettierConfig: string;
    isDev: boolean;
    strict: boolean;
    template: string;
}
export interface Cache {
    isInit: boolean;
    context: React.Context<object>;
    config: Config;
    locales: object;
    reverseLocale: object;
}
export interface Locales {
    [languageType: string]: SubLocales;
}
export interface SubLocales {
    [code: string]: React.ReactText;
}
export interface ReverseLocale {
    [value: string]: string;
}
export declare const defaultConfig: {
    source: string;
    localePath: string;
    languages: string[];
    template: string;
    exportExcelPath: string;
    importExcelPath: string;
    strict: boolean;
};
export declare function setIfInitial(isInit: boolean): void;
export declare function getIfInitial(): boolean;
export declare function useLocales(): object;
export declare function createContext(): void;
export declare function getContext(): React.Context<object>;
export declare function setConfig(config: Config): void;
export declare function getConfig(): Config;
export declare function setLocales(locales: Locales): void;
export declare function getLocales(): object;
export declare function setReverseLocale(reverseLocale: ReverseLocale): void;
export declare function getReverseLocale(): object;
export declare function t(value: string, options: I18NOptions, currentLocale: object, reverseLocaleString: string): string;
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
