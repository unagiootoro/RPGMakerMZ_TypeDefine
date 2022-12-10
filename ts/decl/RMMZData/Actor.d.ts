declare namespace RMMZData {
    interface Actor {
        id: number;
        battlerName: string;
        characterIndex: number;
        characterName: string;
        classId: number;
        equips: number[];
        faceIndex: number;
        faceName: string;
        traits: Trait[];
        initialLevel: number;
        maxLevel: number;
        name: string;
        nickname: string
        note: string;
        profile: string;
    }
}
