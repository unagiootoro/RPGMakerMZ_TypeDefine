//-----------------------------------------------------------------------------
// Scene_Name
//
// The scene class of the name input screen.

class Scene_Name extends Scene_MenuBase {
    protected _actorId!: number;
    protected _maxLength!: number;
    protected _editWindow!: Window_NameEdit;
    protected _inputWindow!: Window_NameInput;

    initialize() {
        Scene_MenuBase.prototype.initialize.call(this);
    }

    prepare(actorId: number, maxLength: number) {
        this._actorId = actorId;
        this._maxLength = maxLength;
    }

    create() {
        Scene_MenuBase.prototype.create.call(this);
        this._actor = $gameActors.actor(this._actorId);
        this.createEditWindow();
        this.createInputWindow();
    }

    start() {
        Scene_MenuBase.prototype.start.call(this);
        this._editWindow.refresh();
    }

    createEditWindow() {
        const rect = this.editWindowRect();
        this._editWindow = new Window_NameEdit(rect);
        this._editWindow.setup(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
    }

    editWindowRect() {
        const inputWindowHeight = this.calcWindowHeight(9, true);
        const padding = $gameSystem.windowPadding();
        const ww = 600;
        const wh = ImageManager.faceHeight + padding * 2;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
        return new Rectangle(wx, wy, ww, wh);
    }

    createInputWindow() {
        const rect = this.inputWindowRect();
        this._inputWindow = new Window_NameInput(rect);
        this._inputWindow.setEditWindow(this._editWindow);
        this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
        this.addWindow(this._inputWindow);
    }

    inputWindowRect() {
        const wx = this._editWindow.x;
        const wy = this._editWindow.y + this._editWindow.height + 8;
        const ww = this._editWindow.width;
        const wh = this.calcWindowHeight(9, true);
        return new Rectangle(wx, wy, ww, wh);
    }

    onInputOk() {
        this._actor.setName(this._editWindow.name());
        this.popScene();
    }
}
