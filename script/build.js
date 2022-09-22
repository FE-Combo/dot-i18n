const chalk = require("chalk");
const fs = require("fs-extra");
const childProcess = require("child_process");

const tsConfigBuild = "config/tsconfig.build.json";

function cleanup (){
    console.info(chalk`{green.bold [task]} {white.bold cleanup}`);
    fs.emptyDirSync("build");
}

function spawn(command, args, errorMessage) {
    console.info(chalk`{green.bold [task]} {white.bold compile}`);
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

cleanup();
spawn("tsc", ["-p", tsConfigBuild], "compile failed, please fix");