//-----------------------------------------------------------------------------
// Window_EquipStatus
//
// The window for displaying parameter changes on the equipment screen.

class Window_EquipStatus extends Window_StatusBase {
    protected _actor!: Game_Actor | null;
    protected _tempActor!: Game_Actor | null;

    initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this._tempActor = null;
        this.refresh();
    }

    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    colSpacing() {
        return 0;
    }

    refresh() {
        this.contents.clear();
        if (this._actor) {
            const nameRect = this.itemLineRect(0);
            this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
            this.drawActorFace(this._actor, nameRect.x, nameRect.height);
            this.drawAllParams();
        }
    }

    setTempActor(tempActor: Game_Actor | null) {
        if (this._tempActor !== tempActor) {
            this._tempActor = tempActor;
            this.refresh();
        }
    }

    drawAllParams() {
        for (let i = 0; i < 6; i++) {
            const x = this.itemPadding();
            const y = this.paramY(i);
            this.drawItem(x, y, 2 + i);
        }
    }

    drawItem(x: number, y: number, paramId: number) {
        const paramX = this.paramX();
        const paramWidth = this.paramWidth();
        const rightArrowWidth = this.rightArrowWidth();
        this.drawParamName(x, y, paramId);
        if (this._actor) {
            this.drawCurrentParam(paramX, y, paramId);
        }
        this.drawRightArrow(paramX + paramWidth, y);
        if (this._tempActor) {
            this.drawNewParam(paramX + paramWidth + rightArrowWidth, y, paramId);
        }
    }

    drawParamName(x: number, y: number, paramId: number) {
        const width = this.paramX() - this.itemPadding() * 2;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.param(paramId), x, y, width);
    }

    drawCurrentParam(x: number, y: number, paramId: number) {
        const paramWidth = this.paramWidth();
        this.resetTextColor();
        this.drawText(this._actor!.param(paramId), x, y, paramWidth, "right");
    }

    drawRightArrow(x: number, y: number) {
        const rightArrowWidth = this.rightArrowWidth();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("\u2192", x, y, rightArrowWidth, "center");
    }

    drawNewParam(x: number, y: number, paramId: number) {
        const paramWidth = this.paramWidth();
        const newValue = this._tempActor!.param(paramId);
        const diffvalue = newValue - this._actor!.param(paramId);
        this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, paramWidth, "right");
    }

    rightArrowWidth() {
        return 32;
    }

    paramWidth() {
        return 48;
    }

    paramX() {
        const itemPadding = this.itemPadding();
        const rightArrowWidth = this.rightArrowWidth();
        const paramWidth = this.paramWidth();
        return this.innerWidth - itemPadding - paramWidth * 2 - rightArrowWidth;
    }

    paramY(index: number) {
        const faceHeight = ImageManager.faceHeight;
        return faceHeight + Math.floor(this.lineHeight() * (index + 1.5));
    }
}
