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
    filename: string;
    exportExcelPath: string;
    importExcelPath: string;
    languages: string[];
    prettierConfig?: string;
    clearLegacy?: boolean;
}

export interface Cache {
    config: Config;
    locales: object;
    language: string;
}

export interface Locales {
    [code: string]: Locales | React.ReactText;
}

export const defaultConfig: Config = {
    baseUrl: "/src",
    outDir: "/src/locales",
    filename: "index",
    languages: ["zh", "en"],
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
};
const I18nContext = React.createContext({} as Locales);

const cache: Cache = {
    language: "zh",
    config: defaultConfig,
    locales: {},
};

// utf-8 => base64
export function encode(code: string): string {
    return Buffer.from(code, "utf-8").toString("base64");
}

// base64 => utf-8
export function decode(code: string) {
    return Buffer.from(code, "base64").toString("utf-8");
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

export function t(value: string, options: I18NOptions, currentLocale: object | null) {
    let result = value;
    const code = encode(value);
    const nextLocale = currentLocale || cache?.locales || {};
    if (code && nextLocale) {
        const namespace = (typeof options === "string" ? options : options?.namespace) || "global";
        const replaceVariable = options?.replace;
        if (nextLocale?.[namespace] && nextLocale[namespace][code]) {
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

interface LocaleProviderProps {
    locales: Locales | {};
    children?: React.ReactNode | React.ReactNode[];
}

export function LocaleProvider(props: LocaleProviderProps) {
    const {children, locales} = props;
    return <I18nContext.Provider value={locales || {}}>{children}</I18nContext.Provider>;
}
