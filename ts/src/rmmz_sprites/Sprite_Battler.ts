//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

class Sprite_Battler extends Sprite_Clickable {
    protected _battler!: Game_Battler | null;
    protected _damages!: Sprite_Damage[];
    protected _homeX!: number;
    protected _homeY!: number;
    protected _offsetX!: number;
    protected _offsetY!: number;
    protected _targetOffsetX!: number;
    protected _targetOffsetY!: number;
    protected _movementDuration!: number;
    protected _selectionEffectCount!: number;

    initialize(battler: Game_Battler) {
        Sprite_Clickable.prototype.initialize.call(this);
        this.initMembers();
        this.setBattler(battler);
    }

    initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this._battler = null;
        this._damages = [];
        this._homeX = 0;
        this._homeY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._targetOffsetX = NaN;
        this._targetOffsetY = NaN;
        this._movementDuration = 0;
        this._selectionEffectCount = 0;
    }

    setBattler(battler: Game_Battler) {
        this._battler = battler;
    }

    checkBattler(battler: Game_Battler) {
        return this._battler === battler;
    }

    mainSprite(): Sprite {
        return this;
    }

    setHome(x: number, y: number) {
        this._homeX = x;
        this._homeY = y;
        this.updatePosition();
    }

    update() {
        Sprite_Clickable.prototype.update.call(this);
        if (this._battler) {
            this.updateMain();
            this.updateDamagePopup();
            this.updateSelectionEffect();
            this.updateVisibility();
        } else {
            this.bitmap = null;
        }
    }

    updateVisibility() {
        Sprite_Clickable.prototype.updateVisibility.call(this);
        if (!this._battler || !this._battler.isSpriteVisible()) {
            this.visible = false;
        }
    }

    updateMain() {
        if (this._battler!.isSpriteVisible()) {
            this.updateBitmap();
            this.updateFrame();
        }
        this.updateMove();
        this.updatePosition();
    }

    updateBitmap() {
        //
    }

    updateFrame() {
        //
    }

    updateMove() {
        if (this._movementDuration > 0) {
            const d = this._movementDuration;
            this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
            this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
            this._movementDuration--;
            if (this._movementDuration === 0) {
                this.onMoveEnd();
            }
        }
    }

    updatePosition() {
        this.x = this._homeX + this._offsetX;
        this.y = this._homeY + this._offsetY;
    }

    updateDamagePopup() {
        this.setupDamagePopup();
        if (this._damages.length > 0) {
            for (const damage of this._damages) {
                damage.update();
            }
            if (!this._damages[0].isPlaying()) {
                this.destroyDamageSprite(this._damages[0]);
            }
        }
    }

    updateSelectionEffect() {
        const target = this.mainSprite();
        if (this._battler!.isSelected()) {
            this._selectionEffectCount++;
            if (this._selectionEffectCount % 30 < 15) {
                target.setBlendColor([255, 255, 255, 64]);
            } else {
                target.setBlendColor([0, 0, 0, 0]);
            }
        } else if (this._selectionEffectCount > 0) {
            this._selectionEffectCount = 0;
            target.setBlendColor([0, 0, 0, 0]);
        }
    }

    setupDamagePopup() {
        if (this._battler!.isDamagePopupRequested()) {
            if (this._battler!.isSpriteVisible()) {
                this.createDamageSprite();
            }
            this._battler!.clearDamagePopup();
            this._battler!.clearResult();
        }
    }

    createDamageSprite() {
        const last = this._damages[this._damages.length - 1];
        const sprite = new Sprite_Damage();
        if (last) {
            sprite.x = last.x + 8;
            sprite.y = last.y - 16;
        } else {
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
        }
        sprite.setup(this._battler!);
        this._damages.push(sprite);
        (this.parent as any).addChild(sprite);
    }

    destroyDamageSprite(sprite: Sprite_Damage) {
        this.parent.removeChild(sprite as any);
        this._damages.remove(sprite);
        sprite.destroy();
    }

    damageOffsetX() {
        return 0;
    }

    damageOffsetY() {
        return 0;
    }

    startMove(x: number, y: number, duration: number) {
        if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
            this._targetOffsetX = x;
            this._targetOffsetY = y;
            this._movementDuration = duration;
            if (duration === 0) {
                this._offsetX = x;
                this._offsetY = y;
            }
        }
    }

    onMoveEnd() {
        //
    }

    isEffecting() {
        return false;
    }

    isMoving() {
        return this._movementDuration > 0;
    }

    inHomePosition() {
        return this._offsetX === 0 && this._offsetY === 0;
    }

    onMouseEnter() {
        $gameTemp.setTouchState(this._battler, "select");
    }

    onPress() {
        $gameTemp.setTouchState(this._battler, "select");
    }

    onClick() {
        $gameTemp.setTouchState(this._battler, "click");
    }
}
