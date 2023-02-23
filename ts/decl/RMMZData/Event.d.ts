declare namespace RMMZData {
    interface Event {
        id: number;
        name: string;
        note: string;
        pages: EventPage[];
        x: number;
        y: number;
        meta: MetaDataType;
    }
}
