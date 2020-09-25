require("colors");
require("./preOperation");
const fs = require("fs-extra");
const XLSX = require("xlsx");
const XLSXStyle = require("xlsx-style");
const i18nStore = require("./i18n-store");

function execute() {
    const config = i18nStore.getConfig();
    const languages = config.languages;
    const allLocales = i18nStore.getLocales() || {};

    const data = [];
    Object.keys(allLocales).forEach((_) => {
        Object.keys(allLocales[_]).forEach((__) => {
            Object.keys(allLocales[_][__]).forEach((___) => {
                const sheet = {
                    namespace: __,
                    code: ___,
                };
                languages.forEach((language) => {
                    sheet[language] = allLocales && allLocales[language] && allLocales[language][__] && allLocales[language][__][___];
                });
                if (Object.values(sheet).filter((v) => v).length === languages.length + 2) {
                    data.push(sheet);
                } else {
                    data.unshift(sheet);
                }
            });
        });
    });

    const languageCountArray = Array(languages.length + 2).fill(null);
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
    const excelExportFilePath = process.cwd() + config.exportExcelPath;
    fs.ensureFileSync(excelExportFilePath);
    XLSXStyle.writeFile(workbook, excelExportFilePath, {bookType: "xlsx", bookSST: false, type: "binary"});

    console.info("Build successfully");
}

execute();
