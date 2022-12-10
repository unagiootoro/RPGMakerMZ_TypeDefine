//-----------------------------------------------------------------------------
// Window_ScrollText
//
// The window for displaying scrolling text. No frame is displayed, but it
// is handled as a window for convenience.

class Window_ScrollText extends Window_Base {
    protected _reservedRect!: Rectangle;
    protected _text!: string | null;
    protected _allTextHeight!: number;

    initialize(rect: Rectangle) {
        Window_Base.prototype.initialize.call(this, new Rectangle());
        this.opacity = 0;
        this.hide();
        this._reservedRect = rect;
        this._text = "";
        this._allTextHeight = 0;
    }

    update() {
        Window_Base.prototype.update.call(this);
        if ($gameMessage.scrollMode()) {
            if (this._text) {
                this.updateMessage();
            }
            if (!this._text && $gameMessage.hasText()) {
                this.startMessage();
            }
        }
    }

    startMessage() {
        this._text = $gameMessage.allText();
        if (this._text) {
            this.updatePlacement();
            this.refresh();
            this.show();
        } else {
            $gameMessage.clear();
        }
    }

    refresh() {
        this._allTextHeight = this.textSizeEx(this._text).height;
        this.createContents();
        this.origin.y = -this.height;
        const rect = this.baseTextRect();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    }

    updatePlacement() {
        const rect = this._reservedRect;
        this.move(rect.x, rect.y, rect.width, rect.height);
    }

    contentsHeight() {
        return Math.max(this._allTextHeight, 1);
    }

    updateMessage() {
        this.origin.y += this.scrollSpeed();
        if (this.origin.y >= this.contents.height) {
            this.terminateMessage();
        }
    }

    scrollSpeed() {
        let speed = $gameMessage.scrollSpeed() / 2;
        if (this.isFastForward()) {
            speed *= this.fastForwardRate();
        }
        return speed;
    }

    isFastForward() {
        if ($gameMessage.scrollNoFast()) {
            return false;
        } else {
            return (
                Input.isPressed("ok") ||
                Input.isPressed("shift") ||
                TouchInput.isPressed()
            );
        }
    }

    fastForwardRate() {
        return 3;
    }

    terminateMessage() {
        this._text = null;
        $gameMessage.clear();
        this.hide();
    }
}
