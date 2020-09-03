import {Context} from "react";

export const setLanguage: (data: string) => void;
export const getLanguage: () => string;

export const setLocales: (data: object) => void;
export const getLocales: () => any;

export const createContext: () => void;
export const getContext: () => Context;

export const t: (value: string, language: string, namespace?: string) => any;
export const useLocales: () => any;

export const Context: Context;
