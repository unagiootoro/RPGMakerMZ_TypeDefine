//-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.

class Game_Timer {
    protected _frames!: number;
    protected _working!: boolean;

    constructor(...args: any[]) {
        this.initialize(...args as []);
    }

    initialize() {
        this._frames = 0;
        this._working = false;
    }

    update(sceneActive: boolean) {
        if (sceneActive && this._working && this._frames > 0) {
            this._frames--;
            if (this._frames === 0) {
                this.onExpire();
            }
        }
    }

    start(count: number) {
        this._frames = count;
        this._working = true;
    }

    stop() {
        this._working = false;
    }

    isWorking() {
        return this._working;
    }

    seconds() {
        return Math.floor(this._frames / 60);
    }

    frames() {
        return this._frames;
    }

    onExpire() {
        BattleManager.abort();
    }
}
