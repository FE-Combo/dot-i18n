const childProcess = require("child_process");

function returnJSXElementFindI18nTag(node, callback) {
    if ((node.openingElement && node.openingElement.name.name === "i18n") || (node.argument && node.argument.openingElement && node.argument.openingElement.name.name === "i18n")) {
        const jsxNode = node || node.argument;
        callback(jsxNode);
    }
    if ((node.children && node.children.length > 0) || (node.argument && node.argument.children && node.argument.children.length > 0)) {
        const children = node.children || node.argument.children;
        children.forEach((_) => {
            findI18nTag(_, callback);
        });
    }
}

function spawn(command, arguments) {
    const isWindows = process.platform === "win32";
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, arguments, {
        stdio: "inherit",
    });
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${arguments.join(" ")}`);
        process.exit(1);
    }
}

module.exports = {
    returnJSXElementFindI18nTag,
    spawn,
};
