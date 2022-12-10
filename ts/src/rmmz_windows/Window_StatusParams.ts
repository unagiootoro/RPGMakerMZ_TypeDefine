//-----------------------------------------------------------------------------
// Window_StatusParams
//
// The window for displaying parameters on the status screen.

class Window_StatusParams extends Window_StatusBase {
    protected _actor!: Game_Actor | null;

    initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
    }

    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    maxItems() {
        return 6;
    }

    itemHeight() {
        return this.lineHeight();
    }

    drawItem(index: number) {
        const rect = this.itemLineRect(index);
        const paramId = index + 2;
        const name = TextManager.param(paramId);
        const value = this._actor!.param(paramId);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, rect.x, rect.y, 160);
        this.resetTextColor();
        this.drawText(value, rect.x + 160, rect.y, 60, "right");
    }

    drawItemBackground(/*index*/) {
        //
    }
}
