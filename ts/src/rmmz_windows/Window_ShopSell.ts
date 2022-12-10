//-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.

class Window_ShopSell extends Window_ItemList {
    initialize(rect: Rectangle) {
        Window_ItemList.prototype.initialize.call(this, rect);
    }

    isEnabled(item: ItemObject) {
        return item && item.price > 0;
    }
}
