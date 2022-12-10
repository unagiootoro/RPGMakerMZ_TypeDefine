//-----------------------------------------------------------------------------
// Window_StatusEquip
//
// The window for displaying equipment items on the status screen.

class Window_StatusEquip extends Window_StatusBase {
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
        return this._actor ? this._actor.equipSlots().length : 0;
    }

    itemHeight() {
        return this.lineHeight();
    }

    drawItem(index: number) {
        const rect = this.itemLineRect(index);
        const equips = this._actor!.equips();
        const item = equips[index];
        const slotName = this.actorSlotName(this._actor!, index);
        const sw = 138;
        this.changeTextColor(ColorManager.systemColor());
        // @ts-ignore
        this.drawText(slotName, rect.x, rect.y, sw, rect!.height);
        this.drawItemName(item!, rect.x + sw, rect.y, rect.width - sw);
    }

    drawItemBackground(/*index*/) {
        //
    }
}
