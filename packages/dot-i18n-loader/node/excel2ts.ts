import "./initialize";
import path from "path";
import XLSX from "xlsx";
import {EXCELSheet} from "../type";
import Store from "../store";
import {spawn, generateLocale} from "./kit";

let result: Record<string, any> = {};

// 翻译后将excel导入项目转换成ts
function execute() {
    const config = Store.getConfig();
    const allLocales = Store.getLocales();
    const languages = config?.languages;
    const prettierConfig = config?.prettierConfig;
    const outDir = config?.outDir;
    if (allLocales && !config.clearLegacy) {
        result = allLocales;
    }
    const excelExportFilePath = process.cwd() + config?.importExcelPath;
    const workbook = XLSX.readFile(excelExportFilePath, {type: "binary"});
    const data = (XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]) as EXCELSheet[]) || [];

    // TODO: flat
    // data.map(_=>unflatten(languages.reduce((pre, current)=>({...pre, [`${current}.${_.code}`]:_?.[current]}), {})));

    languages!.forEach((language) => {
        if (!result[language]) {
            result[language] = {};
        }
        data.forEach((_) => {
            const namespaces = _.code.split(".");
            let nextItemInstance = result![language];
            namespaces.forEach((namespace: string, index: number) => {
                if (namespaces.length === index + 1) {
                    nextItemInstance[namespace] = _[language];
                } else {
                    if (!nextItemInstance[namespace]) {
                        nextItemInstance[namespace] = {};
                    }
                    nextItemInstance = nextItemInstance[namespace];
                }
            });
        });
    });

    generateLocale(config, languages, result);
    if (prettierConfig) {
        spawn("prettier", ["--config", path.join(process.cwd(), prettierConfig), "--write", path.join(process.cwd(), outDir + "/*")]);
    }
    console.info("Update locales successfully");
}

execute();
