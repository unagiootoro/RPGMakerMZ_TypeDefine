//-----------------------------------------------------------------------------
// Window_StatusBase
//
// The superclass of windows for displaying actor status.

class Window_StatusBase extends Window_Selectable {
    protected _additionalSprites: any;

    initialize(rect: Rectangle) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._additionalSprites = {};
        this.loadFaceImages();
    }

    loadFaceImages() {
        for (const actor of $gameParty.members()) {
            ImageManager.loadFace(actor.faceName());
        }
    }

    refresh() {
        this.hideAdditionalSprites();
        Window_Selectable.prototype.refresh.call(this);
    }

    hideAdditionalSprites() {
        for (const sprite of Object.values(this._additionalSprites) as Sprite[]) {
            sprite.hide();
        }
    }

    placeActorName(actor: Game_Actor, x: number, y: number) {
        const key = "actor%1-name".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_Name);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    }

    placeStateIcon(actor: Game_Actor, x: number, y: number) {
        const key = "actor%1-stateIcon".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_StateIcon);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    }

    placeGauge(actor: Game_Actor, type: string, x: number, y: number) {
        const key = "actor%1-gauge-%2".format(actor.actorId(), type);
        const sprite = this.createInnerSprite(key, Sprite_Gauge);
        sprite.setup(actor, type);
        sprite.move(x, y);
        sprite.show();
    }

    createInnerSprite(key: string, spriteClass: any) {
        const dict = this._additionalSprites;
        if (dict[key]) {
            return dict[key];
        } else {
            const sprite = new spriteClass();
            dict[key] = sprite;
            this.addInnerChild(sprite);
            return sprite;
        }
    }

    placeTimeGauge(actor: Game_Actor, x: number, y: number) {
        if (BattleManager.isTpb()) {
            this.placeGauge(actor, "time", x, y);
        }
    }

    placeBasicGauges(actor: Game_Actor, x: number, y: number) {
        this.placeGauge(actor, "hp", x, y);
        this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight());
        if ($dataSystem.optDisplayTp) {
            this.placeGauge(actor, "tp", x, y + this.gaugeLineHeight() * 2);
        }
    }

    gaugeLineHeight() {
        return 24;
    }

    drawActorCharacter(actor: Game_Actor, x: number, y: number) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    }

    // prettier-ignore
    drawActorFace(
        actor: Game_Actor, x: number, y: number, width?: number, height?: number
    ) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    }

    drawActorName(actor: Game_Actor, x: number, y: number, width?: number) {
        width = width || 168;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    }

    drawActorClass(actor: Game_Actor, x: number, y: number, width?: number) {
        width = width || 168;
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    }

    drawActorNickname(actor: Game_Actor, x: number, y: number, width: number) {
        width = width || 270;
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    }

    drawActorLevel(actor: Game_Actor, x: number, y: number) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 84, y, 36, "right");
    }

    drawActorIcons(actor: Game_Actor, x: number, y: number, width?: number) {
        width = width || 144;
        const iconWidth = ImageManager.iconWidth;
        const icons = actor.allIcons().slice(0, Math.floor(width / iconWidth));
        let iconX = x;
        for (const icon of icons) {
            this.drawIcon(icon, iconX, y + 2);
            iconX += iconWidth;
        }
    }

    drawActorSimpleStatus(actor: Game_Actor, x: number, y: number) {
        const lineHeight = this.lineHeight();
        const x2 = x + 180;
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.placeBasicGauges(actor, x2, y + lineHeight);
    }

    actorSlotName(actor: Game_Actor, index: number) {
        const slots = actor.equipSlots();
        return $dataSystem.equipTypes[slots[index]];
    }
}
