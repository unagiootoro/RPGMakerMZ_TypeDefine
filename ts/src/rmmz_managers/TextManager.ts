//-----------------------------------------------------------------------------
// TextManager
//
// The static class that handles terms and messages.

class TextManager {
    static level: string;
    static levelA: string;
    static hp: string;
    static hpA: string;
    static mp: string;
    static mpA: string;
    static tp: string;
    static tpA: string;
    static exp: string;
    static expA: string;
    static fight: string;
    static escape: string;
    static attack: string;
    static guard: string;
    static item: string;
    static skill: string;
    static equip: string;
    static status: string;
    static formation: string;
    static save: string;
    static gameEnd: string;
    static options: string;
    static weapon: string;
    static armor: string;
    static keyItem: string;
    static equip2: string;
    static optimize: string;
    static clear: string;
    static newGame: string;
    static continue_: string;
    static toTitle: string;
    static cancel: string;
    static buy: string;
    static sell: string;
    static alwaysDash: string;
    static commandRemember: string;
    static touchUI: string;
    static bgmVolume: string;
    static bgsVolume: string;
    static meVolume: string;
    static seVolume: string;
    static possession: string;
    static expTotal: string;
    static expNext: string;
    static saveMessage: string;
    static loadMessage: string;
    static file: string;
    static autosave: string;
    static partyName: string;
    static emerge: string;
    static preemptive: string;
    static surprise: string;
    static escapeStart: string;
    static escapeFailure: string;
    static victory: string;
    static defeat: string;
    static obtainExp: string;
    static obtainGold: string;
    static obtainItem: string;
    static levelUp: string;
    static obtainSkill: string;
    static useItem: string;
    static criticalToEnemy: string;
    static criticalToActor: string;
    static actorDamage: string;
    static actorRecovery: string;
    static actorGain: string;
    static actorLoss: string;
    static actorDrain: string;
    static actorNoDamage: string;
    static actorNoHit: string;
    static enemyDamage: string;
    static enemyRecovery: string;
    static enemyGain: string;
    static enemyLoss: string;
    static enemyDrain: string;
    static enemyNoDamage: string;
    static enemyNoHit: string;
    static evasion: string;
    static magicEvasion: string;
    static magicReflection: string;
    static counterAttack: string;
    static substitute: string;
    static buffAdd: string;
    static debuffAdd: string;
    static buffRemove: string;
    static actionFailure: string;

    constructor() {
        throw new Error("This is a static class");
    }

    static basic(basicId: number): string {
        return $dataSystem.terms.basic[basicId] || "";
    }

    static param(paramId: number): string {
        return $dataSystem.terms.params[paramId] || "";
    }

    static command(commandId: number): string {
        return $dataSystem.terms.commands[commandId] || "";
    }

    static message(messageId: string): string {
        return ($dataSystem.terms.messages as any)[messageId] || "";
    }

    static getter(method: string, param: number | string): any {
        return {
            get: function () {
                return this[method](param);
            },
            configurable: true
        };
    }

    static get currencyUnit() { return $dataSystem.currencyUnit; }
}

Object.defineProperties(TextManager, {
    level: TextManager.getter("basic", 0),
    levelA: TextManager.getter("basic", 1),
    hp: TextManager.getter("basic", 2),
    hpA: TextManager.getter("basic", 3),
    mp: TextManager.getter("basic", 4),
    mpA: TextManager.getter("basic", 5),
    tp: TextManager.getter("basic", 6),
    tpA: TextManager.getter("basic", 7),
    exp: TextManager.getter("basic", 8),
    expA: TextManager.getter("basic", 9),
    fight: TextManager.getter("command", 0),
    escape: TextManager.getter("command", 1),
    attack: TextManager.getter("command", 2),
    guard: TextManager.getter("command", 3),
    item: TextManager.getter("command", 4),
    skill: TextManager.getter("command", 5),
    equip: TextManager.getter("command", 6),
    status: TextManager.getter("command", 7),
    formation: TextManager.getter("command", 8),
    save: TextManager.getter("command", 9),
    gameEnd: TextManager.getter("command", 10),
    options: TextManager.getter("command", 11),
    weapon: TextManager.getter("command", 12),
    armor: TextManager.getter("command", 13),
    keyItem: TextManager.getter("command", 14),
    equip2: TextManager.getter("command", 15),
    optimize: TextManager.getter("command", 16),
    clear: TextManager.getter("command", 17),
    newGame: TextManager.getter("command", 18),
    continue_: TextManager.getter("command", 19),
    toTitle: TextManager.getter("command", 21),
    cancel: TextManager.getter("command", 22),
    buy: TextManager.getter("command", 24),
    sell: TextManager.getter("command", 25),
    alwaysDash: TextManager.getter("message", "alwaysDash"),
    commandRemember: TextManager.getter("message", "commandRemember"),
    touchUI: TextManager.getter("message", "touchUI"),
    bgmVolume: TextManager.getter("message", "bgmVolume"),
    bgsVolume: TextManager.getter("message", "bgsVolume"),
    meVolume: TextManager.getter("message", "meVolume"),
    seVolume: TextManager.getter("message", "seVolume"),
    possession: TextManager.getter("message", "possession"),
    expTotal: TextManager.getter("message", "expTotal"),
    expNext: TextManager.getter("message", "expNext"),
    saveMessage: TextManager.getter("message", "saveMessage"),
    loadMessage: TextManager.getter("message", "loadMessage"),
    file: TextManager.getter("message", "file"),
    autosave: TextManager.getter("message", "autosave"),
    partyName: TextManager.getter("message", "partyName"),
    emerge: TextManager.getter("message", "emerge"),
    preemptive: TextManager.getter("message", "preemptive"),
    surprise: TextManager.getter("message", "surprise"),
    escapeStart: TextManager.getter("message", "escapeStart"),
    escapeFailure: TextManager.getter("message", "escapeFailure"),
    victory: TextManager.getter("message", "victory"),
    defeat: TextManager.getter("message", "defeat"),
    obtainExp: TextManager.getter("message", "obtainExp"),
    obtainGold: TextManager.getter("message", "obtainGold"),
    obtainItem: TextManager.getter("message", "obtainItem"),
    levelUp: TextManager.getter("message", "levelUp"),
    obtainSkill: TextManager.getter("message", "obtainSkill"),
    useItem: TextManager.getter("message", "useItem"),
    criticalToEnemy: TextManager.getter("message", "criticalToEnemy"),
    criticalToActor: TextManager.getter("message", "criticalToActor"),
    actorDamage: TextManager.getter("message", "actorDamage"),
    actorRecovery: TextManager.getter("message", "actorRecovery"),
    actorGain: TextManager.getter("message", "actorGain"),
    actorLoss: TextManager.getter("message", "actorLoss"),
    actorDrain: TextManager.getter("message", "actorDrain"),
    actorNoDamage: TextManager.getter("message", "actorNoDamage"),
    actorNoHit: TextManager.getter("message", "actorNoHit"),
    enemyDamage: TextManager.getter("message", "enemyDamage"),
    enemyRecovery: TextManager.getter("message", "enemyRecovery"),
    enemyGain: TextManager.getter("message", "enemyGain"),
    enemyLoss: TextManager.getter("message", "enemyLoss"),
    enemyDrain: TextManager.getter("message", "enemyDrain"),
    enemyNoDamage: TextManager.getter("message", "enemyNoDamage"),
    enemyNoHit: TextManager.getter("message", "enemyNoHit"),
    evasion: TextManager.getter("message", "evasion"),
    magicEvasion: TextManager.getter("message", "magicEvasion"),
    magicReflection: TextManager.getter("message", "magicReflection"),
    counterAttack: TextManager.getter("message", "counterAttack"),
    substitute: TextManager.getter("message", "substitute"),
    buffAdd: TextManager.getter("message", "buffAdd"),
    debuffAdd: TextManager.getter("message", "debuffAdd"),
    buffRemove: TextManager.getter("message", "buffRemove"),
    actionFailure: TextManager.getter("message", "actionFailure")
});
