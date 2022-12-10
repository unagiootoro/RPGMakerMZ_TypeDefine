//-----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.

class Window_MenuActor extends Window_MenuStatus {
    initialize(rect: Rectangle) {
        Window_MenuStatus.prototype.initialize.call(this, rect);
        this.hide();
    }

    processOk() {
        if (!this.cursorAll()) {
            $gameParty.setTargetActor($gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    }

    selectLast() {
        this.forceSelect($gameParty.targetActor()!.index() || 0);
    }

    selectForItem(item: RMMZData.Item) {
        const actor = $gameParty.menuActor()!;
        const action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.forceSelect(actor.index());
            } else {
                this.selectLast();
            }
        } else if (action.isForAll()) {
            this.setCursorAll(true);
            this.forceSelect(0);
        } else {
            this.selectLast();
        }
    }
}
