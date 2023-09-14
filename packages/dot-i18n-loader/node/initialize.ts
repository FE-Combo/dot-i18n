import fs from "fs-extra";
import Store from "../store";

let initial = false;

// 采集数据存入store
function execute() {
    const configJsonPath = process.cwd() + "/i18n.config.json";
    let config = {...Store.getConfig()};
    if (fs.pathExistsSync(configJsonPath)) {
        config = {...config, ...JSON.parse(fs.readFileSync(configJsonPath).toString())};
        Store.setConfig(config);
    }

    try {
        const filename = config.filename || "index";
        const outDir = process.cwd() + config.outDir + `/${filename}.js`;
        if (fs.pathExistsSync(outDir)) {
            const fileContent = require(outDir) || {};
            Store.setLocales(fileContent);
        }
    } catch (error) {
        console.info(error);
    }
}

if (!initial) {
    initial = true;
    execute();
}
