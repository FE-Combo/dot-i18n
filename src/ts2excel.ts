import "./initialize";
import "colors";
import fs from "fs-extra";
import XLSX from "xlsx";
import * as i18nStore from "./i18n-store";
const XLSXStyle = require("xlsx-style");

function execute() {
    const config = i18nStore.getConfig();
    const strict = config?.strict;
    const languages = config?.languages;
    const allLocales = i18nStore.getLocales() || {};

    const data = [] as i18nStore.EXCELSheet[];
    if (strict) {
        Object.keys(allLocales).forEach((_) => {
            Object.keys(allLocales[_]).forEach((__) => {
                Object.keys(allLocales[_][__]).forEach((___) => {
                    const sheet = {
                        namespace: __,
                        code: ___,
                    };
                    languages!.forEach((language) => {
                        sheet[language] = allLocales && allLocales[language] && allLocales[language][__] && allLocales[language][__][___];
                    });
                    if (Object.values(sheet).filter((v) => v).length === languages!.length + 2) {
                        data.push(sheet);
                    } else {
                        data.unshift(sheet);
                    }
                });
            });
        });
    } else {
        const recursion = (item: Array<i18nStore.EXCELSheet> | object, codes: Array<number | string>) => {
            if (item instanceof Array) {
                item.forEach((_, index) => {
                    if (typeof _ === "object") {
                        recursion(_, [...codes, index]);
                    } else if (typeof _ === "string" || typeof _ === "number") {
                        const nextCodes = [...codes];
                        const language = nextCodes.shift()!;
                        const code = [...nextCodes, index].join(".");
                        const sheetIndex = data.findIndex((_) => _ && _.code === code);
                        if (sheetIndex !== -1) {
                            data[sheetIndex] = {...data[sheetIndex], [language]: _};
                        } else {
                            const sheet = {code, [language]: _} as i18nStore.EXCELSheet;
                            languages!.forEach((v) => {
                                if (!sheet[v]) {
                                    sheet[v] = undefined;
                                }
                            });
                            data.push(sheet);
                        }
                    }
                });
            }
            if (item instanceof Object) {
                Object.keys(item).forEach((_) => {
                    if (typeof item[_] === "object") {
                        recursion(item[_], [...codes, _]);
                    } else if (typeof item[_] === "string" || typeof _ === "number") {
                        const nextCodes = [...codes];
                        const language = nextCodes.shift()!;
                        const code = [...nextCodes, _].join(".");
                        const sheetIndex = data.findIndex((_) => _ && _.code === code);
                        if (sheetIndex !== -1) {
                            data[sheetIndex] = {...data[sheetIndex], [language]: item[_]};
                        } else {
                            const sheet = {code, [language]: item[_]};
                            languages!.forEach((v) => {
                                if (!sheet[v]) {
                                    sheet[v] = undefined;
                                }
                            });
                            data.push(sheet);
                        }
                    }
                });
            }
        };
        if (typeof allLocales === "object") {
            recursion(allLocales, []);
        }
    }

    const languageCountArray = Array(languages!.length + 2).fill(null);
    const worksheet = XLSX.utils.json_to_sheet(data);
    Object.keys(worksheet).forEach((_) => {
        if (/^[A-Z]+1$/.test(_)) {
            worksheet[_].s = {
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                },
                bgColor: {rgb: "f6f8fa00"},
                font: {
                    sz: 14,
                    bold: true,
                    color: {rgb: "24292e00"},
                },
            };
        }
    });
    worksheet["!cols"] = languageCountArray.map((_) => ({wpx: 100}));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelExportFilePath = process.cwd() + config!.exportExcelPath;
    fs.ensureFileSync(excelExportFilePath);
    XLSXStyle.writeFile(workbook, excelExportFilePath, {bookType: "xlsx", bookSST: false, type: "binary"});

    console.info("Build successfully");
}

execute();
