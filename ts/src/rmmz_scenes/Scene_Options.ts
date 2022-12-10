//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

class Scene_Options extends Scene_MenuBase {
    protected _optionsWindow!: Window_Options;

    initialize() {
        Scene_MenuBase.prototype.initialize.call(this);
    }

    create() {
        Scene_MenuBase.prototype.create.call(this);
        this.createOptionsWindow();
    }

    terminate() {
        Scene_MenuBase.prototype.terminate.call(this);
        ConfigManager.save();
    }

    createOptionsWindow() {
        const rect = this.optionsWindowRect();
        this._optionsWindow = new Window_Options(rect);
        this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    }

    optionsWindowRect() {
        const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
        const ww = 400;
        const wh = this.calcWindowHeight(n, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new Rectangle(wx, wy, ww, wh);
    }

    maxCommands() {
        // Increase this value when adding option items.
        return 7;
    }

    maxVisibleCommands() {
        return 12;
    }
}
