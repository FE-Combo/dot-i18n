"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("colors");
require("./initialize");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var xlsx_1 = tslib_1.__importDefault(require("xlsx"));
var i18nStore = tslib_1.__importStar(require("./i18n-store"));
var XLSXStyle = require("xlsx-style");
function execute() {
    var config = i18nStore.getConfig();
    var strict = config === null || config === void 0 ? void 0 : config.strict;
    var languages = config === null || config === void 0 ? void 0 : config.languages;
    var allLocales = i18nStore.getLocales() || {};
    var data = [];
    if (strict) {
        Object.keys(allLocales).forEach(function (_) {
            Object.keys(allLocales[_]).forEach(function (__) {
                Object.keys(allLocales[_][__]).forEach(function (___) {
                    var sheet = {
                        namespace: __,
                        code: ___,
                    };
                    languages.forEach(function (language) {
                        sheet[language] = allLocales && allLocales[language] && allLocales[language][__] && allLocales[language][__][___];
                    });
                    if (Object.values(sheet).filter(function (v) { return v; }).length === languages.length + 2) {
                        data.push(sheet);
                    }
                    else {
                        data.unshift(sheet);
                    }
                });
            });
        });
    }
    else {
        var recursion_1 = function (item, codes) {
            if (item instanceof Array) {
                item.forEach(function (_, index) {
                    var _a, _b;
                    if (typeof _ === "object") {
                        recursion_1(_, tslib_1.__spread(codes, [index]));
                    }
                    else if (typeof _ === "string" || typeof _ === "number") {
                        var nextCodes = tslib_1.__spread(codes);
                        var language = nextCodes.shift();
                        var code_1 = tslib_1.__spread(nextCodes, [index]).join(".");
                        var sheetIndex = data.findIndex(function (_) { return _ && _.code === code_1; });
                        if (sheetIndex !== -1) {
                            data[sheetIndex] = tslib_1.__assign(tslib_1.__assign({}, data[sheetIndex]), (_a = {}, _a[language] = _, _a));
                        }
                        else {
                            var sheet_1 = (_b = { code: code_1 }, _b[language] = _, _b);
                            languages.forEach(function (v) {
                                if (!sheet_1[v]) {
                                    sheet_1[v] = undefined;
                                }
                            });
                            data.push(sheet_1);
                        }
                    }
                });
            }
            if (item instanceof Object) {
                Object.keys(item).forEach(function (_) {
                    var _a, _b;
                    if (typeof item[_] === "object") {
                        recursion_1(item[_], tslib_1.__spread(codes, [_]));
                    }
                    else if (typeof item[_] === "string" || typeof _ === "number") {
                        var nextCodes = tslib_1.__spread(codes);
                        var language = nextCodes.shift();
                        var code_2 = tslib_1.__spread(nextCodes, [_]).join(".");
                        var sheetIndex = data.findIndex(function (_) { return _ && _.code === code_2; });
                        if (sheetIndex !== -1) {
                            data[sheetIndex] = tslib_1.__assign(tslib_1.__assign({}, data[sheetIndex]), (_a = {}, _a[language] = item[_], _a));
                        }
                        else {
                            var sheet_2 = (_b = { code: code_2 }, _b[language] = item[_], _b);
                            languages.forEach(function (v) {
                                if (!sheet_2[v]) {
                                    sheet_2[v] = undefined;
                                }
                            });
                            data.push(sheet_2);
                        }
                    }
                });
            }
        };
        if (typeof allLocales === "object") {
            recursion_1(allLocales, []);
        }
    }
    var languageCountArray = Array(languages.length + 2).fill(null);
    var worksheet = xlsx_1.default.utils.json_to_sheet(data);
    Object.keys(worksheet).forEach(function (_) {
        if (/^[A-Z]+1$/.test(_)) {
            worksheet[_].s = {
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                },
                bgColor: { rgb: "f6f8fa00" },
                font: {
                    sz: 14,
                    bold: true,
                    color: { rgb: "24292e00" },
                },
            };
        }
    });
    worksheet["!cols"] = languageCountArray.map(function (_) { return ({ wpx: 100 }); });
    var workbook = xlsx_1.default.utils.book_new();
    xlsx_1.default.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    var excelExportFilePath = process.cwd() + config.exportExcelPath;
    fs_extra_1.default.ensureFileSync(excelExportFilePath);
    XLSXStyle.writeFile(workbook, excelExportFilePath, { bookType: "xlsx", bookSST: false, type: "binary" });
    console.info("Build successfully");
}
execute();
