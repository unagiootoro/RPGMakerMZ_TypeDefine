//-----------------------------------------------------------------------------
// Window_HorzCommand
//
// The command window for the horizontal selection format.

class Window_HorzCommand extends Window_Command {
    initialize(rect: Rectangle) {
        Window_Command.prototype.initialize.call(this, rect);
    }

    maxCols() {
        return 4;
    }

    itemTextAlign(): CanvasTextAlign {
        return "center";
    }
}
