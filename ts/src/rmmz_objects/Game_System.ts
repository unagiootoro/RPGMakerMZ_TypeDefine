//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

class Game_System {
    protected _saveEnabled!: boolean;
    protected _menuEnabled!: boolean;
    protected _encounterEnabled!: boolean;
    protected _formationEnabled!: boolean;
    protected _battleCount!: number;
    protected _winCount!: number;
    protected _escapeCount!: number;
    protected _saveCount!: number;
    protected _versionId!: number;
    protected _savefileId!: number;
    protected _framesOnSave!: number;
    protected _bgmOnSave!: IAudioObject | null;
    protected _bgsOnSave!: IAudioObject | null;
    protected _windowTone!: ToneType | null;
    protected _battleBgm!: IAudioObject | null;
    protected _victoryMe!: IAudioObject | null;
    protected _defeatMe!: IAudioObject | null;
    protected _savedBgm!: IAudioObject | null;
    protected _walkingBgm!: IAudioObject | null;

    constructor(...args: any[]) {
        this.initialize(...args as []);
    }

    initialize() {
        this._saveEnabled = true;
        this._menuEnabled = true;
        this._encounterEnabled = true;
        this._formationEnabled = true;
        this._battleCount = 0;
        this._winCount = 0;
        this._escapeCount = 0;
        this._saveCount = 0;
        this._versionId = 0;
        this._savefileId = 0;
        this._framesOnSave = 0;
        this._bgmOnSave = null;
        this._bgsOnSave = null;
        this._windowTone = null;
        this._battleBgm = null;
        this._victoryMe = null;
        this._defeatMe = null;
        this._savedBgm = null;
        this._walkingBgm = null;
    }

    isJapanese() {
        return $dataSystem.locale.match(/^ja/);
    }

    isChinese() {
        return $dataSystem.locale.match(/^zh/);
    }

    isKorean() {
        return $dataSystem.locale.match(/^ko/);
    }

    isCJK() {
        return $dataSystem.locale.match(/^(ja|zh|ko)/);
    }

    isRussian() {
        return $dataSystem.locale.match(/^ru/);
    }

    isSideView() {
        return $dataSystem.optSideView;
    }

    isAutosaveEnabled() {
        return $dataSystem.optAutosave;
    }

    isSaveEnabled() {
        return this._saveEnabled;
    }

    disableSave() {
        this._saveEnabled = false;
    }

    enableSave() {
        this._saveEnabled = true;
    }

    isMenuEnabled() {
        return this._menuEnabled;
    }

    disableMenu() {
        this._menuEnabled = false;
    }

    enableMenu() {
        this._menuEnabled = true;
    }

    isEncounterEnabled() {
        return this._encounterEnabled;
    }

    disableEncounter() {
        this._encounterEnabled = false;
    }

    enableEncounter() {
        this._encounterEnabled = true;
    }

    isFormationEnabled() {
        return this._formationEnabled;
    }

    disableFormation() {
        this._formationEnabled = false;
    }

    enableFormation() {
        this._formationEnabled = true;
    }

    battleCount() {
        return this._battleCount;
    }

    winCount() {
        return this._winCount;
    }

    escapeCount() {
        return this._escapeCount;
    }

    saveCount() {
        return this._saveCount;
    }

    versionId() {
        return this._versionId;
    }

    savefileId() {
        return this._savefileId || 0;
    }

    setSavefileId(savefileId: number) {
        this._savefileId = savefileId;
    }

    windowTone(): ToneType {
        return this._windowTone || $dataSystem.windowTone;
    }

    setWindowTone(value: ToneType) {
        this._windowTone = value;
    }

    battleBgm() {
        return this._battleBgm || $dataSystem.battleBgm;
    }

    setBattleBgm(value: IAudioObject) {
        this._battleBgm = value;
    }

    victoryMe() {
        return this._victoryMe || $dataSystem.victoryMe;
    }

    setVictoryMe(value: IAudioObject) {
        this._victoryMe = value;
    }

    defeatMe() {
        return this._defeatMe || $dataSystem.defeatMe;
    }

    setDefeatMe(value: IAudioObject) {
        this._defeatMe = value;
    }

    onBattleStart() {
        this._battleCount++;
    }

    onBattleWin() {
        this._winCount++;
    }

    onBattleEscape() {
        this._escapeCount++;
    }

    onBeforeSave() {
        this._saveCount++;
        this._versionId = $dataSystem.versionId;
        this._framesOnSave = Graphics.frameCount;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    }

    onAfterLoad() {
        Graphics.frameCount = this._framesOnSave;
        AudioManager.playBgm(this._bgmOnSave);
        AudioManager.playBgs(this._bgsOnSave);
    }

    playtime() {
        return Math.floor(Graphics.frameCount / 60);
    }

    playtimeText() {
        const hour = Math.floor(this.playtime() / 60 / 60);
        const min = Math.floor(this.playtime() / 60) % 60;
        const sec = this.playtime() % 60;
        return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
    }

    saveBgm() {
        this._savedBgm = AudioManager.saveBgm();
    }

    replayBgm() {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    }

    saveWalkingBgm() {
        this._walkingBgm = AudioManager.saveBgm();
    }

    replayWalkingBgm() {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    }

    saveWalkingBgm2() {
        this._walkingBgm = $dataMap.bgm;
    }

    mainFontFace() {
        return "rmmz-mainfont, " + $dataSystem.advanced.fallbackFonts;
    }

    numberFontFace() {
        return "rmmz-numberfont, " + this.mainFontFace();
    }

    mainFontSize() {
        return $dataSystem.advanced.fontSize;
    }

    windowPadding() {
        return 12;
    }

    windowOpacity() {
        if ("windowOpacity" in $dataSystem.advanced) {
            return $dataSystem.advanced.windowOpacity;
        } else {
            return 192;
        }
    }
}
