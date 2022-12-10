//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

class Window_Help extends Window_Base {
    protected _text!: string;

    initialize(rect: Rectangle) {
        Window_Base.prototype.initialize.call(this, rect);
        this._text = "";
    }

    setText(text: string) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    }

    clear() {
        this.setText("");
    }

    setItem(item: { description: string }) {
        this.setText(item ? item.description : "");
    }

    refresh() {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    }
}
