import React from "react";

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

export const defaultConfig: Config = {
    baseUrl: "/src",
    outDir: "/src/locales",
    filename: "index",
    languages: ["zh", "en"],
    exportExcelPath: "/.i18n/result.xlsx",
    importExcelPath: "/.i18n/result.xlsx",
};

export default class Store {
    static config: Config = defaultConfig
    
    static locales: object = {}
    
    static language: string = "zh";

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