import { indexTrans } from "./functions";

export default function sketch(p) {
  let grid = null
  let size = null
  let mazeStart = []
  let cols
  let execute = false
  p.setup = () => {
    var myCanvas = p.createCanvas(600, 600);
    myCanvas.parent("canvas");
    p.frameRate(1)
    //p.noLoop()
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.codedMaze.length > 0) {
      grid = props.codedMaze
      size = props.size
      cols = props.cols
      mazeStart = props.mazeStart
      execute = true
      console.log(execute)
    }
  };

  p.draw = () => {

    p.background(51);
    p.stroke(255, 255, 255)
    if (grid != null & size != null) {

      for (var i = 0; i < grid.length; i++) {
        show(grid[i].getX(), grid[i].getY(), grid[i].getWalls(), grid[i].getValue(), size)

      }

    }

    
    if(execute === true){
      bfs(grid)
      execute = false
    }  
  }

  function isFree(i, j) {
    if (i >= 0 & i < grid.length & j >= 0 & j < grid.length & (grid[indexTrans(i, j, cols)].getValue() === 0 | grid[indexTrans(i, j, cols)].getValue() === 9 | grid[indexTrans(i, j, cols)].getValue() === 2)) {
      console.log('letting value:', grid[indexTrans(i, j, cols)].getValue(), 'at positions', grid[indexTrans(i, j, cols)].getX(), grid[indexTrans(i, j, cols)].getY())
      return true
    }
    console.log('NOT value:', grid[indexTrans(i, j, cols)].getValue(), 'at positions', grid[indexTrans(i, j, cols)].getX(), grid[indexTrans(i, j, cols)].getY())
    return false
  }
  function bfs(maze) {
    let q = [];
    let interactions = 0;
    if (maze.length > 0) {
      maze[indexTrans(mazeStart[0], mazeStart[1], cols)].setValue(2)
      q.push(maze[indexTrans(mazeStart[0], mazeStart[1], cols)])
      while (q.length > 0 & interactions < 700) {
        let cell = q.shift()
        console.log("CURRENT POSITION", cell.getX(), cell.getY(), "AT VALUE", cell.getValue())
        if (maze[indexTrans(cell.getX(), cell.getY(), cols)].getValue() === 9) {
          console.log("reached")
          return null
        }
        if (isFree(cell.getX() + 1, cell.getY()) === true) {
          console.log("RIGHT")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX() + 1, cell.getY(), cols)]
          q.push(next)
        }
        else if (isFree(cell.getX() - 1, cell.getY()) === true) {
          console.log("LEFT")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX() - 1, cell.getY(), cols)]
          q.push(next)
        }
        else if (isFree(cell.getX(), cell.getY() + 1) === true) {
          console.log("DOWN")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX(), cell.getY() + 1, cols)]
          q.push(next)
        }
        else if (isFree(cell.getX(), cell.getY() - 1) === true) {
          console.log("UP")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX(), cell.getY() - 1, cols)]
          q.push(next)
        }
        /*
        else{
          console.log("null case ", cell.getX(), cell.getY())
        }*/

        interactions++
      }
    } else {
      return null

    }
    return 'hola'
  }

  function show(x, y, walls = [true, true, true, true], value, size) {
    const w = size
    var coord_x = Math.floor((x + 1) * w);
    var coord_y = Math.floor((y + 1) * w);

    switch (value) {
      //visited
      case 2:
        p.stroke(255, 0, 255, 100)
        p.fill(255, 0, 255, 100)
        p.rect(coord_x, coord_y, w, w)
        p.stroke(255, 255, 255)
        break
      //salida
      case 9:
        p.stroke(255, 0, 100)
        p.fill(255, 0, 100)
        p.rect(coord_y, coord_x, w, w)
        p.stroke(255, 255, 255)
        break
      //entrada
      case 3:
        p.stroke(14, 239, 21)
        p.fill(14, 239, 21)
        p.rect(coord_x, coord_y, w, w)
        p.stroke(255, 255, 255)
        break
      default:
        p.stroke(255, 255, 255)
        p.noFill()
        break
    }

    if (walls[0]) {
      //top
      p.line(coord_x, coord_y, coord_x + w, coord_y)
    }

    if (walls[1]) {
      //right
      p.line(coord_x + w, coord_y, coord_x + w, coord_y + w)
    }

    if (walls[2]) {
      //bottom
      p.line(coord_x, coord_y + w, coord_x + w, coord_y + w)
    }

    if (walls[3]) {
      //left
      p.line(coord_x, coord_y + w, coord_x, coord_y)
    }
    //noFill();
    //rect(x,coord_y,w,w)
  }

};