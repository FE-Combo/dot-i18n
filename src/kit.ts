import childProcess  from "child_process";

export function spawn(command:string, params:string[]) {
    const isWindows = process.platform === "win32";
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, params, {
        stdio: "inherit",
    });
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${params.join(" ")}`);
        process.exit(1);
    }
}
