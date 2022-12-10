//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 *
 * @namespace
 */
class Graphics {
    static _width: number;
    static _height: number;
    static _defaultScale: number;
    static _realScale: number;
    static _errorPrinter: any;
    static _tickHandler: any;
    static _canvas: any;
    static _fpsCounter: any;
    static _loadingSpinner: any;
    static _stretchEnabled: boolean;
    static _app: any;
    static _effekseer: any;
    static _wasLoading: boolean;
    static frameCount: number;
    static boxWidth: number;
    static boxHeight: number;

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the graphics system.
     *
     * @returns {boolean} True if the graphics system is available.
     */
    static initialize() {
        this._width = 0;
        this._height = 0;
        this._defaultScale = 1;
        this._realScale = 1;
        this._errorPrinter = null;
        this._tickHandler = null;
        this._canvas = null;
        this._fpsCounter = null;
        this._loadingSpinner = null;
        this._stretchEnabled = this._defaultStretchMode();
        this._app = null;
        this._effekseer = null;
        this._wasLoading = false;

        /**
         * The total frame count of the game screen.
         *
         * @type number
         * @name Graphics.frameCount
         */
        this.frameCount = 0;

        /**
         * The width of the window display area.
         *
         * @type number
         * @name Graphics.boxWidth
         */
        this.boxWidth = this._width;

        /**
         * The height of the window display area.
         *
         * @type number
         * @name Graphics.boxHeight
         */
        this.boxHeight = this._height;

        this._updateRealScale();
        this._createAllElements();
        this._disableContextMenu();
        this._setupEventHandlers();
        this._createPixiApp();
        this._createEffekseerContext();

        return !!this._app;
    }

    /**
     * The PIXI.Application object.
     *
     * @readonly
     * @type PIXI.Application
     * @name Graphics.app
     */
    static get app() { return this._app; }

    /**
     * The context object of Effekseer.
     *
     * @readonly
     * @type EffekseerContext
     * @name Graphics.effekseer
     */
    static get effekseer() { return this._effekseer; }

    /**
     * Register a handler for tick events.
     *
     * @param {function} handler - The listener function to be added for updates.
     */
    static setTickHandler(handler: (deltaTime: any) => void) {
        this._tickHandler = handler;
    }

    /**
     * Starts the game loop.
     */
    static startGameLoop() {
        if (this._app) {
            this._app.start();
        }
    }

    /**
     * Stops the game loop.
     */
    static stopGameLoop() {
        if (this._app) {
            this._app.stop();
        }
    }

    /**
     * Sets the stage to be rendered.
     *
     * @param {Stage} stage - The stage object to be rendered.
     */
    static setStage(stage: Stage | null) {
        if (this._app) {
            this._app.stage = stage;
        }
    }

    /**
     * Shows the loading spinner.
     */
    static startLoading() {
        if (!document.getElementById("loadingSpinner")) {
            document.body.appendChild(this._loadingSpinner);
        }
    }

    /**
     * Erases the loading spinner.
     *
     * @returns {boolean} True if the loading spinner was active.
     */
    static endLoading() {
        if (document.getElementById("loadingSpinner")) {
            document.body.removeChild(this._loadingSpinner);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Displays the error text to the screen.
     *
     * @param {string} name - The name of the error.
     * @param {string} message - The message of the error.
     * @param {Error} [error] - The error object.
     */
    static printError(name: string, message: string, error: string | null = null) {
        if (!this._errorPrinter) {
            this._createErrorPrinter();
        }
        this._errorPrinter.innerHTML = this._makeErrorHtml(name, message, error);
        this._wasLoading = this.endLoading();
        this._applyCanvasFilter();
    }

    /**
     * Displays a button to try to reload resources.
     *
     * @param {function} retry - The callback function to be called when the button
     *                           is pressed.
     */
    static showRetryButton(retry: { (): void; (): void; }) {
        const button = document.createElement("button");
        button.id = "retryButton";
        button.innerHTML = "Retry";
        // [Note] stopPropagation() is required for iOS Safari.
        button.ontouchstart = e => e.stopPropagation();
        button.onclick = () => {
            Graphics.eraseError();
            retry();
        };
        this._errorPrinter.appendChild(button);
        button.focus();
    }

    /**
     * Erases the loading error text.
     */
    static eraseError() {
        if (this._errorPrinter) {
            this._errorPrinter.innerHTML = this._makeErrorHtml();
            if (this._wasLoading) {
                this.startLoading();
            }
        }
        this._clearCanvasFilter();
    }

    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     *
     * @param {number} x - The x coordinate on the page to be converted.
     * @returns {number} The x coordinate on the canvas area.
     */
    static pageToCanvasX(x: number) {
        if (this._canvas) {
            const left = this._canvas.offsetLeft;
            return Math.round((x - left) / this._realScale);
        } else {
            return 0;
        }
    }

    /**
     * Converts a y coordinate on the page to the corresponding
     * y coordinate on the canvas area.
     *
     * @param {number} y - The y coordinate on the page to be converted.
     * @returns {number} The y coordinate on the canvas area.
     */
    static pageToCanvasY(y: number) {
        if (this._canvas) {
            const top = this._canvas.offsetTop;
            return Math.round((y - top) / this._realScale);
        } else {
            return 0;
        }
    }

    /**
     * Checks whether the specified point is inside the game canvas area.
     *
     * @param {number} x - The x coordinate on the canvas area.
     * @param {number} y - The y coordinate on the canvas area.
     * @returns {boolean} True if the specified point is inside the game canvas area.
     */
    static isInsideCanvas(x: number, y: number) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    /**
     * Shows the game screen.
     */
    static showScreen() {
        this._canvas.style.opacity = 1;
    }

    /**
     * Hides the game screen.
     */
    static hideScreen() {
        this._canvas.style.opacity = 0;
    }

    /**
     * Changes the size of the game screen.
     *
     * @param {number} width - The width of the game screen.
     * @param {number} height - The height of the game screen.
     */
    static resize(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._app.renderer.resize(width, height);
        this._updateAllElements();
    }

    /**
     * The width of the game screen.
     *
     * @type number
     * @name Graphics.width
     */
    static get width() { return this._width; }
    static set width(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    }


    /**
     * The height of the game screen.
     *
     * @type number
     * @name Graphics.height
     */
    static get height() { return this._height; }
    static set height(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    }

    /**
     * The default zoom scale of the game screen.
     *
     * @type number
     * @name Graphics.defaultScale
     */
    static get defaultScale() { return this._defaultScale; }
    static set defaultScale(value) {
        if (this._defaultScale !== value) {
            this._defaultScale = value;
            this._updateAllElements();
        }
    }

    static _createAllElements() {
        this._createErrorPrinter();
        this._createCanvas();
        this._createLoadingSpinner();
        this._createFPSCounter();
    }

    static _updateAllElements() {
        this._updateRealScale();
        this._updateErrorPrinter();
        this._updateCanvas();
        this._updateVideo();
    }

    static _onTick(deltaTime: any) {
        this._fpsCounter.startTick();
        if (this._tickHandler) {
            this._tickHandler(deltaTime);
        }
        if (this._canRender()) {
            this._app.render();
        }
        this._fpsCounter.endTick();
    }

    static _canRender() {
        return !!this._app.stage;
    }

    static _updateRealScale() {
        if (this._stretchEnabled && this._width > 0 && this._height > 0) {
            const h = this._stretchWidth() / this._width;
            const v = this._stretchHeight() / this._height;
            this._realScale = Math.min(h, v);
            window.scrollTo(0, 0);
        } else {
            this._realScale = this._defaultScale;
        }
    }

    static _stretchWidth() {
        if (Utils.isMobileDevice()) {
            return document.documentElement.clientWidth;
        } else {
            return window.innerWidth;
        }
    }

    static _stretchHeight() {
        if (Utils.isMobileDevice()) {
            // [Note] Mobile browsers often have special operations at the top and
            //   bottom of the screen.
            const rate = Utils.isLocal() ? 1.0 : 0.9;
            return document.documentElement.clientHeight * rate;
        } else {
            return window.innerHeight;
        }
    }

    static _makeErrorHtml(name: string | undefined | null = null, message: string | undefined | null = null, error?: string | undefined  | null) {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = Utils.escapeHtml(name || "");
        messageDiv.innerHTML = Utils.escapeHtml(message || "");
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }

    static _defaultStretchMode() {
        return Utils.isNwjs() || Utils.isMobileDevice();
    }

    static _createErrorPrinter() {
        this._errorPrinter = document.createElement("div");
        this._errorPrinter.id = "errorPrinter";
        this._errorPrinter.innerHTML = this._makeErrorHtml();
        document.body.appendChild(this._errorPrinter);
    }

    static _updateErrorPrinter() {
        const width = 640 * this._realScale;
        const height = 100 * this._realScale;
        this._errorPrinter.style.width = width + "px";
        this._errorPrinter.style.height = height + "px";
    }

    static _createCanvas() {
        this._canvas = document.createElement("canvas");
        this._canvas.id = "gameCanvas";
        this._updateCanvas();
        document.body.appendChild(this._canvas);
    }

    static _updateCanvas() {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.zIndex = 1;
        this._centerElement(this._canvas);
    }

    static _updateVideo() {
        const width = this._width * this._realScale;
        const height = this._height * this._realScale;
        Video.resize(width, height);
    }

    static _createLoadingSpinner() {
        const loadingSpinner = document.createElement("div");
        const loadingSpinnerImage = document.createElement("div");
        loadingSpinner.id = "loadingSpinner";
        loadingSpinnerImage.id = "loadingSpinnerImage";
        loadingSpinner.appendChild(loadingSpinnerImage);
        this._loadingSpinner = loadingSpinner;
    }

    static _createFPSCounter() {
        this._fpsCounter = new Graphics.FPSCounter();
    }

    static _centerElement(element: any) {
        const width = element.width * this._realScale;
        const height = element.height * this._realScale;
        element.style.position = "absolute";
        element.style.margin = "auto";
        element.style.top = 0;
        element.style.left = 0;
        element.style.right = 0;
        element.style.bottom = 0;
        element.style.width = width + "px";
        element.style.height = height + "px";
    }

    static _disableContextMenu() {
        const elements = document.body.getElementsByTagName("*");
        const oncontextmenu = () => false;
        for (const element of elements) {
            (element as any).oncontextmenu = oncontextmenu;
        }
    }

    static _applyCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = 0.5;
            this._canvas.style.filter = "blur(8px)";
            this._canvas.style.webkitFilter = "blur(8px)";
        }
    }

    static _clearCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = 1;
            this._canvas.style.filter = "";
            this._canvas.style.webkitFilter = "";
        }
    }

    static _setupEventHandlers() {
        window.addEventListener("resize", this._onWindowResize.bind(this));
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }

    static _onWindowResize() {
        this._updateAllElements();
    }

    static _onKeyDown(event: { ctrlKey: any; altKey: any; keyCode: any; preventDefault: () => void; }) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 113: // F2
                    event.preventDefault();
                    this._switchFPSCounter();
                    break;
                case 114: // F3
                    event.preventDefault();
                    this._switchStretchMode();
                    break;
                case 115: // F4
                    event.preventDefault();
                    this._switchFullScreen();
                    break;
            }
        }
    }

    static _switchFPSCounter() {
        this._fpsCounter.switchMode();
    }

    static _switchStretchMode() {
        this._stretchEnabled = !this._stretchEnabled;
        this._updateAllElements();
    }

    static _switchFullScreen() {
        if (this._isFullScreen()) {
            this._cancelFullScreen();
        } else {
            this._requestFullScreen();
        }
    }

    static _isFullScreen() {
        return (
            (document as any).fullScreenElement ||
            (document as any).mozFullScreen ||
            (document as any).webkitFullscreenElement
        );
    }

    static _requestFullScreen() {
        const element: any = document.body;
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen((Element as any).ALLOW_KEYBOARD_INPUT);
        }
    }

    static _cancelFullScreen() {
        if ((document as any).cancelFullScreen) {
            (document as any).cancelFullScreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitCancelFullScreen) {
            (document as any).webkitCancelFullScreen();
        }
    }

    static _createPixiApp() {
        try {
            this._setupPixi();
            this._app = new PIXI.Application({
                view: this._canvas,
                autoStart: false
            });
            this._app.ticker.remove(this._app.render, this._app);
            this._app.ticker.add(this._onTick, this);
        } catch (e) {
            this._app = null;
        }
    }

    static _setupPixi() {
        PIXI.utils.skipHello();
        PIXI.settings.GC_MAX_IDLE = 600;
    }

    static _createEffekseerContext() {
        if (this._app && window.effekseer) {
            try {
                this._effekseer = effekseer.createContext();
                if (this._effekseer) {
                    this._effekseer.init(this._app.renderer.gl);
                    this._effekseer.setRestorationOfStatesFlag(false);
                }
            } catch (e) {
                this._app = null;
            }
        }
    }

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // FPSCounter
    //
    // This is based on Darsain's FPSMeter which is under the MIT license.
    // The original can be found at https://github.com/Darsain/fpsmeter.

    public static FPSCounter = class {
        _tickCount!: number;
        _frameTime!: number;
        _frameStart!: number;
        _lastLoop!: number;
        _showFps!: boolean;
        fps!: number;
        duration!: number;
        _boxDiv!: any;
        _labelDiv!: HTMLDivElement;
        _numberDiv!: HTMLDivElement;

        constructor(...args: any[]) {
            this.initialize(...args as []);
        }

        initialize() {
            this._tickCount = 0;
            this._frameTime = 100;
            this._frameStart = 0;
            this._lastLoop = performance.now() - 100;
            this._showFps = true;
            this.fps = 0;
            this.duration = 0;
            this._createElements();
            this._update();
        }

        startTick() {
            this._frameStart = performance.now();
        }

        endTick() {
            const time = performance.now();
            const thisFrameTime = time - this._lastLoop;
            this._frameTime += (thisFrameTime - this._frameTime) / 12;
            this.fps = 1000 / this._frameTime;
            this.duration = Math.max(0, time - this._frameStart);
            this._lastLoop = time;
            if (this._tickCount++ % 15 === 0) {
                this._update();
            }
        }

        switchMode() {
            if (this._boxDiv.style.display === "none") {
                this._boxDiv.style.display = "block";
                this._showFps = true;
            } else if (this._showFps) {
                this._showFps = false;
            } else {
                this._boxDiv.style.display = "none";
            }
            this._update();
        }

        _createElements() {
            this._boxDiv = document.createElement("div");
            this._labelDiv = document.createElement("div");
            this._numberDiv = document.createElement("div");
            this._boxDiv.id = "fpsCounterBox";
            this._labelDiv.id = "fpsCounterLabel";
            this._numberDiv.id = "fpsCounterNumber";
            this._boxDiv.style.display = "none";
            this._boxDiv.appendChild(this._labelDiv);
            this._boxDiv.appendChild(this._numberDiv);
            document.body.appendChild(this._boxDiv);
        }

        _update() {
            const count = this._showFps ? this.fps : this.duration;
            this._labelDiv.textContent = this._showFps ? "FPS" : "ms";
            this._numberDiv.textContent = count.toFixed(0);
        }
    }
}
