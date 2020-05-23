import { indexTrans } from "./functions";

export default function sketch(p) {
  let grid = null
  let size = null
  let alg
  let mazeStart = []
  let cols
  p.setup = () => {
    var myCanvas = p.createCanvas(600, 600);
    myCanvas.parent("canvas");
    p.frameRate(1)
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.codedMaze) {
      grid = props.codedMaze
      size = props.size
      cols = props.cols
      mazeStart = props.mazeStart
    }
  };

  p.draw = () => {

    p.background(51);
    p.stroke(255, 255, 255)
    if (grid != null & size != null) {

      for (var i = 0; i < grid.length; i++) {
        show(grid[i].getX(), grid[i].getY(), grid[i].getWalls(), grid[i].getValue(), size)

      }

      //check which alg to use:
      let finish = 1 
      if(finish === null){
        console.log('haha')
      } else{
        finish = bfs(grid)
        console('im out')
      }
    }

  };

  function isFree(i, j) {
    if (i >= 0 & i < grid.length & j >= 0 & j < grid.length & (grid[indexTrans(i, j, cols)].getValue() === 0 | grid[indexTrans(i, j, cols)].getValue() === 9 | grid[indexTrans(i, j, cols)].getValue() === 2)) {
      return true
    } else {
      return false
    }
  }
  function bfs(maze) {
    let q = [];
    if (maze.length > 0) {
      
      q.push(maze[indexTrans(mazeStart[0], mazeStart[1], cols)])
      while (q.length > 0) {
        let cell = q.shift()
        
        if (maze[indexTrans(cell.getX(), cell.getY(), cols)].getValue() === 9) {
          break
          
        }
        if (isFree(cell.getX() + 1, cell.getY())) {
          console.log("cond1")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX() + 1, cell.getY(), cols)]
          q.push(next)
        }
        if (isFree(cell.getX() - 1, cell.getY())) {
          console.log("cond2")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX() - 1, cell.getY(), cols)]
          q.push(next)
        }
        if (isFree(cell.getX(), cell.getY() + 1)) {
          console.log("cond3")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX(), cell.getY() + 1, cols)]
          q.push(next)
        }
        if (isFree(cell.getX(), cell.getY() - 1)) {
          console.log("cond4")
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2)
          maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true)
          //visita el siguiente punto.
          let next = maze[indexTrans(cell.getX(), cell.getY() - 1, cols)]
          q.push(next)
        }
      } 
    } else{
      return null
    }

    return null
  }

  function show(x, y, walls = [true, true, true, true], value, size) {
    const w = size
    var coord_x = Math.floor((x + 1) * w);
    var coord_y = Math.floor((y + 1) * w);

    switch (value) {
      case 2:
        p.stroke(255, 0, 255, 100)
        p.fill(255, 0, 255, 100)
        p.rect(coord_y, coord_x, w, w)
        break

      case 9:
        p.stroke(255, 0, 100)
        p.fill(255, 0, 100)
        p.rect(coord_y, coord_x, w, w)
        break

      case 3:
        p.stroke(14, 239, 21)
        p.fill(14, 239, 21)
        p.rect(coord_y, coord_x, w, w)
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