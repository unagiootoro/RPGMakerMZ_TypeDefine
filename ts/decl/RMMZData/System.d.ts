declare namespace RMMZData {
    interface System {
        advanced: {
            gameId: number;
            screenWidth: number;
            screenHeight: number;
            uiAreaWidth: number;
            uiAreaHeight: number;
            numberFontFilename: string;
            fallbackFonts: string;
            fontSize: number;
            mainFontFilename: string;
            windowOpacity: number;
        };
        airship: Vehicle;
        armorTypes: string[];
        attackMotions: {
            type: number;
            weaponImageId: number;
        }[];
        battleBgm: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
        battleback1Name: string;
        battleback2Name: string;
        battlerHue: number;
        battlerName: string;
        battleSystem: number;
        boat: Vehicle;
        currencyUnit: string;
        defeatMe: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        },
        editMapId: number;
        elements: string[];
        equipTypes: string[];
        gameTitle: string;
        gameoverMe: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
        itemCategories: boolean[];
        locale: string;
        magicSkills: number[];
        menuCommands: boolean[];
        optAutosave: boolean;
        optDisplayTp: boolean;
        optDrawTitle: boolean;
        optExtraExp: boolean;
        optFloorDeath: boolean;
        optFollowers: true;
        optKeyItemsNumber: false;
        optSideView: boolean;
        optSlipDeath: boolean;
        optTransparent: boolean;
        partyMembers: number[];
        ship: Vehicle;
        skillTypes: string[]
        sounds: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        }[];
        startMapId: number;
        startX: number;
        startY: number;
        switches: string[];
        terms: {
            basic: string[];
            commands: string[];
            params: string[];
            messages: {
                alwaysDash: string;
                commandRemember: string;
                touchUI: string;
                bgmVolume: string;
                bgsVolume: string;
                meVolume: string;
                seVolume: string;
                possession: string;
                expTotal: string;
                expNext: string;
                saveMessage: string;
                loadMessage: string;
                file: string;
                autosave: string;
                partyName: string;
                emerge: string;
                preemptive: string;
                surprise: string;
                escapeStart: string;
                escapeFailure: string;
                victory: string;
                defeat: string;
                obtainExp: string;
                obtainGold: string;
                obtainItem: string;
                levelUp: string;
                obtainSkill: string;
                useItem: string;
                criticalToEnemy: string;
                criticalToActor: string;
                actorDamage: string;
                actorRecovery: string;
                actorGain: string;
                actorLoss: string;
                actorDrain: string;
                actorNoDamage: string;
                actorNoHit: string;
                enemyDamage: string;
                enemyRecovery: string;
                enemyGain: string;
                enemyLoss: string;
                enemyDrain: string;
                enemyNoDamage: string;
                enemyNoHit: string;
                evasion: string;
                magicEvasion: string;
                magicReflection: string;
                counterAttack: string;
                substitute: string;
                buffAdd: string;
                debuffAdd: string;
                buffRemove: string;
                actionFailure: string;
            }
        };
        testBattlers: {
            actorId: number;
            level: number;
            equips: number[];
        }[];
        testTroopId: number;
        title1Name: string;
        title2Name: string;
        titleBgm: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
        titleCommandWindow: {
            background: number;
            offsetX: number;
            offsetY: number;
        };
        variables: string[];
        versionId: number,
        victoryMe: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
        weaponTypes: string[];
        windowTone: [number, number, number, number];
        tileSize: number;
        hasEncryptedImages?: any;
        hasEncryptedAudio?: any;
        encryptionKey?: string;
    }

    interface Vehicle {
        bgm: {
            name: string;
            pan: number;
            pitch: number;
            volume: number;
        };
        characterIndex: number;
        characterName: string;
        startMapId: number;
        startX: number;
        startY: number;
    }
}
