//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

class Window_EquipCommand extends Window_HorzCommand {
    initialize(rect: Rectangle) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
    }

    maxCols() {
        return 3;
    }

    makeCommandList() {
        this.addCommand(TextManager.equip2, "equip");
        this.addCommand(TextManager.optimize, "optimize");
        this.addCommand(TextManager.clear, "clear");
    }
}
