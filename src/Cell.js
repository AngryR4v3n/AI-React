
export default class Cell {
    constructor(x, y, arr = [true, true, true, true]) {
        this.x = x;
        this.y = y;
        // top, right, bottom, left
        this.walls = arr

    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    getWalls() {
        return this.walls
    }
    setX(adjust) {
        this.x = adjust
    }
    setY(adjust) {
        this.y = adjust
    }
    setWalls(arr = [true, true, true, true]) {
        //this will avoid override of previously defined walls.
        let oldArr = this.getWalls()
        for (let i = 0; i < oldArr.length; i++) {
            if(oldArr[i] === true & arr[i] === false){
                arr[i] = true
            } else if(oldArr[i] === false & arr[i] === true){
                arr[i] = true
            }
        }
        this.walls = arr
    }

}