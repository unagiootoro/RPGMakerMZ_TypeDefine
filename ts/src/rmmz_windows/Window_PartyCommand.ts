//-----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.

class Window_PartyCommand extends Window_Command {
    initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.deactivate();
    }

    makeCommandList() {
        this.addCommand(TextManager.fight, "fight");
        this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    }

    setup() {
        this.refresh();
        this.forceSelect(0);
        this.activate();
        this.open();
    }
}
