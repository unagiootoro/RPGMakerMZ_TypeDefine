//-----------------------------------------------------------------------------
/**
 * The static class that defines utility methods.
 *
 * @namespace
 */
class Utils {
    static _audioElement: any;
    static _videoElement: any;
    static _hasEncryptedImages?: boolean;
    static _hasEncryptedAudio?: boolean;
    static _encryptionKey?: string;

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * The name of the RPG Maker. "MZ" in the current version.
     *
     * @type string
     * @constant
     */
    static RPGMAKER_NAME = "MZ";

    /**
     * The version of the RPG Maker.
     *
     * @type string
     * @constant
     */
    static RPGMAKER_VERSION = "1.6.0";

    /**
     * Checks whether the current RPG Maker version is greater than or equal to
     * the given version.
     *
     * @param {string} version - The "x.x.x" format string to compare.
     * @returns {boolean} True if the current version is greater than or equal
     *                    to the given version.
     */
    static checkRMVersion(version: string) {
        const array1 = this.RPGMAKER_VERSION.split(".");
        const array2 = String(version).split(".");
        for (let i = 0; i < array1.length; i++) {
            const v1 = parseInt(array1[i]);
            const v2 = parseInt(array2[i]);
            if (v1 > v2) {
                return true;
            } else if (v1 < v2) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether the option is in the query string.
     *
     * @param {string} name - The option name.
     * @returns {boolean} True if the option is in the query string.
     */
    static isOptionValid(name: string) {
        const args = location.search.slice(1);
        if (args.split("&").includes(name)) {
            return true;
        }
        if (this.isNwjs() && nw.App.argv.length > 0) {
            return nw.App.argv[0].split("&").includes(name);
        }
        return false;
    }

    /**
     * Checks whether the platform is NW.js.
     *
     * @returns {boolean} True if the platform is NW.js.
     */
    static isNwjs(): boolean {
        // @ts-ignore
        return typeof require === "function" && typeof process === "object";
    }

    /**
     * Checks whether the platform is a mobile device.
     *
     * @returns {boolean} True if the platform is a mobile device.
     */
    static isMobileDevice() {
        const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;
        return !!navigator.userAgent.match(r);
    }

    /**
     * Checks whether the browser is Mobile Safari.
     *
     * @returns {boolean} True if the browser is Mobile Safari.
     */
    static isMobileSafari() {
        const agent = navigator.userAgent;
        return !!(
            agent.match(/iPhone|iPad|iPod/) &&
            agent.match(/AppleWebKit/) &&
            !agent.match("CriOS")
        );
    }

    /**
     * Checks whether the browser is Android Chrome.
     *
     * @returns {boolean} True if the browser is Android Chrome.
     */
    static isAndroidChrome() {
        const agent = navigator.userAgent;
        return !!(agent.match(/Android/) && agent.match(/Chrome/));
    }

    /**
     * Checks whether the browser is accessing local files.
     *
     * @returns {boolean} True if the browser is accessing local files.
     */
    static isLocal() {
        return window.location.href.startsWith("file:");
    }

    /**
     * Checks whether the browser supports WebGL.
     *
     * @returns {boolean} True if the browser supports WebGL.
     */
    static canUseWebGL() {
        try {
            const canvas = document.createElement("canvas");
            return !!canvas.getContext("webgl");
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks whether the browser supports Web Audio API.
     *
     * @returns {boolean} True if the browser supports Web Audio API.
     */
    static canUseWebAudioAPI() {
        return !!(window.AudioContext || (window as any).webkitAudioContext);
    }

    /**
     * Checks whether the browser supports CSS Font Loading.
     *
     * @returns {boolean} True if the browser supports CSS Font Loading.
     */
    static canUseCssFontLoading() {
        return !!(document.fonts && document.fonts.ready);
    }

    /**
     * Checks whether the browser supports IndexedDB.
     *
     * @returns {boolean} True if the browser supports IndexedDB.
     */
    static canUseIndexedDB() {
        return !!(
            window.indexedDB ||
            (window as any).mozIndexedDB ||
            (window as any).webkitIndexedDB
        );
    }

    /**
     * Checks whether the browser can play ogg files.
     *
     * @returns {boolean} True if the browser can play ogg files.
     */
    static canPlayOgg() {
        if (!Utils._audioElement) {
            Utils._audioElement = document.createElement("audio");
        }
        return !!(
            Utils._audioElement &&
            Utils._audioElement.canPlayType('audio/ogg; codecs="vorbis"')
        );
    }

    /**
     * Checks whether the browser can play webm files.
     *
     * @returns {boolean} True if the browser can play webm files.
     */
    static canPlayWebm() {
        if (!Utils._videoElement) {
            Utils._videoElement = document.createElement("video");
        }
        return !!(
            Utils._videoElement &&
            Utils._videoElement.canPlayType('video/webm; codecs="vp8, vorbis"')
        );
    }

    /**
     * Encodes a URI component without escaping slash characters.
     *
     * @param {string} str - The input string.
     * @returns {string} Encoded string.
     */
    static encodeURI(str: string) {
        return encodeURIComponent(str).replace(/%2F/g, "/");
    }

    /**
     * Gets the filename that does not include subfolders.
     *
     * @param {string} filename - The filename with subfolders.
     * @returns {string} The filename without subfolders.
     */
    static extractFileName(filename: string): string {
        return filename.split("/").pop()!;
    }

    /**
     * Escapes special characters for HTML.
     *
     * @param {string} str - The input string.
     * @returns {string} Escaped string.
     */
    static escapeHtml(str: string): string {
        const entityMap: any = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;"
        };
        return String(str).replace(/[&<>"'/]/g, s => entityMap[s]);
    }

    /**
     * Checks whether the string contains any Arabic characters.
     *
     * @returns {boolean} True if the string contains any Arabic characters.
     */
    static containsArabic(str: string) {
        const regExp = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        return regExp.test(str);
    }

    /**
     * Sets information related to encryption.
     *
     * @param {boolean} hasImages - Whether the image files are encrypted.
     * @param {boolean} hasAudio - Whether the audio files are encrypted.
     * @param {string} key - The encryption key.
     */
    static setEncryptionInfo(hasImages: boolean | undefined, hasAudio: boolean | undefined, key: string | undefined) {
        // [Note] This function is implemented for module independence.
        this._hasEncryptedImages = hasImages;
        this._hasEncryptedAudio = hasAudio;
        this._encryptionKey = key;
    }

    /**
     * Checks whether the image files in the game are encrypted.
     *
     * @returns {boolean} True if the image files are encrypted.
     */
    static hasEncryptedImages() {
        return this._hasEncryptedImages;
    }

    /**
     * Checks whether the audio files in the game are encrypted.
     *
     * @returns {boolean} True if the audio files are encrypted.
     */
    static hasEncryptedAudio() {
        return this._hasEncryptedAudio;
    }

    /**
     * Decrypts encrypted data.
     *
     * @param {ArrayBuffer} source - The data to be decrypted.
     * @returns {ArrayBuffer} The decrypted data.
     */
    static decryptArrayBuffer(source: ArrayBuffer) {
        const header = new Uint8Array(source, 0, 16);
        const headerHex = Array.from(header, x => x.toString(16)).join(",");
        if (headerHex !== "52,50,47,4d,56,0,0,0,0,3,1,0,0,0,0,0") {
            throw new Error("Decryption error");
        }
        const body = source.slice(16);
        const view = new DataView(body);
        const key = this._encryptionKey!.match(/.{2}/g)!;
        for (let i = 0; i < 16; i++) {
            view.setUint8(i, view.getUint8(i) ^ parseInt(key[i], 16));
        }
        return body;
    }
}
