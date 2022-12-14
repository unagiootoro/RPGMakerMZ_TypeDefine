declare namespace RMMZData {
    type Animation = AnimationMZ | AnimationMV;

    interface AnimationMZ {
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

    interface AnimationMV {
        id: number;
        animation1Hue: number;
        animation1Name: string;
        animation2Hue: number;
        animation2Name: string;
        frames:  number[][][];
        name: string;
        position: number;
        timings:  AnimationTiming[];
        flashTimings: AnimationFlashTiming[];
        soundTimings: AnimationSoundTiming[];
    }

    interface AnimationTiming {
        flashColor: [number, number, number, number];
        flashDuration: number;
        flashScope: number;
        frame: number;
        se: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        }
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
