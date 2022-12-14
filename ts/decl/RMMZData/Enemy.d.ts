declare namespace RMMZData {
    interface Enemy {
        id: number;
        actions: Action[];
        battlerHue: number;
        battlerName: string;
        dropItems: DropItem[];
        exp: number;
        traits: Trait[];
        gold: number;
        name: string;
        note: string;
        params: [number, number, number, number, number, number, number, number];
    }
}
