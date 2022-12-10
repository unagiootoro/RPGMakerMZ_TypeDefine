declare namespace RMMZData {
    interface Animation {
        id: number;
        displayType: number;
        effectName: string;
        flashTimings: AnimationFlashTiming[];
        name: string;
        offsetX: number;
        offsetY: number;
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        scale: number;
        soundTimings: AnimationSoundTiming[];
        speed: number;
    }

    interface AnimationFlashTiming {
        frame: number;
        duration: number;
        color: [number, number, number, number];
    }

    interface AnimationSoundTiming {
        frame: number;
        se: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
    }
}
