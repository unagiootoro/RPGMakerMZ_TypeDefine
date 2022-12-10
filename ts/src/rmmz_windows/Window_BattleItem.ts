//-----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.

class Window_BattleItem extends Window_ItemList {
    initialize(rect: Rectangle) {
        Window_ItemList.prototype.initialize.call(this, rect);
        this.hide();
    }

    includes(item: RMMZData.Item) {
        return $gameParty.canUse(item);
    }

    show() {
        this.selectLast();
        this.showHelpWindow();
        Window_ItemList.prototype.show.call(this);
    }

    hide() {
        this.hideHelpWindow();
        Window_ItemList.prototype.hide.call(this);
    }
}
