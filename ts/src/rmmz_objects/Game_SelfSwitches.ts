//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.

class Game_SelfSwitches {
    protected _data: any;

    constructor(...args: any[]) {
        this.initialize(...args as []);
    }

    initialize() {
        this.clear();
    }

    clear() {
        this._data = {};
    }

    value(key: [number, number, string]) {
        return !!this._data[key as any];
    }

    setValue(key: [number, number, string], value: boolean) {
        if (value) {
            this._data[key as any] = true;
        } else {
            delete this._data[key as any];
        }
        this.onChange();
    }

    onChange() {
        $gameMap.requestRefresh();
    }
}
