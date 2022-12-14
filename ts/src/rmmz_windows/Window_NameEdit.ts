//-----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.

class Window_NameEdit extends Window_StatusBase {
    protected _actor!: Game_Actor | null;
    protected _maxLength!: number;
    protected _name!: string;
    protected _defaultName!: string;

    initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this._maxLength = 0;
        this._name = "";
        this._index = 0;
        (this._defaultName as any) = 0;
        this.deactivate();
    }

    setup(actor: Game_Actor, maxLength: number) {
        this._actor = actor;
        this._maxLength = maxLength;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._defaultName = this._name;
        ImageManager.loadFace(actor.faceName());
    }

    name() {
        return this._name;
    }

    restoreDefault() {
        this._name = this._defaultName;
        this._index = this._name.length;
        this.refresh();
        return this._name.length > 0;
    }

    add(ch: string) {
        if (this._index < this._maxLength) {
            this._name += ch;
            this._index++;
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    back() {
        if (this._index > 0) {
            this._index--;
            this._name = this._name.slice(0, this._index);
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    faceWidth() {
        return 144;
    }

    charWidth() {
        const text = $gameSystem.isJapanese() ? "\uff21" : "A";
        return this.textWidth(text);
    }

    left() {
        const nameCenter = (this.innerWidth + this.faceWidth()) / 2;
        const nameWidth = (this._maxLength + 1) * this.charWidth();
        return Math.min(nameCenter - nameWidth / 2, this.innerWidth - nameWidth);
    }

    itemRect(index: number) {
        const x = this.left() + index * this.charWidth();
        const y = 54;
        const width = this.charWidth();
        const height = this.lineHeight();
        return new Rectangle(x, y, width, height);
    }

    underlineRect(index: any) {
        const rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    }

    underlineColor() {
        return ColorManager.normalColor();
    }

    drawUnderline(index: number) {
        const rect = this.underlineRect(index);
        const color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    }

    drawChar(index: number) {
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._name[index] || "", rect.x, rect.y);
    }

    refresh() {
        this.contents.clear();
        this.drawActorFace(this._actor!, 0, 0);
        for (let i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (let j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    }
}
