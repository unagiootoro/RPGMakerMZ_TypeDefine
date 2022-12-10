//-----------------------------------------------------------------------------
// AudioManager
//
// The static class that handles BGM, BGS, ME and SE.

class AudioManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static _bgmVolume = 100;
    static _bgsVolume = 100;
    static _meVolume = 100;
    static _seVolume = 100;
    static _currentBgm: any = null;
    static _currentBgs: any = null;
    static _bgmBuffer: any = null;
    static _bgsBuffer: any = null;
    static _meBuffer: any = null;
    static _seBuffers: any = [];
    static _staticBuffers: any = [];
    static _replayFadeTime = 0.5;
    static _path = "audio/";

    static _currentMe: any;

    static get bgmVolume() { return this._bgmVolume; }
    static set bgmVolume(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    }

    static get bgsVolume() { return this._bgsVolume; }
    static set bgsVolume(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    }

    static get meVolume() { return this._meVolume; }
    static set meVolume(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    }

    static get seVolume() { return this._seVolume; }
    static set seVolume(value) {
        this._seVolume = value;
    }

    static playBgm(bgm: IAudioObject | null, pos?: number) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.stopBgm();
            if (bgm!.name) {
                this._bgmBuffer = this.createBuffer("bgm/", bgm!.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
        this.updateCurrentBgm(bgm, pos);
    }

    static replayBgm(bgm: any) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.playBgm(bgm, bgm.pos);
            if (this._bgmBuffer) {
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static isCurrentBgm(bgm: IAudioObject | null) {
        return (
            this._currentBgm &&
            this._bgmBuffer &&
            this._currentBgm.name === bgm!.name
        );
    }

    static updateBgmParameters(bgm: any) {
        this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
    }

    static updateCurrentBgm(bgm: any, pos: number | undefined) {
        this._currentBgm = {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: pos
        };
    }

    static stopBgm() {
        if (this._bgmBuffer) {
            this._bgmBuffer.destroy();
            this._bgmBuffer = null;
            this._currentBgm = null;
        }
    }

    static fadeOutBgm(duration: number) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeOut(duration);
            this._currentBgm = null;
        }
    }

    static fadeInBgm(duration: any) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeIn(duration);
        }
    }

    static playBgs(bgs: any, pos?: number) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.stopBgs();
            if (bgs.name) {
                this._bgsBuffer = this.createBuffer("bgs/", bgs.name);
                this.updateBgsParameters(bgs);
                this._bgsBuffer.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs(bgs, pos);
    }

    static replayBgs(bgs: any) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.playBgs(bgs, bgs.pos);
            if (this._bgsBuffer) {
                this._bgsBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static isCurrentBgs(bgs: any) {
        return (
            this._currentBgs &&
            this._bgsBuffer &&
            this._currentBgs.name === bgs.name
        );
    }

    static updateBgsParameters(bgs: any) {
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
    }

    static updateCurrentBgs(bgs: any, pos: any) {
        this._currentBgs = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        };
    }

    static stopBgs() {
        if (this._bgsBuffer) {
            this._bgsBuffer.destroy();
            this._bgsBuffer = null;
            this._currentBgs = null;
        }
    }

    static fadeOutBgs(duration: number) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeOut(duration);
            this._currentBgs = null;
        }
    }

    static fadeInBgs(duration: any) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeIn(duration);
        }
    }

    static playMe(me: { name: any; }) {
        this.stopMe();
        if (me.name) {
            if (this._bgmBuffer && this._currentBgm) {
                this._currentBgm.pos = this._bgmBuffer.seek();
                this._bgmBuffer.stop();
            }
            this._meBuffer = this.createBuffer("me/", me.name);
            this.updateMeParameters(me);
            this._meBuffer.play(false);
            this._meBuffer.addStopListener(this.stopMe.bind(this));
        }
    }

    static updateMeParameters(me: any) {
        this.updateBufferParameters(this._meBuffer, this._meVolume, me);
    }

    static fadeOutMe(duration: number) {
        if (this._meBuffer) {
            this._meBuffer.fadeOut(duration);
        }
    }

    static stopMe() {
        if (this._meBuffer) {
            this._meBuffer.destroy();
            this._meBuffer = null;
            if (
                this._bgmBuffer &&
                this._currentBgm &&
                !this._bgmBuffer.isPlaying()
            ) {
                this._bgmBuffer.play(true, this._currentBgm.pos);
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static playSe(se: { name: any; }) {
        if (se.name) {
            // [Note] Do not play the same sound in the same frame.
            const latestBuffers = this._seBuffers.filter(
                (                buffer: { frameCount: number; }) => buffer.frameCount === Graphics.frameCount
            );
            if (latestBuffers.find((buffer: { name: any; }) => buffer.name === se.name)) {
                return;
            }
            const buffer = this.createBuffer("se/", se.name);
            this.updateSeParameters(buffer, se);
            buffer.play(false);
            this._seBuffers.push(buffer);
            this.cleanupSe();
        }
    }

    static updateSeParameters(buffer: any, se: any) {
        this.updateBufferParameters(buffer, this._seVolume, se);
    }

    static cleanupSe() {
        for (const buffer of this._seBuffers) {
            if (!buffer.isPlaying()) {
                buffer.destroy();
            }
        }
        this._seBuffers = this._seBuffers.filter((buffer: { isPlaying: () => any; }) => buffer.isPlaying());
    }

    static stopSe() {
        for (const buffer of this._seBuffers) {
            buffer.destroy();
        }
        this._seBuffers = [];
    }

    static playStaticSe(se: { name: any; }) {
        if (se.name) {
            this.loadStaticSe(se);
            for (const buffer of this._staticBuffers) {
                if (buffer.name === se.name) {
                    buffer.stop();
                    this.updateSeParameters(buffer, se);
                    buffer.play(false);
                    break;
                }
            }
        }
    }

    static loadStaticSe(se: { name: any; }) {
        if (se.name && !this.isStaticSe(se)) {
            const buffer = this.createBuffer("se/", se.name);
            this._staticBuffers.push(buffer);
        }
    }

    static isStaticSe(se: { name: any; }) {
        for (const buffer of this._staticBuffers) {
            if (buffer.name === se.name) {
                return true;
            }
        }
        return false;
    }

    static stopAll() {
        this.stopMe();
        this.stopBgm();
        this.stopBgs();
        this.stopSe();
    }

    static saveBgm() {
        if (this._currentBgm) {
            const bgm = this._currentBgm;
            return {
                name: bgm.name,
                volume: bgm.volume,
                pitch: bgm.pitch,
                pan: bgm.pan,
                pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    static saveBgs() {
        if (this._currentBgs) {
            const bgs = this._currentBgs;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    static makeEmptyAudioObject(): IAudioObject {
        return { name: "", volume: 0, pitch: 0 };
    }

    static createBuffer(folder: string, name: any) {
        const ext = this.audioFileExt();
        const url = this._path + folder + Utils.encodeURI(name) + ext;
        const buffer: any = new WebAudio(url);
        buffer.name = name;
        buffer.frameCount = Graphics.frameCount;
        return buffer;
    }

    static updateBufferParameters(buffer: { volume: number; pitch: number; pan: number; }, configVolume: number, audio: { volume: any; pitch: any; pan: any; }) {
        if (buffer && audio) {
            buffer.volume = (configVolume * (audio.volume || 0)) / 10000;
            buffer.pitch = (audio.pitch || 0) / 100;
            buffer.pan = (audio.pan || 0) / 100;
        }
    }

    static audioFileExt() {
        return ".ogg";
    }

    static checkErrors() {
        const buffers = [this._bgmBuffer, this._bgsBuffer, this._meBuffer];
        buffers.push(...this._seBuffers);
        buffers.push(...this._staticBuffers);
        for (const buffer of buffers) {
            if (buffer && buffer.isError()) {
                this.throwLoadError(buffer);
            }
        }
    }

    static throwLoadError(webAudio: { retry: { bind: (arg0: any) => any; }; url: any; }) {
        const retry = webAudio.retry.bind(webAudio);
        throw ["LoadError", webAudio.url, retry];
    }
}

interface IAudioObject {
    name: string;
    volume: number;
    pitch: number;
    pan?: number;
    pos?: number;
}
