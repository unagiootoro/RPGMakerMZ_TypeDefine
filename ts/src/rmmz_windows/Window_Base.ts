//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

class Window_Base extends _Window {
    protected _opening!: boolean;
    protected _closing!: boolean;
    protected _dimmerSprite!: Sprite | null;

    constructor(rect: Rectangle);

    constructor(...args: any[]) {
        super(...args as []);
    }

    initialize(...args: any[]) {
        const [rect] = args;
        super.initialize();
        this.loadWindowskin();
        this.checkRectObject(rect);
        this.move(rect.x, rect.y, rect.width, rect.height);
        this.updatePadding();
        this.updateBackOpacity();
        this.updateTone();
        this.createContents();
        this._opening = false;
        this._closing = false;
        this._dimmerSprite = null;
    }

    destroy(options: any) {
        this.destroyContents();
        if (this._dimmerSprite) {
            this._dimmerSprite.bitmap.destroy();
        }
        _Window.prototype.destroy.call(this, options);
    }

    checkRectObject(rect: any) {
        if (typeof rect !== "object" || !("x" in rect)) {
            // Probably MV plugin is used
            throw new Error("Argument must be a Rectangle");
        }
    }

    lineHeight() {
        return 36;
    }

    itemWidth() {
        return this.innerWidth;
    }

    itemHeight() {
        return this.lineHeight();
    }

    itemPadding() {
        return 8;
    }

    baseTextRect() {
        const rect = new Rectangle(0, 0, this.innerWidth, this.innerHeight);
        rect.pad(-this.itemPadding(), 0);
        return rect;
    }

    loadWindowskin() {
        this.windowskin = ImageManager.loadSystem("Window");
    }

    updatePadding() {
        this.padding = $gameSystem.windowPadding();
    }

    updateBackOpacity() {
        this.backOpacity = $gameSystem.windowOpacity();
    }

    fittingHeight(numLines: number) {
        return numLines * this.itemHeight() + $gameSystem.windowPadding() * 2;
    }

    updateTone() {
        const tone = $gameSystem.windowTone();
        this.setTone(tone[0], tone[1], tone[2]);
    }

    createContents() {
        const width = this.contentsWidth();
        const height = this.contentsHeight();
        this.destroyContents();
        this.contents = new Bitmap(width, height);
        this.contentsBack = new Bitmap(width, height);
        this.resetFontSettings();
    }

    destroyContents() {
        if (this.contents) {
            this.contents.destroy();
        }
        if (this.contentsBack) {
            this.contentsBack.destroy();
        }
    }

    contentsWidth() {
        return this.innerWidth;
    }

    contentsHeight() {
        return this.innerHeight;
    }

    resetFontSettings() {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = $gameSystem.mainFontSize();
        this.resetTextColor();
    }

    resetTextColor() {
        this.changeTextColor(ColorManager.normalColor());
        this.changeOutlineColor(ColorManager.outlineColor());
    }

    update() {
        _Window.prototype.update.call(this);
        this.updateTone();
        this.updateOpen();
        this.updateClose();
        this.updateBackgroundDimmer();
    }

    updateOpen() {
        if (this._opening) {
            this.openness += 32;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    }

    updateClose() {
        if (this._closing) {
            this.openness -= 32;
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    }

    open() {
        if (!this.isOpen()) {
            this._opening = true;
        }
        this._closing = false;
    }

    close() {
        if (!this.isClosed()) {
            this._closing = true;
        }
        this._opening = false;
    }

    isOpening() {
        return this._opening;
    }

    isClosing() {
        return this._closing;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    systemColor() {
        return ColorManager.systemColor();
    }

    translucentOpacity() {
        return 160;
    }

    changeTextColor(color: any) {
        this.contents.textColor = color;
    }

    changeOutlineColor(color: string) {
        this.contents.outlineColor = color;
    }

    changePaintOpacity(enabled: number | boolean | null) {
        this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
    }

    drawRect(x: number, y: number, width: number, height: number) {
        const outlineColor = this.contents.outlineColor;
        const mainColor = this.contents.textColor;
        this.contents.fillRect(x, y, width, height, outlineColor);
        this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
    }

    drawText(text: string | number, x: number, y: number, maxWidth?: number, align: CanvasTextAlign = "left") {
        this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
    }

    textWidth(text: string) {
        return this.contents.measureTextWidth(text);
    }

    drawTextEx(text: any, x: number, y: number, width: number) {
        this.resetFontSettings();
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    textSizeEx(text: any) {
        this.resetFontSettings();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.drawing = false;
        this.processAllText(textState);
        return { width: textState.outputWidth, height: textState.outputHeight };
    }

    createTextState(text: any, x: number, y: number, width: number): any {
        const rtl = Utils.containsArabic(text);
        const textState: any = {};
        textState.text = this.convertEscapeCharacters(text);
        textState.index = 0;
        textState.x = rtl ? x + width : x;
        textState.y = y;
        textState.width = width;
        textState.height = this.calcTextHeight(textState);
        textState.startX = textState.x;
        textState.startY = textState.y;
        textState.rtl = rtl;
        textState.buffer = this.createTextBuffer(rtl);
        textState.drawing = true;
        textState.outputWidth = 0;
        textState.outputHeight = 0;
        return textState;
    }

    processAllText(textState: { index?: any; text?: any; }) {
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        this.flushTextState(textState);
    }

    flushTextState(textState: any) {
        const text = textState.buffer;
        const rtl = textState.rtl;
        const width = this.textWidth(text);
        const height = textState.height;
        const x = rtl ? textState.x - width : textState.x;
        const y = textState.y;
        if (textState.drawing) {
            this.contents.drawText(text, x, y, width, height);
        }
        textState.x += rtl ? -width : width;
        textState.buffer = this.createTextBuffer(rtl);
        const outputWidth = Math.abs(textState.x - textState.startX);
        if (textState.outputWidth < outputWidth) {
            textState.outputWidth = outputWidth;
        }
        textState.outputHeight = y - textState.startY + height;
    }

    createTextBuffer(rtl: boolean) {
        // U+202B: RIGHT-TO-LEFT EMBEDDING
        return rtl ? "\u202B" : "";
    }

    convertEscapeCharacters(text: string) {
        /* eslint no-control-regex: 0 */
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        text = text.replace(/\x1bV\[(\d+)\]/gi, (_: any, p1: string) =>
            $gameVariables.value(parseInt(p1)) as any
        );
        text = text.replace(/\x1bV\[(\d+)\]/gi, (_: any, p1: string) =>
            $gameVariables.value(parseInt(p1)) as any
        );
        text = text.replace(/\x1bN\[(\d+)\]/gi, (_: any, p1: string) =>
            this.actorName(parseInt(p1))
        );
        text = text.replace(/\x1bP\[(\d+)\]/gi, (_: any, p1: string) =>
            this.partyMemberName(parseInt(p1))
        );
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    }

    actorName(n: number) {
        const actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : "";
    }

    partyMemberName(n: number) {
        const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : "";
    }

    processCharacter(textState: any) {
        const c = textState.text[textState.index++];
        if (c.charCodeAt(0) < 0x20) {
            this.flushTextState(textState);
            this.processControlCharacter(textState, c);
        } else {
            textState.buffer += c;
        }
    }

    processControlCharacter(textState: any, c: string) {
        if (c === "\n") {
            this.processNewLine(textState);
        }
        if (c === "\x1b") {
            const code = this.obtainEscapeCode(textState);
            this.processEscapeCharacter(code, textState);
        }
    }

    processNewLine(textState: { x: any; startX: any; y: any; height: any; }) {
        textState.x = textState.startX;
        textState.y += textState.height;
        textState.height = this.calcTextHeight(textState);
    }

    obtainEscapeCode(textState: { text: string; index: number; }) {
        const regExp = /^[$.|^!><{}\\]|^[A-Z]+/i;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].toUpperCase();
        } else {
            return "";
        }
    }

    obtainEscapeParam(textState: any) {
        const regExp = /^\[\d+\]/;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        } else {
            return "";
        }
    }

    processEscapeCharacter(code: string, textState: any) {
        switch (code) {
            case "C":
                this.processColorChange(this.obtainEscapeParam(textState) as number);
                break;
            case "I":
                this.processDrawIcon(this.obtainEscapeParam(textState) as number, textState);
                break;
            case "PX":
                textState.x = this.obtainEscapeParam(textState);
                break;
            case "PY":
                textState.y = this.obtainEscapeParam(textState);
                break;
            case "FS":
                this.contents.fontSize = this.obtainEscapeParam(textState) as any;
                break;
            case "{":
                this.makeFontBigger();
                break;
            case "}":
                this.makeFontSmaller();
                break;
        }
    }

    processColorChange(colorIndex: number) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
    }

    processDrawIcon(iconIndex: number, textState: any) {
        if (textState.drawing) {
            this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
        }
        textState.x += ImageManager.iconWidth + 4;
    }

    makeFontBigger() {
        if (this.contents.fontSize <= 96) {
            this.contents.fontSize += 12;
        }
    }

    makeFontSmaller() {
        if (this.contents.fontSize >= 24) {
            this.contents.fontSize -= 12;
        }
    }

    calcTextHeight(textState: any) {
        const lineSpacing = this.lineHeight() - $gameSystem.mainFontSize();
        const lastFontSize = this.contents.fontSize;
        const lines = textState.text.slice(textState.index).split("\n");
        const textHeight = this.maxFontSizeInLine(lines[0]) + lineSpacing;
        this.contents.fontSize = lastFontSize;
        return textHeight;
    }

    maxFontSizeInLine(line: string) {
        let maxFontSize = this.contents.fontSize;
        const regExp = /\x1b({|}|FS)(\[(\d+)])?/gi;
        for (; ;) {
            const array = regExp.exec(line);
            if (!array) {
                break;
            }
            const code = String(array[1]).toUpperCase();
            if (code === "{") {
                this.makeFontBigger();
            } else if (code === "}") {
                this.makeFontSmaller();
            } else if (code === "FS") {
                this.contents.fontSize = parseInt(array[3]);
            }
            if (this.contents.fontSize > maxFontSize) {
                maxFontSize = this.contents.fontSize;
            }
        }
        return maxFontSize;
    }

    drawIcon(iconIndex: number, x: any, y: any) {
        const bitmap = ImageManager.loadSystem("IconSet");
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (iconIndex % 16) * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
    }

    // prettier-ignore
    drawFace(
        faceName: any, faceIndex: number, x: number, y: number, width?: number, height?: number
    ) {
        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;
        const bitmap = ImageManager.loadFace(faceName);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
        const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2);
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    }

    // prettier-ignore
    drawCharacter(
        characterName: string, characterIndex: number, x: number, y: number
    ) {
        const bitmap = ImageManager.loadCharacter(characterName);
        const big = ImageManager.isBigCharacter(characterName);
        const pw = bitmap.width / (big ? 3 : 12);
        const ph = bitmap.height / (big ? 4 : 8);
        const n = big ? 0 : characterIndex;
        const sx = ((n % 4) * 3 + 1) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    }

    drawItemName(item: ItemObject | null, x: number, y: number, width: number) {
        if (item) {
            const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
            const textMargin = ImageManager.iconWidth + 4;
            const itemWidth = Math.max(0, width - textMargin);
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x, iconY);
            this.drawText(item.name, x + textMargin, y, itemWidth);
        }
    }

    drawCurrencyValue(value: string | number, unit: any, x: number, y: number, width: number) {
        const unitWidth = Math.min(80, this.textWidth(unit));
        this.resetTextColor();
        this.drawText(value, x, y, width - unitWidth - 6, "right");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
    }

    setBackgroundType(type: number) {
        if (type === 0) {
            this.opacity = 255;
        } else {
            this.opacity = 0;
        }
        if (type === 1) {
            this.showBackgroundDimmer();
        } else {
            this.hideBackgroundDimmer();
        }
    }

    showBackgroundDimmer() {
        if (!this._dimmerSprite) {
            this.createDimmerSprite();
        }
        const bitmap = this._dimmerSprite!.bitmap;
        if (bitmap.width !== this.width || bitmap.height !== this.height) {
            this.refreshDimmerBitmap();
        }
        this._dimmerSprite!.visible = true;
        this.updateBackgroundDimmer();
    }

    createDimmerSprite() {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this._dimmerSprite.x = -4;
        this.addChildToBack(this._dimmerSprite);
    }

    hideBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.visible = false;
        }
    }

    updateBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.opacity = this.openness;
        }
    }

    refreshDimmerBitmap() {
        if (this._dimmerSprite) {
            const bitmap = this._dimmerSprite.bitmap;
            const w = this.width > 0 ? this.width + 8 : 0;
            const h = this.height;
            const m = this.padding;
            const c1 = ColorManager.dimColor1();
            const c2 = ColorManager.dimColor2();
            bitmap.resize(w, h);
            bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
            bitmap.fillRect(0, m, w, h - m * 2, c1);
            bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
            this._dimmerSprite.setFrame(0, 0, w, h);
        }
    }

    playCursorSound() {
        SoundManager.playCursor();
    }

    playOkSound() {
        SoundManager.playOk();
    }

    playBuzzerSound() {
        SoundManager.playBuzzer();
    }
}
