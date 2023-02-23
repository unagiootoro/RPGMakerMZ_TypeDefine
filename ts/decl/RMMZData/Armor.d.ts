declare namespace RMMZData {
    interface Armor {
        id: number;
        atypeId: number;
        description: string;
        etypeId: number;
        traits: Trait[];
        iconIndex: number;
        name: string;
        note: string;
        params: number[];
        price: number;
        meta: MetaDataType;
    }
}
