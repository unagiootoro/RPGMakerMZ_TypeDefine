declare namespace RMMZData {
    interface EventPage {
        conditions: {
            actorId: number;
            actorValid: boolean;
            itemId: number;
            itemValid: boolean;
            selfSwitchCh: "A" | "B" | "C" | "D";
            selfSwitchValid: boolean;
            switch1Id: number;
            switch1Valid: boolean;
            switch2Id: number;
            switch2Valid: boolean;
            variableId: number;
            variableValid: boolean;
            variableValue: number;
        };
        directionFix: boolean;
        image: {
            tileId: number;
            characterName: string;
            direction: number;
            pattern: number;
            characterIndex: number;
        };
        list: EventCommand[];
        moveFrequency: 3;
        moveRoute: MoveRoute;
        moveSpeed: number;
        moveType: number;
        priorityType: number;
        stepAnime: boolean;
        through: boolean;
        trigger: number;
        walkAnime: boolean;
    }
}
