import React from "react";
export declare type I18NOptions = {
    namespace?: string;
    language?: string;
    replace?: object;
} | string;
export interface Config {
    baseUrl: string;
    outDir: string;
    exportExcelPath: string;
    importExcelPath: string;
    languages: string[];
    prettierConfig: string;
    isDev: boolean;
}
export interface Cache {
    isInit: boolean;
    config: Config;
    locales: object;
    language: string;
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
    baseUrl: string;
    outDir: string;
    languages: string[];
    exportExcelPath: string;
    importExcelPath: string;
};
export declare function setIfInitial(isInit: boolean): void;
export declare function getIfInitial(): boolean;
export declare function setLanguage<T extends string>(language: T): void;
export declare function getLanguage(): string;
export declare function useLocales<T extends Locales>(): T;
export declare function setConfig(config: Config): void;
export declare function getConfig(): Config;
export declare function setLocales<T extends object>(locales: T): void;
export declare function getLocales(): object;
export declare function setReserveLocale(locales: SubLocales | object): void;
export declare function getReverseLocale(): object;
export declare function t(value: string, options: I18NOptions, currentLocale: object | null): string;
interface LocaleProviderProps<T> {
    locales: T;
    language: keyof T;
    children?: React.ReactNode | React.ReactNode[];
}
export declare function LocaleProvider<T extends object>(props: LocaleProviderProps<T>): JSX.Element;
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
export {};
