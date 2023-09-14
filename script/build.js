const chalk = require("chalk");
const fs = require("fs-extra");
const childProcess = require("child_process");

const dotI18nTSConfig = "config/tsconfig.dot-i18n.json";
const dotI18nLoderTSConfig = "config/tsconfig.dot-i18n-loader.json";

function spawn(command, args, errorMessage) {
    const isWindows = process.platform === "win32"; // spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, args, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(chalk`{red.bold ${errorMessage}}`);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
        process.exit(1);
    }
}

function cleanup (){
    console.info(chalk`{green.bold [task]} {white.bold cleanup}`);
    fs.emptyDirSync("build");
}

function compile() {
    console.info(chalk`{green.bold [task]} {white.bold compile dot-i18n}`);
    spawn("tsc", ["-p", dotI18nTSConfig], "compile failed, please fix");

    console.info(chalk`{green.bold [task]} {white.bold compile dot-i18n-loader}`);
    spawn("tsc", ["-p", dotI18nLoderTSConfig], "compile failed, please fix");
}

function distribute() {
    console.info(chalk`{green.bold [task]} {white.bold distribute dot-i18n}`);
    fs.copySync("packages/dot-i18n/package.json", "build/dot-i18n/package.json", {dereference: true});
    fs.copySync("packages/dot-i18n/global.d.ts", "build/dot-i18n/global.d.ts", {dereference: true});

    console.info(chalk`{green.bold [task]} {white.bold distribute dot-i18n-loader}`);
    fs.copySync("packages/dot-i18n-loader/package.json", "build/dot-i18n-loader/package.json", {dereference: true});
}

cleanup();

compile();

distribute();