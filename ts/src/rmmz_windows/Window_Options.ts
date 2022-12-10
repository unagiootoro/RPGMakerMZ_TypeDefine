//-----------------------------------------------------------------------------
// Window_Options
//
// The window for changing various settings on the options screen.

class Window_Options extends Window_Command {
    initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
    }

    makeCommandList() {
        this.addGeneralOptions();
        this.addVolumeOptions();
    }

    addGeneralOptions() {
        this.addCommand(TextManager.alwaysDash, "alwaysDash");
        this.addCommand(TextManager.commandRemember, "commandRemember");
        this.addCommand(TextManager.touchUI, "touchUI");
    }

    addVolumeOptions() {
        this.addCommand(TextManager.bgmVolume, "bgmVolume");
        this.addCommand(TextManager.bgsVolume, "bgsVolume");
        this.addCommand(TextManager.meVolume, "meVolume");
        this.addCommand(TextManager.seVolume, "seVolume");
    }

    drawItem(index: number) {
        const title = this.commandName(index);
        const status = this.statusText(index);
        const rect = this.itemLineRect(index);
        const statusWidth = this.statusWidth();
        const titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(title, rect.x, rect.y, titleWidth, "left");
        this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
    }

    statusWidth() {
        return 120;
    }

    statusText(index: number) {
        const symbol = this.commandSymbol(index) as keyof ConfigManager;
        const value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else {
            return this.booleanStatusText(value);
        }
    }

    isVolumeSymbol(symbol: string) {
        return symbol.includes("Volume");
    }

    booleanStatusText(value: any) {
        return value ? "ON" : "OFF";
    }

    volumeStatusText(value: any) {
        return value + "%";
    }

    processOk() {
        const index = this.index();
        const symbol = this.commandSymbol(index) as keyof ConfigManager;
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, true);
        } else {
            this.changeValue(symbol, !this.getConfigValue(symbol));
        }
    }

    cursorRight() {
        const index = this.index();
        const symbol = this.commandSymbol(index) as keyof ConfigManager;
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, false);
        } else {
            this.changeValue(symbol, true);
        }
    }

    cursorLeft() {
        const index = this.index();
        const symbol = this.commandSymbol(index) as keyof ConfigManager;
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, false, false);
        } else {
            this.changeValue(symbol, false);
        }
    }

    changeVolume(symbol: keyof ConfigManager, forward: boolean, wrap: boolean) {
        const lastValue = this.getConfigValue(symbol);
        const offset = this.volumeOffset();
        const value = lastValue + (forward ? offset : -offset);
        if (value > 100 && wrap) {
            this.changeValue(symbol, 0);
        } else {
            this.changeValue(symbol, value.clamp(0, 100));
        }
    }

    volumeOffset() {
        return 20;
    }

    changeValue(symbol: keyof ConfigManager, value: any) {
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            this.playCursorSound();
        }
    }

    getConfigValue(symbol: keyof ConfigManager): any {
        return ConfigManager[symbol];
    }

    setConfigValue(symbol: keyof ConfigManager, volume: number) {
        (ConfigManager as any)[symbol] = volume;
    }
}
