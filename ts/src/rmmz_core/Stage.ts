//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class
 * @extends PIXI.Container
 */
class Stage extends PIXI.Container {
    constructor();

    constructor(...args: any[]) {
        super();
        this.initialize(...args);
    }

    initialize(...args: any[]): void {
        PIXI.Container.call(this);
    }

    /**
     * Destroys the stage.
     */
    destroy(): void {
        const options = { children: true, texture: true };
        PIXI.Container.prototype.destroy.call(this, options);
    }
}
