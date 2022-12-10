//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

class Window_BattleActor extends Window_BattleStatus {
    initialize(...args: any[]) {
        super.initialize(...args as [Rectangle]);
        this.openness = 255;
        this.hide();
    }

    show() {
        this.forceSelect(0);
        $gameTemp.clearTouchState();
        Window_BattleStatus.prototype.show.call(this);
    }

    hide() {
        Window_BattleStatus.prototype.hide.call(this);
        $gameParty.select(null);
    }

    select(index: number) {
        Window_BattleStatus.prototype.select.call(this, index);
        $gameParty.select(this.actor(index));
    }

    processTouch() {
        Window_BattleStatus.prototype.processTouch.call(this);
        if (this.isOpenAndActive()) {
            const target = $gameTemp.touchTarget();
            if (target) {
                const members = $gameParty.battleMembers();
                if (members.includes(target)) {
                    this.select(members.indexOf(target));
                    if ($gameTemp.touchState() === "click") {
                        this.processOk();
                    }
                }
                $gameTemp.clearTouchState();
            }
        }
    }
}
