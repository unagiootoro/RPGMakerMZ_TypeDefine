//-----------------------------------------------------------------------------
/**
 * The rectangle class.
 *
 * @class
 * @extends PIXI.Rectangle
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 */
class Rectangle extends PIXI.Rectangle {
    constructor(x?: number, y?: number, width?: number, height?: number);

    constructor(...args: any[]) {
        super();
        this.initialize(...args as [number, number, number, number]);
    }

    initialize(x: number, y: number, width: number, height: number) {
        PIXI.Rectangle.call(this, x, y, width, height);
    }
}
