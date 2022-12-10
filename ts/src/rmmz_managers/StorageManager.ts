//-----------------------------------------------------------------------------
// _StorageManager
//
// The static class that manages storage for saving game data.

class _StorageManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static _forageKeys: any[] = [];
    static _forageKeysUpdated: boolean = false;

    static isLocalMode() {
        return Utils.isNwjs();
    }

    static saveObject(saveName: string, object: any) {
        return this.objectToJson(object)
            .then((json: any) => this.jsonToZip(json))
            .then(zip => this.saveZip(saveName, zip));
    }

    static loadObject(saveName: string): Promise<any> {
        return this.loadZip(saveName)
            .then((zip: any) => this.zipToJson(zip))
            .then((json: string) => this.jsonToObject(json));
    }

    static objectToJson(object: any) {
        return new Promise((resolve, reject) => {
            try {
                const json = JsonEx.stringify(object);
                resolve(json);
            } catch (e) {
                reject(e);
            }
        });
    }

    static jsonToObject(json: string) {
        return new Promise((resolve, reject) => {
            try {
                const object = JsonEx.parse(json);
                resolve(object);
            } catch (e) {
                reject(e);
            }
        });
    }

    static jsonToZip(json: string) {
        return new Promise((resolve, reject) => {
            try {
                // @ts-ignore
                const zip = pako.deflate(json, { to: "string", level: 1 });
                if (zip.length >= 50000) {
                    console.warn("Save data is too big.");
                }
                resolve(zip);
            } catch (e) {
                reject(e);
            }
        });
    }

    static zipToJson(zip: any) {
        return new Promise((resolve, reject) => {
            try {
                if (zip) {
                    // @ts-ignore
                    const json = pako.inflate(zip, { to: "string" });
                    resolve(json);
                } else {
                    resolve("null");
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    static saveZip(saveName: string, zip: any) {
        if (this.isLocalMode()) {
            return this.saveToLocalFile(saveName, zip);
        } else {
            return this.saveToForage(saveName, zip);
        }
    }

    static loadZip(saveName: string) {
        if (this.isLocalMode()) {
            return this.loadFromLocalFile(saveName);
        } else {
            return this.loadFromForage(saveName);
        }
    }

    static exists(saveName: string) {
        if (this.isLocalMode()) {
            return this.localFileExists(saveName);
        } else {
            return this.forageExists(saveName);
        }
    }

    static remove(saveName: string) {
        if (this.isLocalMode()) {
            return this.removeLocalFile(saveName);
        } else {
            return this.removeForage(saveName);
        }
    }

    static saveToLocalFile(saveName: string, zip: any) {
        const dirPath = this.fileDirectoryPath();
        const filePath = this.filePath(saveName);
        const backupFilePath = filePath + "_";
        return new Promise((resolve: any, reject: any) => {
            this.fsMkdir(dirPath);
            this.fsUnlink(backupFilePath);
            this.fsRename(filePath, backupFilePath);
            try {
                this.fsWriteFile(filePath, zip);
                this.fsUnlink(backupFilePath);
                resolve();
            } catch (e) {
                try {
                    this.fsUnlink(filePath);
                    this.fsRename(backupFilePath, filePath);
                } catch (e2) {
                    //
                }
                reject(e);
            }
        });
    }

    static loadFromLocalFile(saveName: string) {
        const filePath = this.filePath(saveName);
        return new Promise((resolve, reject) => {
            const data = this.fsReadFile(filePath);
            if (data) {
                resolve(data);
            } else {
                reject(new Error("Savefile not found"));
            }
        });
    }

    static localFileExists(saveName: string) {
        // @ts-ignore
        const fs = require("fs");
        return fs.existsSync(this.filePath(saveName));
    }

    static removeLocalFile(saveName: string) {
        this.fsUnlink(this.filePath(saveName));
    }

    static saveToForage(saveName: string, zip: any) {
        const key = this.forageKey(saveName);
        const testKey = this.forageTestKey();
        // @ts-ignore
        setTimeout(() => localforage.removeItem(testKey));
        // @ts-ignore
        return localforage
            .setItem(testKey, zip)
            // @ts-ignore
            .then(() => localforage.setItem(key, zip))
            .then(() => this.updateForageKeys());
    }

    static loadFromForage(saveName: string) {
        const key = this.forageKey(saveName);
        // @ts-ignore
        return localforage.getItem(key);
    }

    static forageExists(saveName: string) {
        const key = this.forageKey(saveName);
        return this._forageKeys.includes(key);
    }

    static removeForage(saveName: string) {
        const key = this.forageKey(saveName);
        // @ts-ignore
        return localforage.removeItem(key).then(() => this.updateForageKeys());
    }

    static updateForageKeys() {
        this._forageKeysUpdated = false;
        // @ts-ignore
        return localforage.keys().then(keys => {
            this._forageKeys = keys;
            this._forageKeysUpdated = true;
            return 0;
        });
    }

    static forageKeysUpdated() {
        return this._forageKeysUpdated;
    }

    static fsMkdir(path: string) {
        // @ts-ignore
        const fs = require("fs");
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    static fsRename(oldPath: string, newPath: string) {
        // @ts-ignore
        const fs = require("fs");
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
        }
    }

    static fsUnlink(path: string) {
        // @ts-ignore
        const fs = require("fs");
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    static fsReadFile(path: string) {
        // @ts-ignore
        const fs = require("fs");
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, { encoding: "utf8" });
        } else {
            return null;
        }
    }

    static fsWriteFile(path: string, data: any) {
        // @ts-ignore
        const fs = require("fs");
        fs.writeFileSync(path, data);
    }

    static fileDirectoryPath(): string {
        // @ts-ignore
        const path = require("path");
        // @ts-ignore
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, "save/");
    }

    static filePath(saveName: string) {
        const dir = this.fileDirectoryPath();
        return dir + saveName + ".rmmzsave";
    }

    static forageKey(saveName: string) {
        const gameId = $dataSystem.advanced.gameId;
        return "rmmzsave." + gameId + "." + saveName;
    }

    static forageTestKey() {
        return "rmmzsave.test";
    }
}
