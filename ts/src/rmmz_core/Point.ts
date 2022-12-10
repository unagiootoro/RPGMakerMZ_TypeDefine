//-----------------------------------------------------------------------------
/**
 * The point class.
 *
 * @class
 * @extends PIXI.Point
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
class Point extends PIXI.Point {
    constructor(x?: number, y?: number);

    constructor(...args: any[]) {
        super();
        this.initialize(...args as [number, number]);
    }

    initialize(x: number, y: number) {
        PIXI.Point.call(this, x, y);
    }
}
