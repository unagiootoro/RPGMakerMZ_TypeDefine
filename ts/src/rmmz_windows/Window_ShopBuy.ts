//-----------------------------------------------------------------------------
// Window_ShopBuy
//
// The window for selecting an item to buy on the shop screen.

class Window_ShopBuy extends Window_Selectable {
    protected _money!: number;
    protected _shopGoods!: number[][];
    protected _data!: ItemObject[];
    protected _price!: number[];
    protected _statusWindow!: Window_ShopStatus;

    initialize(rect: Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._money = 0;
    }

    setupGoods(shopGoods: number[][]) {
        this._shopGoods = shopGoods;
        this.refresh();
        this.select(0);
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

    setMoney(money: number) {
        this._money = money;
        this.refresh();
    }

    isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }

    price(item: ItemObject | null) {
        return this._price[this._data.indexOf(item as any)] || 0;
    }

    isEnabled(item: ItemObject | null): boolean | null {
        return (
            item && this.price(item) <= this._money && !$gameParty.hasMaxItems(item)
        );
    }

    refresh() {
        this.makeItemList();
        Window_Selectable.prototype.refresh.call(this);
    }

    makeItemList() {
        this._data = [];
        this._price = [];
        for (const goods of this._shopGoods) {
            const item = this.goodsToItem(goods);
            if (item) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
        }
    }

    goodsToItem(goods: number[]) {
        switch (goods[0]) {
            case 0:
                return $dataItems[goods[1]];
            case 1:
                return $dataWeapons[goods[1]];
            case 2:
                return $dataArmors[goods[1]];
            default:
                return null;
        }
    }

    drawItem(index: number) {
        const item = this.itemAt(index);
        const price = this.price(item);
        const rect = this.itemLineRect(index);
        const priceWidth = this.priceWidth();
        const priceX = rect.x + rect.width - priceWidth;
        const nameWidth = rect.width - priceWidth;
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, nameWidth);
        this.drawText(price, priceX, rect.y, priceWidth, "right");
        this.changePaintOpacity(true);
    }

    priceWidth() {
        return 96;
    }

    setStatusWindow(statusWindow: Window_ShopStatus) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    updateHelp() {
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item()!);
        }
    }
}
