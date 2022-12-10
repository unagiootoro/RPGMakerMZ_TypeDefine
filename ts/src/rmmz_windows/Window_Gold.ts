//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.

class Window_Gold extends Window_Selectable {
    initialize(rect: Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
    }

    colSpacing() {
        return 0;
    }

    refresh() {
        const rect = this.itemLineRect(0);
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
    }

    value() {
        return $gameParty.gold();
    }

    currencyUnit() {
        return TextManager.currencyUnit;
    }

    open() {
        this.refresh();
        Window_Selectable.prototype.open.call(this);
    }
}
