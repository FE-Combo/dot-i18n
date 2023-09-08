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

export interface Locales {
    [code: string]: Locales | React.ReactText;
}

const I18nContext = React.createContext({} as Locales);


interface LocaleProviderProps {
    locales: Locales | {};
    children?: React.ReactNode | React.ReactNode[];
}

export const defaultConfig: Config = {
    baseUrl: "/src",
    outDir: "/src/locales",
    filename: "index",
    languages: ["zh", "en"],
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
};

export default class DotI18n {
    static config: Config = defaultConfig
    
    static locales: object = {}
    
    static language: string = "zh";

    static t(value: string, options?: I18NOptions, currentLocale?: object | null) {
        let result = value;
        const code = this.encode(value);
        // 该方法中禁止使用 this.locales, this.locales仅应用于采集数据与 excel/ts 转换
        // 将业务层的 locales 存入DotI18n.locales 中有什么影响？
        const nextLocale = currentLocale || {};
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

    // 使用 createContext 用于组件内 `i18n标签` 的转换
    static Provider(props: LocaleProviderProps) {
        const {children, locales} = props;
        return <I18nContext.Provider value={locales}>{children}</I18nContext.Provider>;
    }

    static useLocales<T extends Locales>() {
        return React.useContext<T>(I18nContext as unknown as  React.Context<T>);
    }

    // utf-8 => base64
    static encode(code: string): string {
        return Buffer.from(code, "utf-8").toString("base64");
    }

    // base64 => utf-8
    static decode(code: string) {
        return Buffer.from(code, "base64").toString("utf-8");
    }

    static setConfig(config: Config) {
        this.config = config;
    }
    
    static getConfig() {
        return this.config;
    }
    
    static setLocales<T extends object>(locales: T) {
        this.locales = locales;
    }
    
    static getLocales() {
        return this.locales;
    }
    
}