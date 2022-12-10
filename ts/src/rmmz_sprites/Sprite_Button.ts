//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

class Sprite_Button extends Sprite_Clickable {
    protected _buttonType!: string;
    protected _clickHandler!: Function | null;
    protected _coldFrame!: Rectangle | null;
    protected _hotFrame!: Rectangle | null;

    constructor(buttonType: string);

    constructor(...args: []) {
        super(...args);
    }

    initialize(buttonType: string): void;

    initialize(...args: any[]) {
        const [buttonType] = args;
        Sprite_Clickable.prototype.initialize.call(this);
        this._buttonType = buttonType;
        this._clickHandler = null;
        this._coldFrame = null;
        this._hotFrame = null;
        this.setupFrames();
    }

    setupFrames() {
        const data = this.buttonData();
        const x = data.x * this.blockWidth();
        const width = data.w * this.blockWidth();
        const height = this.blockHeight();
        this.loadButtonImage();
        this.setColdFrame(x, 0, width, height);
        this.setHotFrame(x, height, width, height);
        this.updateFrame();
        this.updateOpacity();
    }

    blockWidth() {
        return 48;
    }

    blockHeight() {
        return 48;
    }

    loadButtonImage() {
        this.bitmap = ImageManager.loadSystem("ButtonSet");
    }

    buttonData(): { x: number, w: number } {
        const buttonTable: any = {
            cancel: { x: 0, w: 2 },
            pageup: { x: 2, w: 1 },
            pagedown: { x: 3, w: 1 },
            down: { x: 4, w: 1 },
            up: { x: 5, w: 1 },
            down2: { x: 6, w: 1 },
            up2: { x: 7, w: 1 },
            ok: { x: 8, w: 2 },
            menu: { x: 10, w: 1 }
        };
        return buttonTable[this._buttonType];
    }

    update() {
        Sprite_Clickable.prototype.update.call(this);
        this.checkBitmap();
        this.updateFrame();
        this.updateOpacity();
        this.processTouch();
    }

    checkBitmap() {
        if (this.bitmap.isReady() && this.bitmap.width < this.blockWidth() * 11) {
            // Probably MV image is used
            throw new Error("ButtonSet image is too small");
        }
    }

    updateFrame() {
        const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    }

    updateOpacity() {
        this.opacity = this._pressed ? 255 : 192;
    }

    setColdFrame(x: number, y: number, width: number, height: number) {
        this._coldFrame = new Rectangle(x, y, width, height);
    }

    setHotFrame(x: number, y: number, width: number, height: number) {
        this._hotFrame = new Rectangle(x, y, width, height);
    }

    setClickHandler(method: Function) {
        this._clickHandler = method;
    }

    onClick() {
        if (this._clickHandler) {
            this._clickHandler();
        } else {
            Input.virtualClick(this._buttonType);
        }
    }
}
