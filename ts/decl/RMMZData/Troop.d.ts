declare namespace RMMZData {
    interface Troop {
        id: number;
        members: TroopMember[];
        name: string;
        pages: TroopPage[];
    }

    interface TroopMember {
        enemyId: number;
        x: number;
        y: number;
        hidden: boolean;
    }

    interface TroopPage {
        conditions: TroopCondition[];
        list: EventCommand[];
        span: number;
    }

    interface TroopCondition {
        actorHp: number;
        actorId: number;
        actorValid: boolean;
        enemyHp: number;
        enemyIndex: number;
        enemyValid: boolean;
        switchId: number;
        switchValid: boolean;
        turnA: number;
        turnB: number;
        turnEnding: boolean;
        turnValid: boolean;
    }
}
