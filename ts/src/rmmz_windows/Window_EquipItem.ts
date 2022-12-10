//-----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.

class Window_EquipItem extends Window_ItemList {
    protected _actor!: Game_Actor | null;
    protected _slotId!: number;
    protected _statusWindow!: Window_EquipStatus;

    initialize(rect: Rectangle) {
        Window_ItemList.prototype.initialize.call(this, rect);
        this._actor = null;
        this._slotId = 0;
    }

    maxCols() {
        return 1;
    }

    colSpacing() {
        return 8;
    }

    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    setSlotId(slotId: number) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    includes(item: RMMZData.Weapon | RMMZData.Armor | null) {
        if (item === null) {
            return true;
        }
        return (
            this._actor &&
            this._actor.canEquip(item) &&
            item.etypeId === this.etypeId()
        );
    }

    etypeId() {
        if (this._actor && this._slotId >= 0) {
            return this._actor.equipSlots()[this._slotId];
        } else {
            return 0;
        }
    }

    isEnabled(/*item*/) {
        return true;
    }

    selectLast() {
        //
    }

    setStatusWindow(statusWindow: Window_EquipStatus) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    updateHelp() {
        Window_ItemList.prototype.updateHelp.call(this);
        if (this._actor && this._statusWindow && this._slotId >= 0) {
            const actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
    }

    playOkSound() {
        //
    }
}
