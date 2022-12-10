//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.

type ItemObject = RMMZData.Item | RMMZData.Weapon | RMMZData.Armor;

class Game_Item {
    protected _dataClass!: string;
    protected _itemId!: number;

    constructor(item?: RMMZData.Item);

    constructor(...args: [RMMZData.Item]) {
        this.initialize(...args);
    }

    initialize(item?: RMMZData.Item) {
        this._dataClass = "";
        this._itemId = 0;
        if (item) {
            this.setObject(item);
        }
    }

    isSkill() {
        return this._dataClass === "skill";
    }

    isItem() {
        return this._dataClass === "item";
    }

    isUsableItem() {
        return this.isSkill() || this.isItem();
    }

    isWeapon() {
        return this._dataClass === "weapon";
    }

    isArmor() {
        return this._dataClass === "armor";
    }

    isEquipItem() {
        return this.isWeapon() || this.isArmor();
    }

    isNull() {
        return this._dataClass === "";
    }

    itemId() {
        return this._itemId;
    }

    object(): ItemObject | null {
        if (this.isSkill()) {
            return $dataSkills[this._itemId];
        } else if (this.isItem()) {
            return $dataItems[this._itemId];
        } else if (this.isWeapon()) {
            return $dataWeapons[this._itemId];
        } else if (this.isArmor()) {
            return $dataArmors[this._itemId];
        } else {
            return null;
        }
    }

    setObject(item: ItemObject | null) {
        if (DataManager.isSkill(item)) {
            this._dataClass = "skill";
        } else if (DataManager.isItem(item)) {
            this._dataClass = "item";
        } else if (DataManager.isWeapon(item)) {
            this._dataClass = "weapon";
        } else if (DataManager.isArmor(item)) {
            this._dataClass = "armor";
        } else {
            this._dataClass = "";
        }
        this._itemId = item ? item.id : 0;
    }

    setEquip(isWeapon: boolean, itemId: number) {
        this._dataClass = isWeapon ? "weapon" : "armor";
        this._itemId = itemId;
    }
}
