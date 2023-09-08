import fs from "fs-extra";
import DotI18n from "..";

let initial = false;

// 采集数据存入store
function execute() {
    const configJsonPath = process.cwd() + "/i18n.config.json";
    let config = {...DotI18n.getConfig()};
    if (fs.pathExistsSync(configJsonPath)) {
        config = {...config, ...JSON.parse(fs.readFileSync(configJsonPath).toString())};
        DotI18n.setConfig(config);
    }

    try {
        const filename = config.filename || "index";
        const outDir = process.cwd() + config.outDir + `/${filename}.js`;
        if (fs.pathExistsSync(outDir)) {
            const fileContent = require(outDir) || {};
            DotI18n.setLocales(fileContent);
        }
    } catch (error) {
        console.info(error);
    }
}

if (!initial) {
    initial = true;
    execute();
}
