import React from "react";

export type I18NOptions =
    | {
          namespace?: string;
          language?: string;
          replace?: object;
      }
    | string;

export interface Locales {
    [code: string]: Locales | React.ReactText;
}

export const I18nContext = React.createContext({} as Locales);

interface LocaleProviderProps {
    locales: Locales | {};
    children?: React.ReactNode | React.ReactNode[];
}

export default class DotI18n {    
    static t(value: string, options?: I18NOptions, currentLocale?: object | null) {
        let result = value;
        const code = this.encode(value);
        const nextLocale: Record<string, any> = currentLocale || {};
        if (code && nextLocale) {
            const namespace = (typeof options === "string" ? options : options?.namespace) || "global";
            const replaceVariable: Record<string, any> | undefined = options?.replace;
            if (nextLocale?.[namespace] && nextLocale[namespace][code]) {
                if (nextLocale[namespace][code]) {
                    result = nextLocale[namespace][code];
                }
            }
            if (replaceVariable) {
                Object.keys(replaceVariable).forEach(function (key) {
                    result = result.replace(new RegExp(key, "g"), replaceVariable[key] as string);
                });
            }
        }
        return result;
    }

    // 使用 createContext 用于组件内 `i18n标签` 的转换
    static Provider(props: LocaleProviderProps) {
        // TODO: locales额外存储使组件外部可以访问？
        const {children, locales} = props;
        return <I18nContext.Provider value={locales}>{children}</I18nContext.Provider>;
    }

    static useLocales(): Locales {
        return React.useContext(I18nContext)
    }

    // utf-8 => base64
    static encode(code: string): string {
        return Buffer.from(code, "utf-8").toString("base64");
    }

    // base64 => utf-8
    static decode(code: string) {
        return Buffer.from(code, "base64").toString("utf-8");
    }
}