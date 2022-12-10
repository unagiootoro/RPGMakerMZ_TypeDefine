const util = require("util");
const childProcess = require("child_process");
const exec = util.promisify(childProcess.exec);
const fs = require("fs");

const targetDirs = [
    "rmmz_core",
    "rmmz_managers",
    "rmmz_objects",
    "rmmz_scenes",
    "rmmz_sprites",
    "rmmz_windows",
];

async function moveDts(srcDirPath, dstDirPath) {
    const fileNames = await fs.promises.readdir(srcDirPath);
    for (const fileName of fileNames) {
        if (fileName.match(/\.d\.ts$/)) {
            const srcFilePath = `${srcDirPath}/${fileName}`;
            const dstFilePath = `${dstDirPath}/${fileName}`;
            await fs.promises.rename(srcFilePath, dstFilePath);
        }
    }
}

async function copyDir(srcDirPath, dstDirPath) {
    const fileNames = await fs.promises.readdir(srcDirPath);
    for (const fileName of fileNames) {
        const srcFilePath = `${srcDirPath}/${fileName}`;
        const dstFilePath = `${dstDirPath}/${fileName}`;
        if (fs.lstatSync(srcFilePath).isDirectory()) {
            if (!fs.existsSync(dstFilePath)) await fs.promises.mkdir(dstFilePath);
            await copyDir(srcFilePath, dstFilePath);
        } else {
            await fs.promises.copyFile(srcFilePath, dstFilePath);
        }
    }
}

async function deleteDir(dirPath) {
    const fileNames = await fs.promises.readdir(dirPath);
    for (const fileName of fileNames) {
        const filePath = `${dirPath}/${fileName}`;
        if (fs.lstatSync(filePath).isDirectory()) {
            await deleteDir(filePath);
        } else {
            await fs.promises.unlink(filePath);
        }
    }
    await fs.promises.rmdir(dirPath);
}

async function generateRmmzTypeDefine() {
    if (fs.existsSync("rmmz-typedefine")) await deleteDir("rmmz-typedefine");

    await fs.promises.mkdir("rmmz-typedefine");

    for (const targetDir of targetDirs) {
        const srcDirPath = `js/${targetDir}`;
        const dstDirPath = `rmmz-typedefine/${targetDir}`;
        await fs.promises.mkdir(dstDirPath);
        await moveDts(srcDirPath, dstDirPath);
    }

    await moveDts("js", "rmmz-typedefine");

    await copyDir("ts/decl", "rmmz-typedefine");
}

function main() {
    exec("cd ts && tsc", (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        generateRmmzTypeDefine();
    });
}

main();
