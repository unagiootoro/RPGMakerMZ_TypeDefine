//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

class Game_ActionResult {
    used!: boolean;
    missed!: boolean;
    evaded!: boolean;
    physical!: boolean;
    drain!: boolean;
    critical!: boolean;
    success!: boolean;
    hpAffected!: boolean;
    hpDamage!: number;
    mpDamage!: number;
    tpDamage!: number;
    addedStates!: number[];
    removedStates!: number[];
    addedBuffs!: number[];
    addedDebuffs!: number[];
    removedBuffs!: number[];

    constructor(...args: []) {
        this.initialize(...args);
    }

    initialize() {
        this.clear();
    }

    clear() {
        this.used = false;
        this.missed = false;
        this.evaded = false;
        this.physical = false;
        this.drain = false;
        this.critical = false;
        this.success = false;
        this.hpAffected = false;
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.tpDamage = 0;
        this.addedStates = [];
        this.removedStates = [];
        this.addedBuffs = [];
        this.addedDebuffs = [];
        this.removedBuffs = [];
    }

    addedStateObjects() {
        return this.addedStates.map(id => $dataStates[id]);
    }

    removedStateObjects() {
        return this.removedStates.map(id => $dataStates[id]);
    }

    isStatusAffected() {
        return (
            this.addedStates.length > 0 ||
            this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 ||
            this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0
        );
    }

    isHit() {
        return this.used && !this.missed && !this.evaded;
    }

    isStateAdded(stateId: any) {
        return this.addedStates.includes(stateId);
    }

    pushAddedState(stateId: any) {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    }

    isStateRemoved(stateId: any) {
        return this.removedStates.includes(stateId);
    }

    pushRemovedState(stateId: any) {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    }

    isBuffAdded(paramId: number) {
        return this.addedBuffs.includes(paramId);
    }

    pushAddedBuff(paramId: number) {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    }

    isDebuffAdded(paramId: number) {
        return this.addedDebuffs.includes(paramId);
    }

    pushAddedDebuff(paramId: number) {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    }

    isBuffRemoved(paramId: number) {
        return this.removedBuffs.includes(paramId);
    }

    pushRemovedBuff(paramId: number) {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    }
}
