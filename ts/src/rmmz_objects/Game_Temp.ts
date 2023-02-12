//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

class Game_Temp {
    protected _isPlaytest!: boolean;
    protected _destinationX!: number | null;
    protected _destinationY!: number | null;
    protected _touchTarget!: any;
    protected _touchState!: string;
    protected _needsBattleRefresh!: boolean;
    protected _commonEventQueue!: number[];
    protected _animationQueue!: IAnimationRequest[];
    protected _balloonQueue!: IBalloonRequest[];
    protected _lastActionData!: number[];

    constructor() {
        this.initialize(...arguments as unknown as []);
    }

    initialize() {
        this._isPlaytest = Utils.isOptionValid("test");
        this._destinationX = null;
        this._destinationY = null;
        this._touchTarget = null;
        this._touchState = "";
        this._needsBattleRefresh = false;
        this._commonEventQueue = [];
        this._animationQueue = [];
        this._balloonQueue = [];
        this._lastActionData = [0, 0, 0, 0, 0, 0];
    }

    isPlaytest() {
        return this._isPlaytest;
    }

    setDestination(x: number, y: number) {
        this._destinationX = x;
        this._destinationY = y;
    }

    clearDestination() {
        this._destinationX = null;
        this._destinationY = null;
    }

    isDestinationValid() {
        return this._destinationX !== null;
    }

    destinationX() {
        return this._destinationX;
    }

    destinationY() {
        return this._destinationY;
    }

    setTouchState(target: any, state: string) {
        this._touchTarget = target;
        this._touchState = state;
    }

    clearTouchState() {
        this._touchTarget = null;
        this._touchState = "";
    }

    touchTarget() {
        return this._touchTarget;
    }

    touchState() {
        return this._touchState;
    }

    requestBattleRefresh() {
        if ($gameParty.inBattle()) {
            this._needsBattleRefresh = true;
        }
    }

    clearBattleRefreshRequest() {
        this._needsBattleRefresh = false;
    }

    isBattleRefreshRequested() {
        return this._needsBattleRefresh;
    }

    reserveCommonEvent(commonEventId: number) {
        this._commonEventQueue.push(commonEventId);
    }

    retrieveCommonEvent() {
        return $dataCommonEvents[this._commonEventQueue.shift()!];
    }

    clearCommonEventReservation() {
        this._commonEventQueue.length = 0;
    }

    isCommonEventReserved() {
        return this._commonEventQueue.length > 0;
    }

    // prettier-ignore
    requestAnimation(
        targets: (Game_Character | Game_Battler)[], animationId: number, mirror: boolean = false
    ) {
        if ($dataAnimations[animationId]) {
            const request = {
                targets: targets,
                animationId: animationId,
                mirror: mirror
            }
            this._animationQueue.push(request);
            for (const target of targets as any[]) {
                if (target.startAnimation) {
                    target.startAnimation();
                }
            }
        }
    }

    retrieveAnimation() {
        return this._animationQueue.shift();
    }

    requestBalloon(target: Game_Character, balloonId: number) {
        const request = { target: target, balloonId: balloonId };
        this._balloonQueue.push(request);
        if (target.startBalloon) {
            target.startBalloon();
        }
    }

    retrieveBalloon() {
        return this._balloonQueue.shift();
    }

    lastActionData(type: number) {
        return this._lastActionData[type] || 0;
    }

    setLastActionData(type: number, value: number) {
        this._lastActionData[type] = value;
    }

    setLastUsedSkillId(skillID: number) {
        this.setLastActionData(0, skillID);
    }

    setLastUsedItemId(itemID: number) {
        this.setLastActionData(1, itemID);
    }

    setLastSubjectActorId(actorID: number) {
        this.setLastActionData(2, actorID);
    }

    setLastSubjectEnemyIndex(enemyIndex: number) {
        this.setLastActionData(3, enemyIndex);
    }

    setLastTargetActorId(actorID: number) {
        this.setLastActionData(4, actorID);
    }

    setLastTargetEnemyIndex(enemyIndex: number) {
        this.setLastActionData(5, enemyIndex);
    }
}

interface IAnimationRequest {
    targets: (Game_Character | Game_Battler)[];
    animationId: number;
    mirror: boolean;
}

interface IBalloonRequest {
    target: Game_Character;
    balloonId: number;
}
