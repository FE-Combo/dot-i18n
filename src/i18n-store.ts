import React from "react";

export type I18NOptions =
    | {
          namespace?: string;
          language?: string;
          replace?: object;
      }
    | string;

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
    [languageType:string]:SubLocales
}

export interface SubLocales{
    [code:string]: React.ReactText
}

export interface ReverseLocale {
    [value:string]: string
}

export const defaultConfig = {
    source:"/src",
    localePath: "/src/locales",
    languages: ["zh", "en"],
    template: "i18n",
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
    strict: true,
}

const cache: Cache = {
    isInit:false,
    config: defaultConfig,
    locales:{} as Locales,
    reverseLocale: {} as ReverseLocale,
} as Cache;

export function setIfInitial(isInit:boolean){
    cache.isInit = isInit
}

export function getIfInitial(){
    return cache.isInit
}

export function useLocales() {
    return React.useContext(cache?.context);
}

export function createContext() {
    cache.context = React.createContext({});
}

export function getContext() {
    return cache.context;
}

export function setConfig(config: Config) {
    cache.config = config;
}

export function getConfig() {
    return cache.config;
}

export function setLocales(locales: Locales) {
    cache.locales = locales;
}

export function getLocales() {
    return cache.locales;
}

export function setReverseLocale(reverseLocale: ReverseLocale) {
    cache.reverseLocale = reverseLocale;
}

export function getReverseLocale() {
    return cache.reverseLocale;
}

export function t(value: string, options: I18NOptions, currentLocale: object, reverseLocaleString: string) {
    let result = value;
    const namespace = (typeof options === "string" ? options : options?.namespace) || "global";
    const replaceVariable = options?.replace;
    const reverseLocale = JSON.parse(reverseLocaleString);
    if (reverseLocale && reverseLocale[namespace] && reverseLocale[namespace][value] && currentLocale && currentLocale[namespace]) {
        const code = reverseLocale[namespace][value];
        if (currentLocale[namespace][code]) {
            result = currentLocale[namespace][code];
        }
    }
    if (replaceVariable) {
        Object.keys(replaceVariable).forEach(function (key) {
            result = result.replace(new RegExp(key, "g"), replaceVariable[key]);
        });
    }
    return result;
}

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
