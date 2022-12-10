//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.

class Scene_Load extends Scene_File {
    protected _loadSuccess!: boolean;

    initialize() {
        Scene_File.prototype.initialize.call(this);
        this._loadSuccess = false;
    }

    terminate() {
        Scene_File.prototype.terminate.call(this);
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    }

    mode(): "load" {
        return "load";
    }

    helpWindowText() {
        return TextManager.loadMessage;
    }

    firstSavefileId() {
        return DataManager.latestSavefileId();
    }

    onSavefileOk() {
        Scene_File.prototype.onSavefileOk.call(this);
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeLoad(savefileId);
        } else {
            this.onLoadFailure();
        }
    }

    executeLoad(savefileId: number) {
        DataManager.loadGame(savefileId)
            .then(() => this.onLoadSuccess())
            .catch(() => this.onLoadFailure());
    }

    onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    }

    onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }

    reloadMapIfUpdated() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            const mapId = $gameMap.mapId();
            const x = $gamePlayer.x;
            const y = $gamePlayer.y;
            const d = $gamePlayer.direction();
            $gamePlayer.reserveTransfer(mapId, x, y, d, 0);
            $gamePlayer.requestMapReload();
        }
    }
}
