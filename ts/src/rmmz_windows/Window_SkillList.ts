//-----------------------------------------------------------------------------
// Window_SkillList
//
// The window for selecting a skill on the skill screen.

class Window_SkillList extends Window_Selectable {
    protected _actor!: Game_Actor | null;
    protected _stypeId!: number;
    protected _data!: RMMZData.Item[];

    initialize(rect: Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._actor = null;
        this._stypeId = 0;
        this._data = [];
    }

    setActor(actor: Game_Actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    setStypeId(stypeId: number) {
        if (this._stypeId !== stypeId) {
            this._stypeId = stypeId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    maxCols() {
        return 2;
    }

    colSpacing() {
        return 16;
    }

    maxItems() {
        return this._data ? this._data.length : 1;
    }

    item() {
        return this.itemAt(this.index());
    }

    itemAt(index: number) {
        return this._data && index >= 0 ? this._data[index] : null;
    }

    isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }

    includes(item: RMMZData.Item) {
        return item && item.stypeId === this._stypeId;
    }

    isEnabled(item: RMMZData.Item): boolean {
        return (this._actor as unknown as boolean) && this._actor!.canUse(item);
    }

    makeItemList() {
        if (this._actor) {
            this._data = this._actor.skills().filter(item => this.includes(item));
        } else {
            this._data = [];
        }
    }

    selectLast() {
        const index = this._data.indexOf(this._actor!.lastSkill());
        this.forceSelect(index >= 0 ? index : 0);
    }

    drawItem(index: number) {
        const skill = this.itemAt(index);
        if (skill) {
            const costWidth = this.costWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }

    costWidth() {
        return this.textWidth("000");
    }

    drawSkillCost(skill: RMMZData.Item, x: number, y: number, width: number) {
        if (this._actor!.skillTpCost(skill) > 0) {
            this.changeTextColor(ColorManager.tpCostColor());
            this.drawText(this._actor!.skillTpCost(skill), x, y, width, "right");
        } else if (this._actor!.skillMpCost(skill) > 0) {
            this.changeTextColor(ColorManager.mpCostColor());
            this.drawText(this._actor!.skillMpCost(skill), x, y, width, "right");
        }
    }

    updateHelp() {
        this.setHelpWindowItem(this.item());
    }

    refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    }
}
