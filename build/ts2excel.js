"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("./initialize");
require("colors");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var xlsx_1 = tslib_1.__importDefault(require("xlsx"));
var i18nStore = tslib_1.__importStar(require("./i18n-store"));
var XLSXStyle = require("xlsx-style");
// 原生的 xlsx 不支持表格的样式设置, 选择使用 xlsx-style 可以设置表格样式
function execute() {
    var config = i18nStore.getConfig();
    var languages = config === null || config === void 0 ? void 0 : config.languages;
    var allLocales = i18nStore.getLocales() || {};
    var data = [];
    var recursion = function (item, codes) {
        if (item instanceof Array) {
            item.forEach(function (_, index) {
                var _a, _b;
                if (typeof _ === "object") {
                    recursion(_, tslib_1.__spread(codes, [index]));
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
                    recursion(item[_], tslib_1.__spread(codes, [_]));
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
        recursion(allLocales, []);
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
    console.info("Build excel successfully");
}
execute();
