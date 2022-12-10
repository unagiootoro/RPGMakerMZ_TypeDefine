//-----------------------------------------------------------------------------
// Game_Followers
//
// The wrapper class for a follower array.

class Game_Followers {
    _visible!: boolean;
    _gathering!: boolean;
    _data!: Game_Follower[]

    constructor() {
        // @ts-ignore
        this.initialize(...arguments);
    }

    initialize() {
        this._visible = $dataSystem.optFollowers;
        this._gathering = false;
        this._data = [];
        this.setup();
    }

    setup() {
        this._data = [];
        for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
            this._data.push(new Game_Follower(i));
        }
    }

    isVisible() {
        return this._visible;
    }

    show() {
        this._visible = true;
    }

    hide() {
        this._visible = false;
    }

    data() {
        return this._data.clone();
    }

    reverseData() {
        return this._data.clone().reverse();
    }

    follower(index: number) {
        return this._data[index];
    }

    refresh() {
        for (const follower of this._data) {
            follower.refresh();
        }
    }

    update() {
        if (this.areGathering()) {
            if (!this.areMoving()) {
                this.updateMove();
            }
            if (this.areGathered()) {
                this._gathering = false;
            }
        }
        for (const follower of this._data) {
            follower.update();
        }
    }

    updateMove() {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
            this._data[i].chaseCharacter(precedingCharacter);
        }
    }

    jumpAll() {
        if ($gamePlayer.isJumping()) {
            for (const follower of this._data) {
                const sx = $gamePlayer.deltaXFrom(follower.x);
                const sy = $gamePlayer.deltaYFrom(follower.y);
                follower.jump(sx, sy);
            }
        }
    }

    synchronize(x: number, y: number, d: number) {
        for (const follower of this._data) {
            follower.locate(x, y);
            follower.setDirection(d);
        }
    }

    gather() {
        this._gathering = true;
    }

    areGathering() {
        return this._gathering;
    }

    visibleFollowers() {
        return this._data.filter(follower => follower.isVisible());
    }

    areMoving() {
        return this.visibleFollowers().some(follower => follower.isMoving());
    }

    areGathered() {
        return this.visibleFollowers().every(follower => follower.isGathered());
    }

    isSomeoneCollided(x: number, y: number) {
        return this.visibleFollowers().some(follower => follower.pos(x, y));
    }
}
