//-----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.

class Window_EquipSlot extends Window_StatusBase {
    protected _actor!: Game_Actor | null;
    protected _itemWindow!: Window_EquipItem;
    protected _statusWindow!: Window_EquipStatus;

    initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._actor = null;
        this.refresh();
    }

    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    update() {
        Window_StatusBase.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    }

    maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    }

    item() {
        return this.itemAt(this.index());
    }

    itemAt(index: number) {
        return this._actor ? this._actor.equips()[index] : null;
    }

    drawItem(index: number) {
        if (this._actor) {
            const slotName = this.actorSlotName(this._actor, index);
            const item = this.itemAt(index);
            const slotNameWidth = this.slotNameWidth();
            const rect = this.itemLineRect(index);
            const itemWidth = rect.width - slotNameWidth;
            this.changeTextColor(ColorManager.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            // @ts-ignore
            this.drawText(slotName, rect.x, rect.y, slotNameWidth, rect.height);
            this.drawItemName(item, rect.x + slotNameWidth, rect.y, itemWidth);
            this.changePaintOpacity(true);
        }
    }

    slotNameWidth() {
        return 138;
    }

    isEnabled(index: number) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    }

    isCurrentItemEnabled() {
        return this.isEnabled(this.index());
    }

    setStatusWindow(statusWindow: Window_EquipStatus) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    setItemWindow(itemWindow: Window_EquipItem) {
        this._itemWindow = itemWindow;
    }

    updateHelp() {
        Window_StatusBase.prototype.updateHelp.call(this);
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setTempActor(null);
        }
    }
}
