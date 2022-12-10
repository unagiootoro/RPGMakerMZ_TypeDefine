//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

class BattleManager {
    protected static _canEscape: boolean;
    protected static _canLose: boolean;
    protected static _phase: string;
    protected static _inputting: boolean;
    protected static _battleTest: boolean;
    protected static _eventCallback: Function | null;
    protected static _preemptive: boolean;
    protected static _surprise: boolean;
    protected static _currentActor: Game_Actor | null;
    protected static _actionForcedBattler: Game_Battler | null;
    protected static _mapBgm: any;
    protected static _mapBgs: any;
    protected static _actionBattlers: Game_Battler[];
    protected static _subject: Game_Battler | null;
    protected static _action: Game_Action | null;
    protected static _targets: Game_Battler[];
    protected static _logWindow: Window_BattleLog | null;
    protected static _spriteset: Spriteset_Battle | null;
    protected static _escapeRatio: number;
    protected static _escaped: boolean;
    protected static _rewards: any;
    protected static _tpbNeedsPartyCommand: boolean;
    static _formationController: any;

    constructor() {
        throw new Error("This is a static class");
    }

    static setup(troopId: number, canEscape: boolean, canLose: boolean) {
        this.initMembers();
        this._canEscape = canEscape;
        this._canLose = canLose;
        $gameTroop.setup(troopId);
        $gameScreen.onBattleStart();
        this.makeEscapeRatio();
    }

    static initMembers() {
        this._phase = "";
        this._inputting = false;
        this._canEscape = false;
        this._canLose = false;
        this._battleTest = false;
        this._eventCallback = null;
        this._preemptive = false;
        this._surprise = false;
        this._currentActor = null;
        this._actionForcedBattler = null;
        this._mapBgm = null;
        this._mapBgs = null;
        this._actionBattlers = [];
        this._subject = null;
        this._action = null;
        this._targets = [];
        this._logWindow = null;
        this._spriteset = null;
        this._escapeRatio = 0;
        this._escaped = false;
        this._rewards = {};
        this._tpbNeedsPartyCommand = true;
    }

    static isTpb() {
        return $dataSystem.battleSystem >= 1;
    }

    static isActiveTpb() {
        return $dataSystem.battleSystem === 1;
    }

    static isBattleTest() {
        return this._battleTest;
    }

    static setBattleTest(battleTest: boolean) {
        this._battleTest = battleTest;
    }

    static setEventCallback(callback: Function) {
        this._eventCallback = callback;
    }

    static setLogWindow(logWindow: Window_BattleLog) {
        this._logWindow = logWindow;
    }

    static setSpriteset(spriteset: Spriteset_Battle) {
        this._spriteset = spriteset;
    }

    static onEncounter() {
        this._preemptive = Math.random() < this.ratePreemptive();
        this._surprise = Math.random() < this.rateSurprise() && !this._preemptive;
    }

    static ratePreemptive() {
        return $gameParty.ratePreemptive($gameTroop.agility());
    }

    static rateSurprise() {
        return $gameParty.rateSurprise($gameTroop.agility());
    }

    static saveBgmAndBgs() {
        this._mapBgm = AudioManager.saveBgm();
        this._mapBgs = AudioManager.saveBgs();
    }

    static playBattleBgm() {
        AudioManager.playBgm($gameSystem.battleBgm());
        AudioManager.stopBgs();
    }

    static playVictoryMe() {
        AudioManager.playMe($gameSystem.victoryMe());
    }

    static playDefeatMe() {
        AudioManager.playMe($gameSystem.defeatMe());
    }

    static replayBgmAndBgs() {
        if (this._mapBgm) {
            AudioManager.replayBgm(this._mapBgm);
        } else {
            AudioManager.stopBgm();
        }
        if (this._mapBgs) {
            AudioManager.replayBgs(this._mapBgs);
        }
    }

    static makeEscapeRatio() {
        this._escapeRatio = (0.5 * $gameParty.agility()) / $gameTroop.agility();
    }

    static update(timeActive: boolean) {
        if (!this.isBusy() && !this.updateEvent()) {
            this.updatePhase(timeActive);
        }
        if (this.isTpb()) {
            this.updateTpbInput();
        }
    }

    static updatePhase(timeActive: any) {
        switch (this._phase) {
            case "start":
                this.updateStart();
                break;
            case "turn":
                this.updateTurn(timeActive);
                break;
            case "action":
                this.updateAction();
                break;
            case "turnEnd":
                this.updateTurnEnd();
                break;
            case "battleEnd":
                this.updateBattleEnd();
                break;
        }
    }

    static updateEvent() {
        switch (this._phase) {
            case "start":
            case "turn":
            case "turnEnd":
                if (this.isActionForced()) {
                    this.processForcedAction();
                    return true;
                } else {
                    return this.updateEventMain();
                }
        }
        return this.checkAbort();
    }

    static updateEventMain() {
        $gameTroop.updateInterpreter();
        $gameParty.requestMotionRefresh();
        if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
            return true;
        }
        $gameTroop.setupBattleEvent();
        if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
            return true;
        }
        return false;
    }

    static isBusy() {
        return (
            $gameMessage.isBusy() ||
            this._spriteset!.isBusy() ||
            this._logWindow!.isBusy()
        );
    }

    static updateTpbInput() {
        if (this._inputting) {
            this.checkTpbInputClose();
        } else {
            this.checkTpbInputOpen();
        }
    }

    static checkTpbInputClose() {
        if (!this.isPartyTpbInputtable() || this.needsActorInputCancel()) {
            this.cancelActorInput();
            this._currentActor = null;
            this._inputting = false;
        }
    }

    static checkTpbInputOpen() {
        if (this.isPartyTpbInputtable()) {
            if (this._tpbNeedsPartyCommand) {
                this._inputting = true;
                this._tpbNeedsPartyCommand = false;
            } else {
                this.selectNextCommand();
            }
        }
    }

    static isPartyTpbInputtable() {
        return $gameParty.canInput() && this.isTpbMainPhase();
    }

    static needsActorInputCancel() {
        return this._currentActor && !this._currentActor.canInput();
    }

    static isTpbMainPhase() {
        return ["turn", "turnEnd", "action"].includes(this._phase);
    }

    static isInputting() {
        return this._inputting;
    }

    static isInTurn() {
        return this._phase === "turn";
    }

    static isTurnEnd() {
        return this._phase === "turnEnd";
    }

    static isAborting() {
        return this._phase === "aborting";
    }

    static isBattleEnd() {
        return this._phase === "battleEnd";
    }

    static canEscape() {
        return this._canEscape;
    }

    static canLose() {
        return this._canLose;
    }

    static isEscaped() {
        return this._escaped;
    }

    static actor() {
        return this._currentActor;
    }

    static startBattle() {
        this._phase = "start";
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart(this._preemptive);
        $gameTroop.onBattleStart(this._surprise);
        this.displayStartMessages();
    }

    static displayStartMessages() {
        for (const name of $gameTroop.enemyNames()) {
            $gameMessage.add(TextManager.emerge.format(name));
        }
        if (this._preemptive) {
            $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
        } else if (this._surprise) {
            $gameMessage.add(TextManager.surprise.format($gameParty.name()));
        }
    }

    static startInput() {
        this._phase = "input";
        this._inputting = true;
        $gameParty.makeActions();
        $gameTroop.makeActions();
        this._currentActor = null;
        if (this._surprise || !$gameParty.canInput()) {
            this.startTurn();
        }
    }

    static inputtingAction() {
        return this._currentActor ? this._currentActor.inputtingAction() : null;
    }

    static selectNextCommand() {
        if (this._currentActor) {
            if (this._currentActor.selectNextCommand()) {
                return;
            }
            this.finishActorInput();
        }
        this.selectNextActor();
    }

    static selectNextActor() {
        this.changeCurrentActor(true);
        if (!this._currentActor) {
            if (this.isTpb()) {
                this.changeCurrentActor(true);
            } else {
                this.startTurn();
            }
        }
    }

    static selectPreviousCommand() {
        if (this._currentActor) {
            if (this._currentActor.selectPreviousCommand()) {
                return;
            }
            this.cancelActorInput();
        }
        this.selectPreviousActor();
    }

    static selectPreviousActor() {
        if (this.isTpb()) {
            this.changeCurrentActor(true);
            if (!this._currentActor) {
                this._inputting = $gameParty.canInput();
            }
        } else {
            this.changeCurrentActor(false);
        }
    }

    static changeCurrentActor(forward: boolean) {
        const members = $gameParty.battleMembers();
        let actor = this._currentActor;
        for (; ;) {
            const currentIndex = members.indexOf(actor);
            actor = members[currentIndex + (forward ? 1 : -1)];
            if (!actor || actor.canInput()) {
                break;
            }
        }
        this._currentActor = actor ? actor : null;
        this.startActorInput();
    }

    static startActorInput() {
        if (this._currentActor) {
            this._currentActor.setActionState("inputting");
            this._inputting = true;
        }
    }

    static finishActorInput() {
        if (this._currentActor) {
            if (this.isTpb()) {
                this._currentActor.startTpbCasting();
            }
            this._currentActor.setActionState("waiting");
        }
    }

    static cancelActorInput() {
        if (this._currentActor) {
            this._currentActor.setActionState("undecided");
        }
    }

    static updateStart() {
        if (this.isTpb()) {
            this._phase = "turn";
        } else {
            this.startInput();
        }
    }

    static startTurn() {
        this._phase = "turn";
        $gameTroop.increaseTurn();
        $gameParty.requestMotionRefresh();
        if (!this.isTpb()) {
            this.makeActionOrders();
            this._logWindow!.startTurn();
            this._inputting = false;
        }
    }

    static updateTurn(timeActive: any) {
        $gameParty.requestMotionRefresh();
        if (this.isTpb() && timeActive) {
            this.updateTpb();
        }
        if (!this._subject) {
            this._subject = this.getNextSubject();
        }
        if (this._subject) {
            this.processTurn();
        } else if (!this.isTpb()) {
            this.endTurn();
        }
    }

    static updateTpb() {
        $gameParty.updateTpb();
        $gameTroop.updateTpb();
        this.updateAllTpbBattlers();
        this.checkTpbTurnEnd();
    }

    static updateAllTpbBattlers() {
        for (const battler of this.allBattleMembers()) {
            this.updateTpbBattler(battler);
        }
    }

    static updateTpbBattler(battler: Game_Battler) {
        if (battler.isTpbTurnEnd()) {
            battler.onTurnEnd();
            battler.startTpbTurn();
            this.displayBattlerStatus(battler, false);
        } else if (battler.isTpbReady()) {
            battler.startTpbAction();
            this._actionBattlers.push(battler);
        } else if (battler.isTpbTimeout()) {
            battler.onTpbTimeout();
            this.displayBattlerStatus(battler, true);
        }
    }

    static checkTpbTurnEnd() {
        if ($gameTroop.isTpbTurnEnd()) {
            this.endTurn();
        }
    }

    static processTurn() {
        const subject = this._subject;
        const action = subject!.currentAction();
        if (action) {
            action.prepare();
            if (action.isValid()) {
                this.startAction();
            }
            subject!.removeCurrentAction();
        } else {
            this.endAction();
            this._subject = null;
        }
    }

    static endBattlerActions(battler: Game_Battler) {
        battler.setActionState(this.isTpb() ? "undecided" : "done");
        battler.onAllActionsEnd();
        battler.clearTpbChargeTime();
        this.displayBattlerStatus(battler, true);
    }

    static endTurn() {
        this._phase = "turnEnd";
        this._preemptive = false;
        this._surprise = false;
    }

    static updateTurnEnd() {
        if (this.isTpb()) {
            this.startTurn();
        } else {
            this.endAllBattlersTurn();
            this._phase = "start";
        }
    }

    static endAllBattlersTurn() {
        for (const battler of this.allBattleMembers()) {
            battler.onTurnEnd();
            this.displayBattlerStatus(battler, false);
        }
    }

    static displayBattlerStatus(battler: any, current: boolean) {
        this._logWindow!.displayAutoAffectedStatus(battler);
        if (current) {
            this._logWindow!.displayCurrentState(battler);
        }
        this._logWindow!.displayRegeneration(battler);
    }

    static getNextSubject() {
        for (; ;) {
            const battler = this._actionBattlers.shift();
            if (!battler) {
                return null;
            }
            if (battler.isBattleMember() && battler.isAlive()) {
                return battler;
            }
        }
    }

    static allBattleMembers() {
        return $gameParty.battleMembers().concat($gameTroop.members());
    }

    static makeActionOrders() {
        const battlers = [];
        if (!this._surprise) {
            battlers.push(...$gameParty.battleMembers());
        }
        if (!this._preemptive) {
            battlers.push(...$gameTroop.members());
        }
        for (const battler of battlers) {
            battler.makeSpeed();
        }
        battlers.sort((a, b) => b.speed() - a.speed());
        this._actionBattlers = battlers;
    }

    static startAction() {
        const subject = this._subject!;
        const action = subject.currentAction();
        const targets = action.makeTargets();
        this._phase = "action";
        this._action = action;
        this._targets = targets;
        subject.cancelMotionRefresh();
        subject.useItem(action.item() as RMMZData.Item);
        this._action.applyGlobal();
        this._logWindow!.startAction(subject, action, targets);
    }

    static updateAction() {
        const target = this._targets.shift();
        if (target) {
            this.invokeAction(this._subject!, target);
        } else {
            this.endAction();
        }
    }

    static endAction() {
        this._logWindow!.endAction(this._subject!);
        this._phase = "turn";
        if (this._subject!.numActions() === 0) {
            this.endBattlerActions(this._subject!);
            this._subject = null;
        }
    }

    static invokeAction(subject: Game_Battler, target: Game_Battler) {
        this._logWindow!.push("pushBaseLine");
        if (Math.random() < this._action!.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else if (Math.random() < this._action!.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else {
            this.invokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        this._logWindow!.push("popBaseLine");
    }

    static invokeNormalAction(subject: any, target: any) {
        const realTarget = this.applySubstitute(target);
        this._action!.apply(realTarget);
        this._logWindow!.displayActionResults(subject, realTarget);
    }

    static invokeCounterAttack(subject: Game_Battler, target: Game_Battler) {
        const action = new Game_Action(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow!.displayCounter(target);
        this._logWindow!.displayActionResults(target, subject);
    }

    static invokeMagicReflection(subject: any, target: any) {
        (this._action as any)._reflectionTarget = target;
        this._logWindow!.displayReflection(target);
        this._action!.apply(subject);
        this._logWindow!.displayActionResults(target, subject);
    }

    static applySubstitute(target: Game_Battler) {
        if (this.checkSubstitute(target)) {
            const substitute = target.friendsUnit().substituteBattler();
            if (substitute && target !== substitute) {
                this._logWindow!.displaySubstitute(substitute, target);
                return substitute;
            }
        }
        return target;
    }

    static checkSubstitute(target: Game_Battler) {
        return target.isDying() && !this._action!.isCertainHit();
    }

    static isActionForced() {
        return !!this._actionForcedBattler;
    }

    static forceAction(battler: Game_Battler) {
        this._actionForcedBattler = battler;
        this._actionBattlers.remove(battler);
    }

    static processForcedAction() {
        if (this._actionForcedBattler) {
            if (this._subject) {
                this.endBattlerActions(this._subject);
            }
            this._subject = this._actionForcedBattler;
            this._actionForcedBattler = null;
            this.startAction();
            this._subject.removeCurrentAction();
        }
    }

    static abort() {
        this._phase = "aborting";
    }

    static checkBattleEnd() {
        if (this._phase) {
            if ($gameParty.isEscaped()) {
                this.processPartyEscape();
                return true;
            } else if ($gameParty.isAllDead()) {
                this.processDefeat();
                return true;
            } else if ($gameTroop.isAllDead()) {
                this.processVictory();
                return true;
            }
        }
        return false;
    }

    static checkAbort() {
        if (this.isAborting()) {
            this.processAbort();
            return true;
        }
        return false;
    }

    static processVictory() {
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        this.displayVictoryMessage();
        this.displayRewards();
        this.gainRewards();
        this.endBattle(0);
    }

    static processEscape() {
        $gameParty.performEscape();
        SoundManager.playEscape();
        const success = this._preemptive || Math.random() < this._escapeRatio;
        if (success) {
            this.onEscapeSuccess();
        } else {
            this.onEscapeFailure();
        }
        return success;
    }

    static onEscapeSuccess() {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    }

    static onEscapeFailure() {
        $gameParty.onEscapeFailure();
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        if (!this.isTpb()) {
            this.startTurn();
        }
    }

    static processPartyEscape() {
        this._escaped = true;
        this.processAbort();
    }

    static processAbort() {
        $gameParty.removeBattleStates();
        this._logWindow!.clear();
        this.replayBgmAndBgs();
        this.endBattle(1);
    }

    static processDefeat() {
        this.displayDefeatMessage();
        this.playDefeatMe();
        if (this._canLose) {
            this.replayBgmAndBgs();
        } else {
            AudioManager.stopBgm();
        }
        this.endBattle(2);
    }

    static endBattle(result: number) {
        this._phase = "battleEnd";
        this.cancelActorInput();
        this._inputting = false;
        if (this._eventCallback) {
            this._eventCallback(result);
        }
        if (result === 0) {
            $gameSystem.onBattleWin();
        } else if (this._escaped) {
            $gameSystem.onBattleEscape();
        }
        $gameTemp.clearCommonEventReservation();
    }

    static updateBattleEnd() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && $gameParty.isAllDead()) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else {
                SceneManager.goto(Scene_Gameover);
            }
        } else {
            SceneManager.pop();
        }
        this._phase = "";
    }

    static makeRewards() {
        this._rewards = {
            gold: $gameTroop.goldTotal(),
            exp: $gameTroop.expTotal(),
            items: $gameTroop.makeDropItems()
        };
    }

    static displayVictoryMessage() {
        $gameMessage.add(TextManager.victory.format($gameParty.name()));
    }

    static displayDefeatMessage() {
        $gameMessage.add(TextManager.defeat.format($gameParty.name()));
    }

    static displayEscapeSuccessMessage() {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    }

    static displayEscapeFailureMessage() {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
        $gameMessage.add("\\." + TextManager.escapeFailure);
    }

    static displayRewards() {
        this.displayExp();
        this.displayGold();
        this.displayDropItems();
    }

    static displayExp() {
        const exp = this._rewards.exp;
        if (exp > 0) {
            const text = TextManager.obtainExp.format(exp, TextManager.exp);
            $gameMessage.add("\\." + text);
        }
    }

    static displayGold() {
        const gold = this._rewards.gold;
        if (gold > 0) {
            $gameMessage.add("\\." + TextManager.obtainGold.format(gold));
        }
    }

    static displayDropItems() {
        const items = this._rewards.items;
        if (items.length > 0) {
            $gameMessage.newPage();
            for (const item of items) {
                $gameMessage.add(TextManager.obtainItem.format(item.name));
            }
        }
    }

    static gainRewards() {
        this.gainExp();
        this.gainGold();
        this.gainDropItems();
    }

    static gainExp() {
        const exp = this._rewards.exp;
        for (const actor of $gameParty.allMembers()) {
            actor!.gainExp(exp);
        }
    }

    static gainGold() {
        $gameParty.gainGold(this._rewards.gold);
    }

    static gainDropItems() {
        const items = this._rewards.items;
        for (const item of items) {
            $gameParty.gainItem(item, 1);
        }
    }
}
