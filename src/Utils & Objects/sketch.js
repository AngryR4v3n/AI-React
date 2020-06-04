import { indexTrans } from "./functions";
//variables for path backtrack tracing
let map = {};
let lastPoint;
let startPoint;

export default function sketch(p) {
  let grid = null;
  let size = null;
  let mazeStart = [];
  let cols;
  let execute = false;
  let alg = null

  //setup of maze with null values.
  p.setup = () => {
    var myCanvas = p.createCanvas(600, 600);
    myCanvas.parent("canvas");
    p.frameRate(30);

  };
  //This is called when props are updated.
  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.codedMaze.length > 0) {
      grid = props.codedMaze;
      size = props.size;
      cols = props.cols;
      mazeStart = props.mazeStart;
      execute = true;
      alg = props.alg
    }
  };

  p.draw = async () => {
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
    //decides which algorithm we will use
    if (execute === true) {
      switch (alg) {
        case "1":
          await bfs(grid);
          break;
        case "2":
          await dfs(grid);
          break
        case null:
          console.log("pass")
          break

        default:
          alert("This is a major error")
          break;
      }
      //draw path
      execute = false;
      let path = await makePath();
      grid[startPoint].setValue(3)
      for (let i = 0; i < path.length; i++) {
        grid[path[i]].setValue(9)
      }
    }
  };
  /**
   * Function that provided as key the parent cell will return the child cells, used to backtrack original position.
   */
  function makePath() {
    let path = [];
    let crr = lastPoint;
    while (crr !== startPoint) {
      for (let key in map) {
        if (map[parseInt(key)].includes(crr)) {
          path.push(crr);
          crr = parseInt(key);
        }
      }

    }
    return path;
  }
  /**
   * Used by BFS to determine whether it can be visited or not.
   * @param {*} i -> x
   * @param {*} j  -> y
   */
  function isFree(i, j) {
    if (
      (i >= 0) &
      (i < grid.length) &
      (j >= 0) &
      (j < grid.length) &
      ((grid[indexTrans(i, j, cols)].getValue() === 0) |
        (grid[indexTrans(i, j, cols)].getValue() === 9))
    ) {
      return true;
    }

    return false;
  }
  /**
   * Provided the encoded 1D array of cells it will traverse it via BFS method
   * @param {*} maze 
   */
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
        //Right neighbor
        if (isFree(cell.getX() + 1, cell.getY()) === true) {
          
          let next = await maze[indexTrans(cell.getX() + 1, cell.getY(), cols)];
          map[index].push(indexTrans(cell.getX() + 1, cell.getY(), cols));
          q.push(next);
        }
        //Left neighbor
        if (isFree(cell.getX() - 1, cell.getY()) === true) {
          
          let next = await maze[indexTrans(cell.getX() - 1, cell.getY(), cols)];
          map[index].push(indexTrans(cell.getX() - 1, cell.getY(), cols));
          q.push(next);
        }
        //Down neighbor
        if (isFree(cell.getX(), cell.getY() + 1) === true) {
          let next = await maze[indexTrans(cell.getX(), cell.getY() + 1, cols)];
          map[index].push(indexTrans(cell.getX(), cell.getY() + 1, cols));

          q.push(next);
        }
        //Up neighbor
        if (isFree(cell.getX(), cell.getY() - 1) === true) {
          let next = await maze[indexTrans(cell.getX(), cell.getY() - 1, cols)];
          map[index].push(indexTrans(cell.getX(), cell.getY() - 1, cols));
          q.push(next);
        }
      }
    } else {
      return null;
    }
    return null;
  }

  /**
   * Provided the encoded 1D array of cells it will traverse it via DFS method
   * @param {*} maze 
   */
  async function dfs(maze) {
    let q = [];
    let cell = undefined
    let index
    if (maze[indexTrans(mazeStart[0], mazeStart[1], cols)].getValue() !== 9) {
      maze[indexTrans(mazeStart[0], mazeStart[1], cols)].setValue(2);
      maze[indexTrans(mazeStart[0], mazeStart[1], cols)].setVisited(true);
    }
    //we set starting point
    q.push(maze[indexTrans(mazeStart[0], mazeStart[1], cols)]);
    while (q.length > 0) {

      cell = q.pop()
      //set variables to recreate path..
      if (maze[indexTrans(cell.getX(), cell.getY(), cols)].getValue() === 9) {
        console.log("Finish!!!");
        lastPoint = indexTrans(cell.getX(), cell.getY(), cols);
        startPoint = indexTrans(mazeStart[0], mazeStart[1], cols);
        return null;
      }

      //recreate map
      index = indexTrans(cell.getX(), cell.getY(), cols);
      map[index] = [];

      if (cell.getValue() !== 2 | !cell.getVisited()) {
        cell.setValue(2)
        cell.setVisited(true)
      }
      let neighbors = []
      //we add cell neighbors 
      if (isFree(cell.getX() + 1, cell.getY()) === true) {

        let neighborR = await maze[indexTrans(cell.getX() + 1, cell.getY(), cols)];
        map[index].push(indexTrans(cell.getX() + 1, cell.getY(), cols));
        neighbors.push(neighborR);
      }
      if (isFree(cell.getX() - 1, cell.getY()) === true) {

        let neighborL = await maze[indexTrans(cell.getX() - 1, cell.getY(), cols)];
        map[index].push(indexTrans(cell.getX() - 1, cell.getY(), cols));

        neighbors.push(neighborL);
      }
      if (isFree(cell.getX(), cell.getY() + 1) === true) {

        let neighborD = await maze[indexTrans(cell.getX(), cell.getY() + 1, cols)];
        map[index].push(indexTrans(cell.getX(), cell.getY() + 1, cols));


        neighbors.push(neighborD);
      }
      if (isFree(cell.getX(), cell.getY() - 1) === true) {

        let neighborU = await maze[indexTrans(cell.getX(), cell.getY() - 1, cols)];
        map[index].push(indexTrans(cell.getX(), cell.getY() - 1, cols));

        neighbors.push(neighborU);
      }

      for (let i = 0; i < neighbors.length; i++) {
        let cellNeighbor = neighbors[i]
        if (cellNeighbor && !cellNeighbor.getVisited() && cellNeighbor.getValue() !== 2) {
          q.push(cellNeighbor)
        }
      }
    }
  }
  /**
   * Function that reads the state of each individual cell in the map. Code inspired by https://www.youtube.com/watch?v=HyK_Q5rrcr4
   * 
   * @param {*} x 
   * @param {*} y 
   * @param {*} walls 
   * @param {*} value 
   * @param {*} visited 
   * @param {*} size 
   */
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
  }
}
