//-----------------------------------------------------------------------------
// Window_GameEnd
//
// The window for selecting "Go to Title" on the game end screen.

class Window_GameEnd extends Window_Command {
    initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
        this.openness = 0;
        this.open();
    }

    makeCommandList() {
        this.addCommand(TextManager.toTitle, "toTitle");
        this.addCommand(TextManager.cancel, "cancel");
    }
}
