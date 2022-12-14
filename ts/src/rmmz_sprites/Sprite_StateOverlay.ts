//-----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.

class Sprite_StateOverlay extends Sprite {
    protected _battler!: Game_Battler | null;
    protected _overlayIndex!: number;
    protected _animationCount!: number;
    protected _pattern!: number;

    initialize() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.loadBitmap();
    }

    initMembers() {
        this._battler = null;
        this._overlayIndex = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }

    loadBitmap() {
        this.bitmap = ImageManager.loadSystem("States");
        this.setFrame(0, 0, 0, 0);
    }

    setup(battler: Game_Battler) {
        this._battler = battler;
    }

    update() {
        Sprite.prototype.update.call(this);
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    animationWait() {
        return 8;
    }

    updatePattern() {
        this._pattern++;
        this._pattern %= 8;
        if (this._battler) {
            this._overlayIndex = this._battler.stateOverlayIndex();
        } else {
            this._overlayIndex = 0;
        }
    }

    updateFrame() {
        if (this._overlayIndex > 0) {
            const w = 96;
            const h = 96;
            const sx = this._pattern * w;
            const sy = (this._overlayIndex - 1) * h;
            this.setFrame(sx, sy, w, h);
        } else {
            this.setFrame(0, 0, 0, 0);
        }
    }
}
