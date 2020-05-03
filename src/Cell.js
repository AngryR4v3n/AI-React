
export default class Cell {
    constructor(x, y, arr = [true, true, true, true]) {
        this.x = x;
        this.y = y;
        // top, right, bottom, left
        this.walls = arr

    }

}