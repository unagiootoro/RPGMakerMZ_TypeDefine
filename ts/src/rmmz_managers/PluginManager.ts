//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

class PluginManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static _scripts: string[] = [];
    static _errorUrls: string[] = [];
    static _parameters: any = {};
    static _commands: any = {};

    static setup(plugins: any[]) {
        for (const plugin of plugins) {
            const pluginName = Utils.extractFileName(plugin.name)!;
            if (plugin.status && !this._scripts.includes(pluginName)) {
                this.setParameters(pluginName, plugin.parameters);
                this.loadScript(plugin.name);
                this._scripts.push(pluginName);
            }
        }
    }

    static parameters(name: string) {
        return this._parameters[name.toLowerCase()] || {};
    }

    static setParameters(name: string, parameters: any) {
        this._parameters[name.toLowerCase()] = parameters;
    }

    static loadScript(filename: string) {
        const url = this.makeUrl(filename);
        const script: any = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.async = false;
        script.defer = true;
        script.onerror = this.onError.bind(this);
        script._url = url;
        document.body.appendChild(script);
    }

    static onError(e: any) {
        this._errorUrls.push(e.target._url);
    }

    static makeUrl(filename: string) {
        return "js/plugins/" + Utils.encodeURI(filename) + ".js";
    }

    static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            this.throwLoadError(url);
        }
    }

    static throwLoadError(url: string) {
        throw new Error("Failed to load: " + url);
    }

    static registerCommand(pluginName: string, commandName: string, func: Function) {
        const key = pluginName + ":" + commandName;
        this._commands[key] = func;
    }

    static callCommand(self: any, pluginName: string, commandName: string, args: any[]) {
        const key = pluginName + ":" + commandName;
        const func = this._commands[key];
        if (typeof func === "function") {
            func.bind(self)(args);
        }
    }
}
