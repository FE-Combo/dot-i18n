import { createContext, Context } from "react";
let context: Context<any> | null = null

export function getI18nContent() {
    if (context === null) {
        context = createContext({})
    }
    return context
}

