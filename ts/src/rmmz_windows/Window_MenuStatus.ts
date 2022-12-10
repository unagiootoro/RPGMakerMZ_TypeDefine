//-----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.

class Window_MenuStatus extends Window_StatusBase {
    protected _formationMode!: boolean;
    protected _pendingIndex!: number;

    initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._formationMode = false;
        this._pendingIndex = -1;
        this.refresh();
    }

    maxItems() {
        return $gameParty.size();
    }

    numVisibleRows() {
        return 4;
    }

    itemHeight() {
        return Math.floor(this.innerHeight / this.numVisibleRows());
    }

    actor(index: number) {
        return $gameParty.members()[index];
    }

    drawItem(index: number) {
        this.drawPendingItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }

    drawPendingItemBackground(index: number) {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = ColorManager.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    }

    drawItemImage(index: number) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const width = ImageManager.faceWidth;
        const height = rect.height - 2;
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
        this.changePaintOpacity(true);
    }

    drawItemStatus(index: number) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x + 180;
        const y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
        this.drawActorSimpleStatus(actor, x, y);
    }

    processOk() {
        Window_StatusBase.prototype.processOk.call(this);
        const actor = this.actor(this.index());
        $gameParty.setMenuActor(actor);
    }

    isCurrentItemEnabled() {
        if (this._formationMode) {
            const actor = this.actor(this.index());
            return actor && actor.isFormationChangeOk();
        } else {
            return true;
        }
    }

    selectLast() {
        this.smoothSelect($gameParty.menuActor()!.index() || 0);
    }

    formationMode() {
        return this._formationMode;
    }

    setFormationMode(formationMode: boolean) {
        this._formationMode = formationMode;
    }

    pendingIndex() {
        return this._pendingIndex;
    }

    setPendingIndex(index: number) {
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    }
}
