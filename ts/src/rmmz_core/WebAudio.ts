//-----------------------------------------------------------------------------
/**
 * The audio object of Web Audio API.
 *
 * @class
 * @param {string} url - The url of the audio file.
 */
class WebAudio {
    static _context: AudioContext | null;
    static _masterGainNode: any;
    static _masterVolume: number;

    protected _url!: string;
    protected _data!: any;
    protected _fetchedSize!: number;
    protected _fetchedData!: any[];
    protected _buffers!: any[];
    protected _sourceNodes!: any[];
    protected _gainNode!: any;
    protected _pannerNode!: any;
    protected _totalTime!: number;
    protected _sampleRate!: number;
    protected _loop!: boolean | number;
    protected _loopStart!: number;
    protected _loopLength!: number;
    protected _loopStartTime!: number;
    protected _loopLengthTime!: number;
    protected _startTime!: number;
    protected _volume!: number;
    protected _pitch!: number;
    protected _pan!: number;
    protected _endTimer!: any;
    protected _loadListeners!: any[];
    protected _stopListeners!: any[];
    protected _lastUpdateTime!: number;
    protected _isLoaded!: boolean;
    protected _isError!: boolean;
    protected _isPlaying!: boolean;
    protected _decoder!: any;

    constructor(url: string) {
        // @ts-ignore
        this.initialize(...arguments);
    }

    initialize(url: string) {
        this.clear();
        this._url = url;
        this._startLoading();
    }

    /**
     * Initializes the audio system.
     *
     * @returns {boolean} True if the audio system is available.
     */
    static initialize() {
        this._context = null;
        this._masterGainNode = null;
        this._masterVolume = 1;
        this._createContext();
        this._createMasterGainNode();
        this._setupEventHandlers();
        return !!this._context;
    }

    /**
     * Sets the master volume for all audio.
     *
     * @param {number} value - The master volume (0 to 1).
     */
    static setMasterVolume(value: number) {
        this._masterVolume = value;
        this._resetVolume();
    }

    static _createContext() {
        try {
            // @ts-ignore
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this._context = new AudioContext();
        } catch (e) {
            this._context = null;
        }
    }

    static _currentTime() {
        return this._context ? this._context.currentTime : 0;
    }

    static _createMasterGainNode() {
        const context = this._context;
        if (context) {
            this._masterGainNode = context.createGain();
            this._resetVolume();
            this._masterGainNode.connect(context.destination);
        }
    }

    static _setupEventHandlers() {
        const onUserGesture = this._onUserGesture.bind(this);
        const onVisibilityChange = this._onVisibilityChange.bind(this);
        document.addEventListener("keydown", onUserGesture);
        document.addEventListener("mousedown", onUserGesture);
        document.addEventListener("touchend", onUserGesture);
        document.addEventListener("visibilitychange", onVisibilityChange);
    }

    static _onUserGesture() {
        const context = this._context;
        if (context && context.state === "suspended") {
            context.resume();
        }
    }

    static _onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            this._onHide();
        } else {
            this._onShow();
        }
    }

    static _onHide() {
        if (this._shouldMuteOnHide()) {
            this._fadeOut(1);
        }
    }

    static _onShow() {
        if (this._shouldMuteOnHide()) {
            this._fadeIn(1);
        }
    }

    static _shouldMuteOnHide(): boolean {
        // @ts-ignore
        return Utils.isMobileDevice() && !window.navigator.standalone;
    }

    static _resetVolume() {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(volume, currentTime);
        }
    }

    static _fadeIn(duration: number) {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(volume, currentTime + duration);
        }
    }

    static _fadeOut(duration: number) {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(volume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
    }

    /**
     * Clears the audio data.
     */
    clear() {
        this.stop();
        this._data = null;
        this._fetchedSize = 0;
        this._fetchedData = [];
        this._buffers = [];
        this._sourceNodes = [];
        this._gainNode = null;
        this._pannerNode = null;
        this._totalTime = 0;
        this._sampleRate = 0;
        this._loop = 0;
        this._loopStart = 0;
        this._loopLength = 0;
        this._loopStartTime = 0;
        this._loopLengthTime = 0;
        this._startTime = 0;
        this._volume = 1;
        this._pitch = 1;
        this._pan = 0;
        this._endTimer = null;
        this._loadListeners = [];
        this._stopListeners = [];
        this._lastUpdateTime = 0;
        this._isLoaded = false;
        this._isError = false;
        this._isPlaying = false;
        this._decoder = null;
    }

    /**
     * The url of the audio file.
     *
     * @readonly
     * @type string
     * @name WebAudio#url
     */
    get url() { return this._url }

    /**
     * The volume of the audio.
     *
     * @type number
     * @name WebAudio#volume
     */
    get volume() { return this._volume }
    set volume(value) {
        this._volume = value;
        if (this._gainNode) {
            this._gainNode.gain.setValueAtTime(
                this._volume,
                WebAudio._currentTime()
            );
        }
    }

    /**
     * The pitch of the audio.
     *
     * @type number
     * @name WebAudio#pitch
     */
    get pitch() { return this._pitch }
    set pitch(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._loop as boolean, 0);
            }
        }
    }

    /**
     * The pan of the audio.
     *
     * @type number
     * @name WebAudio#pan
     */
    get pan() { return this._pan }
    set pan(value) {
        this._pan = value;
        this._updatePanner();
    }

    /**
     * Checks whether the audio data is ready to play.
     *
     * @returns {boolean} True if the audio data is ready to play.
     */
    isReady() {
        return this._buffers && this._buffers.length > 0;
    }

    /**
     * Checks whether a loading error has occurred.
     *
     * @returns {boolean} True if a loading error has occurred.
     */
    isError() {
        return this._isError;
    }

    /**
     * Checks whether the audio is playing.
     *
     * @returns {boolean} True if the audio is playing.
     */
    isPlaying() {
        return this._isPlaying;
    }

    /**
     * Plays the audio.
     *
     * @param {boolean} loop - Whether the audio data play in a loop.
     * @param {number} offset - The start position to play in seconds.
     */
    play(loop: boolean, offset?: number) {
        this._loop = loop;
        if (this.isReady()) {
            offset = offset || 0;
            this._startPlaying(offset);
        } else if (WebAudio._context) {
            this.addLoadListener(() => this.play(loop, offset));
        }
        this._isPlaying = true;
    }

    /**
     * Stops the audio.
     */
    stop() {
        this._isPlaying = false;
        this._removeEndTimer();
        this._removeNodes();
        this._loadListeners = [];
        if (this._stopListeners) {
            while (this._stopListeners.length > 0) {
                const listner = this._stopListeners.shift()!;
                listner();
            }
        }
    }

    /**
     * Destroys the audio.
     */
    destroy() {
        this._destroyDecoder();
        this.clear();
    }

    /**
     * Performs the audio fade-in.
     *
     * @param {number} duration - Fade-in time in seconds.
     */
    fadeIn(duration: any) {
        if (this.isReady()) {
            if (this._gainNode) {
                const gain = this._gainNode.gain;
                const currentTime = WebAudio._currentTime();
                gain.setValueAtTime(0, currentTime);
                gain.linearRampToValueAtTime(this._volume, currentTime + duration);
            }
        } else {
            this.addLoadListener(() => this.fadeIn(duration));
        }
    }

    /**
     * Performs the audio fade-out.
     *
     * @param {number} duration - Fade-out time in seconds.
     */
    fadeOut(duration: any) {
        if (this._gainNode) {
            const gain = this._gainNode.gain;
            const currentTime = WebAudio._currentTime();
            gain.setValueAtTime(this._volume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
        this._isPlaying = false;
        this._loadListeners = [];
    }

    /**
     * Gets the seek position of the audio.
     */
    seek() {
        if (WebAudio._context) {
            let pos = (WebAudio._currentTime() - this._startTime) * this._pitch;
            if (this._loopLengthTime > 0) {
                while (pos >= this._loopStartTime + this._loopLengthTime) {
                    pos -= this._loopLengthTime;
                }
            }
            return pos;
        } else {
            return 0;
        }
    }

    /**
     * Adds a callback function that will be called when the audio data is loaded.
     *
     * @param {function} listner - The callback function.
     */
    addLoadListener(listner: { (): void; (): void; }) {
        this._loadListeners.push(listner);
    }

    /**
     * Adds a callback function that will be called when the playback is stopped.
     *
     * @param {function} listner - The callback function.
     */
    addStopListener(listner: any) {
        this._stopListeners.push(listner);
    }

    /**
     * Tries to load the audio again.
     */
    retry() {
        this._startLoading();
        if (this._isPlaying) {
            this.play(this._loop as boolean, 0);
        }
    }

    _startLoading() {
        if (WebAudio._context) {
            const url = this._realUrl();
            if (Utils.isLocal()) {
                this._startXhrLoading(url);
            } else {
                this._startFetching(url);
            }
            const currentTime = WebAudio._currentTime();
            this._lastUpdateTime = currentTime - 0.5;
            this._isError = false;
            this._isLoaded = false;
            this._destroyDecoder();
            if (this._shouldUseDecoder()) {
                this._createDecoder();
            }
        }
    }

    _shouldUseDecoder(): boolean {
        // @ts-ignore
        return !Utils.canPlayOgg() && typeof VorbisDecoder === "function";
    }

    _createDecoder(): any {
        // @ts-ignore
        this._decoder = new VorbisDecoder(
            WebAudio._context,
            this._onDecode.bind(this),
            this._onError.bind(this)
        );
    }

    _destroyDecoder() {
        if (this._decoder) {
            this._decoder.destroy();
            this._decoder = null;
        }
    }

    _realUrl() {
        return this._url + (Utils.hasEncryptedAudio() ? "_" : "");
    }

    _startXhrLoading(url: string | URL) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => this._onXhrLoad(xhr);
        xhr.onerror = this._onError.bind(this);
        xhr.send();
    }

    _startFetching(url: URL | RequestInfo) {
        const options: any = { credentials: "same-origin" };
        fetch(url, options)
            .then(response => this._onFetch(response))
            .catch(() => this._onError());
    }

    _onXhrLoad(xhr: XMLHttpRequest) {
        if (xhr.status < 400) {
            this._data = new Uint8Array(xhr.response);
            this._isLoaded = true;
            this._updateBuffer();
        } else {
            this._onError();
        }
    }

    _onFetch(response: Response) {
        if (response.ok) {
            const reader = response.body!.getReader();
            const readChunk: any = ({ done, value }: any) => {
                if (done) {
                    this._isLoaded = true;
                    if (this._fetchedSize > 0) {
                        this._concatenateFetchedData();
                        this._updateBuffer();
                        this._data = null;
                    }
                    return 0;
                } else {
                    this._onFetchProcess(value);
                    return reader.read().then(readChunk);
                }
            }
            reader
                .read()
                .then(readChunk)
                .catch(() => this._onError());
        } else {
            this._onError();
        }
    }

    _onError() {
        if (this._sourceNodes.length > 0) {
            this._stopSourceNode();
        }
        this._data = null;
        this._isError = true;
    }

    _onFetchProcess(value: string | any[]) {
        this._fetchedSize += value.length;
        this._fetchedData.push(value);
        this._updateBufferOnFetch();
    }

    _updateBufferOnFetch() {
        const currentTime = WebAudio._currentTime();
        const deltaTime = currentTime - this._lastUpdateTime;
        const currentData = this._data;
        const currentSize = currentData ? currentData.length : 0;
        if (deltaTime >= 1 && currentSize + this._fetchedSize >= 200000) {
            this._concatenateFetchedData();
            this._updateBuffer();
            this._lastUpdateTime = currentTime;
        }
    }

    _concatenateFetchedData() {
        const currentData = this._data;
        const currentSize = currentData ? currentData.length : 0;
        const newData = new Uint8Array(currentSize + this._fetchedSize);
        let pos = 0;
        if (currentData) {
            newData.set(currentData);
            pos += currentSize;
        }
        for (const value of this._fetchedData) {
            newData.set(value, pos);
            pos += value.length;
        }
        this._data = newData;
        this._fetchedData = [];
        this._fetchedSize = 0;
    }

    _updateBuffer() {
        const arrayBuffer = this._readableBuffer();
        this._readLoopComments(arrayBuffer);
        this._decodeAudioData(arrayBuffer);
    }

    _readableBuffer() {
        if (Utils.hasEncryptedAudio()) {
            return Utils.decryptArrayBuffer(this._data.buffer);
        } else {
            return this._data.buffer;
        }
    }

    _decodeAudioData(arrayBuffer: any[]) {
        if (this._shouldUseDecoder()) {
            if (this._decoder) {
                this._decoder.send(arrayBuffer, this._isLoaded);
            }
        } else {
            // [Note] Make a temporary copy of arrayBuffer because
            //   decodeAudioData() detaches it.
            WebAudio._context!
                .decodeAudioData(arrayBuffer.slice() as any)
                .then((buffer: any) => this._onDecode(buffer))
                .catch(() => this._onError());
        }
    }

    _onDecode(buffer: { duration: number; }) {
        if (!this._shouldUseDecoder()) {
            this._buffers = [];
            this._totalTime = 0;
        }
        this._buffers.push(buffer);
        this._totalTime += buffer.duration;
        if (this._loopLength > 0 && this._sampleRate > 0) {
            this._loopStartTime = this._loopStart / this._sampleRate;
            this._loopLengthTime = this._loopLength / this._sampleRate;
        } else {
            this._loopStartTime = 0;
            this._loopLengthTime = this._totalTime;
        }
        if (this._sourceNodes.length > 0) {
            this._refreshSourceNode();
        }
        this._onLoad();
    }

    _refreshSourceNode() {
        if (this._shouldUseDecoder()) {
            const index = this._buffers.length - 1;
            this._createSourceNode(index);
            if (this._isPlaying) {
                this._startSourceNode(index);
            }
        } else {
            this._stopSourceNode();
            this._createAllSourceNodes();
            if (this._isPlaying) {
                this._startAllSourceNodes();
            }
        }
        if (this._isPlaying) {
            this._removeEndTimer();
            this._createEndTimer();
        }
    }

    _startPlaying(offset: number) {
        if (this._loopLengthTime > 0) {
            while (offset >= this._loopStartTime + this._loopLengthTime) {
                offset -= this._loopLengthTime;
            }
        }
        this._startTime = WebAudio._currentTime() - offset / this._pitch;
        this._removeEndTimer();
        this._removeNodes();
        this._createPannerNode();
        this._createGainNode();
        this._createAllSourceNodes();
        this._startAllSourceNodes();
        this._createEndTimer();
    }

    _startAllSourceNodes() {
        for (let i = 0; i < this._sourceNodes.length; i++) {
            this._startSourceNode(i);
        }
    }

    _startSourceNode(index: number) {
        const sourceNode = this._sourceNodes[index];
        const seekPos = this.seek();
        const currentTime = WebAudio._currentTime();
        const loop = this._loop;
        const loopStart = this._loopStartTime;
        const loopLength = this._loopLengthTime;
        const loopEnd = loopStart + loopLength;
        const pitch = this._pitch;
        let chunkStart = 0;
        for (let i = 0; i < index; i++) {
            chunkStart += this._buffers[i].duration;
        }
        const chunkEnd = chunkStart + sourceNode.buffer.duration;
        let when = 0;
        let offset = 0;
        let duration = sourceNode.buffer.duration;
        if (seekPos >= chunkStart && seekPos < chunkEnd - 0.01) {
            when = currentTime;
            offset = seekPos - chunkStart;
        } else {
            when = currentTime + (chunkStart - seekPos) / pitch;
            offset = 0;
            if (loop) {
                if (when < currentTime - 0.01) {
                    when += loopLength / pitch;
                }
                if (seekPos >= loopStart && chunkStart < loopStart) {
                    when += (loopStart - chunkStart) / pitch;
                    offset = loopStart - chunkStart;
                }
            }
        }
        if (loop && loopEnd < chunkEnd) {
            duration = loopEnd - chunkStart - offset;
        }
        if (this._shouldUseDecoder()) {
            if (when >= currentTime && offset < duration) {
                sourceNode.loop = false;
                sourceNode.start(when, offset, duration);
                if (loop && chunkEnd > loopStart) {
                    sourceNode.onended = () => {
                        this._createSourceNode(index);
                        this._startSourceNode(index);
                    }
                }
            }
        } else {
            if (when >= currentTime && offset < sourceNode.buffer.duration) {
                sourceNode.start(when, offset);
            }
        }
        chunkStart += sourceNode.buffer.duration;
    }

    _stopSourceNode() {
        for (const sourceNode of this._sourceNodes) {
            try {
                sourceNode.onended = null;
                sourceNode.stop();
            } catch (e) {
                // Ignore InvalidStateError
            }
        }
    }

    _createPannerNode() {
        this._pannerNode = WebAudio._context!.createPanner();
        this._pannerNode.panningModel = "equalpower";
        this._pannerNode.connect(WebAudio._masterGainNode);
        this._updatePanner();
    }

    _createGainNode() {
        const currentTime = WebAudio._currentTime();
        this._gainNode = WebAudio._context!.createGain();
        this._gainNode.gain.setValueAtTime(this._volume, currentTime);
        this._gainNode.connect(this._pannerNode);
    }

    _createAllSourceNodes() {
        for (let i = 0; i < this._buffers.length; i++) {
            this._createSourceNode(i);
        }
    }

    _createSourceNode(index: number) {
        const sourceNode = WebAudio._context!.createBufferSource();
        const currentTime = WebAudio._currentTime();
        sourceNode.buffer = this._buffers[index];
        sourceNode.loop = (this._loop && this._isLoaded) as boolean;
        sourceNode.loopStart = this._loopStartTime;
        sourceNode.loopEnd = this._loopStartTime + this._loopLengthTime;
        sourceNode.playbackRate.setValueAtTime(this._pitch, currentTime);
        sourceNode.connect(this._gainNode);
        this._sourceNodes[index] = sourceNode;
    }

    _removeNodes() {
        if (this._sourceNodes && this._sourceNodes.length > 0) {
            this._stopSourceNode();
            this._sourceNodes = [];
            this._gainNode = null;
            this._pannerNode = null;
        }
    }

    _createEndTimer() {
        if (this._sourceNodes.length > 0 && !this._loop) {
            const endTime = this._startTime + this._totalTime / this._pitch;
            const delay = endTime - WebAudio._currentTime();
            this._endTimer = setTimeout(this.stop.bind(this), delay * 1000);
        }
    }

    _removeEndTimer() {
        if (this._endTimer) {
            clearTimeout(this._endTimer);
            this._endTimer = null;
        }
    }

    _updatePanner() {
        if (this._pannerNode) {
            const x = this._pan;
            const z = 1 - Math.abs(x);
            this._pannerNode.setPosition(x, 0, z);
        }
    }

    _onLoad() {
        while (this._loadListeners.length > 0) {
            const listner = this._loadListeners.shift();
            listner();
        }
    }

    _readLoopComments(arrayBuffer: ArrayBufferLike) {
        const view = new DataView(arrayBuffer);
        let index = 0;
        while (index < view.byteLength - 30) {
            if (this._readFourCharacters(view, index) !== "OggS") {
                break;
            }
            index += 26;
            const numSegments = view.getUint8(index++);
            const segments: any[] = [];
            for (let i = 0; i < numSegments; i++) {
                segments.push(view.getUint8(index++));
            }
            const packets = [];
            while (segments.length > 0) {
                let packetSize = 0;
                while (segments[0] === 255) {
                    packetSize += segments.shift();
                }
                if (segments.length > 0) {
                    packetSize += segments.shift();
                }
                packets.push(packetSize);
            }
            let vorbisHeaderFound = false;
            for (const size of packets) {
                if (this._readFourCharacters(view, index + 1) === "vorb") {
                    const headerType = view.getUint8(index);
                    if (headerType === 1) {
                        this._sampleRate = view.getUint32(index + 12, true);
                    } else if (headerType === 3) {
                        this._readMetaData(view, index, size);
                    }
                    vorbisHeaderFound = true;
                }
                index += size;
            }
            if (!vorbisHeaderFound) {
                break;
            }
        }
    }

    _readMetaData(view: DataView, index: number, size: number) {
        for (let i = index; i < index + size - 10; i++) {
            if (this._readFourCharacters(view, i) === "LOOP") {
                let text = "";
                while (view.getUint8(i) > 0) {
                    text += String.fromCharCode(view.getUint8(i++));
                }
                if (text.match(/LOOPSTART=([0-9]+)/)) {
                    this._loopStart = parseInt(RegExp.$1);
                }
                if (text.match(/LOOPLENGTH=([0-9]+)/)) {
                    this._loopLength = parseInt(RegExp.$1);
                }
                if (text === "LOOPSTART" || text === "LOOPLENGTH") {
                    let text2 = "";
                    i += 16;
                    while (view.getUint8(i) > 0) {
                        text2 += String.fromCharCode(view.getUint8(i++));
                    }
                    if (text === "LOOPSTART") {
                        this._loopStart = parseInt(text2);
                    } else {
                        this._loopLength = parseInt(text2);
                    }
                }
            }
        }
    }

    _readFourCharacters(view: DataView, index: number) {
        let string = "";
        if (index <= view.byteLength - 4) {
            for (let i = 0; i < 4; i++) {
                string += String.fromCharCode(view.getUint8(index + i));
            }
        }
        return string;
    }
}
