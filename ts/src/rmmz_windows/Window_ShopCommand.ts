//-----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.

class Window_ShopCommand extends Window_HorzCommand {
    private _purchaseOnly!: boolean;

    initialize(rect: Rectangle) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    }

    setPurchaseOnly(purchaseOnly: boolean) {
        this._purchaseOnly = purchaseOnly;
        this.refresh();
    }

    maxCols() {
        return 3;
    }

    makeCommandList() {
        this.addCommand(TextManager.buy, "buy");
        this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
        this.addCommand(TextManager.cancel, "cancel");
    }
}
