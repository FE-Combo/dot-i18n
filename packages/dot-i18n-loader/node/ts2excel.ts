import "./initialize";
import "colors";
import fs from "fs-extra";
import XLSX from "xlsx";
import Store from "../store";
import {EXCELSheet} from "../type";
const XLSXStyle = require("xlsx-style");
// 原生的 xlsx 不支持表格的样式设置, 选择使用 xlsx-style 可以设置表格样式

function isObject(item: Array<EXCELSheet> | Record<string, any>): item is Record<string, any> {
    return item instanceof Object && !Array.isArray(item);
}

function isArray(item: Array<EXCELSheet> | Record<string, any>): item is Array<EXCELSheet> {
    return Array.isArray(item);
}

// 本地ts转换成excel（导出excel便于翻译）
function execute() {
    const config = Store.getConfig();
    const languages = config?.languages;
    const allLocales = Store.getLocales() || {};
    const data = [] as EXCELSheet[];
    const recursion = (item: Array<EXCELSheet> | Record<string, any>, codes: Array<number | string>) => {
        if (isArray(item)) {
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
                        const sheet = {code, [language]: _} as EXCELSheet;
                        languages!.forEach((v) => {
                            if (!sheet[v]) {
                                sheet[v] = undefined;
                            }
                        });
                        data.push(sheet);
                    }
                }
            });
        } else if (isObject(item)) {
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

    console.info("Update excel successfully");
}

execute();
