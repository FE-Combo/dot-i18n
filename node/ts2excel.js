require("./preOperation");
const path = require("path");
const fs = require("fs-extra");
const XLSX = require("xlsx");
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
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelExportFilePath = process.cwd() + config.exportExcelPath;
    fs.ensureFileSync(excelExportFilePath);
    XLSX.writeFile(workbook, excelExportFilePath);
}

execute();
