//-----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.

class Window_BattleStatus extends Window_StatusBase {
    protected _bitmapsReady!: number;

    initialize(rect: Rectangle) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this.frameVisible = false;
        this.openness = 0;
        this._bitmapsReady = 0;
        this.preparePartyRefresh();
    }

    extraHeight() {
        return 10;
    }

    maxCols() {
        return 4;
    }

    itemHeight() {
        return this.innerHeight;
    }

    maxItems() {
        return $gameParty.battleMembers().length;
    }

    rowSpacing() {
        return 0;
    }

    updatePadding() {
        this.padding = 8;
    }

    actor(index: number) {
        return $gameParty.battleMembers()[index];
    }

    selectActor(actor: Game_Actor | null) {
        const members = $gameParty.battleMembers();
        this.select(members.indexOf(actor));
    }

    update() {
        Window_StatusBase.prototype.update.call(this);
        if ($gameTemp.isBattleRefreshRequested()) {
            this.preparePartyRefresh();
        }
    }

    preparePartyRefresh() {
        $gameTemp.clearBattleRefreshRequest();
        this._bitmapsReady = 0;
        for (const actor of $gameParty.members()) {
            const bitmap = ImageManager.loadFace(actor.faceName());
            bitmap.addLoadListener(this.performPartyRefresh.bind(this));
        }
    }

    performPartyRefresh() {
        this._bitmapsReady++;
        if (this._bitmapsReady >= $gameParty.members().length) {
            this.refresh();
        }
    }

    drawItem(index: number) {
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }

    drawItemImage(index: number) {
        const actor = this.actor(index);
        const rect = this.faceRect(index);
        this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
    }

    drawItemStatus(index: number) {
        const actor = this.actor(index);
        const rect = this.itemRectWithPadding(index);
        const nameX = this.nameX(rect);
        const nameY = this.nameY(rect);
        const stateIconX = this.stateIconX(rect);
        const stateIconY = this.stateIconY(rect);
        const basicGaugesX = this.basicGaugesX(rect);
        const basicGaugesY = this.basicGaugesY(rect);
        this.placeTimeGauge(actor, nameX, nameY);
        this.placeActorName(actor, nameX, nameY);
        this.placeStateIcon(actor, stateIconX, stateIconY);
        this.placeBasicGauges(actor, basicGaugesX, basicGaugesY);
    }

    faceRect(index: number) {
        const rect = this.itemRect(index);
        rect.pad(-1);
        rect.height = this.nameY(rect) + this.gaugeLineHeight() / 2 - rect.y;
        return rect;
    }

    nameX(rect: Rectangle) {
        return rect.x;
    }

    nameY(rect: Rectangle) {
        return this.basicGaugesY(rect) - this.gaugeLineHeight();
    }

    stateIconX(rect: Rectangle) {
        return rect.x + rect.width - ImageManager.iconWidth / 2 + 4;
    }

    stateIconY(rect: Rectangle) {
        return rect.y + ImageManager.iconHeight / 2 + 4;
    }

    basicGaugesX(rect: Rectangle) {
        return rect.x;
    }

    basicGaugesY(rect: Rectangle) {
        const bottom = rect.y + rect.height - this.extraHeight();
        const numGauges = $dataSystem.optDisplayTp ? 3 : 2;
        return bottom - this.gaugeLineHeight() * numGauges;
    }
}
