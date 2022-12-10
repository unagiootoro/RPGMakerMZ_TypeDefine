//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

class Window_BattleEnemy extends Window_Selectable {
    protected _enemies!: any[];

    initialize(rect: Rectangle) {
        this._enemies = [];
        super.initialize(rect);
        this.refresh();
        this.hide();
    }

    maxCols() {
        return 2;
    }

    maxItems() {
        return this._enemies.length;
    }

    enemy() {
        return this._enemies[this.index()];
    }

    enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    }

    drawItem(index: number) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemLineRect(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    }

    show() {
        this.refresh();
        this.forceSelect(0);
        $gameTemp.clearTouchState();
        Window_Selectable.prototype.show.call(this);
    }

    hide() {
        Window_Selectable.prototype.hide.call(this);
        $gameTroop.select(null);
    }

    refresh() {
        this._enemies = $gameTroop.aliveMembers();
        Window_Selectable.prototype.refresh.call(this);
    }

    select(index: number) {
        Window_Selectable.prototype.select.call(this, index);
        $gameTroop.select(this.enemy());
    }

    processTouch() {
        Window_Selectable.prototype.processTouch.call(this);
        if (this.isOpenAndActive()) {
            const target = $gameTemp.touchTarget();
            if (target) {
                if (this._enemies.includes(target)) {
                    this.select(this._enemies.indexOf(target));
                    if ($gameTemp.touchState() === "click") {
                        this.processOk();
                    }
                }
                $gameTemp.clearTouchState();
            }
        }
    }
}
