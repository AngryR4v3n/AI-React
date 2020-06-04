import { indexTrans } from "./functions";

let map = {};
let lastPoint;
let startPoint;

export default function sketch(p) {
  let grid = null;
  let size = null;
  let mazeStart = [];
  let cols;
  let execute = false;
  p.setup = () => {
    var myCanvas = p.createCanvas(600, 600);
    myCanvas.parent("canvas");
    p.frameRate(30);
    //p.noLoop()
  };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.codedMaze.length > 0) {
      grid = props.codedMaze;
      size = props.size;
      cols = props.cols;
      mazeStart = props.mazeStart;
      execute = true;
      console.log(execute);
    }
  };

   p.draw = async() => {
    p.background(51);
    p.stroke(255, 255, 255);
    if ((grid != null) & (size != null)) {
      for (var i = 0; i < grid.length; i++) {
        show(
          grid[i].getX(),
          grid[i].getY(),
          grid[i].getWalls(),
          grid[i].getValue(),
          grid[i].getVisited(),
          size
        );
      }
    }

    if (execute === true) {
      await bfs(grid);
      execute = false;

      let path = await makePath();
      grid[startPoint].setValue(3)
      for(let i = 0; i<path.length; i++){
        grid[path[i]].setValue(9)
      }
    }
  };

  function makePath() {
    let path = [];
    let crr = lastPoint;
    let a = 0;
    while (crr !== startPoint) {
      for (let key in map) {
        if (map[parseInt(key)].includes(crr)) {
          path.push(crr);
          crr = parseInt(key);
        }
      }
      a++;
    }
    return path;
  }

  function isFree(i, j) {
    if (
      (i >= 0) &
      (i < grid.length) &
      (j >= 0) &
      (j < grid.length) &
      ((grid[indexTrans(i, j, cols)].getValue() === 0) |
        (grid[indexTrans(i, j, cols)].getValue() === 9))
    ) {
      // console.log(
      //   "letting value:",
      //   grid[indexTrans(i, j, cols)].getValue(),
      //   "at positions",
      //   grid[indexTrans(i, j, cols)].getX(),
      //   grid[indexTrans(i, j, cols)].getY()
      // );
      return true;
    }
    // console.log(
    //   "NOT value:",
    //   grid[indexTrans(i, j, cols)].getValue(),
    //   "at positions",
    //   grid[indexTrans(i, j, cols)].getX(),
    //   grid[indexTrans(i, j, cols)].getY()
    // );
    return false;
  }
  async function bfs(maze) {
    let index;
    let q = [];
    let cell = undefined;
    if (maze.length > 0) {
      // Set the start point
      if (maze[indexTrans(mazeStart[0], mazeStart[1], cols)].getValue() !== 9) {
        maze[indexTrans(mazeStart[0], mazeStart[1], cols)].setValue(2);
      }

      // Add the start point to queue
      q.push(maze[indexTrans(mazeStart[0], mazeStart[1], cols)]);

      while (q.length > 0) {
        cell = q.splice(0, 1)[0];
        index = indexTrans(cell.getX(), cell.getY(), cols);
        map[index] = [];

        if (maze[indexTrans(cell.getX(), cell.getY(), cols)].getValue() === 9) {
          console.log("Finish!!!");
          lastPoint = indexTrans(cell.getX(), cell.getY(), cols);
          startPoint = indexTrans(mazeStart[0], mazeStart[1], cols);
          return null;
        }
        await maze[indexTrans(cell.getX(), cell.getY(), cols)].setValue(2);
        await maze[indexTrans(cell.getX(), cell.getY(), cols)].setVisited(true);

        if (isFree(cell.getX() + 1, cell.getY()) === true) {
          //visita el siguiente punto.
          let next = await maze[indexTrans(cell.getX() + 1, cell.getY(), cols)];
          map[index].push(indexTrans(cell.getX() + 1, cell.getY(), cols));
          q.push(next);
        }
        if (isFree(cell.getX() - 1, cell.getY()) === true) {
          //visita el siguiente punto.
          let next = await maze[indexTrans(cell.getX() - 1, cell.getY(), cols)];
          map[index].push(indexTrans(cell.getX() - 1, cell.getY(), cols));
          q.push(next);
        }
        if (isFree(cell.getX(), cell.getY() + 1) === true) {
          //visita el siguiente punto.
          let next = await maze[indexTrans(cell.getX(), cell.getY() + 1, cols)];
          map[index].push(indexTrans(cell.getX(), cell.getY() + 1, cols));

          q.push(next);
        }
        if (isFree(cell.getX(), cell.getY() - 1) === true) {
          //visita el siguiente punto.
          let next = await maze[indexTrans(cell.getX(), cell.getY() - 1, cols)];
          map[index].push(indexTrans(cell.getX(), cell.getY() - 1, cols));
          q.push(next);
        }

        /*
        else{
          console.log("null case ", cell.getX(), cell.getY())
        }*/
      }
    } else {
      return null;
    }
    return "hola";
  }

  function show(x, y, walls = [true, true, true, true], value, visited, size) {
    const w = size;
    var coord_x = Math.floor((x + 1) * w);
    var coord_y = Math.floor((y + 1) * w);
    if (visited === true) {
      p.stroke(255, 0, 255, 100);
      p.fill(255, 0, 255, 100);
      p.rect(coord_x, coord_y, w, w);
      p.stroke(255, 255, 255);
    }
    switch (value) {
      //salida
      case 9:
        p.stroke(255, 0, 100);
        p.fill(255, 0, 100);
        p.rect(coord_x, coord_y, w, w);
        p.stroke(255, 255, 255);
        break;
      //entrada
      case 3:
        p.stroke(14, 239, 21);
        p.fill(14, 239, 21);
        p.rect(coord_x, coord_y, w, w);
        p.stroke(255, 255, 255);
        break;
      default:
        p.stroke(255, 255, 255);
        p.noFill();
        break;
    }

    if (walls[0]) {
      //top
      p.line(coord_x, coord_y, coord_x + w, coord_y);
    }

    if (walls[1]) {
      //right
      p.line(coord_x + w, coord_y, coord_x + w, coord_y + w);
    }

    if (walls[2]) {
      //bottom
      p.line(coord_x, coord_y + w, coord_x + w, coord_y + w);
    }

    if (walls[3]) {
      //left
      p.line(coord_x, coord_y + w, coord_x, coord_y);
    }
    //noFill();
    //rect(x,coord_y,w,w)
  }
}
