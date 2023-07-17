//-----------------------------------------------------------------------------
// Scene_Base
//
// The superclass of all scenes within the game.

class Scene_Base extends Stage {
    protected _started!: boolean;
    protected _active!: boolean;
    protected _fadeSign!: number;
    protected _fadeDuration!: number;
    protected _fadeWhite!: boolean | number;
    protected _fadeOpacity!: number;
    protected _windowLayer!: WindowLayer;
    protected _colorFilter!: ColorFilter;

    initialize() {
        Stage.prototype.initialize.call(this);
        this._started = false;
        this._active = false;
        this._fadeSign = 0;
        this._fadeDuration = 0;
        this._fadeWhite = 0;
        this._fadeOpacity = 0;
        this.createColorFilter();
    }

    create() {
        //
    }

    isActive() {
        return this._active;
    }

    isReady() {
        return (
            ImageManager.isReady() &&
            EffectManager.isReady() &&
            FontManager.isReady()
        );
    }

    start() {
        this._started = true;
        this._active = true;
    }

    update() {
        this.updateFade();
        this.updateColorFilter();
        this.updateChildren();
        AudioManager.checkErrors();
    }

    stop() {
        this._active = false;
    }

    isStarted() {
        return this._started;
    }

    isBusy() {
        return this.isFading();
    }

    isFading() {
        return this._fadeDuration > 0;
    }

    terminate() {
        //
    }

    createWindowLayer() {
        this._windowLayer = new WindowLayer();
        this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._windowLayer);
    }

    addWindow(window: _Window | Sprite_Button) {
        this._windowLayer.addChild(window);
    }

    startFadeIn(duration: number, white: number | boolean) {
        this._fadeSign = 1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 255;
        this.updateColorFilter();
    }

    startFadeOut(duration: number, white: number | boolean = false) {
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 0;
        this.updateColorFilter();
    }

    createColorFilter() {
        this._colorFilter = new ColorFilter();
        this.filters = [this._colorFilter];
    }

    updateColorFilter() {
        const c = this._fadeWhite ? 255 : 0;
        const blendColor: ColorType = [c, c, c, this._fadeOpacity];
        this._colorFilter.setBlendColor(blendColor);
    }

    updateFade() {
        if (this._fadeDuration > 0) {
            const d = this._fadeDuration;
            if (this._fadeSign > 0) {
                this._fadeOpacity -= this._fadeOpacity / d;
            } else {
                this._fadeOpacity += (255 - this._fadeOpacity) / d;
            }
            this._fadeDuration--;
        }
    }

    updateChildren() {
        for (const child of this.children as Sprite[]) {
            if (child.update) {
                child.update();
            }
        }
    }

    popScene() {
        SceneManager.pop();
    }

    checkGameover() {
        if ($gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    }

    fadeOutAll() {
        const time = this.slowFadeSpeed() / 60;
        AudioManager.fadeOutBgm(time);
        AudioManager.fadeOutBgs(time);
        AudioManager.fadeOutMe(time);
        this.startFadeOut(this.slowFadeSpeed());
    }

    fadeSpeed() {
        return 24;
    }

    slowFadeSpeed() {
        return this.fadeSpeed() * 2;
    }

    scaleSprite(sprite: Sprite) {
        const ratioX = Graphics.width / sprite.bitmap!.width;
        const ratioY = Graphics.height / sprite.bitmap!.height;
        const scale = Math.max(ratioX, ratioY, 1.0);
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }

    centerSprite(sprite: { x: number; y: number; anchor: { x: number; y: number; }; }) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    }

    isBottomHelpMode() {
        return true;
    }

    isBottomButtonMode() {
        return false;
    }

    isRightInputMode() {
        return true;
    }

    mainCommandWidth() {
        return 240;
    }

    buttonAreaTop() {
        if (this.isBottomButtonMode()) {
            return Graphics.boxHeight - this.buttonAreaHeight();
        } else {
            return 0;
        }
    }

    buttonAreaBottom() {
        return this.buttonAreaTop() + this.buttonAreaHeight();
    }

    buttonAreaHeight() {
        return 52;
    }

    buttonY() {
        const offsetY = Math.floor((this.buttonAreaHeight() - 48) / 2);
        return this.buttonAreaTop() + offsetY;
    }

    calcWindowHeight(numLines: number, selectable: boolean) {
        if (selectable) {
            return Window_Selectable.prototype.fittingHeight(numLines);
        } else {
            return Window_Base.prototype.fittingHeight(numLines);
        }
    }

    requestAutosave() {
        if (this.isAutosaveEnabled()) {
            this.executeAutosave();
        }
    }

    isAutosaveEnabled() {
        return (
            !DataManager.isBattleTest() &&
            !DataManager.isEventTest() &&
            $gameSystem.isAutosaveEnabled() &&
            $gameSystem.isSaveEnabled()
        );
    }

    executeAutosave() {
        $gameSystem.onBeforeSave();
        DataManager.saveGame(0)
            .then(() => this.onAutosaveSuccess())
            .catch(() => this.onAutosaveFailure());
    }

    onAutosaveSuccess() {
        //
    }

    onAutosaveFailure() {
        //
    }
}
