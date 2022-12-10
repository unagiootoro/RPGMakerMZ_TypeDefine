//-----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.

class Sprite_Destination extends Sprite {
    protected _frameCount!: number;

    initialize() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this._frameCount = 0;
    }

    destroy(options?: any) {
        if (this.bitmap) {
            this.bitmap.destroy();
        }
        Sprite.prototype.destroy.call(this, options);
    }

    update() {
        Sprite.prototype.update.call(this);
        if ($gameTemp.isDestinationValid()) {
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        } else {
            this._frameCount = 0;
            this.visible = false;
        }
    }

    createBitmap() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.bitmap.fillAll("white");
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = 1;
    }

    updatePosition() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const x = $gameTemp.destinationX()!;
        const y = $gameTemp.destinationY()!;
        this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
        this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
    }

    updateAnimation() {
        this._frameCount++;
        this._frameCount %= 20;
        this.opacity = (20 - this._frameCount) * 6;
        this.scale.x = 1 + this._frameCount / 20;
        this.scale.y = this.scale.x;
    }
}
