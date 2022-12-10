//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.

class Scene_Save extends Scene_File {
    initialize() {
        Scene_File.prototype.initialize.call(this);
    }

    mode(): "save" {
        return "save";
    }

    helpWindowText() {
        return TextManager.saveMessage;
    }

    firstSavefileId() {
        return $gameSystem.savefileId();
    }

    onSavefileOk() {
        Scene_File.prototype.onSavefileOk.call(this);
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeSave(savefileId);
        } else {
            this.onSaveFailure();
        }
    }

    executeSave(savefileId: number) {
        $gameSystem.setSavefileId(savefileId);
        $gameSystem.onBeforeSave();
        DataManager.saveGame(savefileId)
            .then(() => this.onSaveSuccess())
            .catch(() => this.onSaveFailure());
    }

    onSaveSuccess() {
        SoundManager.playSave();
        this.popScene();
    }

    onSaveFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
}
