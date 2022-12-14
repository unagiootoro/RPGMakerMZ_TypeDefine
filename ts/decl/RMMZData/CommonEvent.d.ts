declare namespace RMMZData {
    interface CommonEvent {
        id: number;
        list: EventCommand[];
        name: string;
        switchId: number;
        trigger: number;
    }
}
