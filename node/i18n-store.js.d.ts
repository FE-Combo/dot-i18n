import {Context} from "react";

export type I18NOptions =
    | {
          namespace?: string;
          language?: string;
          replace?: object;
      }
    | string;

export const setLanguage: (data: string) => void;
export const getLanguage: () => string;

export const setLocales: (data: object) => void;
export const getLocales: () => any;

export const createContext: () => void;
export const getContext: () => Context;

export const t: (value: string, options: I18NOptions, currentLocale: any, reverseLocaleString: string) => any;
export const useLocales: () => any;

export const Context: Context;
