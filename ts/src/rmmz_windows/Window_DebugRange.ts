//-----------------------------------------------------------------------------
// Window_DebugRange
//
// The window for selecting a block of switches/variables on the debug screen.

class Window_DebugRange extends Window_Selectable {
    static lastTopRow = 0;
    static lastIndex = 0;

    protected _maxSwitches!: number;
    protected _maxVariables!: number;
    protected _editWindow!: Window_DebugEdit;

    initialize(rect: Rectangle) {
        this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);
        this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);
        Window_Selectable.prototype.initialize.call(this, rect);
        this.refresh();
        this.setTopRow(Window_DebugRange.lastTopRow);
        this.select(Window_DebugRange.lastIndex);
        this.activate();
    }

    maxItems() {
        return this._maxSwitches + this._maxVariables;
    }

    update() {
        Window_Selectable.prototype.update.call(this);
        if (this._editWindow) {
            const index = this.index();
            this._editWindow.setMode(this.mode(index));
            this._editWindow.setTopId(this.topId(index));
        }
    }

    mode(index?: number) {
        return this.isSwitchMode(index as any) ? "switch" : "variable";
    }

    topId(index: number) {
        if (this.isSwitchMode(index)) {
            return index * 10 + 1;
        } else {
            return (index - this._maxSwitches) * 10 + 1;
        }
    }

    isSwitchMode(index: number) {
        return index < this._maxSwitches;
    }

    drawItem(index: number) {
        const rect = this.itemLineRect(index);
        const c = this.isSwitchMode(index) ? "S" : "V";
        const start = this.topId(index);
        const end = start + 9;
        const text = c + " [" + start.padZero(4) + "-" + end.padZero(4) + "]";
        this.drawText(text, rect.x, rect.y, rect.width);
    }

    isCancelTriggered() {
        return (
            Window_Selectable.prototype.isCancelTriggered() ||
            Input.isTriggered("debug")
        );
    }

    processCancel() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_DebugRange.lastTopRow = this.topRow();
        Window_DebugRange.lastIndex = this.index();
    }

    setEditWindow(editWindow: Window_DebugEdit) {
        this._editWindow = editWindow;
    }
}
