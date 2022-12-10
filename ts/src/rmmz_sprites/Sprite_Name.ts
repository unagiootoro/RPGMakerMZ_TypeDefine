//-----------------------------------------------------------------------------
// Sprite_Name
//
// The sprite for displaying a status gauge.

class Sprite_Name extends Sprite {
    protected _battler!: Game_Battler | null;
    protected _name!: string;
    protected _textColor!: string;

    initialize() {
        Sprite.prototype.initialize.call(this);
        this.initMembers();
        this.createBitmap();
    }

    initMembers() {
        this._battler = null;
        this._name = "";
        this._textColor = "";
    }

    destroy(options: any) {
        this.bitmap.destroy();
        Sprite.prototype.destroy.call(this, options);
    }

    createBitmap() {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    }

    bitmapWidth() {
        return 128;
    }

    bitmapHeight() {
        return 24;
    }

    fontFace() {
        return $gameSystem.mainFontFace();
    }

    fontSize() {
        return $gameSystem.mainFontSize();
    }

    setup(battler: Game_Battler) {
        this._battler = battler;
        this.updateBitmap();
    }

    update() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
    }

    updateBitmap() {
        const name = this.name();
        const color = this.textColor();
        if (name !== this._name || color !== this._textColor) {
            this._name = name;
            this._textColor = color;
            this.redraw();
        }
    }

    name() {
        return this._battler ? this._battler.name() : "";
    }

    textColor() {
        return ColorManager.hpColor(this._battler);
    }

    outlineColor() {
        return ColorManager.outlineColor();
    }

    outlineWidth() {
        return 3;
    }

    redraw() {
        const name = this.name();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupFont();
        this.bitmap.clear();
        this.bitmap.drawText(name, 0, 0, width, height, "left");
    }

    setupFont() {
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        this.bitmap.textColor = this.textColor();
        this.bitmap.outlineColor = this.outlineColor();
        this.bitmap.outlineWidth = this.outlineWidth();
    }
}
