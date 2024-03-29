//-----------------------------------------------------------------------------
// Window_BattleLog
//
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.

class Window_BattleLog extends Window_Base {
    protected _lines!: string[];
    protected _methods!: { name: string, params: any[] }[];
    protected _waitCount!: number;
    protected _waitMode!: string;
    protected _baseLineStack!: number[];
    protected _spriteset!: Spriteset_Battle | null;

    initialize(rect: Rectangle) {
        super.initialize(rect);
        this.opacity = 0;
        this._lines = [];
        this._methods = [];
        this._waitCount = 0;
        this._waitMode = "";
        this._baseLineStack = [];
        this._spriteset = null;
        this.refresh();
    }

    setSpriteset(spriteset: Spriteset_Battle) {
        this._spriteset = spriteset;
    }

    maxLines() {
        return 10;
    }

    numLines() {
        return this._lines.length;
    }

    messageSpeed() {
        return 16;
    }

    isBusy() {
        return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
    }

    update() {
        if (!this.updateWait()) {
            this.callNextMethod();
        }
    }

    updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }

    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount -= this.isFastForward() ? 3 : 1;
            if (this._waitCount < 0) {
                this._waitCount = 0;
            }
            return true;
        }
        return false;
    }

    updateWaitMode() {
        let waiting = false;
        switch (this._waitMode) {
            case "effect":
                waiting = this._spriteset!.isEffecting();
                break;
            case "movement":
                waiting = this._spriteset!.isAnyoneMoving();
                break;
        }
        if (!waiting) {
            this._waitMode = "";
        }
        return waiting;
    }

    setWaitMode(waitMode: string) {
        this._waitMode = waitMode;
    }

    callNextMethod() {
        if (this._methods.length > 0) {
            const method = this._methods.shift()!;
            if (method.name && (this as any)[method.name]) {
                (this as any)[method.name].apply(this, method.params);
            } else {
                throw new Error("Method not found: " + method.name);
            }
        }
    }

    isFastForward() {
        return (
            Input.isLongPressed("ok") ||
            Input.isPressed("shift") ||
            TouchInput.isLongPressed()
        );
    }

    push(methodName: string, ...args: any[]) {
        const methodArgs = Array.prototype.slice.call(arguments, 1);
        this._methods.push({ name: methodName, params: methodArgs });
    }

    clear() {
        this._lines = [];
        this._baseLineStack = [];
        this.refresh();
    }

    wait() {
        this._waitCount = this.messageSpeed();
    }

    waitForEffect() {
        this.setWaitMode("effect");
    }

    waitForMovement() {
        this.setWaitMode("movement");
    }

    addText(text: string) {
        this._lines.push(text);
        this.refresh();
        this.wait();
    }

    pushBaseLine() {
        this._baseLineStack.push(this._lines.length);
    }

    popBaseLine() {
        const baseLine = this._baseLineStack.pop();
        while (this._lines.length > baseLine!) {
            this._lines.pop();
        }
    }

    waitForNewLine() {
        let baseLine = 0;
        if (this._baseLineStack.length > 0) {
            baseLine = this._baseLineStack[this._baseLineStack.length - 1];
        }
        if (this._lines.length > baseLine) {
            this.wait();
        }
    }

    popupDamage(target: Game_Battler) {
        if (target.shouldPopupDamage()) {
            target.startDamagePopup();
        }
    }

    performActionStart(subject: Game_Battler, action: Game_Action) {
        subject.performActionStart(action);
    }

    performAction(subject: Game_Battler, action: Game_Action) {
        subject.performAction(action);
    }

    performActionEnd(subject: Game_Battler) {
        subject.performActionEnd();
    }

    performDamage(target: Game_Battler) {
        target.performDamage();
    }

    performMiss(target: Game_Battler) {
        target.performMiss();
    }

    performRecovery(target: Game_Battler) {
        target.performRecovery();
    }

    performEvasion(target: Game_Battler) {
        target.performEvasion();
    }

    performMagicEvasion(target: Game_Battler) {
        target.performMagicEvasion();
    }

    performCounter(target: Game_Battler) {
        target.performCounter();
    }

    performReflection(target: Game_Battler) {
        target.performReflection();
    }

    performSubstitute(substitute: Game_Battler, target: Game_Battler) {
        substitute.performSubstitute(target);
    }

    performCollapse(target: Game_Battler) {
        target.performCollapse();
    }

    // prettier-ignore
    showAnimation(
        subject: Game_Battler, targets: Game_Battler[], animationId: number
    ) {
        if (animationId < 0) {
            this.showAttackAnimation(subject, targets);
        } else {
            this.showNormalAnimation(targets, animationId);
        }
    }

    showAttackAnimation(subject: Game_Battler, targets: Game_Battler[]) {
        if (subject.isActor()) {
            this.showActorAttackAnimation(subject as Game_Actor, targets);
        } else {
            this.showEnemyAttackAnimation(subject as Game_Enemy, targets);
        }
    }

    // prettier-ignore
    showActorAttackAnimation(
        subject: Game_Actor, targets: Game_Battler[]
    ) {
        this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
    }

    // prettier-ignore
    showEnemyAttackAnimation(
        subject: Game_Enemy, targets: Game_Battler[]
    ) {
        SoundManager.playEnemyAttack();
    }

    // prettier-ignore
    showNormalAnimation(
        targets: Game_Battler[], animationId: number, mirror?: boolean
    ) {
        const animation = $dataAnimations[animationId];
        if (animation) {
            $gameTemp.requestAnimation(targets, animationId, mirror);
        }
    }

    refresh() {
        this.drawBackground();
        this.contents.clear();
        for (let i = 0; i < this._lines.length; i++) {
            this.drawLineText(i);
        }
    }

    drawBackground() {
        const rect = this.backRect();
        const color = this.backColor();
        this.contentsBack.clear();
        this.contentsBack.paintOpacity = this.backPaintOpacity();
        this.contentsBack.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contentsBack.paintOpacity = 255;
    }

    backRect() {
        const height = this.numLines() * this.itemHeight();
        return new Rectangle(0, 0, this.innerWidth, height);
    }

    lineRect(index: number) {
        const itemHeight = this.itemHeight();
        const padding = this.itemPadding();
        const x = padding;
        const y = index * itemHeight;
        const width = this.innerWidth - padding * 2;
        const height = itemHeight;
        return new Rectangle(x, y, width, height);
    }

    backColor() {
        return "#000000";
    }

    backPaintOpacity() {
        return 64;
    }

    drawLineText(index: number) {
        const rect = this.lineRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
    }

    startTurn() {
        this.push("wait");
    }

    startAction(subject: Game_Battler, action: Game_Action, targets: Game_Battler[]) {
        const item = action.item();
        this.push("performActionStart", subject, action);
        this.push("waitForMovement");
        this.push("performAction", subject, action);
        this.push("showAnimation", subject, targets.clone(), (item as RMMZData.Item).animationId);
        this.displayAction(subject, item as RMMZData.Item);
    }

    endAction(subject: Game_Battler) {
        this.push("waitForNewLine");
        this.push("clear");
        this.push("performActionEnd", subject);
    }

    displayCurrentState(subject: Game_Battler) {
        const stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push("addText", stateText.format(subject.name()));
            this.push("wait");
            this.push("clear");
        }
    }

    displayRegeneration(subject: Game_Battler) {
        this.push("popupDamage", subject);
    }

    displayAction(subject: Game_Battler, item: RMMZData.Item) {
        const numMethods = this._methods.length;
        if (DataManager.isSkill(item)) {
            this.displayItemMessage(item.message1, subject, item);
            this.displayItemMessage(item.message2, subject, item);
        } else {
            this.displayItemMessage(TextManager.useItem, subject, item);
        }
        if (this._methods.length === numMethods) {
            this.push("wait");
        }
    }

    displayItemMessage(fmt: string, subject: Game_Battler, item: RMMZData.Item) {
        if (fmt) {
            this.push("addText", fmt.format(subject.name(), item.name));
        }
    }

    displayCounter(target: Game_Battler) {
        this.push("performCounter", target);
        this.push("addText", TextManager.counterAttack.format(target.name()));
    }

    displayReflection(target: Game_Battler) {
        this.push("performReflection", target);
        this.push("addText", TextManager.magicReflection.format(target.name()));
    }

    displaySubstitute(substitute: Game_Battler, target: Game_Battler) {
        const substName = substitute.name();
        const text = TextManager.substitute.format(substName, target.name());
        this.push("performSubstitute", substitute, target);
        this.push("addText", text);
    }

    displayActionResults(subject: Game_Battler, target: Game_Battler) {
        if (target.result().used) {
            this.push("pushBaseLine");
            this.displayCritical(target);
            this.push("popupDamage", target);
            this.push("popupDamage", subject);
            this.displayDamage(target);
            this.displayAffectedStatus(target);
            this.displayFailure(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    }

    displayFailure(target: Game_Battler) {
        if (target.result().isHit() && !target.result().success) {
            this.push("addText", TextManager.actionFailure.format(target.name()));
        }
    }

    displayCritical(target: Game_Battler) {
        if (target.result().critical) {
            if (target.isActor()) {
                this.push("addText", TextManager.criticalToActor);
            } else {
                this.push("addText", TextManager.criticalToEnemy);
            }
        }
    }

    displayDamage(target: Game_Battler) {
        if (target.result().missed) {
            this.displayMiss(target);
        } else if (target.result().evaded) {
            this.displayEvasion(target);
        } else {
            this.displayHpDamage(target);
            this.displayMpDamage(target);
            this.displayTpDamage(target);
        }
    }

    displayMiss(target: Game_Battler) {
        let fmt;
        if (target.result().physical) {
            const isActor = target.isActor();
            fmt = isActor ? TextManager.actorNoHit : TextManager.enemyNoHit;
            this.push("performMiss", target);
        } else {
            fmt = TextManager.actionFailure;
        }
        this.push("addText", fmt.format(target.name()));
    }

    displayEvasion(target: Game_Battler) {
        let fmt;
        if (target.result().physical) {
            fmt = TextManager.evasion;
            this.push("performEvasion", target);
        } else {
            fmt = TextManager.magicEvasion;
            this.push("performMagicEvasion", target);
        }
        this.push("addText", fmt.format(target.name()));
    }

    displayHpDamage(target: Game_Battler) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.push("performDamage", target);
            }
            if (target.result().hpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeHpDamageText(target));
        }
    }

    displayMpDamage(target: Game_Battler) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeMpDamageText(target));
        }
    }

    displayTpDamage(target: Game_Battler) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeTpDamageText(target));
        }
    }

    displayAffectedStatus(target: Game_Battler) {
        if (target.result().isStatusAffected()) {
            this.push("pushBaseLine");
            this.displayChangedStates(target);
            this.displayChangedBuffs(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    }

    displayAutoAffectedStatus(target: Game_Battler) {
        if (target.result().isStatusAffected()) {
            // @ts-ignore // 元ソースのまま
            this.displayAffectedStatus(target, null);
            this.push("clear");
        }
    }

    displayChangedStates(target: Game_Battler) {
        this.displayAddedStates(target);
        this.displayRemovedStates(target);
    }

    displayAddedStates(target: Game_Battler) {
        const result = target.result();
        const states = result.addedStateObjects();
        for (const state of states) {
            const stateText = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push("performCollapse", target);
            }
            if (stateText) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", stateText.format(target.name()));
                this.push("waitForEffect");
            }
        }
    }

    displayRemovedStates(target: Game_Battler) {
        const result = target.result();
        const states = result.removedStateObjects();
        for (const state of states) {
            if (state.message4) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", state.message4.format(target.name()));
            }
        }
    }

    displayChangedBuffs(target: Game_Battler) {
        const result = target.result();
        this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
    }

    displayBuffs(target: Game_Battler, buffs: number[], fmt: string) {
        for (const paramId of buffs) {
            const text = fmt.format(target.name(), TextManager.param(paramId));
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push("addText", text);
        }
    }

    makeHpDamageText(target: Game_Battler) {
        const result = target.result();
        const damage = result.hpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.hp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
            return fmt.format(target.name(), damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.hp, -damage);
        } else {
            fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
            return fmt.format(target.name());
        }
    }

    makeMpDamageText(target: Game_Battler) {
        const result = target.result();
        const damage = result.mpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.mp, -damage);
        } else {
            return "";
        }
    }

    makeTpDamageText(target: Game_Battler) {
        const result = target.result();
        const damage = result.tpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.tp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
            return fmt.format(target.name(), TextManager.tp, -damage);
        } else {
            return "";
        }
    }
}
