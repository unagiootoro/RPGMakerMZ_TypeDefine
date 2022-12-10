//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

class Sprite_Damage extends Sprite {
    protected _duration!: number;
    protected _flashColor!: number[];
    protected _flashDuration!: number;
    protected _colorType!: number;

    initialize() {
        Sprite.prototype.initialize.call(this);
        this._duration = 90;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._colorType = 0;
    }

    destroy(options?: any) {
        for (const child of this.children as { bitmap?: Bitmap }[]) {
            if (child.bitmap) {
                child.bitmap.destroy();
            }
        }
        Sprite.prototype.destroy.call(this, options);
    }

    setup(target: Game_Battler) {
        const result = target.result();
        if (result.missed || result.evaded) {
            this._colorType = 0;
            this.createMiss();
        } else if (result.hpAffected) {
            this._colorType = result.hpDamage >= 0 ? 0 : 1;
            this.createDigits(result.hpDamage);
        } else if (target.isAlive() && result.mpDamage !== 0) {
            this._colorType = result.mpDamage >= 0 ? 2 : 3;
            this.createDigits(result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    }

    setupCriticalEffect() {
        this._flashColor = [255, 0, 0, 160];
        this._flashDuration = 60;
    }

    fontFace() {
        return $gameSystem.numberFontFace();
    }

    fontSize() {
        return $gameSystem.mainFontSize() + 4;
    }

    damageColor() {
        return ColorManager.damageColor(this._colorType);
    }

    outlineColor() {
        return "rgba(0, 0, 0, 0.7)";
    }

    outlineWidth() {
        return 4;
    }

    createMiss() {
        const h = this.fontSize();
        const w = Math.floor(h * 3.0);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText("Miss", 0, 0, w, h, "center");
        sprite.dy = 0;
    }

    createDigits(value: number) {
        const string = Math.abs(value).toString();
        const h = this.fontSize();
        const w = Math.floor(h * 0.75);
        for (let i = 0; i < string.length; i++) {
            const sprite = this.createChildSprite(w, h);
            sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite.dy = -i;
        }
    }

    createChildSprite(width: number, height: number): IDamageSprite {
        const sprite: IDamageSprite = new Sprite() as IDamageSprite;
        sprite.bitmap = this.createBitmap(width, height);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        this.addChild(sprite);
        return sprite;
    }

    createBitmap(width: number, height: number) {
        const bitmap = new Bitmap(width, height);
        bitmap.fontFace = this.fontFace();
        bitmap.fontSize = this.fontSize();
        bitmap.textColor = this.damageColor();
        bitmap.outlineColor = this.outlineColor();
        bitmap.outlineWidth = this.outlineWidth();
        return bitmap;
    }

    update() {
        Sprite.prototype.update.call(this);
        if (this._duration > 0) {
            this._duration--;
            for (const child of this.children as IDamageSprite[]) {
                this.updateChild(child);
            }
        }
        this.updateFlash();
        this.updateOpacity();
    }

    updateChild(sprite: IDamageSprite) {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    }

    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    }

    updateOpacity() {
        if (this._duration < 10) {
            this.opacity = (255 * this._duration) / 10;
        }
    }

    isPlaying() {
        return this._duration > 0;
    }
}

interface IDamageSprite extends Sprite {
    dy: number;
    ry: number;
}
