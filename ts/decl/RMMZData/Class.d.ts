declare namespace RMMZData {
    interface Class {
        id: number;
        expParams: number[];
        traits: Trait[];
        learnings: Learning[];
        name: string;
        note: string;
        params: number[][];
        meta: MetaDataType;
    }
}
