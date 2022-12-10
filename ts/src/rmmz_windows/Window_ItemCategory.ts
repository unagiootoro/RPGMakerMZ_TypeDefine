//-----------------------------------------------------------------------------
// Window_ItemCategory
//
// The window for selecting a category of items on the item and shop screens.

class Window_ItemCategory extends Window_HorzCommand {
    protected _itemWindow!: Window_ItemList;

    initialize(rect: Rectangle) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    }

    maxCols() {
        return 4;
    }

    update() {
        Window_HorzCommand.prototype.update.call(this);
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    }

    makeCommandList() {
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item");
        }
        if (this.needsCommand("weapon")) {
            this.addCommand(TextManager.weapon, "weapon");
        }
        if (this.needsCommand("armor")) {
            this.addCommand(TextManager.armor, "armor");
        }
        if (this.needsCommand("keyItem")) {
            this.addCommand(TextManager.keyItem, "keyItem");
        }
    }

    needsCommand(name: string) {
        const table = ["item", "weapon", "armor", "keyItem"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return $dataSystem.itemCategories[index];
        }
        return true;
    }

    setItemWindow(itemWindow: Window_ItemList) {
        this._itemWindow = itemWindow;
    }

    needsSelection() {
        return this.maxItems() >= 2;
    }
}
