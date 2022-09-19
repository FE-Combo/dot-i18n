import React from "react";

export type I18NOptions =
    | {
        namespace?: string;
        language?: string;
        replace?: object;
    }
    | string;

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
    [languageType: string]: SubLocales
}

export interface SubLocales {
    [code: string]: React.ReactText
}

export interface ReverseLocale {
    [value: string]: string
}

export const defaultConfig = {
    baseUrl: "/src",
    outDir: "/src/locales",
    languages: ["zh", "en"],
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
}
const I18nContext = React.createContext({} as SubLocales)

const cache: Cache = {
    isInit: false,
    language: "zh",
    config: defaultConfig,
    locales: {},
    reverseLocale: {} as ReverseLocale,
} as Cache;

export function setIfInitial(isInit: boolean) {
    cache.isInit = isInit
}

export function getIfInitial() {
    return cache.isInit
}

export function setLanguage<T extends string>(language: T) {
    cache.language = language
}

export function getLanguage() {
    return cache.language;
}

export function useLocales<T extends Locales>() {
    return React.useContext<T>(I18nContext as any);
}

export function setConfig(config: Config) {
    cache.config = config;
}

export function getConfig() {
    return cache.config;
}

export function setLocales<T extends object>(locales: T) {
    cache.locales = locales;
}

export function getLocales() {
    return cache.locales;
}

export function setReserveLocale(locales: SubLocales | object) {
    cache.reverseLocale = Object.keys(locales).reduce((preObject, namespace) => {
        preObject[namespace] = Object.keys(locales[namespace]).reduce((preSubObject, code) => {
            const value = preSubObject[code];
            preSubObject[value] = code;
            delete preSubObject[code];
            return preSubObject;
        }, { ...locales[namespace] });
        return preObject
    }, {} as ReverseLocale)
}

export function getReverseLocale() {
    return cache.reverseLocale;
}

export function t(value: string, options: I18NOptions, currentLocale: object | null) {
    let result = value;
    const nextLocale = currentLocale || cache?.locales?.[cache.language] || {}
    if (nextLocale) {
        const reverseLocale = cache.reverseLocale
        const namespace = (typeof options === "string" ? options : options?.namespace) || "global";
        const replaceVariable = options?.replace;
        if (reverseLocale?.[namespace]?.[value] && nextLocale?.[namespace]) {
            const code = reverseLocale[namespace][value];
            if (nextLocale[namespace][code]) {
                result = nextLocale[namespace][code];
            }
        }
        if (replaceVariable) {
            Object.keys(replaceVariable).forEach(function (key) {
                result = result.replace(new RegExp(key, "g"), replaceVariable[key]);
            });
        }
    }
    return result;
}

interface LocaleProviderProps<T> {
    locales: T
    language: keyof T
    children?: React.ReactNode | React.ReactNode[]
}

export function LocaleProvider<T extends object>(props: LocaleProviderProps<T>) {
    const { children, locales, language } = props
    if (Object.keys(cache.locales).length <= 0) {
        setLocales(locales)
        // TODO: Object cannot guarantee order
        setReserveLocale(locales?.[Object.keys(locales)?.[0] ?? "zh"] || {})
        setLanguage(language.toString())
    }

    return (
        <I18nContext.Provider value={locales?.[language] ?? {}}>
            {children}
        </I18nContext.Provider>
    )
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
