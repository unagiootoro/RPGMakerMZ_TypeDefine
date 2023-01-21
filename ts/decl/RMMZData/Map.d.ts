declare namespace RMMZData {
    interface Map {
        autoplayBgm: boolean;
        autoplayBgs: boolean;
        battleback1Name: string;
        battleback2Name: string;
        bgm: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
        bgs: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
        disableDashing: boolean;
        displayName: string;
        encounterList: Encounter[];
        encounterStep: number;
        height: number;
        note: string;
        parallaxLoopX: boolean;
        parallaxLoopY: boolean;
        parallaxName: string;
        parallaxShow: boolean;
        parallaxSx: number;
        parallaxSy: number;
        scrollType: number;
        specifyBattleback: boolean;
        tilesetId: number;
        width: number;
        data: number[];
        events: (Event | null)[];
    }
}
